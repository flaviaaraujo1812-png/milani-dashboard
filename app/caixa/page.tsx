"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id:number
  nome:string
  preco:number
  estoque:number
  cores?:string
}

type Item = Produto & {
  quantidade:number
  corSelecionada?:string
}

export default function Caixa(){

const [produtos,setProdutos] = useState<Produto[]>([])
const [carrinho,setCarrinho] = useState<Item[]>([])

const [busca,setBusca] = useState("")
const [cliente,setCliente] = useState("")
const [telefone,setTelefone] = useState("")
const [pagamento,setPagamento] = useState("Pix")

const [taxa,setTaxa] = useState(0)
const [desconto,setDesconto] = useState(0)

useEffect(()=>{
carregar()
},[])

async function carregar(){
const {data} = await supabase.from("produtos").select("*")
setProdutos(data || [])
}

function add(prod:Produto){
const existe = carrinho.find(p=>p.id===prod.id)

if(existe){
setCarrinho(carrinho.map(p=>p.id===prod.id ? {...p,quantidade:p.quantidade+1}:p))
}else{
setCarrinho([...carrinho,{...prod,quantidade:1}])
}
}

function remove(id:number){
setCarrinho(carrinho.filter(p=>p.id!==id))
}

function subtotal(){
return carrinho.reduce((t,p)=> t + p.preco*p.quantidade,0)
}

function valorDesconto(){
return subtotal()*(desconto/100)
}

function total(){
return subtotal() - valorDesconto() + taxa
}

function cancelar(){
setCarrinho([])
setCliente("")
setTelefone("")
setTaxa(0)
setDesconto(0)
}

function mensagem(){

let msg = `🛍️ *Pedido - Milani*%0A%0A`

msg += `👤 ${cliente}%0A📞 ${telefone}%0A%0A`

msg += `🛒 *Itens:*%0A`

carrinho.forEach(p=>{
msg += `- ${p.nome} x${p.quantidade} = R$ ${(p.preco*p.quantidade).toFixed(2)}%0A`
})

msg += `%0A💰 Total: R$ ${total().toFixed(2)}%0A`
msg += `💳 ${pagamento}%0A`
msg += `%0A✨ Obrigado pela preferência!`

const numero = telefone.replace(/\D/g,"")

window.open(`https://wa.me/55${numero}?text=${msg}`,"_blank")
}

async function finalizar(){

if(!confirm("Finalizar venda?")) return

await supabase.from("caixa").insert({
cliente,
valor:total(),
pagamento,
itens:carrinho
})

for(const i of carrinho){
await supabase
.from("produtos")
.update({estoque:i.estoque - i.quantidade})
.eq("id",i.id)
}

mensagem()
cancelar()
alert("Venda salva!")

}

const input = {
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"1px solid #D8C3A5",
marginBottom:"10px"
}

const btn = {
background:"#E8AEB7",
color:"#fff",
border:"none",
padding:"10px",
borderRadius:"8px",
cursor:"pointer"
}

return(

<div>

<h1 style={{color:"#6B3E2E"}}>Caixa</h1>

<div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

{/* CLIENTE */}
<div style={{
flex:1,
background:"#fff",
padding:"20px",
borderRadius:"12px"
}}>

<h3>Cliente</h3>
<input style={input} placeholder="Nome" value={cliente} onChange={e=>setCliente(e.target.value)} />

<input style={input} placeholder="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} />

<select style={input} onChange={e=>setPagamento(e.target.value)}>
<option>Pix</option>
<option>Dinheiro</option>
<option>Cartão</option>
</select>

<input style={input} type="number" placeholder="Entrega" onChange={e=>setTaxa(Number(e.target.value))} />

<input style={input} type="number" placeholder="Desconto %" onChange={e=>setDesconto(Number(e.target.value))} />

</div>

{/* VENDA */}
<div style={{
flex:2,
background:"#fff",
padding:"20px",
borderRadius:"12px"
}}>

<input placeholder="Buscar" style={input} onChange={e=>setBusca(e.target.value)} />

<div style={{maxHeight:200,overflowY:"auto"}}>

{produtos
.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()))
.map(p=>(
<div key={p.id} style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>

<span>{p.nome} - R$ {p.preco}</span>

<button style={btn} onClick={()=>add(p)}>+</button>

</div>
))}

</div>

<hr/>

<h3>Carrinho</h3>

{carrinho.map(p=>(
<div key={p.id} style={{display:"flex",justifyContent:"space-between"}}>

<span>{p.nome} x{p.quantidade}</span>

<button onClick={()=>remove(p.id)}>X</button>

</div>
))}

<hr/>

<p>Subtotal: R$ {subtotal().toFixed(2)}</p>
<p>Desconto: {desconto}%</p>
<p>Entrega: R$ {taxa}</p>

<h2 style={{color:"#C9A227"}}>
Total: R$ {total().toFixed(2)}
</h2>

<div style={{display:"flex",gap:"10px"}}>

<button style={btn} onClick={finalizar}>
Finalizar
</button>

<button onClick={cancelar}>
Cancelar
</button>

</div>

</div>

</div>

</div>

)
}
