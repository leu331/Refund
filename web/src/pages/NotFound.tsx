import error from "../assets/404-error.png"

export function NotFound () {
    return (
            <div className=" h-screen flex flex-col items-center bg-gray-400 justify-center px-4 pb-14"> 
                <img className="w-56 sm:w-80 mb-6" src={error} alt="" />

                <h1 className="text-gray-100 font-semibold text-xl mb-10 text-center"> A página que você procura não está mais por aqui. Acontece com os melhores links. 🤔</h1>

                <a className="flex justify-center items-center w-full max-w-[250px] bg-green-100 h-10 rounded-lg text-white hover:bg-green-200" href="/">Voltar para o ínicio</a>
            </div>     
    )
}