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

  const resumoVeiculos: Record<string, number> = {}

  dados.forEach(item => {

    if (item.tipo === "ENTRADA") {

      const veiculo =
        item.descricao || "Não informado"

      resumoVeiculos[veiculo] =
        (resumoVeiculos[veiculo] || 0) + 1

    }

  })

  const categoriasEntrada: Record<string, number> = {}

  dados.forEach(item => {

    if (item.tipo === "ENTRADA") {

      const categoria =
        item.categoria || "Outros"

      categoriasEntrada[categoria] =
        (categoriasEntrada[categoria] || 0)
        + Number(item.entrada || 0)

    }

  })

  const categoriasSaida: Record<string, number> = {}

  dados.forEach(item => {

    if (
      item.tipo === "SAIDA" ||
      item.tipo === "DESPESA FIXA" ||
      item.tipo === "DIVIDA"
    ) {

      const categoria =
        item.categoria || "Outros"

      categoriasSaida[categoria] =
        (categoriasSaida[categoria] || 0)
        + Number(item.saida || 0)

    }

  })

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
            marginBottom: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📊 Dashboard
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
            gridTemplateColumns: "repeat(6,1fr)",
            gap: "12px",
            marginBottom: "20px"
          }}
        >

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
            titulo="Lucro"
            valor={moeda(lucro)}
            cor="#111827"
          />

          <Card
            titulo="Retiradas"
            valor={moeda(retiradas)}
            cor="#d97706"
          />

          <Card
            titulo="Despesas"
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
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >

          <div style={box}>

            <h2 style={tituloBox}>
              🚗 Veículos Atendidos
            </h2>

            {Object.entries(resumoVeiculos).length === 0 && (
              <p>Nenhum veículo lançado.</p>
            )}

            {Object.entries(resumoVeiculos).map(
              ([veiculo, quantidade]) => (

                <div
                  key={veiculo}
                  style={linha}
                >
                  <span>{veiculo}</span>
                  <strong>{quantidade}</strong>
                </div>

              )
            )}

          </div>

          <div style={box}>

            <h2 style={tituloBox}>
              📦 Entradas por Categoria
            </h2>

            {Object.entries(categoriasEntrada).length === 0 && (
              <p>Nenhuma entrada cadastrada.</p>
            )}

            {Object.entries(categoriasEntrada).map(
              ([categoria, valor]) => (

                <div
                  key={categoria}
                  style={linha}
                >
                  <span>{categoria}</span>
                  <strong>{moeda(valor)}</strong>
                </div>

              )
            )}

          </div>

          <div style={box}>

            <h2 style={tituloBox}>
              📄 Despesas e Dívidas
            </h2>

            {Object.entries(categoriasSaida).length === 0 && (
              <p>Nenhuma despesa cadastrada.</p>
            )}

            {Object.entries(categoriasSaida).map(
              ([categoria, valor]) => (

                <div
                  key={categoria}
                  style={linha}
                >
                  <span>{categoria}</span>
                  <strong>{moeda(valor)}</strong>
                </div>

              )
            )}

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
        boxShadow: "0 3px 12px rgba(0,0,0,0.04)"
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
  boxShadow: "0 3px 15px rgba(0,0,0,0.04)"
}

const tituloBox = {
  fontSize: "18px",
  marginBottom: "15px",
  color: "#1e1b4b",
  fontWeight: "bold"
}

const linha = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb"
}