"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Produto = {
  id: number
  nome: string
  preco: number
  estoque: number
  cores?: string
  quantidade?: number
}

export default function Caixa() {

const [produtos,setProdutos] = useState<Produto[]>([])
const [carrinho,setCarrinho] = useState<Produto[]>([])
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
? {...p, quantidade:(p.quantidade || 1)+1}
: p
))
}else{
setCarrinho([...carrinho,{...produto, quantidade:1}])
}

}

function removerProduto(produto:Produto){
setCarrinho(carrinho.filter(p=>p.id !== produto.id))
}

function subtotal(){
return carrinho.reduce((acc,p)=> acc + p.preco * (p.quantidade || 1),0)
}

function total(){
return subtotal() + taxaEntrega - desconto
}

function cancelarVenda(){
setCarrinho([])
setCliente("")
setTelefone("")
setEndereco("")
setTaxaEntrega(0)
setDesconto(0)
}

function copiarPedido(){

let texto = `Pedido - Milani Bolsas

Cliente: ${cliente}
Telefone: ${telefone}
Endereço: ${endereco}

Itens:
`

carrinho.forEach(p=>{
texto += `• ${p.nome} x${p.quantidade} - R$ ${p.preco}\n`
})

texto += `
Subtotal: R$ ${subtotal().toFixed(2)}
Entrega: R$ ${taxaEntrega}
Desconto: R$ ${desconto}

Total: R$ ${total().toFixed(2)}
Pagamento: ${pagamento}
`

navigator.clipboard.writeText(texto)
alert("Pedido copiado!")

}

async function finalizarVenda(){

for(const item of carrinho){

await supabase.from("vendas").insert({
produto:item.nome,
preco:item.preco,
quantidade:item.quantidade,
cliente,
telefone,
endereco,
pagamento,
total: total()
})

await supabase
.from("produtos")
.update({
estoque:item.estoque - (item.quantidade || 1)
})
.eq("id",item.id)

}

alert("Venda salva com sucesso!")

cancelarVenda()

}

return(

<div style={{padding:20}}>

<h1>Caixa de vendas</h1>

<div style={{display:"flex", gap:"40px"}}>

{/* CLIENTE */}
<div style={{width:"30%"}}>

<h3>Cliente</h3>
<input value={cliente} onChange={e=>setCliente(e.target.value)} />

<h3>Telefone</h3>
<input value={telefone} onChange={e=>setTelefone(e.target.value)} />

<h3>Endereço</h3>
<input value={endereco} onChange={e=>setEndereco(e.target.value)} />

<h3>Pagamento</h3>
<select onChange={e=>setPagamento(e.target.value)}>
<option>Pix</option>
<option>Dinheiro</option>
<option>Cartão</option>
</select>

<h3>Taxa de entrega</h3>
<input type="number" value={taxaEntrega} onChange={e=>setTaxaEntrega(Number(e.target.value))} />

<h3>Desconto</h3>
<input type="number" value={desconto} onChange={e=>setDesconto(Number(e.target.value))} />

</div>

{/* PRODUTOS */}
<div style={{width:"70%"}}>

<h3>Buscar produto</h3>
<input placeholder="B01" onChange={e=>setBusca(e.target.value)} />

<h3>Produtos</h3>

{produtos
.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()))
.map(p=>(
<div key={p.id}>
{p.nome} - R$ {p.preco}
<button onClick={()=>adicionarProduto(p)}>Adicionar</button>
</div>
))}

<h3>Carrinho</h3>

{carrinho.map(p=>(
<div key={p.id}>
{p.nome} x{p.quantidade} - R$ {p.preco}
<button onClick={()=>removerProduto(p)}>X</button>
</div>
))}

<h3>Subtotal: R$ {subtotal().toFixed(2)}</h3>
<p>Entrega: R$ {taxaEntrega}</p>
<p>Desconto: R$ {desconto}</p>

<h2>Total: R$ {total().toFixed(2)}</h2>

<button onClick={finalizarVenda}>
Finalizar venda
</button>

<button onClick={copiarPedido}>
Copiar pedido
</button>

<button onClick={cancelarVenda}>
Cancelar venda
</button>

</div>

</div>

</div>

)

}