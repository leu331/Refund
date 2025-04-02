import { BrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./authRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { ManagerRoutes } from "./ManagerRoutes";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useContextAuth";

// const isLoading = false

// const session = {
//     user: {
//         role: "" 
//     }
// }

export function Routes(){
    const {session, isLoading} = useAuth()

    function Route() {
        switch (session?.user.role) {
            case "employee":
                return <EmployeeRoutes/>
            case "manager":
                return <ManagerRoutes/>
            default:
                return <AuthRoutes/>
        }
    }

    if (isLoading) {
        return <Loading/>
    }

    return (   
    <BrowserRouter> 
        <Route/>
    </BrowserRouter>
    )
}