import { Input } from "../components/input"
import { Button } from "../components/button"
import { FormEvent, useState } from "react"
import { api } from "../services/api"
import {z, ZodError} from "zod"
import { useNavigate } from "react-router"
import { AxiosError } from "axios"

const signUpSchema = z.object({
    name: z.string().trim().min(1, {message: "Informe o seu nome."}),
    email: z.string().email({message: "E-mail inválido."}),
    password: z.string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
        .max(16, { message: "A senha deve ter no máximo 16 caracteres." })
        .regex(/[0-9]/, {message: "A senha deve conter pelo menos um número."})
        .regex(/[A-Z]/, {message: "A senha deve conter pelo menos uma letra maiúscula."})
        .regex(/[\W_]/, { message: "A senha deve conter pelo menos um caractere especial." }),
    passwordConfirm: z.string({message: "Confirme a senha."})
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "As senhas não são coincidem", 
        path:["passwordConfirm"]
    })

export function SignUp(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const navigate = useNavigate() //isso fica fora do escopo da função
     
    async function registerUser(event: React.FormEvent) {
        event.preventDefault()
       

        if (password !== passwordConfirm) {
            alert("As senhas não coincidem!");
            return;
        }
        
        try {
            setIsLoading(true)

            const data = signUpSchema.parse({
                name,
                email,
                password,
                passwordConfirm
            })

            await api.post(`/users`, data)

            if (confirm("Cadastrado com sucesso, deseja retornar a tela de login?")) {
                navigate("/")
            }

            // const response = await api.post(`/users`, {
            //     name,
            //     email,
            //     password
            // }, {
            //     headers: {
            //         "Content-Type" : "application/json"
            //     }
            // });

        } catch (error) {
            if (error instanceof ZodError) {
                return alert(error.issues[0].message)
            }

            if (error instanceof AxiosError) {
                return alert(error.response?.data.message)
            }
            alert("Erro ao criar usuário");
        }

        finally {
            setIsLoading(false)
        }
    }

    return(
        <form onSubmit={registerUser} className="w-full flex flex-col gap-4">
            <Input 
            required 
            legend="Nome" 
            type="text" 
            placeholder="seu@email.com"
            onChange={(event) => setName(event.target.value)}/>

            <Input 
            required 
            legend="E-mail" 
            type="email" 
            placeholder="seu@email.com"
            onChange={(event) => setEmail(event.target.value)}/>

            <Input 
            required 
            legend="Senha" 
            type="password" 
            placeholder=""
            onChange={(event) => setPassword(event.target.value)}/>

            <Input 
            required 
            legend="Confirme a senha" 
            type="password" 
            placeholder=""
            onChange={(event) => setPasswordConfirm(event.target.value)}/>
           
            <Button className="" isLoading={isLoading} type="submit" title="Cadastrar"/>

            <a className="flex justify-center items-center mt-2 hover:text-green-200" href="/">Já tenho uma conta</a>
           
        </form>
    )
}