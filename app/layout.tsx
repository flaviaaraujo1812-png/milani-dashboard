"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function RootLayout({
children,
}:{
children: React.ReactNode
}) {

const pathname = usePathname()

function active(path:string){
return pathname === path
}

return (

<html lang="pt-br">
<body style={{
margin:0,
fontFamily:"Arial",
background:"#F5E6DC"
}}>

<div style={{display:"flex",height:"100vh"}}>

{/* MENU */}
<div style={{
width:170,
background:"#6B3E2E",
color:"#fff",
padding:"15px 10px",
display:"flex",
flexDirection:"column",
justifyContent:"space-between"
}}>

<div>

<h2 style={{
color:"#C9A227",
marginBottom:20,
fontSize:"18px"
}}>
Milani
</h2>

<div style={{display:"flex",flexDirection:"column",gap:6}}>

<Link href="/" style={menuItem(active("/"))}>
<span style={indicator(active("/"))}></span>
💰 Caixa
</Link>

<Link href="/produtos" style={menuItem(active("/produtos"))}>
<span style={indicator(active("/produtos"))}></span>
📦 Produtos
</Link>

<Link href="/relatorio" style={menuItem(active("/relatorio"))}>
<span style={indicator(active("/relatorio"))}></span>
📑 Relatório
</Link>

<Link href="/dashboard" style={menuItem(active("/dashboard"))}>
<span style={indicator(active("/dashboard"))}></span>
📊 Dashboard
</Link>

</div>

</div>

<div style={{
fontSize:11,
opacity:0.6
}}>
Sistema Milani ©
</div>

</div>

{/* CONTEÚDO */}
<div style={{
flex:1,
padding:"15px",
overflowY:"auto"
}}>

<div style={{
background:"#fff",
borderRadius:"12px",
padding:"25px",
minHeight:"100%",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)",
color:"#3E2C2C"
}}>

{children}

</div>

</div>

</div>

</body>
</html>

)
}

/* ITEM MENU */
function menuItem(active:boolean){
return {
display:"flex",
alignItems:"center",
gap:"8px",
color: active ? "#C9A227" : "#fff",
textDecoration:"none",
padding:"8px 10px",
borderRadius:"6px",
fontSize:"14px",
fontWeight:"500",
background: active ? "rgba(255,255,255,0.05)" : "transparent"
}
}

/* INDICADOR */
function indicator(active:boolean){
return {
width:"6px",
height:"6px",
borderRadius:"50%",
background: active ? "#C9A227" : "transparent"
}
}