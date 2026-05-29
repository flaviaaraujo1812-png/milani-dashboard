export default function Sidebar() {

  return (

    <div style={{
      width: "240px",
      background: "#111827",
      color: "#fff",
      padding: "25px",
      minHeight: "100vh"
    }}>

      <h2 style={{
        color: "#FFD700",
        marginBottom: "35px",
        fontSize: "32px"
      }}>
        PLANETA
      </h2>

      <a href="/dashboard" style={menu}>
        Dashboard
      </a>

      <a href="/caixa" style={menu}>
        Caixa Diário
      </a>

      <a href="/relatorio" style={menu}>
        Relatórios
      </a>

    </div>

  )

}

const menu = {
  display: "block",
  color: "#fff",
  textDecoration: "none",
  marginBottom: "18px",
  fontSize: "18px"
}