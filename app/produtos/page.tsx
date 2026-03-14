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

const url = URL.createObjectURL(file)

setPreview(url)

}

}

async function uploadImagem(){

if(!foto) return ""

const nomeArquivo = Date.now() + "_" + foto.name

const { data, error } = await supabase.storage
.from("produtos")
.upload(nomeArquivo, foto)

if(error){
console.log("Erro upload:", error)
return ""
}

const { data: url } = supabase.storage
.from("produtos")
.getPublicUrl(nomeArquivo)

return url.publicUrl

}

async function salvarProduto(){

let urlFoto = produtoEditando?.foto || ""

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

await supabase
.from("produtos")
.update(dados)
.eq("id",produtoEditando.id)

}else{

await supabase
.from("produtos")
.insert(dados)

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
setPreview(p.foto)

}

async function excluirProduto(id:number){

await supabase
.from("produtos")
.delete()
.eq("id",id)

carregarProdutos()

}

return(

<div style={{padding:20,width:"100%"}}>

<h2>Cadastrar Produto</h2>

<input
placeholder="Nome"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<br/><br/>

<input
placeholder="Preço"
value={preco}
onChange={(e)=>setPreco(e.target.value)}
/>

<br/><br/>

<input
placeholder="Custo"
value={custo}
onChange={(e)=>setCusto(e.target.value)}
/>

<br/><br/>

<input
placeholder="Estoque"
value={estoque}
onChange={(e)=>setEstoque(e.target.value)}
/>

<br/><br/>

<input
placeholder="Cores (ex: Preto,Marrom,Bege)"
value={cores}
onChange={(e)=>setCores(e.target.value)}
/>

<br/><br/>

<input
type="file"
onChange={selecionarFoto}
/>

<br/><br/>

{preview && (

<img
src={preview}
width="120"
style={{borderRadius:8}}
/>

)}

<br/><br/>

<button
onClick={salvarProduto}
style={{
background:"#ec4899",
color:"white",
padding:"10px 20px",
border:"none",
borderRadius:6,
cursor:"pointer"
}}
>

Salvar Produto

</button>

<hr/>

<h2>Produtos cadastrados</h2>

<div style={{display:"flex",gap:20,flexWrap:"wrap"}}>

{produtos.map((p)=>{

const lucro = p.preco - p.custo

return(

<div key={p.id} style={{
border:"1px solid #ddd",
padding:15,
width:220,
borderRadius:8
}}>

<img src={p.foto} width="100%" />

<h3>{p.nome}</h3>

<p>Venda: R$ {p.preco}</p>

<p>Custo: R$ {p.custo}</p>

<p style={{color:"green"}}>Lucro: R$ {lucro}</p>

<p>Estoque: {p.estoque}</p>

<p>Cores: {p.cores}</p>

<br/>

<button
onClick={()=>editarProduto(p)}
style={{marginRight:5}}
>

Editar

</button>

<button
onClick={()=>excluirProduto(p.id)}
>

Excluir

</button>

</div>

)

})}

</div>

</div>

)

}