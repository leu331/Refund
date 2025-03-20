import { BrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./authRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { ManagerRoutes } from "./ManagerRoutes";
import { Loading } from "../components/Loading";

const isLoading = false

const session = {
    user: {
        role: "" 
    }
}

export function Routes(){

    function Route() {
        switch (session.user.role) {
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