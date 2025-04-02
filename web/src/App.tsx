import { Routes } from "./routes";
import { AuthContext, AuthProvider } from "./context/AuthContext";

export function App(){
  return (
    <AuthProvider>
       <Routes/>
    </AuthProvider>
  )
}