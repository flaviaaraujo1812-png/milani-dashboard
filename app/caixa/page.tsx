"use client"

import { useState,useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Caixa(){

const [produtos,setProdutos] = useState<any[]>([])
const [busca,setBusca] = useState("")
const [carrinho,setCarrinho] = useState<any[]>([])

const [cliente,setCliente] = useState("")
const [endereco,setEndereco] = useState("")
const [entrega,setEntrega] = useState(0)
const [desconto,setDesconto] = useState(0)
const [pagamento,setPagamento] = useState("Pix")

useEffect(()=>{
carregarProdutos()
},[])

async function carregarProdutos(){

const { data } = await supabase
.from("produtos")
.select("*")

if(data){
setProdutos(data)
}

}

function adicionarProduto(p:any){
setCarrinho([...carrinho,p])
}

function removerProduto(index:number){

const novo = [...carrinho]
novo.splice(index,1)

setCarrinho(novo)

}

function cancelarVenda(){

setCarrinho([])
setCliente("")
setEndereco("")
setEntrega(0)
setDesconto(0)

}

const produtosFiltrados = produtos.filter((p:any)=>
p.nome?.toLowerCase().includes(busca.toLowerCase())
)

const subtotal = carrinho.reduce((total,p)=> total + Number(p.preco || 0),0)

const total = subtotal + Number(entrega) - Number(desconto)

async function finalizarVenda(){

for (const p of carrinho){

const lucro = Number(p.preco) - Number(p.custo)

await supabase
.from("caixa")
.insert({
produto:p.nome,
valor:p.preco,
custo:p.custo,
lucro:lucro,
cliente:cliente,
pagamento:pagamento,
data:new Date().toLocaleDateString()
})

await supabase
.from("produtos")
.update({
estoque:p.estoque - 1
})
.eq("id",p.id)

}

gerarComprovante()

cancelarVenda()

alert("Venda finalizada!")

}

function gerarComprovante(){

const itens = carrinho.map((p:any)=>
`• ${p.nome} — R$ ${Number(p.preco).toFixed(2)}`
).join("\n")

const texto = `🛍️ *MILANI BOLSAS*

👤 Cliente: ${cliente || "Não informado"}
📍 Endereço: ${endereco || "Retirada na loja"}

📦 Produtos
${itens}

🚚 Entrega: R$ ${Number(entrega).toFixed(2)}
💸 Desconto: R$ ${Number(desconto).toFixed(2)}

💰 TOTAL: R$ ${Number(total).toFixed(2)}

💳 Pagamento: ${pagamento}

Obrigado pela preferência ❤️
`

navigator.clipboard.writeText(texto)

alert("Comprovante copiado! Agora é só colar no WhatsApp.")

}

return(

<div style={{padding:30,maxWidth:900,margin:"auto"}}>

<h1>Caixa de vendas</h1>

<input
placeholder="Buscar produto"
value={busca}
onChange={(e)=>setBusca(e.target.value)}
style={{
padding:10,
width:"100%",
marginBottom:20,
borderRadius:8,
border:"1px solid #ccc"
}}
/>

<h3>Produtos</h3>

{produtosFiltrados.map((p:any)=>(

<div key={p.id}
style={{
border:"1px solid #eee",
padding:10,
marginBottom:10,
borderRadius:8
}}
>

{p.foto && (

<img
src={p.foto}
style={{
width:80,
height:80,
objectFit:"cover",
borderRadius:8,
marginBottom:10
}}
/>

)}

<b>{p.nome}</b>

<p>R$ {p.preco}</p>

<button
onClick={()=>adicionarProduto(p)}
style={{
background:"#c49a6c",
color:"#fff",
border:"none",
padding:"6px 12px",
borderRadius:6,
cursor:"pointer"
}}
>
Adicionar
</button>

</div>

))}

<hr style={{margin:"20px 0"}}/>

<h3>Carrinho</h3>

{carrinho.map((p:any,i:number)=>(

<div key={i} style={{marginBottom:5}}>

{p.nome} — R$ {p.preco}

<button
onClick={()=>removerProduto(i)}
style={{
marginLeft:10,
background:"#e63946",
color:"#fff",
border:"none",
padding:"3px 8px",
borderRadius:5,
cursor:"pointer"
}}
>
x
</button>

</div>

))}

<p>Subtotal: R$ {subtotal.toFixed(2)}</p>

<hr style={{margin:"20px 0"}}/>

<h3>Cliente</h3>

<input
placeholder="Nome do cliente"
value={cliente}
onChange={(e)=>setCliente(e.target.value)}
/>

<br/><br/>

<input
placeholder="Endereço"
value={endereco}
onChange={(e)=>setEndereco(e.target.value)}
/>

<br/><br/>

<label>Taxa de entrega</label>

<br/>

<input
type="number"
value={entrega}
onChange={(e)=>setEntrega(Number(e.target.value))}
/>

<br/><br/>

<label>Desconto</label>

<br/>

<input
type="number"
value={desconto}
onChange={(e)=>setDesconto(Number(e.target.value))}
/>

<br/><br/>

<label>Forma de pagamento</label>

<br/>

<select
value={pagamento}
onChange={(e)=>setPagamento(e.target.value)}
>

<option>Pix</option>
<option>Dinheiro</option>
<option>Cartão</option>
<option>Transferência</option>

</select>

<hr style={{margin:"20px 0"}}/>

<p>Entrega: R$ {Number(entrega).toFixed(2)}</p>
<p>Desconto: R$ {Number(desconto).toFixed(2)}</p>

<h2>Total: R$ {total.toFixed(2)}</h2>

<button
onClick={finalizarVenda}
style={{
background:"#c49a6c",
color:"#fff",
border:"none",
padding:"10px 20px",
borderRadius:8,
cursor:"pointer"
}}
>
Finalizar venda
</button>

<button
onClick={cancelarVenda}
style={{
background:"#6c757d",
color:"#fff",
border:"none",
padding:"10px 20px",
borderRadius:8,
cursor:"pointer",
marginLeft:10
}}
>
Cancelar venda
</button>

</div>

)

}