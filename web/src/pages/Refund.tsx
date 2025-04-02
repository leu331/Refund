import { useEffect, useState } from "react"
import { Input } from "../components/input"
import { Select } from "../components/Select"
import { CATEGORIES, CATEGORIES_KEYS } from "../utils/categories"
import { Upload } from "../components/Upload"
import { Button } from "../components/button"
import fileSvg from "../assets/file.svg"
import { data, useNavigate, useParams } from "react-router-dom"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"
import { api } from "../services/api"
import { formatCurrency } from "../utils/formatCurrency"

const refundSchema = z.object({
    name: z.string().min(3, {message: "Informe um nome claro para a sua solicitação"}),
    category: z.string().min(1, {message: "Informe a categoria"}),
    amount: z.coerce.number({message: "Informe um valor válido"}).positive({message: "Informe um valor acima de 0"})
})

export function Refund () {
    const [category, setCategory] = useState("")
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [filename, setFilename] = useState<File | null>(null)
    const [fileURL, setFileURL] = useState<string | null>(null)
    
    const navigate = useNavigate() 
    const params = useParams<{id: string}>()

    async function handleSubmit(event: React.FormEvent){
        event.preventDefault()
        if (params.id) {
            return navigate(-1)
        }

        try {
            setIsLoading(true)

            if (!filename) {
                return alert("Anexe o arquivo de comporovamente à sua solicitação.")
            }

            const fileUploadForm = new FormData() //como o arquivo está apenas na minha máquina, não adianta apenas eu colocar o endereço do arquivo, então vou colocar o aqruivo inteiro dentro do formdata

            fileUploadForm.append("file", filename) //o nome desse campo precisa ser exatamente igual ao que a api espera (tá lá na upload-routes)

            const response = await api.post("/uploads", fileUploadForm) //subindo o arquivo na api, primeiro colocar na response pq tem api's que alteram os nomes do arquivo antes de serem inseridos no bd

            const data = refundSchema.parse({
                name, category, amount: amount.replace(",", ".")
            })

            console.log(data);
            

            await api.post("/refunds", {...data, filename: response.data.filename})

            navigate("/confirm", {state: {fromSubmit: true}})   
        } 
        
        catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                return alert(error.issues[0].message)
            }

            if (error instanceof AxiosError) {
                return alert(error.response?.data.message)
            }

            alert("Não foi possível realizar a solicitação.")
        }
        
        finally {
            setIsLoading(false)
        }
    }

    async function fetchRefund(id: string) {
        try {
            const response = await api.get<RefundAPIResponse>(`/refunds/${id}`)

            setName(response.data.name)
            setCategory(response.data.category)
            setAmount(formatCurrency(response.data.amount))
            setFileURL(response.data.filename)
        } 
        
        catch (error) {
            console.log(error);

            if(error instanceof AxiosError) {
                return alert(error.response?.data.message)
            }

            alert("Não foi possível processar a sua solicitação.")
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchRefund(params.id)
        }
    }, [params.id])
   
    return (
       <form onSubmit={handleSubmit} className="bg-gray-500 w-full  mx-auto rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512]" action="">
            <header>
                <h1 className="text-xl font-bold text-gray-100">Solicitação de Reembolso</h1>
                <p className="text-sm text-gray mt-2 mb-2">Dados da despesa para solicitar reembolso.</p>
            </header>

            <Input
            required
            legend="Nome da solicitação"
            onChange={(event) => setName(event.target.value)}
            value={name}
            disabled={!!params.id}
            />

            <div className="flex gap-4">
                <Select
                required
                legend="Categoria"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={!!params.id}
                > 
                <option value="" disabled hidden>Selecione</option>
                {
                    CATEGORIES_KEYS.map((categorieKey) => {
                        return ( 
                        <option key={categorieKey} value={categorieKey}>
                            {CATEGORIES[categorieKey].name}
                        </option>)
                    })      
                }
                </Select>

                <Input 
                type="text" 
                step={5} 
                legend="Valor" 
                required
                onChange={(event) => setAmount(event.target.value)}
                value={amount}
                disabled={!!params.id}/>
            </div>

            {
                (params.id && fileURL) ? (
                <a href={`https://localhost:3333/uploads/${fileURL}`} target="_blank" className="text-sm text-green-100 font-semibold flex items-center justify-center gap-2 my-1">
                    <img src={fileSvg} alt="" /> 
                Abrir comprovante
                </a>
                ) 
                : 
                (<Upload
                    filename={filename && filename.name}
                    onChange={(event) => event?.target.files && setFilename(event.target.files[0])}
                    disabled={!!params.id}
                    />)
            }

            

            <Button 
            isLoading={isLoading} 
            type="submit"
            title={params.id ? "Voltar" : "Enviar"}
            />
       </form>
    )
}