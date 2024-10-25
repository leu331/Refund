const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const expense = document.getElementById("expense")
const category = document.querySelector("#category")

//seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//capturando o evento do input
amount.oninput = () => { 

    //selecionando o valor que eu digitar no input e substituindo por nada
    let value = amount.value.replace(/\D/g, "")

    //transformando em centavos
    value = Number(value) / 100

    /*para fazer a função abaixo receber o valor atualizado*/
    amount.value = formatCurrencyBRL (value)
    
    //fazendo o valor do input receber a substituição que fiz acima, não permitindo que as letras apareçam na caixinha 
    //amount.value = value
}

function formatCurrencyBRL(value) {

    //formatando valor no padrão BRL
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

//captura o evento de submit
form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),

    }

    /*console.log(newExpense);*/

    //chama a função que irá adicionar o item na lista
    expenseAdd(newExpense)
    
}

function expenseAdd (newExpense) {
    try {
        //cria o elemento de li para adicionar o item (ul) na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense") //adicionando a classe de estilização

        //adicionando o ícone da categoria 
        const expenseIcon = document.createElement("img")
        
        //coloca a imagem dinamicamente de acordo com o com o valor da categoria (category.value)
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        
        //adicionando o alt
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //criando informações do item
        const expenseInfo = document.createElement("div")
        expense.classList.add("expense-info")

        //criando o nome
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense //atualizando o texto da despesa dinamicamente

        //criando a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //adiciona nome e categoria na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        //criando o valor da despesa
        expenseAmount = document.createElement("span")
        expenseAmount.classList.add(expense-amount)
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        //criando icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover item")

        //adicionando número de despesas

        //adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
        
        //adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulário para ser completado novamente após alguma adição
        formClear()

        //depois que adiciona um item, atualiza os totais
        updateTotals()

    
    }

    catch (error) {
        alert("Não foi possível adicionar a despesa na lista.")
    }

}

//adicionando função que atualiza o número de despesas e o valor total
function updateTotals () {
    try {
        const itens = expenseList.children

        //atualiza a quantidade de itens da lista
        expenseQuantity.textContent = `${itens.length} ${itens.length > 1 ? "despesas" : "despesa"}`
        console.log(itens)
        
        let total = 0

        for(let item = 0; item < itens.length; item++){
            const itemAmount = itens[item].querySelector(".expense-amount")

            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(".", ",")

            value = parseFloat(value) 

            if(isNaN(value)){
                return alert ("Não foi possível calcular o total")
            }

            total += Number(value)
        }

        expensesTotal.textContent = formatCurrencyBRL(total)
        
        //cria a small de R$ para o total
        const symbolBRL = document.createElement("small") 
        //escolhe o conteúdo da small
        symbolBRL = "R$"

        //formata o total
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
        
        //limpa o conteúdo do elemento
        expensesTotal.innerHTML = ""

        //puxa o valor total das despesas e o símbolo R$
        expensesTotal.append(symbolBRL, total)
    }

    catch (error) {
    alert("Não foi possível atualizar os totais")   
    }
}


//evento que captura clique nos itens da lista
expenseList.addEventListener("click", function(event) {
    //verifica se o item clicado é o de remover
    if(event.target.classList.contains("remove-icon")){

        //obtém a li pai do elemento clicado
        const item = event.target.closest(".expense")

        //remove o item
        item.remove()

    }
    //atualiza os totais
    updateTotals()
})


function formClear () {
    expense.value = ""
    category.value = ""
    amount = ""

    //deixa o foco no input do nome da despesa após algo ser adicionado
    expense.focus()
}
