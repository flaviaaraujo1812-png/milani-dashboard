"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://kkbobdoymvhebusrjcou.supabase.co",
  "sb_publishable_nKo1OA9sJgSWY5qbxlUX9A_3eHpstql"
)

export default function Home() {

const [produtos,setProdutos] = useState<any[]>([])
const [nome,setNome] = useState("")
const [preco,setPreco] = useState("")
const [custo,setCusto] = useState("")
const [estoque,setEstoque] = useState("")
const [foto,setFoto] = useState("")
const [produtoEditando,setProdutoEditando] = useState<any>(null)

const [cliente,setCliente] = useState("")
const [endereco,setEndereco] = useState("")
const [taxaEntrega,setTaxaEntrega] = useState(0)

const [carrinho,setCarrinho] = useState<any[]>([])

useEffect(()=>{
carregarProdutos()
},[])

async function carregarProdutos(){
const {data} = await supabase
.from("produtos")
.select("*")
.order("id",{ascending:false})

setProdutos(data || [])
}

async function salvarProduto(){

if(produtoEditando){

await supabase
.from("produtos")
.update({
nome,
preco,
custo,
estoque,
foto
})
.eq("id",produtoEditando.id)

}else{

await supabase.from("produtos").insert({
nome,
preco,
custo,
estoque,
foto
})

}

setNome("")
setPreco("")
setCusto("")
setEstoque("")
setFoto("")
setProdutoEditando(null)

carregarProdutos()
}

function editarProduto(p:any){

setProdutoEditando(p)

setNome(p.nome)
setPreco(p.preco)
setCusto(p.custo)
setEstoque(p.estoque)
setFoto(p.foto)

}

async function excluirProduto(id:number){

await supabase
.from("produtos")
.delete()
.eq("id",id)

carregarProdutos()

}

function adicionarCarrinho(p:any){

setCarrinho([...carrinho,{...p,quantidade:1}])

}

const subtotal = carrinho.reduce((acc,item)=>acc + item.preco,0)

const total = subtotal + Number(taxaEntrega)

async function finalizarVenda(){

for(const item of carrinho){

await supabase.from("vendas").insert({
produto:item.nome,
quantidade:item.quantidade,
valor:item.preco,
custo:item.custo,
lucro:item.preco - item.custo,
cliente,
endereco,
entrega:taxaEntrega
})

await supabase
.from("produtos")
.update({
estoque:item.estoque - 1
})
.eq("id",item.id)

}

setCarrinho([])
setCliente("")
setEndereco("")
setTaxaEntrega(0)

carregarProdutos()

alert("Venda finalizada")

}

return(

<div style={{display:"flex",fontFamily:"Arial"}}>

<div style={{
width:200,
background:"#111827",
color:"white",
padding:20,
height:"100vh"
}}>

<h3>Milani</h3>

<p>Produtos</p>
<p>Caixa</p>

</div>

<div style={{padding:20,width:"100%"}}>

<h2>Painel Milani Bolsas e Acessórios</h2>

<h3>Cadastrar Produto</h3>

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
placeholder="URL da foto"
value={foto}
onChange={(e)=>setFoto(e.target.value)}
/>

<br/><br/>

<button onClick={salvarProduto}
style={{
background:"#ec4899",
color:"white",
padding:10,
border:"none"
}}
>

Salvar Produto

</button>

<hr/>

<h3>Produtos</h3>

<div style={{display:"flex",gap:20,flexWrap:"wrap"}}>

{produtos.map((p)=>{

const lucro = p.preco - p.custo

return(

<div key={p.id} style={{
border:"1px solid #ddd",
padding:10,
width:200
}}>

<img src={p.foto} width="100%" />

<h4>{p.nome}</h4>

<p>Venda: R$ {p.preco}</p>

<p>Custo: R$ {p.custo}</p>

<p style={{color:"green"}}>Lucro: R$ {lucro}</p>

<p>Estoque: {p.estoque}</p>

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

<br/><br/>

<button
onClick={()=>adicionarCarrinho(p)}
style={{
background:"green",
color:"white",
padding:5
}}
>

Vender

</button>

</div>

)

})}

</div>

<hr/>

<h2>Caixa</h2>

<h3>Carrinho</h3>

{carrinho.map((item,i)=>(

<div key={i}>

{item.nome} - R$ {item.preco}

</div>

))}

<p>Subtotal: R$ {subtotal}</p>

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

<input
placeholder="Taxa entrega"
value={taxaEntrega}
onChange={(e)=>setTaxaEntrega(Number(e.target.value))}
/>

<h3>Total: R$ {total}</h3>

<button
onClick={finalizarVenda}
style={{
background:"#ec4899",
color:"white",
padding:10,
border:"none"
}}
>

Finalizar venda

</button>

</div>

</div>

)

}