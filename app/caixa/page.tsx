"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id:number
  nome:string
  preco:number
  estoque:number
  foto?:string
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
const [resultado,setResultado] = useState<Produto[]>([])

const [cliente,setCliente] = useState("")
const [telefone,setTelefone] = useState("")
const [pagamento,setPagamento] = useState("Pix")

const [taxa,setTaxa] = useState(0)
const [desconto,setDesconto] = useState(0)

const [produtoSelecionado,setProdutoSelecionado] = useState<Produto|null>(null)
const [quantidade,setQuantidade] = useState(1)
const [cor,setCor] = useState("")

useEffect(()=>{
carregar()
},[])

async function carregar(){
const {data} = await supabase.from("produtos").select("*")
setProdutos(data || [])
}

/* BUSCA */
function buscar(valor:string){
setBusca(valor)

const filtrados = produtos.filter(p =>
p.nome.toLowerCase().includes(valor.toLowerCase())
)

setResultado(filtrados.slice(0,5))
}

/* ADICIONAR */
function add(){

if(!produtoSelecionado) return

const novo:Item = {
...produtoSelecionado,
quantidade,
corSelecionada:cor
}

setCarrinho([...carrinho,novo])

setProdutoSelecionado(null)
setBusca("")
setResultado([])
setQuantidade(1)
setCor("")
}

/* REMOVER */
function remove(id:number){
setCarrinho(carrinho.filter(p=>p.id!==id))
}

/* VALORES */
function subtotal(){
return carrinho.reduce((t,p)=> t + p.preco*p.quantidade,0)
}

function total(){
return subtotal() - (subtotal()*desconto/100) + taxa
}

/* FINALIZAR */
async function finalizar(){

await supabase.from("caixa").insert({
cliente,
valor:total(),
pagamento,
itens:carrinho
})

alert("Venda finalizada")

setCarrinho([])
setCliente("")
setTelefone("")
setTaxa(0)
setDesconto(0)
}

/* ESTILO */
const box = {
background:"#fff",
padding:"20px",
borderRadius:"12px",
flex:1
}

const input = {
width:"100%",
padding:"10px",
marginBottom:"10px",
borderRadius:"8px",
border:"1px solid #ccc"
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

<h1>Caixa</h1>

<div style={{display:"flex",gap:"20px"}}>

{/* ESQUERDA */}
<div style={box}>

<h3>Cliente</h3>

<input style={input} placeholder="Nome" value={cliente} onChange={e=>setCliente(e.target.value)} />
<input style={input} placeholder="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} />

<select style={input} onChange={e=>setPagamento(e.target.value)}>
<option>Pix</option>
<option>Cartão</option>
<option>Dinheiro</option>
</select>

<input style={input} type="number" placeholder="Entrega" onChange={e=>setTaxa(Number(e.target.value))} />
<input style={input} type="number" placeholder="Desconto %" onChange={e=>setDesconto(Number(e.target.value))} />

{/* BUSCA */}
<input
style={input}
placeholder="Buscar produto"
value={busca}
onChange={e=>buscar(e.target.value)}
/>

{/* RESULTADOS */}
{resultado.map(p=>(
<div key={p.id}
onClick={()=>setProdutoSelecionado(p)}
style={{cursor:"pointer",padding:"5px",borderBottom:"1px solid #eee"}}
>
{p.nome}
</div>
))}

{/* PRODUTO SELECIONADO */}
{produtoSelecionado && (

<div style={{marginTop:"10px"}}>

<img src={produtoSelecionado.foto} width="100" />

<p>{produtoSelecionado.nome}</p>

<input
type="number"
value={quantidade}
onChange={e=>setQuantidade(Number(e.target.value))}
style={input}
/>

<input
placeholder="Cor"
value={cor}
onChange={e=>setCor(e.target.value)}
style={input}
/>

<button style={btn} onClick={add}>
Adicionar
</button>

</div>

)}

</div>

{/* DIREITA */}
<div style={box}>

<h3>Carrinho</h3>

{carrinho.map((p,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between"}}>

<div>
<p>{p.nome}</p>
<p>{p.corSelecionada}</p>
<p>x{p.quantidade}</p>
</div>

<button onClick={()=>remove(p.id)}>X</button>

</div>
))}

<hr/>

<p>Subtotal: R$ {subtotal().toFixed(2)}</p>
<p>Desconto: {desconto}%</p>
<p>Entrega: R$ {taxa}</p>

<h2>Total: R$ {total().toFixed(2)}</h2>

<div style={{display:"flex",gap:"10px"}}>

<button style={btn} onClick={finalizar}>
Finalizar
</button>

<button onClick={()=>setCarrinho([])}>
Cancelar
</button>

</div>

</div>

</div>

</div>

)
}