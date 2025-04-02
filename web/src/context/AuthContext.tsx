import { createContext, ReactNode, useState, useEffect } from "react";
import { api } from "../services/api";

interface AuthProviderProps {
    children: ReactNode
}

type AuthContext = {
    session: null | UserAPIResponse
    save: (data: UserAPIResponse) => void
    logoutUser: () => void
    isLoading: boolean
}

const LOCAL_STORAGE_KEY = "@refund"

export const AuthContext = createContext({} as AuthContext) //contexto com as informações de autenticação como nome, token e etc

export function AuthProvider({children}: AuthProviderProps) {
    const [session, setSession] = useState<null | UserAPIResponse>(null)
    const [isLoading, setIsLoading] = useState(true)

    function save(data: UserAPIResponse){
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, JSON.stringify(data.token))

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}` //adicionando ao cabeçalo a informação de autorização que tem o token

        setSession(data)
    }

    function loginUser() {
        const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
        const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)

        if (token && user) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}` //adicionando ao cabeçalo a informação de autorização que tem o token
            setSession({
                token,
                user: JSON.parse(user)
            })
        }

        setIsLoading(false)
    }

    useEffect(() => {
        loginUser()
    }, [])    

    function logoutUser() {
        setSession(null)
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)

        window.location.assign("/")
    }

    return (
        <AuthContext.Provider value={{session, save, isLoading, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}