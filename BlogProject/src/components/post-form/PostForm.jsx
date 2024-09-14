import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
    // Get info from useForm
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate()
    const userData = useSelector(state => state.user.userData)

    // If user has submited form
    const submit = async (data) => {
        // If post is there
        if (post) {
            // Data gives access to image, if there is image use appwriteService
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null

            // Delete the previous image bcz we are uploading new
            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }
            // Update the post , slug = post ID

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                //  if file is there , uski id featured image m daal denge
                featuredImage: file ? file.$id : undefined,
            })
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        }
        // If post not there
        else {
            const file = await appwriteService.uploadFile(data.image[0])

            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id,
                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof (value) === 'string') return value
            .trim()
            .toLowerCase()
            .replace(/^[a-zA-Z\d\s]+/g, '-')
            .replace(/\s/g, '-')

        return ''

    }, [])

    React.useEffect(()=>{
        const subscription = watch()
        
    },[watch, slugTransform, setValue])

    return (
        <div>

        </div>
    )
}

export default PostForm
