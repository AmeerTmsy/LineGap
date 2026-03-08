import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userToken, setUserToken] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setUserToken(token)
            const decoded = jwtDecode(token)
            setUser(decoded)
        }
        setAuthLoading(false)
    }, [])

    const storeToken = (token) => {
        localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        setUserToken(token)
        setUser(decoded)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setUserToken(null)
    }


    return (
        <AuthContext.Provider value={{
            user,
            userToken,
            authLoading,
            storeToken,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)