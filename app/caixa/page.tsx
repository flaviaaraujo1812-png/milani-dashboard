"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "../components/sidebar"

type Lancamento = {
  id?: number
  tipo: string
  categoria: string
  descricao: string
  pagamento: string
  entrada: number
  saida: number
  data?: string
  created_at?: string
}

export default function Caixa() {

  const [tipo, setTipo] = useState("ENTRADA")
  const [categoria, setCategoria] = useState("")
  const [descricao, setDescricao] = useState("")
  const [pagamento, setPagamento] = useState("PIX")
  const [valor, setValor] = useState("")

  const [dados, setDados] = useState<Lancamento[]>([])

  const [dataFiltro, setDataFiltro] = useState(
    new Date().toISOString().split("T")[0]
  )

  useEffect(() => {
    carregar()
  }, [dataFiltro])

  async function carregar() {

    const inicio = `${dataFiltro}T00:00:00`
    const fim = `${dataFiltro}T23:59:59`

    const { data } = await supabase
      .from("financeiro")
      .select("*")
      .gte("data", inicio)
      .lte("data", fim)
      .order("id", { ascending: false })

    setDados(data || [])

  }

  async function salvar() {

    if (!categoria) {
      alert("Selecione categoria")
      return
    }

    await supabase.from("financeiro").insert({

      tipo,
      categoria,
      descricao,
      pagamento,

      entrada:
        tipo === "ENTRADA"
          ? Number(valor || 0)
          : 0,

      saida:
        tipo !== "ENTRADA"
          ? Number(valor || 0)
          : 0,

      data: new Date().toISOString()

    })

    setCategoria("")
    setDescricao("")
    setValor("")

    carregar()

  }

  async function excluir(id?: number) {

    const confirmar = confirm("Deseja excluir lançamento?")

    if (!confirmar) return

    await supabase
      .from("financeiro")
      .delete()
      .eq("id", id)

    carregar()

  }

  function moeda(valor: number) {

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

  }

  const totalEntrada = dados.reduce(
    (t, i) => t + Number(i.entrada || 0),
    0
  )

  const totalSaida = dados.reduce(
    (t, i) => t + Number(i.saida || 0),
    0
  )

  const saldo = totalEntrada - totalSaida

  const despesasFixas = dados
    .filter(i => i.tipo === "DESPESA FIXA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const dividas = dados
    .filter(i => i.tipo === "DIVIDA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const retiradas = dados
    .filter(i => i.tipo === "RETIRADA")
    .reduce((t, i) => t + Number(i.saida || 0), 0)

  const lucroLiquido = totalEntrada - totalSaida

  const alexandre =
    (lucroLiquido * 0.70)
    - (despesasFixas / 2)
    - (dividas * 0.70)

  const anderson =
    (lucroLiquido * 0.30)
    - (despesasFixas / 2)
    - (dividas * 0.30)

  return (

    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>

      <Sidebar />

      {/* CONTEÚDO */}

      <div style={{
        flex: 1,
        padding: "35px"
      }}>

        <h1 style={{
          fontSize: "42px",
          marginBottom: "30px",
          color: "#1e1b4b"
        }}>
          Caixa
        </h1>

        {/* NOVO LANÇAMENTO */}

        <div style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>

          <h2 style={{
            marginBottom: "20px",
            color: "#1e1b4b"
          }}>
            Novo Lançamento
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px"
          }}>

            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={input}
            >

              <option>ENTRADA</option>
              <option>SAIDA</option>
              <option>DESPESA FIXA</option>
              <option>DIVIDA</option>
              <option>RETIRADA</option>

            </select>

            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              style={input}
            >

              <option value="">Categoria</option>

              <option>Retrovisor</option>
              <option>Farol</option>
              <option>Espelho</option>
              <option> Parachoque</option>
              <option>Lanterna</option>
              <option>Aluguel</option>
              <option>Energia</option>
              <option>Fornecedor</option>
              <option>Retirada</option>
              <option>Internet</option>
              <option>Divida</option>
              <option>Agua</option>


            </select>

            <input
              placeholder="Descrição"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              style={input}
            />

            <select
              value={pagamento}
              onChange={e => setPagamento(e.target.value)}
              style={input}
            >

              <option>PIX</option>
              <option>DINHEIRO</option>
              <option>CARTÃO</option>

            </select>

            <input
              placeholder="Valor R$"
              value={valor}
              onChange={e => setValor(e.target.value)}
              style={input}
            />

          </div>

          <button
            onClick={salvar}
            style={{
              marginTop: "20px",
              background: "#FFD700",
              border: "none",
              padding: "14px 24px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            SALVAR LANÇAMENTO
          </button>

        </div>

        {/* MOVIMENTAÇÕES */}

        <div style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>

            <h2 style={{
              color: "#1e1b4b"
            }}>
              Movimentações
            </h2>

            <input
              type="date"
              value={dataFiltro}
              onChange={e => setDataFiltro(e.target.value)}
              style={{
                ...input,
                width: "220px"
              }}
            />

          </div>

          <div style={{
            overflowX: "auto"
          }}>

            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>

              <thead>

                <tr style={{
                  background: "#f3f4f6"
                }}>

                  <th style={th}>Data</th>
                  <th style={th}>Tipo</th>
                  <th style={th}>Categoria</th>
                  <th style={th}>Descrição</th>
                  <th style={th}>Pagamento</th>
                  <th style={th}>Valor</th>
                  <th style={th}>Ações</th>

                </tr>

              </thead>

              <tbody>

                {dados.map((item) => (

                  <tr key={item.id}>

                    <td style={td}>
                      {item.data
                        ? new Date(item.data).toLocaleDateString("pt-BR")
                        : "-"
                      }
                    </td>

                    <td style={td}>{item.tipo}</td>

                    <td style={td}>{item.categoria}</td>

                    <td style={td}>{item.descricao}</td>

                    <td style={td}>{item.pagamento}</td>

                    <td style={{
                      ...td,
                      color:
                        item.entrada > 0
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: "bold"
                    }}>

                      {item.entrada > 0
                        ? moeda(item.entrada)
                        : moeda(item.saida)
                      }

                    </td>

                    <td style={td}>

                      <button
                        onClick={() => excluir(item.id)}
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        Excluir
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* CARDS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "25px",
          marginBottom: "25px"
        }}>

          <Card titulo="Entradas" valor={moeda(totalEntrada)} cor="#16a34a" />

          <Card titulo="Saídas" valor={moeda(totalSaida)} cor="#dc2626" />

          <Card titulo="Saldo" valor={moeda(saldo)} cor="#111827" />

          <Card titulo="Retiradas" valor={moeda(retiradas)} cor="#d97706" />

        </div>

        {/* FECHAMENTO */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}>

          <div style={boxFechamento}>

            <h2>Alexandre (70%)</h2>

            <p>Lucro: {moeda(lucroLiquido * 0.70)}</p>

            <p>
              Despesas Fixas:
              - {moeda(despesasFixas / 2)}
            </p>

            <p>
              Dívidas:
              - {moeda(dividas * 0.70)}
            </p>

            <h1 style={{
              color: alexandre >= 0
                ? "green"
                : "red"
            }}>
              {moeda(alexandre)}
            </h1>

          </div>

          <div style={boxFechamento}>

            <h2>Anderson (30%)</h2>

            <p>Lucro: {moeda(lucroLiquido * 0.30)}</p>

            <p>
              Despesas Fixas:
              - {moeda(despesasFixas / 2)}
            </p>

            <p>
              Dívidas:
              - {moeda(dividas * 0.30)}
            </p>

            <h1 style={{
              color: anderson >= 0
                ? "green"
                : "red"
            }}>
              {moeda(anderson)}
            </h1>

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
        marginBottom: "12px",
        fontSize: "15px"
      }}>
        {titulo}
      </p>

      <h2 style={{
        color: cor,
        fontSize: "32px"
      }}>
        {valor}
      </h2>

    </div>

  )

}

 const menu = {
  display: "block",
  color: "#fff",
  textDecoration: "none",
  marginBottom: "12px",
  fontSize: "18px",
  padding: "12px 15px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.05)"
}

const input = {
  width: "100%",
  padding: "14px",
  border: "1px constsolid #ddd",
  borderRadius: "10px",
  fontSize: "15px"
}

const th = {
  padding: "14px",
  textAlign: "left" as const,
  borderBottom: "2px solid #d1d5db"
}

const td = {
  padding: "12px",
  borderBottom: "1px solid #d1d5db"
}

const boxFechamento = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
}