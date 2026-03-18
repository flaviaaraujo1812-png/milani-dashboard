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

<div>

<h1 style={{
color:"#6B3E2E",
marginBottom:"20px"
}}>
Relatório de vendas
</h1>

{/* RESUMO */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
gap:"20px",
marginBottom:"30px"
}}>

<div style={cardStyle}>
<h3 style={titulo}>Total vendido</h3>
<p style={valor}>R$ {total.toFixed(2)}</p>
</div>

<div style={cardStyle}>
<h3 style={titulo}>Lucro</h3>
<p style={valor}>R$ {lucro.toFixed(2)}</p>
</div>

</div>

{/* LISTA */}
<div style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<h2 style={{marginBottom:"15px"}}>Vendas</h2>

<div style={{
maxHeight:"400px",
overflowY:"auto"
}}>

{vendas.map((v:any)=>(

<div key={v.id}
style={{
borderBottom:"1px solid #eee",
padding:"10px 0",
display:"flex",
justifyContent:"space-between",
flexWrap:"wrap"
}}
>

<div style={{flex:"1"}}>

<p><b>{v.cliente || "Cliente não informado"}</b></p>
<p>Pagamento: {v.pagamento}</p>
<p>Data: {v.data || "-"}</p>

</div>

<div style={{textAlign:"right"}}>

<p>Venda: R$ {Number(v.valor).toFixed(2)}</p>
<p>Custo: R$ {Number(v.custo || 0).toFixed(2)}</p>
<p style={{color:"green", fontWeight:"bold"}}>
Lucro: R$ {Number(v.lucro || 0).toFixed(2)}
</p>

</div>

</div>

))}

</div>

</div>

</div>

)
}

/* ESTILOS */

const cardStyle = {
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}

const titulo = {
color:"#6B3E2E",
marginBottom:"10px"
}

const valor = {
color:"#C9A227",
fontSize:"22px",
fontWeight:"bold"
}