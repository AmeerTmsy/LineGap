import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Authcontext";
import { serverAPI } from "../services/apis";
import axios from "axios";

const AvailableProfileContext = createContext();

export const AvailableProfileProvider = ({ children }) => {
    const { userToken } = useAuth();
    const [availableProfiles, setAvailableProfiles] = useState(null);

    useEffect(() => {
        const fetchAvailableProfiles = async () => {
            try {
                // console.log('available profile context')
                const url = `${serverAPI}/auth/user`
                const headers = { Authorization: `Bearer ${userToken}` }
                const response = await axios.get(url, { headers })
                // console.log("available profile",response)
                if (response?.status == 200) {
                    setAvailableProfiles(response?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (userToken) fetchAvailableProfiles()
    }, [userToken])

    return (
        <AvailableProfileContext.Provider value={{
            availableProfiles
        }}>{children}</AvailableProfileContext.Provider>
    )
}

export const useAvailableProfiles = () => useContext(AvailableProfileContext);