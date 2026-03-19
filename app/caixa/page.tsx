"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id:number
  nome:string
  preco:number
  estoque:number
  cores?:string
  foto?:string
}

type Item = {
  id:number
  nome:string
  preco:number
  estoque:number
  quantidade:number
  corSelecionada?:string
  foto?:string
}

export default function Caixa(){

const [produtos,setProdutos] = useState<Produto[]>([])
const [resultado,setResultado] = useState<Produto | null>(null)

const [busca,setBusca] = useState("")
const [cor,setCor] = useState("")
const [quantidade,setQuantidade] = useState(1)

const [carrinho,setCarrinho] = useState<Item[]>([])

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

function buscarProduto(valor:string){
setBusca(valor)

if(valor.length < 2){
setResultado(null)
return
}

const encontrado = produtos.find(p =>
p.nome.toLowerCase().includes(valor.toLowerCase())
)

setResultado(encontrado || null)
}

/* ✅ ADICIONAR COM COR + QUANTIDADE */
function adicionar(){

if(!resultado) return

const existe = carrinho.find(
p => p.id === resultado.id && p.corSelecionada === cor
)

if(existe){
setCarrinho(carrinho.map(p =>
p.id === resultado.id && p.corSelecionada === cor
? {...p, quantidade: p.quantidade + quantidade}
: p
))
}else{
setCarrinho([
...carrinho,
{
id: resultado.id,
nome: resultado.nome,
preco: resultado.preco,
estoque: resultado.estoque,
quantidade: quantidade,
corSelecionada: cor,
foto: resultado.foto
}
])
}

/* reset */
setResultado(null)
setBusca("")
setCor("")
setQuantidade(1)
}

function remover(id:number){
setCarrinho(carrinho.filter(p=>p.id!==id))
}

/* VALORES */
function subtotal(){
return carrinho.reduce((t,p)=> t + p.preco*p.quantidade,0)
}

function valorDesconto(){
return subtotal()*(desconto/100)
}

function total(){
return subtotal() - valorDesconto() + taxa
}

/* WHATSAPP */
function mensagem(){

let msg = `🛍️ *Pedido - Milani*%0A%0A`

msg += `👤 ${cliente}%0A📞 ${telefone}%0A%0A`

msg += `🛒 *Itens:*%0A`

carrinho.forEach(p=>{
msg += `- ${p.nome} (${p.corSelecionada || "-"}) x${p.quantidade} = R$ ${(p.preco*p.quantidade).toFixed(2)}%0A`
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
setCarrinho([])
alert("Venda salva!")
}

/* ESTILO */
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

<input
placeholder="Buscar código ou nome"
style={input}
value={busca}
onChange={e=>buscarProduto(e.target.value)}
/>

{/* RESULTADO */}
{resultado && (
<div style={{
border:"1px solid #ddd",
padding:10,
borderRadius:8,
marginBottom:10
}}>

{resultado.foto && (
<img src={resultado.foto} width="80" style={{borderRadius:8}} />
)}

<p>{resultado.nome}</p>
<p>R$ {resultado.preco}</p>

{/* COR */}
{resultado.cores && (
<select style={input} onChange={e=>setCor(e.target.value)}>
<option>Escolher cor</option>
{resultado.cores.split(",").map((c,i)=>(
<option key={i}>{c}</option>
))}
</select>
)}

{/* QUANTIDADE */}
<input
type="number"
style={input}
value={quantidade}
onChange={e=>setQuantidade(Number(e.target.value))}
/>

<button style={btn} onClick={adicionar}>
Adicionar ao carrinho
</button>

</div>
)}

<hr/>

<h3>Carrinho</h3>

{carrinho.map(p=>(
<div key={p.id} style={{
display:"flex",
gap:10,
marginBottom:10,
alignItems:"center"
}}>

{p.foto && (
<img src={p.foto} width="50" style={{borderRadius:6}} />
)}

<div style={{flex:1}}>
<p>{p.nome}</p>
<p>{p.corSelecionada || "-"}</p>
<p>x{p.quantidade}</p>
</div>

<button onClick={()=>remover(p.id)}>X</button>

</div>
))}

<hr/>

<p>Subtotal: R$ {subtotal().toFixed(2)}</p>
<p>Desconto: {desconto}%</p>
<p>Entrega: R$ {taxa}</p>

<h2 style={{color:"#C9A227"}}>
Total: R$ {total().toFixed(2)}
</h2>

<button style={btn} onClick={finalizar}>
Finalizar venda
</button>

</div>

</div>

</div>

)
}