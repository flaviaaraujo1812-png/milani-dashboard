"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Dashboard(){

const [vendas,setVendas] = useState<any[]>([])

useEffect(()=>{
carregar()
},[])

async function carregar(){

const { data } = await supabase
.from("caixa")
.select("*")

if(data){
setVendas(data)
}

}

const total = vendas.reduce((t,v)=> t + Number(v.valor || 0),0)
const lucro = vendas.reduce((t,v)=> t + Number(v.lucro || 0),0)

return(

<div>

<h1 style={{
color:"#6B3E2E",
marginBottom:"20px"
}}>
Dashboard
</h1>

{/* CARDS */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
gap:"20px"
}}>

{/* TOTAL */}
<div style={cardStyle}>
<h3 style={tituloCard}>Total vendido</h3>
<p style={valorCard}>R$ {total.toFixed(2)}</p>
</div>

{/* LUCRO */}
<div style={cardStyle}>
<h3 style={tituloCard}>Lucro</h3>
<p style={valorCard}>R$ {lucro.toFixed(2)}</p>
</div>

{/* VENDAS */}
<div style={cardStyle}>
<h3 style={tituloCard}>Vendas</h3>
<p style={valorCard}>{vendas.length}</p>
</div>

</div>

{/* LISTA DE VENDAS */}
<div style={{
marginTop:"30px",
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<h3 style={{marginBottom:"15px"}}>Últimas vendas</h3>

<div style={{
maxHeight:"300px",
overflowY:"auto"
}}>

{vendas.map((v,i)=>(
<div key={i} style={{
display:"flex",
justifyContent:"space-between",
borderBottom:"1px solid #eee",
padding:"8px 0"
}}>

<span>{v.cliente || "Cliente não informado"}</span>
<span>R$ {Number(v.valor).toFixed(2)}</span>

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

const tituloCard = {
color:"#6B3E2E",
marginBottom:"10px"
}

const valorCard = {
color:"#C9A227",
fontSize:"22px",
fontWeight:"bold"
}