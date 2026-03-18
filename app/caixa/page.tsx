"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id: number
  nome: string
  preco: number
  estoque: number
  cores?: string
}

type ItemCarrinho = Produto & {
  quantidade: number
  corSelecionada?: string
}

export default function Caixa(){

const [produtos,setProdutos] = useState<Produto[]>([])
const [carrinho,setCarrinho] = useState<ItemCarrinho[]>([])
const [busca,setBusca] = useState("")

const [cliente,setCliente] = useState("")
const [telefone,setTelefone] = useState("")
const [endereco,setEndereco] = useState("")
const [pagamento,setPagamento] = useState("Pix")

const [taxaEntrega,setTaxaEntrega] = useState(0)
const [desconto,setDesconto] = useState(0)

useEffect(()=>{
buscarProdutos()
},[])

async function buscarProdutos(){
const {data} = await supabase.from("produtos").select("*")
setProdutos(data || [])
}

function adicionarProduto(produto:Produto){
const existe = carrinho.find(p=>p.id === produto.id)

if(existe){
setCarrinho(carrinho.map(p =>
p.id === produto.id
? {...p, quantidade:p.quantidade + 1}
: p
))
}else{
setCarrinho([...carrinho,{...produto, quantidade:1}])
}
}

function removerProduto(produto:Produto){
setCarrinho(carrinho.filter(p=>p.id !== produto.id))
}

function alterarCor(id:number, cor:string){
setCarrinho(carrinho.map(p =>
p.id === id ? {...p, corSelecionada:cor} : p
))
}

function subtotal(){
return carrinho.reduce((acc,p)=> acc + p.preco * p.quantidade,0)
}

function valorDesconto(){
return subtotal() * (desconto / 100)
}

function total(){
return subtotal() - valorDesconto() + taxaEntrega
}

function cancelarVenda(){
setCarrinho([])
setCliente("")
setTelefone("")
setEndereco("")
setTaxaEntrega(0)
setDesconto(0)
}

async function finalizarVenda(){

await supabase.from("caixa").insert({
cliente,
pagamento,
valor: total(),
itens: carrinho
})

for(const item of carrinho){
await supabase
.from("produtos")
.update({estoque:item.estoque - item.quantidade})
.eq("id",item.id)
}

alert("Venda salva!")
cancelarVenda()
}

const inputStyle = {
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"1px solid #D8C3A5",
marginBottom:"10px"
}

const buttonStyle = {
background:"#E8AEB7",
color:"#fff",
border:"none",
padding:"10px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}

return(

<div>

<h1 style={{color:"#6B3E2E", marginBottom:"20px"}}>
Caixa de Vendas
</h1>

<div style={{display:"flex", gap:"20px", flexWrap:"wrap"}}>

{/* CLIENTE */}
<div style={{
flex:"1",
minWidth:"280px",
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<h3>Cliente</h3>
<input style={inputStyle} value={cliente} onChange={e=>setCliente(e.target.value)} />

<h3>Telefone</h3>
<input style={inputStyle} value={telefone} onChange={e=>setTelefone(e.target.value)} />

<h3>Endereço</h3>
<input style={inputStyle} value={endereco} onChange={e=>setEndereco(e.target.value)} />

<h3>Pagamento</h3>
<select style={inputStyle} onChange={e=>setPagamento(e.target.value)}>
<option>Pix</option>
<option>Dinheiro</option>
<option>Cartão</option>
</select>

<h3>Entrega</h3>
<input style={inputStyle} type="number" onChange={e=>setTaxaEntrega(Number(e.target.value))} />

<h3>Desconto (%)</h3>
<input style={inputStyle} type="number" onChange={e=>setDesconto(Number(e.target.value))} />

</div>

{/* PRODUTOS + CARRINHO */}
<div style={{
flex:"2",
minWidth:"320px",
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<input
placeholder="Buscar produto"
style={inputStyle}
onChange={e=>setBusca(e.target.value)}
/>

<div style={{
maxHeight:"250px",
overflowY:"auto",
marginBottom:"15px"
}}>
{produtos
.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()))
.map(p=>{

const cores = p.cores ? p.cores.split(",") : []

return(
<div key={p.id} style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"10px"
}}>

<div>
{p.nome} - R$ {p.preco}
</div>

<div>

<button
onClick={()=>adicionarProduto(p)}
style={{...buttonStyle, padding:"5px 10px", marginRight:"5px"}}
>
+
</button>

{cores.length > 0 && (
<select
style={{borderRadius:"6px", padding:"5px"}}
onChange={(e)=>alterarCor(p.id,e.target.value)}
>
<option>Cor</option>
{cores.map((c,i)=>(
<option key={i}>{c}</option>
))}
</select>
)}

</div>

</div>
)
})}
</div>

<hr/>

<h3>Carrinho</h3>

{carrinho.map(p=>(
<div key={p.id} style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"8px"
}}>
<div>
{p.nome} ({p.corSelecionada || "sem cor"}) x{p.quantidade}
</div>

<button
onClick={()=>removerProduto(p)}
style={{background:"red", color:"#fff", border:"none", borderRadius:"6px"}}
>
X
</button>

</div>
))}

<hr/>

<h3>Subtotal: R$ {subtotal().toFixed(2)}</h3>
<p>Entrega: R$ {taxaEntrega}</p>
<p>Desconto: {desconto}%</p>

<h2 style={{color:"#C9A227"}}>
Total: R$ {total().toFixed(2)}
</h2>

<div style={{display:"flex", gap:"10px"}}>

<button onClick={finalizarVenda} style={{...buttonStyle, flex:1}}>
Finalizar venda
</button>

<button onClick={cancelarVenda} style={{flex:1}}>
Cancelar
</button>

</div>

</div>

</div>

</div>

)
}