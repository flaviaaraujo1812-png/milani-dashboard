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

  function moeda(valor:number) {
    return valor.toLocaleString("pt-BR", {
      style:"currency",
      currency:"BRL"
    })
  }

  const entradas = dados.reduce(
    (t,i) => t + Number(i.entrada || 0),
    0
  )

  const saidas = dados.reduce(
    (t,i) => t + Number(i.saida || 0),
    0
  )

  const despesas = dados
    .filter(i => i.tipo === "DESPESA FIXA")
    .reduce((t,i) => t + Number(i.saida || 0),0)

  const dividas = dados
    .filter(i => i.tipo === "DIVIDA")
    .reduce((t,i) => t + Number(i.saida || 0),0)

  const retiradaAlexandre = dados
    .filter(i => i.categoria === "Retirada Alexandre")
    .reduce((t,i) => t + Number(i.saida || 0),0)

  const retiradaAnderson = dados
    .filter(i => i.categoria === "Retirada Anderson")
    .reduce((t,i) => t + Number(i.saida || 0),0)

  const lucroLiquido = entradas - saidas

  const alexandreBruto = lucroLiquido * 0.70
  const andersonBruto = lucroLiquido * 0.30

  const alexandreFinal =
    alexandreBruto - retiradaAlexandre

  const andersonFinal =
    andersonBruto - retiradaAnderson

  return (

    <div style={{
      display:"flex",
      minHeight:"100vh",
      background:"#f5f5f5"
    }}>

      <Sidebar />

      <div style={{
        flex:1,
        padding:"35px"
      }}>

        <h1 style={{
          fontSize:"42px",
          marginBottom:"30px"
        }}>
          🤝 Fechamento
        </h1>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
          gap:"20px",
          marginBottom:"25px"
        }}>

          <Card titulo="Entradas" valor={moeda(entradas)} cor="#16a34a" />
          <Card titulo="Saídas" valor={moeda(saidas)} cor="#dc2626" />
          <Card titulo="Despesas" valor={moeda(despesas)} cor="#2563eb" />
          <Card titulo="Dívidas" valor={moeda(dividas)} cor="#9333ea" />
          <Card titulo="Lucro Líquido" valor={moeda(lucroLiquido)} cor="#111827" />

        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"20px"
        }}>

          <div style={box}>

            <h2>Alexandre (70%)</h2>

            <p>Lucro: {moeda(alexandreBruto)}</p>

            <p>
              Retirado:
              - {moeda(retiradaAlexandre)}
            </p>

            <h1 style={{
              color:
                alexandreFinal >= 0
                ? "green"
                : "red"
            }}>
              {moeda(alexandreFinal)}
            </h1>

          </div>

          <div style={box}>

            <h2>Anderson (30%)</h2>

            <p>Lucro: {moeda(andersonBruto)}</p>

            <p>
              Retirado:
              - {moeda(retiradaAnderson)}
            </p>

            <h1 style={{
              color:
                andersonFinal >= 0
                ? "green"
                : "red"
            }}>
              {moeda(andersonFinal)}
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
}:{
  titulo:string
  valor:string
  cor:string
}) {

  return (

    <div style={{
      background:"#fff",
      padding:"25px",
      borderRadius:"16px",
      boxShadow:"0 4px 15px rgba(0,0,0,0.05)"
    }}>

      <p>{titulo}</p>

      <h2 style={{
        color:cor
      }}>
        {valor}
      </h2>

    </div>

  )

}

const box = {
  background:"#fff",
  padding:"25px",
  borderRadius:"16px",
  boxShadow:"0 4px 15px rgba(0,0,0,0.05)"
}