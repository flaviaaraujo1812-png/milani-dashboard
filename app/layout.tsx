import "./globals.css"

export const metadata = {
title: "Planeta dos Retrovisores",
description: "Sistema Financeiro",
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<html lang="pt-br">
<body
style={{
margin: 0,
background: "#f5f5f5",
fontFamily: "Arial",
}}
>
{children}
</body>
</html>
)
}