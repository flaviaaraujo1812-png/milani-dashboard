"use client"

import Link from "next/link"

export default function RootLayout({
children,
}:{
children: React.ReactNode
}) {

return (

<html lang="pt-br">

<body style={{margin:0,fontFamily:"Arial"}}>

<div style={{display:"flex",height:"100vh"}}>

{/* MENU LATERAL */}

<div style={{
width:220,
background:"#1f2937",
color:"#fff",
padding:20
}}>

<h2 style={{marginBottom:30}}>Milani</h2>

<div style={{display:"flex",flexDirection:"column",gap:15}}>

<Link href="/dashboard" style={{color:"#fff",textDecoration:"none"}}>
📊 Dashboard
</Link>

<Link href="/produtos" style={{color:"#fff",textDecoration:"none"}}>
📦 Produtos
</Link>

<Link href="/caixa" style={{color:"#fff",textDecoration:"none"}}>
💰 Caixa
</Link>

<Link href="/relatorio" style={{color:"#fff",textDecoration:"none"}}>
📑 Relatório
</Link>

</div>

</div>

{/* CONTEÚDO */}

<div style={{
flex:1,
background:"#f4f6f9",
padding:30
}}>

{children}

</div>

</div>

</body>

</html>

)

}