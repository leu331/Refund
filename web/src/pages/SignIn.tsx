import { Input } from "../components/input"
import { Button } from "../components/button"
import { FormEvent, useState } from "react"

export function SignIn(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    function handleSubmit (event: React.FormEvent) {
        event.preventDefault()
        console.log("sdwdwdw");
        
    }
    return(
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
    
            <Button className="" isLoading={isLoading} type="submit" title="Login"/>

            <a className="flex justify-center items-center mt-2 hover:text-green-200" href="/signup">Criar conta</a>
        
        </form>
    )
}