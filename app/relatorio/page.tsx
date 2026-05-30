"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "../components/sidebar"

type Lancamento = {
  id?: number
  tipo: string
  categoria: string
  veiculo: string
  descricao: string
  entrada: number
  saida: number
  data?: string
}

export default function Relatorios() {

  const [dados, setDados] = useState<Lancamento[]>([])

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

  const hoje = new Date()

  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()

  const mesAnterior =
    mesAtual === 0
      ? 11
      : mesAtual - 1

  const anoAnterior =
    mesAtual === 0
      ? anoAtual - 1
      : anoAtual

  const dadosMesAtual = dados.filter(item => {

    if (!item.data) return false

    const data = new Date(item.data)

    return (
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    )

  })

  const dadosMesAnterior = dados.filter(item => {

    if (!item.data) return false

    const data = new Date(item.data)

    return (
      data.getMonth() === mesAnterior &&
      data.getFullYear() === anoAnterior
    )

  })

  function totalEntradas(lista: Lancamento[]) {

    return lista.reduce(
      (t, i) => t + Number(i.entrada || 0),
      0
    )

  }

  function totalDespesas(lista: Lancamento[]) {

    return lista
      .filter(
        i =>
          i.tipo === "DESPESA FIXA" ||
          i.tipo === "SAIDA"
      )
      .reduce(
        (t, i) => t + Number(i.saida || 0),
        0
      )

  }

  function totalDividas(lista: Lancamento[]) {

    return lista
      .filter(i => i.tipo === "DIVIDA")
      .reduce(
        (t, i) => t + Number(i.saida || 0),
        0
      )

  }

  function lucro(lista: Lancamento[]) {

    return (
      totalEntradas(lista)
      - totalDespesas(lista)
      - totalDividas(lista)
    )

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

  const entradasAtual =
    totalEntradas(dadosMesAtual)

  const despesasAtual =
    totalDespesas(dadosMesAtual)

  const dividasAtual =
    totalDividas(dadosMesAtual)

  const lucroAtual =
    lucro(dadosMesAtual)

  const entradasAnterior =
    totalEntradas(dadosMesAnterior)

  const despesasAnterior =
    totalDespesas(dadosMesAnterior)

  const dividasAnterior =
    totalDividas(dadosMesAnterior)

  const lucroAnterior =
    lucro(dadosMesAnterior)

  return (

    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f7fb"
    }}>

      <Sidebar />

      <div style={{
        flex: 1,
        padding: "30px"
      }}>

        <h1 style={{
          fontSize: "42px",
          color: "#1e1b4b",
          marginBottom: "10px"
        }}>
          📊 Relatórios Financeiros
        </h1>

        <p style={{
          color: "#6b7280",
          marginBottom: "30px"
        }}>
          Comparativo dos últimos meses
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "25px"
        }}>


        {/* MÊS ATUAL */}

          <div style={box}>

            <h2 style={tituloSecao}>
              📅 Mês Atual
            </h2>

            <p style={{
              color: "#6b7280",
              marginBottom: "20px"
            }}>
              {hoje.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric"
              })}
            </p>

            </div>

            <div style={resumoGrid}>

              <MiniCard
                titulo="Entradas"
                valor={moeda(entradasAtual)}
                cor="#16a34a"
              />

              <MiniCard
                titulo="Despesas"
                valor={moeda(despesasAtual)}
                cor="#dc2626"
              />

              <MiniCard
                titulo="Dívidas"
                valor={moeda(dividasAtual)}
                cor="#7c3aed"
              />

              <MiniCard
                titulo="Lucro"
                valor={moeda(lucroAtual)}
                cor="#2563eb"
              />

            </div>

          </div>

          {/* MÊS ANTERIOR */}

          <div style={box}>

            <h2 style={tituloSecao}>
              📅 Mês Anterior
            </h2>

            <p style={{
              color: "#6b7280",
              marginBottom: "20px"
            }}>
              {new Date(
                anoAnterior,
                mesAnterior
              ).toLocaleString("pt-BR", {
                month: "long",
                year: "numeric"
              })}
            </p>

            <div style={resumoGrid}>

              <MiniCard
                titulo="Entradas"
                valor={moeda(entradasAnterior)}
                cor="#16a34a"
              />

              <MiniCard
                titulo="Despesas"
                valor={moeda(despesasAnterior)}
                cor="#dc2626"
              />

              <MiniCard
                titulo="Dívidas"
                valor={moeda(dividasAnterior)}
                cor="#7c3aed"
              />

              <MiniCard
                titulo="Lucro"
                valor={moeda(lucroAnterior)}
                cor="#2563eb"
              />

            </div>

          </div>

        </div>

        {/* MELHORES E PIORES DIAS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "25px"
        }}>

          <div style={box}>

            <h2 style={tituloSecao}>
              🏆 Melhores Dias
            </h2>

            <div style={linhaResumo}>
              <span>1º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>2º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>3º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>4º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>5º Lugar</span>
              <span>R$ 0,00</span>
            </div>

          </div>

          <div style={box}>

            <h2 style={tituloSecao}>
              📉 Piores Dias
            </h2>

            <div style={linhaResumo}>
              <span>1º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>2º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>3º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>4º Lugar</span>
              <span>R$ 0,00</span>
            </div>

            <div style={linhaResumo}>
              <span>5º Lugar</span>
              <span>R$ 0,00</span>
            </div>

          </div>

        </div>
        {/* RESUMO OPERACIONAL */}

        <div style={box}>

          <h2 style={tituloSecao}>
            🚗 Resumo Operacional
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px"
          }}>

            <div>

              <h3 style={{
                color: "#2563eb",
                marginBottom: "15px"
              }}>
                Top 5 Carros Mais Atendidos
              </h3>

              <p>1º - -</p>
              <p>2º - -</p>
              <p>3º - -</p>
              <p>4º - -</p>
              <p>5º - -</p>

            </div>

            <div>

              <h3 style={{
                color: "#7c3aed",
                marginBottom: "15px"
              }}>
                Top 3 Categorias de Serviços/Peças
              </h3>

              <p>1º - -</p>
              <p>2º - -</p>
              <p>3º - -</p>

            </div>

          </div>


      </div>

    </div>

  )

}

/* COMPONENTE CARD */

function MiniCard({
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
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "15px",
      textAlign: "center"
    }}>

      <p style={{
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "8px"
      }}>
        {titulo}
      </p>

      <h3 style={{
        color: cor,
        fontSize: "20px"
      }}>
        {valor}
      </h3>

    </div>

  )

}

/* ESTILOS */

const box = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.04)"
}

const resumoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px"
}

const tituloSecao = {
  marginBottom: "15px",
  fontSize: "22px",
  fontWeight: "bold"
}

const linhaResumo = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb"
}