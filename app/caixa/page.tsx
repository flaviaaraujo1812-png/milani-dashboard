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
const [veiculo, setVeiculo] = useState("")
const [observacao, setObservacao] = useState("")
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
  alert("Informe a categoria")
  return
}

const { data, error } = await supabase
  .from("financeiro")
  .insert({

    tipo,
    categoria,

    descricao:
      veiculo +
      (observacao
        ? ` - ${observacao}`
        : ""),

    pagamento,

    entrada:
  tipo === "ENTRADA"
    ? Number(String(valor).replace(".", "").replace(",", ".") || 0)
    : 0,

saida:
  tipo === "SAIDA" ||
  tipo === "DESPESA FIXA" ||
  tipo === "DIVIDA" ||
  tipo === "RETIRADA"
    ? Number(String(valor).replace(".", "").replace(",", ".") || 0)
    : 0,
    
   data: new Date().toISOString().split("T")[0]

  })

  console.log("DATA:", data)
console.log("ERROR:", error)

if (error) {
  alert(JSON.stringify(error))
}

setCategoria("")
setVeiculo("")
setObservacao("")
setValor("")

carregar()

}

async function excluir(id?: number) {

const confirmar = confirm(
  "Deseja excluir lançamento?"
)

if (!confirmar) return

await supabase
  .from("financeiro")
  .delete()
  .eq("id", id)

carregar()


}

function moeda(valor: number) {

return valor.toLocaleString(
  "pt-BR",
  {
    style: "currency",
    currency: "BRL"
  }
)

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

const retiradas = dados
.filter(i => i.tipo === "RETIRADA")
.reduce(
(t, i) => t + Number(i.saida || 0),
0
)

return (

<div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "#f5f5f5"
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
        marginBottom: "6px"
      }}
    >
      💰 Caixa Diário
    </h1>

    <p
      style={{
        color: "#6b7280",
        marginBottom: "25px"
      }}
    >
      Controle diário de entradas e saídas
    </p>

    <div style={box}>

      <h2 style={tituloBox}>
        Novo Lançamento
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px"
        }}
      >

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

        <input
          placeholder="Categoria"
          value={categoria}
          onChange={e =>
            setCategoria(e.target.value)
          }
          style={input}
        />

        <input
          placeholder="Veículo"
          value={veiculo}
          onChange={e =>
            setVeiculo(e.target.value)
          }
          style={input}
        />

        <input
          placeholder="Observação (opcional)"
          value={observacao}
          onChange={e =>
            setObservacao(e.target.value)
          }
          style={input}
        />

        <select
          value={pagamento}
          onChange={e =>
            setPagamento(e.target.value)
          }
          style={input}
        >
          <option>PIX</option>
          <option>DINHEIRO</option>
          <option>CARTÃO</option>
        </select>

        <input
          placeholder="Valor R$"
          value={valor}
          onChange={e =>
            setValor(e.target.value)
          }
          style={input}
        />

      </div>

      <button
        onClick={salvar}
        style={{
          marginTop: "20px",
          background: "#FFD700",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        SALVAR LANÇAMENTO
      </button>

    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(4,1fr)",
        gap: "12px",
        marginTop: "20px",
        marginBottom: "20px"
      }}
    >

      <Card
        titulo="Entradas"
        valor={moeda(totalEntrada)}
        cor="#16a34a"
      />

      <Card
        titulo="Saídas"
        valor={moeda(totalSaida)}
        cor="#dc2626"
      />

      <Card
        titulo="Saldo"
        valor={moeda(saldo)}
        cor="#111827"
      />

      <Card
        titulo="Retiradas"
        valor={moeda(retiradas)}
        cor="#d97706"
      />

    </div>

    <div style={box}>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >

        <h2 style={tituloBox}>
          Movimentações
        </h2>

        <input
          type="date"
          value={dataFiltro}
          onChange={e =>
            setDataFiltro(
              e.target.value
            )
          }
          style={{
            ...input,
            width: "220px"
          }}
        />

      </div>

      <div
        style={{
          overflowX: "auto"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr>

              <th style={th}>Data</th>
              <th style={th}>Tipo</th>
              <th style={th}>Categoria</th>
              <th style={th}>Veículo</th>
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
                    ? new Date(
                        item.data
                      ).toLocaleDateString(
                        "pt-BR"
                      )
                    : "-"
                  }
                </td>

                <td style={td}>
                  {item.tipo}
                </td>

                <td style={td}>
                  {item.categoria}
                </td>

                <td style={td}>
                  {item.descricao}
                </td>

                <td style={td}>
                  {item.pagamento}
                </td>

                <td
                  style={{
                    ...td,
                    color:
                      item.entrada > 0
                        ? "#16a34a"
                        : "#dc2626",
                    fontWeight:
                      "bold"
                  }}
                >

                  {item.entrada > 0
                    ? moeda(
                        item.entrada
                      )
                    : moeda(
                        item.saida
                      )}

                </td>

                <td style={td}>

                  <button
                    onClick={() =>
                      excluir(item.id)
                    }
                    style={{
                      background:
                        "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding:
                        "8px 12px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer"
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
    padding: "15px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.04)"
  }}
>

  <p
    style={{
      color: "#6b7280",
      marginBottom: "8px",
      fontSize: "13px"
    }}
  >
    {titulo}
  </p>

  <h2
    style={{
      color: cor,
      fontSize: "16px",
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
boxShadow:
"0 3px 15px rgba(0,0,0,0.04)",
marginBottom: "20px"
}

const tituloBox = {
fontSize: "18px",
marginBottom: "15px",
color: "#111827",
fontWeight: "bold"
}

const input = {
width: "100%",
padding: "12px",
border: "1px solid #d1d5db",
borderRadius: "10px",
fontSize: "14px"
}

const th = {
padding: "10px",
textAlign: "left" as const,
borderBottom:
"2px solid #e5e7eb",
fontSize: "14px"
}

const td = {
padding: "10px",
borderBottom:
"1px solid #e5e7eb",
fontSize: "14px"
}
