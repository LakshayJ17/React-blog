import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    //  useEffect will tell whether to send at login, home page
    useEffect(() => {
        //  true && true( if authStatus = false which means false !== true i.e true)
        //  Make it easy : TODO

        if (authentication && authStatus !== authentication) {
            navigate("/login")
            //  false && true !== true i.e false 
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}

