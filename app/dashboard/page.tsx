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

<h1>Dashboard</h1>

<div style={{display:"flex",gap:20,marginTop:20}}>

<div style={{background:"#fff",padding:20,borderRadius:10,width:200}}>
<h3>Total vendido</h3>
<p>R$ {total.toFixed(2)}</p>
</div>

<div style={{background:"#fff",padding:20,borderRadius:10,width:200}}>
<h3>Lucro</h3>
<p>R$ {lucro.toFixed(2)}</p>
</div>

<div style={{background:"#fff",padding:20,borderRadius:10,width:200}}>
<h3>Vendas</h3>
<p>{vendas.length}</p>
</div>

</div>

</div>

)

}