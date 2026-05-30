"use client"

import { usePathname } from "next/navigation"

export default function Sidebar() {

  const pathname = usePathname()

  return (

    <div style={{
      width: "280px",
      background: "linear-gradient(180deg,#0f172a,#111827)",
      color: "#fff",
      padding: "25px",
      minHeight: "100vh",
      borderRight: "3px solid #fbbf24"
    }}>

      <h2 style={{
        color: "#fbbf24",
        marginBottom: "40px",
        fontSize: "24px",
        lineHeight: "32px",
        fontWeight: "700",
        letterSpacing: "0.5px"
      }}>
        🚘 PLANETA DOS
        <br />
        RETROVISORES
      </h2>

      <a
        href="/dashboard"
        style={{
          ...menu,
          background:
            pathname === "/dashboard"
              ? "#fbbf24"
              : "#1e293b",
          color:
            pathname === "/dashboard"
              ? "#111827"
              : "#fff"
        }}
      >
        📊 Dashboard
      </a>

      <a
        href="/caixa"
        style={{
          ...menu,
          background:
            pathname === "/caixa"
              ? "#fbbf24"
              : "#1e293b",
          color:
            pathname === "/caixa"
              ? "#111827"
              : "#fff"
        }}
      >
        💰 Caixa Diário
      </a>

      <a
        href="/relatorio"
        style={{
          ...menu,
          background:
            pathname === "/relatorio"
              ? "#fbbf24"
              : "#1e293b",
          color:
            pathname === "/relatorio"
              ? "#111827"
              : "#fff"
        }}
      >
        📋 Relatórios
      </a>

      <a
        href="/fechamento"
        style={{
          ...menu,
          background:
            pathname === "/fechamento"
              ? "#fbbf24"
              : "#1e293b",
          color:
            pathname === "/fechamento"
              ? "#111827"
              : "#fff"
        }}
      >
        🤝 Fechamento
      </a>

    </div>

  )

}

const menu = {
  display: "block",
  
  textDecoration: "none",
  marginBottom: "12px",
  padding: "14px 16px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  fontFamily: "Arial, sans-serif",
  transition: "all 0.2s ease"
}