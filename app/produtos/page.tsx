"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
"https://kkbobdoymvhebusrjcou.supabase.co",
"sb_publishable_nKo1OA9sJgSWY5qbxlUX9A_3eHpstql"
)

export default function Produtos(){

const [produtos,setProdutos] = useState<any[]>([])

const [nome,setNome] = useState("")
const [preco,setPreco] = useState("")
const [custo,setCusto] = useState("")
const [estoque,setEstoque] = useState("")
const [cores,setCores] = useState("")
const [foto,setFoto] = useState<any>(null)
const [preview,setPreview] = useState("")

const [produtoEditando,setProdutoEditando] = useState<any>(null)

useEffect(()=>{
carregarProdutos()
},[])

async function carregarProdutos(){

const {data} = await supabase
.from("produtos")
.select("*")
.order("nome",{ascending:true})

setProdutos(data || [])

}

function selecionarFoto(e:any){

const file = e.target.files[0]

if(file){
setFoto(file)
setPreview(URL.createObjectURL(file))
}

}

async function uploadImagem(){

if(!foto) return ""

const nomeArquivo = Date.now()+"_"+foto.name

await supabase.storage
.from("produtos")
.upload(nomeArquivo,foto)

const {data} = supabase
.storage
.from("produtos")
.getPublicUrl(nomeArquivo)

return data.publicUrl

}

async function salvarProduto(){

let urlFoto = ""

if(foto){
urlFoto = await uploadImagem()
}

const dados = {
nome,
preco:Number(preco),
custo:Number(custo),
estoque:Number(estoque),
cores,
foto:urlFoto
}

if(produtoEditando){
await supabase.from("produtos").update(dados).eq("id",produtoEditando.id)
}else{
await supabase.from("produtos").insert(dados)
}

setNome("")
setPreco("")
setCusto("")
setEstoque("")
setCores("")
setFoto(null)
setPreview("")
setProdutoEditando(null)

carregarProdutos()
}

function editarProduto(p:any){
setProdutoEditando(p)
setNome(p.nome)
setPreco(p.preco)
setCusto(p.custo)
setEstoque(p.estoque)
setCores(p.cores)
}

async function excluirProduto(id:number){
await supabase.from("produtos").delete().eq("id",id)
carregarProdutos()
}

/* ESTILOS */

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
padding:"12px",
borderRadius:"8px",
fontWeight:"bold",
cursor:"pointer"
}

return(

<div>

<h1 style={{color:"#6B3E2E", marginBottom:"20px"}}>
Cadastro de Produtos
</h1>

{/* FORMULÁRIO */}
<div style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)",
marginBottom:"30px"
}}>

<input placeholder="Nome" value={nome} onChange={(e)=>setNome(e.target.value)} style={inputStyle} />
<input placeholder="Preço" value={preco} onChange={(e)=>setPreco(e.target.value)} style={inputStyle} />
<input placeholder="Custo" value={custo} onChange={(e)=>setCusto(e.target.value)} style={inputStyle} />
<input placeholder="Estoque" value={estoque} onChange={(e)=>setEstoque(e.target.value)} style={inputStyle} />
<input placeholder="Cores (ex: Preto,Bege)" value={cores} onChange={(e)=>setCores(e.target.value)} style={inputStyle} />

<input type="file" onChange={selecionarFoto} style={{marginBottom:"10px"}} />

{preview && (
<img src={preview} style={{width:"120px", borderRadius:"8px", marginBottom:"10px"}} />
)}

<button onClick={salvarProduto} style={buttonStyle}>
{produtoEditando ? "Atualizar Produto" : "Salvar Produto"}
</button>

</div>

{/* LISTA */}
<h2 style={{color:"#6B3E2E", marginBottom:"15px"}}>
Produtos cadastrados
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
gap:"20px"
}}>

{produtos.map((p)=>{

const lucro = p.preco - p.custo

return(

<div key={p.id} style={{
background:"#fff",
borderRadius:"12px",
padding:"15px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<img
src={p.foto}
style={{
width:"100%",
height:"150px",
objectFit:"cover",
borderRadius:"8px",
marginBottom:"10px"
}}
/>

<h3 style={{color:"#6B3E2E"}}>{p.nome}</h3>

<p>Venda: R$ {p.preco}</p>
<p>Custo: R$ {p.custo}</p>

<p style={{color:"green", fontWeight:"bold"}}>
Lucro: R$ {lucro}
</p>

<p>Estoque: {p.estoque}</p>
<p>Cores: {p.cores}</p>

<div style={{display:"flex", gap:"5px", marginTop:"10px"}}>

<button onClick={()=>editarProduto(p)} style={{...buttonStyle, flex:1}}>
Editar
</button>

<button
onClick={()=>excluirProduto(p.id)}
style={{
flex:1,
background:"#b91c1c",
color:"#fff",
border:"none",
borderRadius:"8px"
}}
>
Excluir
</button>

</div>

</div>

)

})}

</div>

</div>

)
}