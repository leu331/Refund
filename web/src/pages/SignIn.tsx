import { Input } from "../components/input"
import { Button } from "../components/button"
import { useActionState } from "react"
import {z, ZodError} from "zod"

import { api } from "../services/api"
import { AxiosError } from "axios"
import { useAuth } from "../hooks/useContextAuth"

const signInSchema = z.object({
    email: z.string().email({message: "E-mail inválido"}),
    password: z.string().trim().min(8, {message: "Mínimo de 8 caracteres"}).max(16, {message: "Máximo de 16 caracteres"})
})

export function SignIn(){

    const [state, formAction, isLoading] = useActionState(signIn, null)
    const auth = useAuth()

    async function signIn (prevState: any, formData: FormData) {
        try {
            const data = signInSchema.parse({
                email: formData.get("email"),
                password: formData.get("password")
            })

            const response = await api.post("/sessions", data)

            auth.save(response.data)

            // await new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve("ok")
            //     }, 3000)
            // }) 
        } 
        
        catch (error) {
            if (error instanceof ZodError) {
                return{message: error.issues[0].message}
            }

            if (error instanceof AxiosError) {
                return{message: error.response?.data.message}
            }

             return{message:"Erro ao fazer login."}
        }   
        // console.log(prevState)
    }

    return(
        <form action={formAction} className="w-full flex flex-col gap-4">
            <Input 
            required 
            legend="E-mail" 
            type="email"
            name="email" 
            placeholder="seu@email.com"   
            />
            
            <Input 
            required 
            legend="Senha" 
            type="password" 
            name="password"
            placeholder=""
            />

            <p className="text-sm text-red-600 text-center my-4 font-medium"> {state?.message} </p>
    
            <Button className="" isLoading={isLoading} type="submit" title="Login"/>

            <a className="flex justify-center items-center mt-2 hover:text-green-200" href="/signup">Criar conta</a>
        </form>
    )
}