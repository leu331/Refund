import { useEffect, useState } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { RefundItem, RefundItemProps } from "../components/refundItem";

import { formatCurrency } from "../utils/formatCurrency";
import { CATEGORIES } from "../utils/categories";

import searchSvg from "../assets/search.svg";
import { Pagination } from "../components/Pagination";

import { api } from "../services/api";
import { AxiosError } from "axios";
import { data } from "react-router";

// const REFUND_EXAMPLE = {
//     id: "123",
//     username: "Alice",
//     category: "Transporte",
//     expense: formatCurrency(43.3),
//     categoryImg: CATEGORIES["transport"].icon,
// };

const PER_PAGE = 5

export function Dashboard() {
    const [name, setName] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1); // Esse valor precisa ser dinâmico futuramente
    const [refunds, setRefunds] = useState<RefundItemProps[]>([]); // Estado para armazenar os reembolsos

    async function fetchRefunds() {
        try {
            const response = await api.get<RefundPaginationAPIResponse>(`/refunds?=${name.trim()}&page=${page}&perPage=${PER_PAGE}`)
            setRefunds(response.data.refunds.map((refund) =>({
                id: refund.id,
                name: refund.user.name,
                category: refund.name,
                amount: formatCurrency(refund.amount),
                categoryImg: CATEGORIES[refund.category].icon
            })))

            setTotalPage(response.data.pagination.totalPages)
        } 
        catch (error) {
          console.log(error)  

          if (error instanceof AxiosError) {
            return alert(error.response?.data.message)
          }
          return alert("Não foi possível carregar os reembolsos.")
        }
     
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        fetchRefunds()
    }

    

    function handlePagination(action: "next" | "previous") {
        setPage((prevPage) => {
            let newPage = prevPage;
            if (action === "next" && prevPage < totalPage) {
                newPage = prevPage + 1;
            }
            if (action === "previous" && prevPage > 1) {
                newPage = prevPage - 1;
            }
    
            console.log(`🔄 Página alterada para: ${newPage}`);
            return newPage;
        });
    }
    
    // Sempre buscar os reembolsos quando a página mudar
    useEffect(() => {
        fetchRefunds();
    }, [page]);
    

    return (
        <div className="bg-gray-500 rounded-xl p-10 md:min-w-[768px]">
            <h1 className="text-gray-100 font-bold text-xl flex-1">Solicitações</h1>

            <form
                onSubmit={fetchRefunds}
                className="flex items-center justify-between pb-6 border-b-[1px] border-gray-400 md:flex-row gap-2 mt-6"
            >
                <Input
                    placeholder="Pesquisar pelo nome"
                    onChange={(event) => setName(event.target.value)}
                />

                <Button variant="iconSmall" onClick={onSubmit} className="w-12 h-12"> 
                    <img src={searchSvg} alt="Pesquisar" className="w-5"/>
                </Button>
            </form>

            <div className="flex flex-col mt-6 gap-4 overflow-y-scroll max-h-[342px]">
                {refunds.length > 0 ? (
                    refunds.map((refund: RefundItemProps) => <RefundItem href={`/refund/${refund.id}`} key={refund.id} data={refund} />)
                ) : (
                    <p className="text-gray-300 text-center">Nenhum reembolso encontrado.</p>
                )}
            </div>

            <Pagination
                current={page}
                total={totalPage}
                onNext={() => handlePagination("next")}
                onPrevious={() => handlePagination("previous")}
            />
        </div>
    );
}
