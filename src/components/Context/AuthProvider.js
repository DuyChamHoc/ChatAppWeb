import React, { useEffect, createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { Spin } from 'antd';
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [isUpdateLoad, setIsUpdateLoad] = useState(false)
    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({
                    displayName, email, uid, photoURL
                })
                console.log(displayName)
                setIsLoading(false);
                navigate('/');
                return;
            }
            else {
                navigate('/login')
                setIsLoading(false)
            }
        })
        return () => {
            unsubscribed();
        }
    },[isUpdateVisible,isUpdateLoad])
    return (
        <AuthContext.Provider value={{ user,isUpdateVisible, setIsUpdateVisible,isUpdateLoad, setIsUpdateLoad}}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    )
}
