export default function Sidebar() {

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
        fontWeight: "bold"
      }}>
        🚘 PLANETA DOS
        <br />
        RETROVISORES
      </h2>

      <a href="/dashboard" style={menu}>
        📊 Dashboard
      </a>

      <a href="/caixa" style={menu}>
        💰 Caixa Diário
      </a>

      <a href="/relatorio" style={menu}>
        📋 Relatórios
      </a>

      <a href="/fechamento" style={menu}>
        🤝 Fechamento
      </a>

    </div>

  )

}

const menu = {
  display: "block",
  background: "#1e293b",
  color: "#fff",
  textDecoration: "none",
  marginBottom: "12px",
  padding: "14px",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "bold",
  transition: "0.2s"
}