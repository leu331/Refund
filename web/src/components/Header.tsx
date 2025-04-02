import logoSvg from "../assets/logo.svg"
import logoutSvg from "../assets/logout.svg"
import { useAuth } from "../hooks/useContextAuth"

export function Header () {
    const auth = useAuth()
    return (
       
        <header className="w-full flex items-center justify-between">
            <img src={logoSvg} alt="" />

            <div className="flex items-center gap-3">
                <span 
                    className="font-semibold text-sm text-gray-200">
                        {`Olá, ${auth.session?.user.name}`}
                </span>

                <img 
                src={logoutSvg} 
                alt="" 
                className="my-8 cursor-pointer hover:opacity-75"
                onClick={() => auth.logoutUser()}/>
            </div>
        </header>

    )
}