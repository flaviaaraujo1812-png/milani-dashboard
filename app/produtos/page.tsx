"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Produtos(){

const [produtos,setProdutos] = useState<any[]>([])
const [busca,setBusca] = useState("")
const [nome,setNome] = useState("")
const [preco,setPreco] = useState("")
const [custo,setCusto] = useState("")
const [estoque,setEstoque] = useState("")
const [foto,setFoto] = useState("")
const [editandoId,setEditandoId] = useState<any>(null)

useEffect(()=>{
carregarProdutos()
},[])

async function carregarProdutos(){

const { data } = await supabase
.from("produtos")
.select("*")
.order("id",{ascending:false})

if(data){
setProdutos(data)
}

}

async function salvarProduto(){

if(editandoId){

await supabase
.from("produtos")
.update({
nome,
preco:Number(preco),
custo:Number(custo),
estoque:Number(estoque),
foto
})
.eq("id",editandoId)

setEditandoId(null)

}else{

await supabase
.from("produtos")
.insert([{
nome,
preco:Number(preco),
custo:Number(custo),
estoque:Number(estoque),
foto
}])

}

setNome("")
setPreco("")
setCusto("")
setEstoque("")
setFoto("")

carregarProdutos()

}

async function excluirProduto(id:any){

await supabase
.from("produtos")
.delete()
.eq("id",id)

carregarProdutos()

}

async function editarProduto(p:any){

setNome(p.nome)
setPreco(p.preco)
setCusto(p.custo)
setEstoque(p.estoque)
setFoto(p.foto)
setEditandoId(p.id)

}

async function venderProduto(p:any){

if(p.estoque <= 0){
alert("Produto sem estoque")
return
}

await supabase
.from("produtos")
.update({
estoque:p.estoque - 1
})
.eq("id",p.id)

await supabase
.from("caixa")
.insert([{
produto:p.nome,
valor:Number(p.preco),
custo:Number(p.custo),
lucro:Number(p.preco)-Number(p.custo),
data:new Date()
}])

carregarProdutos()

}

const produtosFiltrados = produtos.filter((p)=>
p.nome?.toLowerCase().includes(busca.toLowerCase())
)

return(

<div style={{padding:30,maxWidth:1200,margin:"auto"}}>

<h1>Painel de Produtos</h1>

<input
placeholder="Buscar produto..."
value={busca}
onChange={(e)=>setBusca(e.target.value)}
style={{
padding:10,
width:"100%",
marginBottom:20,
borderRadius:8,
border:"1px solid #ddd"
}}
/>

<h2>Cadastrar Produto</h2>

<input
type="text"
placeholder="Nome"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<br/><br/>

<input
type="number"
placeholder="Preço"
value={preco}
onChange={(e)=>setPreco(e.target.value)}
/>

<br/><br/>

<input
type="number"
placeholder="Custo"
value={custo}
onChange={(e)=>setCusto(e.target.value)}
/>

<br/><br/>

<input
type="number"
placeholder="Estoque"
value={estoque}
onChange={(e)=>setEstoque(e.target.value)}
/>

<br/><br/>

<input
type="text"
placeholder="URL da foto"
value={foto}
onChange={(e)=>setFoto(e.target.value)}
/>

<br/><br/>

<button
onClick={salvarProduto}
style={{
background:"#c49a6c",
color:"#fff",
border:"none",
padding:"10px 20px",
borderRadius:8,
cursor:"pointer"
}}
>
Salvar Produto
</button>

<hr style={{margin:"30px 0"}}/>

<h2>Produtos cadastrados</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
gap:20
}}>

{produtosFiltrados.map((p:any)=>(

<div key={p.id} style={{
border:"1px solid #eee",
padding:15,
borderRadius:10,
boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}}>

<b>{p.nome}</b>

<p>Venda: R$ {p.preco || 0}</p>

<p>Custo: R$ {p.custo || 0}</p>

<p style={{color:"green"}}>
Lucro: R$ {(p.preco || 0)-(p.custo || 0)}
</p>

<p style={{
color:p.estoque <= 2 ? "red":"black"
}}>
Estoque: {p.estoque}
</p>

<img
src={p.foto || "https://via.placeholder.com/80"}
width="80"
/>

<br/><br/>

<button
onClick={()=>editarProduto(p)}
style={{
background:"#c49a6c",
color:"#fff",
border:"none",
padding:"6px 12px",
marginRight:5,
borderRadius:6,
cursor:"pointer"
}}
>
Editar
</button>

<button
onClick={()=>excluirProduto(p.id)}
style={{
background:"#b02a37",
color:"#fff",
border:"none",
padding:"6px 12px",
marginRight:5,
borderRadius:6,
cursor:"pointer"
}}
>
Excluir
</button>

<button
onClick={()=>venderProduto(p)}
style={{
background:"#2e7d32",
color:"#fff",
border:"none",
padding:"6px 12px",
borderRadius:6,
cursor:"pointer"
}}
>
Vender
</button>

</div>

))}

</div>

</div>

)

}