"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Relatorio(){

const [vendas,setVendas] = useState<any[]>([])
const [total,setTotal] = useState(0)
const [lucro,setLucro] = useState(0)

useEffect(()=>{
carregarRelatorio()
},[])

async function carregarRelatorio(){

const { data, error } = await supabase
.from("caixa")
.select("*")
.order("id",{ascending:false})

if(error){
console.log(error)
}

if(data){

setVendas(data)

let totalVenda = 0
let totalLucro = 0

data.forEach((v:any)=>{
totalVenda += Number(v.valor || 0)
totalLucro += Number(v.lucro || 0)
})

setTotal(totalVenda)
setLucro(totalLucro)

}

}

return(

<div style={{padding:30,maxWidth:900,margin:"auto"}}>

<h1>Relatório de vendas</h1>

<div style={{display:"flex",gap:20,marginBottom:30}}>

<div style={{background:"#f1f1f1",padding:20,borderRadius:8}}>
<h3>Total vendido</h3>
<p>R$ {total.toFixed(2)}</p>
</div>

<div style={{background:"#f1f1f1",padding:20,borderRadius:8}}>
<h3>Lucro</h3>
<p>R$ {lucro.toFixed(2)}</p>
</div>

</div>

<h2>Vendas</h2>

{vendas.map((v:any)=>(

<div key={v.id}
style={{
border:"1px solid #eee",
padding:15,
marginBottom:15,
borderRadius:8
}}
>

<b>{v.produto}</b>

<p>Cliente: {v.cliente}</p>

<p>Pagamento: {v.pagamento}</p>

<p>Venda: R$ {Number(v.valor).toFixed(2)}</p>

<p>Custo: R$ {Number(v.custo).toFixed(2)}</p>

<p>Lucro: R$ {Number(v.lucro).toFixed(2)}</p>

<p>Data: {v.data}</p>

</div>

))}

</div>

)

}