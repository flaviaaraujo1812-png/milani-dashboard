"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id: number
  nome: string
  preco: number
  estoque: number
  quantidade?: number
}

export default function Caixa() {

const [produtos,setProdutos] = useState<Produto[]>([])
const [carrinho,setCarrinho] = useState<Produto[]>([])

const [cliente,setCliente] = useState("")
const [endereco,setEndereco] = useState("")
const [taxaEntrega,setTaxaEntrega] = useState(0)
const [desconto,setDesconto] = useState(0)

useEffect(()=>{
buscarProdutos()
},[])

async function buscarProdutos(){

const {data} = await supabase
.from("produtos")
.select("*")

setProdutos(data || [])

}

function adicionarProduto(produto:Produto){

const existente = carrinho.find(p => p.id === produto.id)

if(existente){

setCarrinho(
carrinho.map(p =>
p.id === produto.id
? {...p, quantidade:(p.quantidade || 1) + 1}
: p
)
)

}else{

setCarrinho([...carrinho,{...produto,quantidade:1}])

}

}

function diminuirProduto(produto:Produto){

const existente = carrinho.find(p => p.id === produto.id)

if(!existente) return

if((existente.quantidade || 1) === 1){

setCarrinho(carrinho.filter(p => p.id !== produto.id))

}else{

setCarrinho(
carrinho.map(p =>
p.id === produto.id
? {...p, quantidade:(p.quantidade || 1) - 1}
: p
)
)

}

}

function subtotal(){

return carrinho.reduce((acc,p)=> acc + p.preco * (p.quantidade || 1),0)

}

function total(){

const sub = subtotal()

const valorDesconto = sub * (desconto/100)

return sub - valorDesconto + Number(taxaEntrega)

}

async function finalizarVenda(){

for(const item of carrinho){

await supabase.from("vendas").insert({
produto:item.nome,
preco:item.preco,
quantidade:item.quantidade,
cliente,
endereco
})

await supabase
.from("produtos")
.update({
estoque:item.estoque - (item.quantidade || 1)
})
.eq("id",item.id)

}

alert("Venda realizada!")

setCarrinho([])

}

return(

<div>

<h1>Caixa de vendas</h1>

<h3>Cliente</h3>
<input value={cliente} onChange={e=>setCliente(e.target.value)} />

<h3>Endereço</h3>
<input value={endereco} onChange={e=>setEndereco(e.target.value)} />

<h3>Taxa de entrega</h3>
<input type="number" onChange={e=>setTaxaEntrega(Number(e.target.value))} />

<h3>Desconto %</h3>
<input type="number" onChange={e=>setDesconto(Number(e.target.value))} />

<h2>Produtos</h2>

{produtos.map(p=>(
<div key={p.id}>

<p>{p.nome} - R$ {p.preco}</p>

<button onClick={()=>adicionarProduto(p)}>
Adicionar
</button>

</div>
))}

<h2>Carrinho</h2>

{carrinho.map(p=>(
<div key={p.id}>

<p>{p.nome}</p>

<button onClick={()=>diminuirProduto(p)}>➖</button>

{p.quantidade}

<button onClick={()=>adicionarProduto(p)}>➕</button>

</div>
))}

<h3>Subtotal: {subtotal()}</h3>

<h3>Total: {total()}</h3>

<button onClick={finalizarVenda}>
Finalizar venda
</button>

</div>

)

}