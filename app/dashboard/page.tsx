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

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

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
          padding: "35px"
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            color: "#1e1b4b",
            marginBottom: "30px"
          }}
        >
          📊 Dashboard Financeiro
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "25px"
          }}
        >

          <Card
            titulo="💰 Entradas"
            valor={moeda(entradas)}
            cor="#16a34a"
          />

          <Card
            titulo="💸 Saídas"
            valor={moeda(saidas)}
            cor="#dc2626"
          />

          <Card
            titulo="📈 Lucro Líquido"
            valor={moeda(lucro)}
            cor="#111827"
          />

          <Card
            titulo="🏦 Retiradas"
            valor={moeda(retiradas)}
            cor="#d97706"
          />

          <Card
            titulo="🏠 Despesas Fixas"
            valor={moeda(despesasFixas)}
            cor="#2563eb"
          />

          <Card
            titulo="📄 Dívidas"
            valor={moeda(dividas)}
            cor="#9333ea"
          />

        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
          }}
        >

          <h2
            style={{
              marginBottom: "20px",
              color: "#1e1b4b"
            }}
          >
            Últimas Movimentações
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#f3f4f6"
                }}
              >

                <th style={th}>Tipo</th>
                <th style={th}>Categoria</th>
                <th style={th}>Descrição</th>
                <th style={th}>Valor</th>

              </tr>

            </thead>

            <tbody>

              {dados.slice(0, 10).map((item) => (

                <tr key={item.id}>

                  <td style={td}>{item.tipo}</td>

                  <td style={td}>{item.categoria}</td>

                  <td style={td}>{item.descricao}</td>

                  <td
                    style={{
                      ...td,
                      color:
                        Number(item.entrada) > 0
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: "bold"
                    }}
                  >

                    {Number(item.entrada) > 0
                      ? moeda(Number(item.entrada))
                      : moeda(Number(item.saida))
                    }

                  </td>

                </tr>

              ))}

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
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}
    >

      <p
        style={{
          color: "#6b7280",
          marginBottom: "12px"
        }}
      >
        {titulo}
      </p>

      <h2
        style={{
          color: cor,
          fontSize: "32px"
        }}
      >
        {valor}
      </h2>

    </div>

  )

}

const th = {
  padding: "14px",
  textAlign: "left" as const
}

const td = {
  padding: "12px",
  borderTop: "1px solid #e5e7eb"
}