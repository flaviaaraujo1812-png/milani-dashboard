"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Sidebar from "../components/sidebar"

export default function Dashboard() {

const [dados, setDados] = useState<any[]>([])

useEffect(() => {
carregar()
}, [])

async function carregar() {

const { data } = await supabase
  .from("financeiro")
  .select("*")
  .order("id", { ascending: false })

setDados(data || [])

}

function moeda(valor: number) {
return valor.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
})
}

const entradas = dados.reduce(
(t, i) => t + Number(i.entrada || 0),
0
)

const saidas = dados.reduce(
(t, i) => t + Number(i.saida || 0),
0
)

const lucro = entradas - saidas

const retiradas = dados
.filter(i => i.tipo === "RETIRADA")
.reduce((t, i) => t + Number(i.saida || 0), 0)

const despesasFixas = dados
.filter(i => i.tipo === "DESPESA FIXA")
.reduce((t, i) => t + Number(i.saida || 0), 0)

const dividas = dados
.filter(i => i.tipo === "DIVIDA")
.reduce((t, i) => t + Number(i.saida || 0), 0)

const totalLancamentos = dados.length

const categorias = [...new Set(
dados.map(i => i.categoria).filter(Boolean)
)]

return (

<div
  style={{
    display: "flex",
    background: "#f5f5f5",
    minHeight: "100vh"
  }}
>

  <Sidebar />

  <div
    style={{
      flex: 1,
      padding: "25px"
    }}
  >

    <h1
      style={{
        fontSize: "32px",
        color: "#111827",
        marginBottom: "6px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <span style={{
        fontSize: "24px"
      }}>
        📊
      </span>

      Dashboard
    </h1>

    <p
      style={{
        color: "#6b7280",
        marginBottom: "25px"
      }}
    >
      Visão geral do desempenho financeiro da empresa
    </p>
    <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: "16px",
            marginBottom: "20px"
          }}
        >      <Card
        titulo="Entradas"
        valor={moeda(entradas)}
        cor="#16a34a"
      />

      <Card
        titulo="Saídas"
        valor={moeda(saidas)}
        cor="#dc2626"
      />

      <Card
        titulo="Lucro Líquido"
        valor={moeda(lucro)}
        cor="#111827"
      />

      <Card
        titulo="Retiradas"
        valor={moeda(retiradas)}
        cor="#d97706"
      />

      <Card
        titulo="Despesas Fixas"
        valor={moeda(despesasFixas)}
        cor="#2563eb"
      />

      <Card
        titulo="Dívidas"
        valor={moeda(dividas)}
        cor="#9333ea"
      />

    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "20px"
      }}
    >

      <div style={box}>

        <h2 style={tituloBox}>
          📈 Indicadores Gerais
        </h2>

        <p>Total de Lançamentos: {totalLancamentos}</p>

        <p>Total de Entradas: {moeda(entradas)}</p>

        <p>Total de Saídas: {moeda(saidas)}</p>

        <p>
          Saldo Atual:
          {" "}
          <strong>
            {moeda(lucro)}
          </strong>
        </p>

      </div>

      <div style={box}>

        <h2 style={tituloBox}>
          💰 Resumo Financeiro
        </h2>

        <p>Retiradas: {moeda(retiradas)}</p>

        <p>Despesas Fixas: {moeda(despesasFixas)}</p>

        <p>Dívidas: {moeda(dividas)}</p>

        <p>
          Resultado:
          {" "}
          <strong>
            {moeda(lucro)}
          </strong>
        </p>

      </div>

    </div>

    <div style={box}>

      <h2 style={tituloBox}>
        📄 Resumo por Categoria
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>

            <th style={th}>
              Categoria
            </th>

            <th style={th}>
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          {categorias.map((categoria) => {

            const total = dados
              .filter(
                i => i.categoria === categoria
              )
              .reduce(
                (t, i) =>
                  t +
                  Number(i.entrada || 0) +
                  Number(i.saida || 0),
                0
              )

            return (

              <tr key={categoria}>

                <td style={td}>
                  {categoria}
                </td>

                <td
                  style={{
                    ...td,
                    fontWeight: "bold"
                  }}
                >
                  {moeda(total)}
                </td>

              </tr>

            )

          })}

        </tbody>

      </table>

    </div>

  </div>

</div>

)

}
function Card({
titulo,
valor,
cor
}: {
titulo: string
valor: string
cor: string
}) {

return (

<div
  style={{
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.04)"
  }}
>

  <p
    style={{
      color: "#6b7280",
      marginBottom: "6px",
      fontSize: "13px"
    }}
  >
    {titulo}
  </p>

  <h2
    style={{
      color: cor,
      fontSize: "18px",
      fontWeight: "bold"
    }}
  >
    {valor}
  </h2>

</div>

)

}

const box = {
background: "#fff",
padding: "20px",
borderRadius: "16px",
border: "1px solid #e5e7eb",
boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
}

const tituloBox = {
marginBottom: "15px",
color: "#111827",
fontSize: "18px",
fontWeight: "bold"
}

const th = {
padding: "10px",
textAlign: "left" as const,
borderBottom: "2px solid #e5e7eb",
fontSize: "14px"
}

const td = {
padding: "10px",
borderBottom: "1px solid #e5e7eb",
fontSize: "14px"
}