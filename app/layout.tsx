"use client"

import Link from "next/link"

export default function RootLayout({
children,
}:{
children: React.ReactNode
}) {

return (

<html lang="pt-br">
<body style={{
margin:0,
fontFamily:"Arial",
background:"#F5E6DC"
}}>

<div style={{display:"flex",height:"100vh"}}>

{/* MENU LATERAL */}
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

<div style={{display:"flex",flexDirection:"column",gap:10}}>

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

{/* CONTEÚDO PRINCIPAL */}
<div style={{
flex:1,
padding:"15px",
overflowY:"auto"
}}>

{/* CAIXA BRANCA PRINCIPAL */}
<div style={{
background:"#fff",
borderRadius:"12px",
padding:"25px",
minHeight:"100%",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)",
color:"#3E2C2C",
width:"100%"
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
padding:"10px 12px",
borderRadius:"8px",
background:"transparent",
fontWeight:"500"
}