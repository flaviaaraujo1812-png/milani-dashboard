"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "../components/sidebar"

export default function Relatorios() {

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

  const lucro = entradas - saidas

  const despesas = dados
    .filter(i => i.tipo === "DESPESA FIXA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const dividas = dados
    .filter(i => i.tipo === "DIVIDA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)


  return (

    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>

      <Sidebar />

      <div style={{
        flex: 1,
        padding: "25px"
      }}>

        <h1 style={{
          fontSize: "32px",
          color: "#111827",
          marginBottom: "6px"
        }}>
          📊 Relatórios Financeiros
        </h1>

        <p style={{
          color: "#6b7280",
          marginBottom: "25px"
        }}>
          Comparativo completo entre os últimos meses
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "20px"
        }}>

          {/* MÊS ATUAL */}

          <div style={box}>

            <h2 style={{
              color: "#16a34a",
              marginBottom: "10px",
              fontSize: "22px"
            }}>
              📅 Mês Atual
            </h2>

            <p style={{
              color: "#6b7280",
              marginBottom: "15px"
            }}>
              Maio / 2026
            </p>

            <div style={resumoGrid}>

              <MiniCard
                titulo="Entradas"
                valor={moeda(entradas)}
                cor="#16a34a"
              />

              <MiniCard
                titulo="Saídas"
                valor={moeda(saidas)}
                cor="#dc2626"
              />

              <MiniCard
                titulo="Lucro"
                valor={moeda(lucro)}
                cor="#2563eb"
              />

            </div>

          </div>

          {/* MÊS ANTERIOR */}

          <div style={box}>

            <h2 style={{
              color: "#2563eb",
              marginBottom: "10px",
              fontSize: "22px"
            }}>
              📅 Mês Anterior
            </h2>

            <p style={{
              color: "#6b7280",
              marginBottom: "15px"
            }}>
              Abril / 2026
            </p>

            <div style={resumoGrid}>

              <MiniCard
                titulo="Entradas"
                valor="R$ 0,00"
                cor="#16a34a"
              />

              <MiniCard
                titulo="Saídas"
                valor="R$ 0,00"
                cor="#dc2626"
              />

              <MiniCard
                titulo="Lucro"
                valor="R$ 0,00"
                cor="#2563eb"
              />

            </div>

          </div>

          {/* COMPARATIVO */}

          <div style={box}>

            <h2 style={{
              color: "#9333ea",
              marginBottom: "15px",
              fontSize: "22px"
            }}>
              ⚖️ Comparativo
            </h2>

            <table style={{
              width: "100%"
            }}>

              <tbody>

                <tr>
                  <td style={tdComp}>Entradas</td>
                  <td style={{
                    ...tdComp,
                    color: "#16a34a",
                    fontWeight: "bold"
                  }}>
                    {moeda(entradas)}
                  </td>
                </tr>

                <tr>
                  <td style={tdComp}>Saídas</td>
                  <td style={{
                    ...tdComp,
                    color: "#dc2626",
                    fontWeight: "bold"
                  }}>
                    {moeda(saidas)}
                  </td>
                </tr>

                <tr>
                  <td style={tdComp}>Lucro</td>
                  <td style={{
                    ...tdComp,
                    color: "#2563eb",
                    fontWeight: "bold"
                  }}>
                    {moeda(lucro)}
                  </td>
                </tr>

                <tr>
                  <td style={tdComp}>Despesas</td>
                  <td style={{
                    ...tdComp,
                    color: "#f97316",
                    fontWeight: "bold"
                  }}>
                    {moeda(despesas)}
                  </td>
                </tr>

                <tr>
                  <td style={tdComp}>Dívidas</td>
                  <td style={{
                    ...tdComp,
                    color: "#9333ea",
                    fontWeight: "bold"
                  }}>
                    {moeda(dividas)}
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>
        {/* MELHORES E PIORES DIAS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px"
        }}>

          <div style={box}>

            <h2 style={tituloSecao}>
              🏆 Melhores Dias
            </h2>

            <table style={{ width: "100%" }}>

              <tbody>

                <tr>
                  <td style={tdComp}>1º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

                <tr>
                  <td style={tdComp}>2º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

                <tr>
                  <td style={tdComp}>3º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

              </tbody>

            </table>

          </div>

          <div style={box}>

            <h2 style={tituloSecao}>
              📉 Piores Dias
            </h2>

            <table style={{ width: "100%" }}>

              <tbody>

                <tr>
                  <td style={tdComp}>1º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

                <tr>
                  <td style={tdComp}>2º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

                <tr>
                  <td style={tdComp}>3º Lugar</td>
                  <td style={tdComp}>R$ 0,00</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* DESPESAS E DIVIDAS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px"
        }}>

          <div style={box}>

            <h2 style={tituloSecao}>
              💸 Total de Despesas
            </h2>

            <h1 style={{
              color: "#f97316",
              fontSize: "28px"
            }}>
              {moeda(despesas)}
            </h1>

          </div>

          <div style={box}>

            <h2 style={tituloSecao}>
              📄 Total de Dívidas
            </h2>

            <h1 style={{
              color: "#9333ea",
              fontSize: "28px"
            }}>
              {moeda(dividas)}
            </h1>

          </div>

        </div>

        {/* RESULTADO DOS SOCIOS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px"
        }}>

          <div style={box}>

            <h2 style={{
              fontSize: "18px",
              fontWeight: "bold",
              borderBottom: "2px solid #16a34a",
              paddingBottom: "8px",
              marginBottom: "15px"
            }}>
              Alexandre • 70%
            </h2>

            <h1 style={{
              fontSize: "24px",
              color: "#16a34a"
            }}>
              Positivo
            </h1>

            <p style={{
              color: "#6b7280"
            }}>
              Resultado do fechamento
            </p>

          </div>

          <div style={box}>

            <h2 style={{
              fontSize: "18px",
              fontWeight: "bold",
              borderBottom: "2px solid #2563eb",
              paddingBottom: "8px",
              marginBottom: "15px"
            }}>
              Anderson • 30%
            </h2>

            <h1 style={{
              fontSize: "24px",
              color: "#16a34a"
            }}>
              Positivo
            </h1>

            <p style={{
              color: "#6b7280"
            }}>
              Resultado do fechamento
            </p>

          </div>
</div>

        {/* RESUMO OPERACIONAL */}

        <div style={{
          ...box,
          marginBottom: "20px"
        }}>

          <h2 style={tituloSecao}>
            🚗 Resumo Operacional
          </h2>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <span>Veículos Atendidos</span>
            <strong>0</strong>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <span>Carro Mais Atendido</span>
            <strong>Gol G5</strong>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <span>O que Mais Vendeu</span>
            <strong>Retrovisor</strong>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0"
          }}>
            <span>Categoria Mais Vendida</span>
            <strong>Retrovisor</strong>
          </div>

        </div>
      

        {/* BOTOES */}

        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px"
        }}>

          <button style={botao}>
            📄 Exportar PDF
          </button>

          <button style={botao}>
            📊 Exportar Excel
          </button>

          <button style={botao}>
            🖨 Imprimir
          </button>

        </div>

      </div>

    </div>

  )

}

function MiniCard({
  titulo,
  valor,
  cor
}: any) {

  return (

    <div style={{
      background: "#f9fafb",
      padding: "12px",
      borderRadius: "12px"
    }}>

      <p style={{
        color: "#6b7280",
        fontSize: "12px"
      }}>
        {titulo}
      </p>

      <h3 style={{
        color: cor,
        fontSize: "16px"
      }}>
        {valor}
      </h3>

    </div>

  )

}

const box = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.04)"
}

const resumoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "10px"
}

const tituloSecao = {
  marginBottom: "15px",
  fontSize: "18px",
  fontWeight: "bold"
}

const tdComp = {
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb"
}

const botao = {
  background: "#111827",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer"
}