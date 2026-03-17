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

export default function Caixa() {

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

// GERAR ID DO PEDIDO
function gerarPedidoId(){
return "PED-" + Date.now()
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

// COPIAR PEDIDO
function copiarPedido(){

let texto = `Pedido - Milani Bolsas

Cliente: ${cliente}
Telefone: ${telefone}
Endereço: ${endereco}

Itens:
`

carrinho.forEach(p=>{
texto += `• ${p.nome} (${p.corSelecionada || "sem cor"}) x${p.quantidade} - R$ ${p.preco}\n`
})

texto += `
Subtotal: R$ ${subtotal().toFixed(2)}
Entrega: R$ ${taxaEntrega}
Desconto: ${desconto}% (R$ ${valorDesconto().toFixed(2)})

Total: R$ ${total().toFixed(2)}
Pagamento: ${pagamento}
`

navigator.clipboard.writeText(texto)
alert("Pedido copiado!")
}

// SALVAR VENDA AGRUPADA
async function finalizarVenda(){

const pedidoId = gerarPedidoId()

await supabase.from("caixa").insert({
pedido_id: pedidoId,
cliente,
pagamento,
valor: total(),
itens: carrinho
})

for(const item of carrinho){

await supabase
.from("produtos")
.update({
estoque:item.estoque - item.quantidade
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

<h3>Desconto (%)</h3>
<input type="number" value={desconto} onChange={e=>setDesconto(Number(e.target.value))} />

</div>

{/* PRODUTOS */}
<div style={{width:"70%"}}>

<h3>Buscar produto</h3>
<input onChange={e=>setBusca(e.target.value)} />

<h3>Produtos</h3>

{produtos
.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()))
.map(p=>{

const cores = p.cores ? p.cores.split(",") : []

return(
<div key={p.id}>

{p.nome} - R$ {p.preco}

<button onClick={()=>adicionarProduto(p)}>
Adicionar
</button>

{cores.length > 0 && (
<select onChange={(e)=>alterarCor(p.id,e.target.value)}>
<option>Cor</option>
{cores.map((c,i)=>(
<option key={i}>{c}</option>
))}
</select>
)}

</div>
)
})}

<h3>Carrinho</h3>

{carrinho.map(p=>(
<div key={p.id}>
{p.nome} ({p.corSelecionada || "sem cor"}) x{p.quantidade}
<button onClick={()=>removerProduto(p)}>X</button>
</div>
))}

<h3>Subtotal: R$ {subtotal().toFixed(2)}</h3>
<p>Entrega: R$ {taxaEntrega}</p>
<p>Desconto: {desconto}% (R$ {valorDesconto().toFixed(2)})</p>

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