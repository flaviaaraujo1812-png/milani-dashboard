"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "../components/sidebar"

export default function Fechamento() {

  const [dados, setDados] = useState<any[]>([])

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {

    const { data } = await supabase
      .from("financeiro")
      .select("*")

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

  const despesas = dados
    .filter(i => i.tipo === "DESPESA FIXA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const dividas = dados
    .filter(i => i.tipo === "DIVIDA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const retiradaAlexandre = dados
    .filter(i => i.categoria === "Retirada Alexandre")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const retiradaAnderson = dados
    .filter(i => i.categoria === "Retirada Anderson")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const lucroLiquido = entradas - saidas

  const alexandreBruto = lucroLiquido * 0.70
  const andersonBruto = lucroLiquido * 0.30

  const despesaAlexandre = despesas * 0.50
  const despesaAnderson = despesas * 0.50

  const dividaAlexandre = dividas * 0.70
  const dividaAnderson = dividas * 0.30

  const alexandreFinal =
    alexandreBruto
    - despesaAlexandre
    - dividaAlexandre
    - retiradaAlexandre

  const andersonFinal =
    andersonBruto
    - despesaAnderson
    - dividaAnderson
    - retiradaAnderson

  return (

    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>

      <Sidebar />

      <div style={{
        flex: 1,
        padding: "35px"
      }}>

        <h1 style={{
          fontSize: "42px",
          marginBottom: "10px",
          color: "#111827"
        }}>
          🤝 Fechamento
        </h1>

        <p style={{
          color: "#6b7280",
          marginBottom: "30px"
        }}>
          Resumo financeiro geral e divisão entre sócios
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "25px"
        }}>

          <Card
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
            titulo="Despesas Fixas"
            valor={moeda(despesas)}
            cor="#2563eb"
          />

          <Card
            titulo="Dívidas"
            valor={moeda(dividas)}
            cor="#9333ea"
          />

          <Card
            titulo="Lucro Líquido"
            valor={moeda(lucroLiquido)}
            cor="#111827"
          />

        </div>

        <div style={{
          background: "#eef4ff",
          border: "1px solid #c7d2fe",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "25px"
        }}>

          <h3>📘 Regras de divisão</h3>

          <p>
            • Despesas Fixas são divididas 50% para cada sócio.
          </p>

          <p>
            • Dívidas são divididas 70% Alexandre e 30% Anderson.
          </p>

        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>

          <div style={box}>

            <h2 style={{
              color: "#16a34a",
              marginBottom: "20px"
            }}>
              Alexandre (70%)
            </h2>

            <p>Participação no Lucro: {moeda(alexandreBruto)}</p>

            <p>
              (-) Despesas Fixas:
              {" "}
              {moeda(despesaAlexandre)}
            </p>

            <p>
              (-) Dívidas:
              {" "}
              {moeda(dividaAlexandre)}
            </p>

            <p>
              (-) Retirada Alexandre:
              {" "}
              {moeda(retiradaAlexandre)}
            </p>

            <hr style={{ margin: "20px 0" }} />

            <h1 style={{
              color:
                alexandreFinal >= 0
                  ? "#16a34a"
                  : "#dc2626"
            }}>
              {moeda(alexandreFinal)}
            </h1>

            <p style={{
              fontWeight: "bold"
            }}>
              Status:
              {" "}
              {alexandreFinal >= 0
                ? "Receber"
                : "Negativo"}
            </p>

          </div>

          <div style={box}>

            <h2 style={{
              color: "#2563eb",
              marginBottom: "20px"
            }}>
              Anderson (30%)
            </h2>

            <p>Participação no Lucro: {moeda(andersonBruto)}</p>

            <p>
              (-) Despesas Fixas:
              {" "}
              {moeda(despesaAnderson)}
            </p>

            <p>
              (-) Dívidas:
              {" "}
              {moeda(dividaAnderson)}
            </p>

            <p>
              (-) Retirada Anderson:
              {" "}
              {moeda(retiradaAnderson)}
            </p>

            <hr style={{ margin: "20px 0" }} />

            <h1 style={{
              color:
                andersonFinal >= 0
                  ? "#16a34a"
                  : "#dc2626"
            }}>
              {moeda(andersonFinal)}
            </h1>

            <p style={{
              fontWeight: "bold"
            }}>
              Status:
              {" "}
              {andersonFinal >= 0
                ? "Receber"
                : "Negativo"}
            </p>

          </div>

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

    <div style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "16px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
    }}>

      <p style={{
        color: "#6b7280",
        marginBottom: "10px"
      }}>
        {titulo}
      </p>

      <h2 style={{
        color: cor,
        fontSize: "30px"
      }}>
        {valor}
      </h2>

    </div>

  )

}

const box = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
}