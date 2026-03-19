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

/* 🔍 BUSCA INTELIGENTE */
function buscarProduto(valor:string){

setBusca(valor)

if(valor.length < 2) return

const encontrado = produtos.find(p =>
p.nome.toLowerCase().includes(valor.toLowerCase()) ||
String(p.id) === valor
)

if(encontrado){
add(encontrado)
setBusca("")
}

}

/* 🛒 CARRINHO */
function add(prod:Produto){
const existe = carrinho.find(p=>p.id===prod.id)

if(existe){
setCarrinho(carrinho.map(p=>
p.id===prod.id ? {...p,quantidade:p.quantidade+1}:p
))
}else{
setCarrinho([...carrinho,{...prod,quantidade:1}])
}
}

function alterarCor(id:number, cor:string){
setCarrinho(carrinho.map(p=>
p.id === id ? {...p, corSelecionada:cor} : p
))
}

function remove(id:number){
setCarrinho(carrinho.filter(p=>p.id!==id))
}

/* 💰 CÁLCULOS */
function subtotal(){
return carrinho.reduce((t,p)=> t + p.preco*p.quantidade,0)
}

function valorDesconto(){
return subtotal()*(desconto/100)
}

function total(){
return subtotal() - valorDesconto() + taxa
}

/* 🔄 AÇÕES */
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
msg += `- ${p.nome} (${p.corSelecionada || "sem cor"}) x${p.quantidade} = R$ ${(p.preco*p.quantidade).toFixed(2)}%0A`
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

/* 🎨 ESTILO */

const input = {
width:"100%",
padding:"12px",
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
cursor:"pointer",
fontWeight:"bold"
}

/* 🖥️ TELA */

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

{/* 🔍 BUSCA */}
<input
placeholder="Digite código ou nome do produto"
style={input}
value={busca}
onChange={(e)=>buscarProduto(e.target.value)}
onKeyDown={(e)=>{
if(e.key === "Enter"){
buscarProduto(busca)
}
}}
/>

<hr/>

<h3>Carrinho</h3>

{carrinho.map(p=>{

const cores = p.cores ? p.cores.split(",") : []

return(

<div key={p.id} style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"8px"
}}>

<div>
{p.nome} ({p.corSelecionada || "sem cor"}) x{p.quantidade}
</div>

<div style={{display:"flex",gap:"5px"}}>

{cores.length > 0 && (
<select onChange={(e)=>alterarCor(p.id,e.target.value)}>
<option>Cor</option>
{cores.map((c,i)=>(
<option key={i}>{c}</option>
))}
</select>
)}

<button onClick={()=>remove(p.id)}>X</button>

</div>

</div>

)

})}

<hr/>

<p>Subtotal: R$ {subtotal().toFixed(2)}</p>
<p>Desconto: {desconto}%</p>
<p>Entrega: R$ {taxa}</p>

<h2 style={{color:"#C9A227"}}>
Total: R$ {total().toFixed(2)}
</h2>

<div style={{display:"flex",gap:"10px"}}>

<button style={btn} onClick={finalizar}>
Finalizar venda
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