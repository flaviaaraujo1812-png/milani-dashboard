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

{/* MENU */}
<div style={{
width:230,
background:"#6B3E2E",
color:"#fff",
padding:"20px 15px",
display:"flex",
flexDirection:"column",
justifyContent:"space-between"
}}>

<div>
<h2 style={{
color:"#C9A227",
marginBottom:30
}}>
Milani
</h2>

<div style={{display:"flex",flexDirection:"column",gap:12}}>

<Link href="/" style={menuItem}>💰 Caixa</Link>
<Link href="/produtos" style={menuItem}>📦 Produtos</Link>
<Link href="/relatorio" style={menuItem}>📑 Relatório</Link>
<Link href="/dashboard" style={menuItem}>📊 Dashboard</Link>

</div>
</div>

<div style={{
fontSize:12,
opacity:0.7
}}>
Sistema Milani ©
</div>

</div>

{/* CONTEÚDO */}
<div style={{
flex:1,
background:"#F5E6DC",
padding:"25px",
overflowY:"auto"
}}>

{/* CAIXA DE CONTEÚDO */}
<div style={{
background:"#fff",
borderRadius:12,
padding:20,
minHeight:"100%",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
}}>

{children}

</div>

</div>

</div>

</body>
</html>

)
}

const menuItem = {
color:"#fff",
textDecoration:"none",
padding:"10px",
borderRadius:"8px",
transition:"0.3s",
background:"transparent"
}