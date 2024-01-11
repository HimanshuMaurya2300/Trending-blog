import { createContext, useState } from "react";

export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState(null)

    const storeToken = (token) => {
        localStorage.setItem('trendingblog-token', token)
    }

    return (
        <UserContext.Provider
            value={{ userInfo, setUserInfo, storeToken }}
        >
            {children}
        </UserContext.Provider>
    )
}