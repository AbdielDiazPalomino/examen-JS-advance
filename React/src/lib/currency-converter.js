const USD_TO_SOL_RATE = 3.75 // Tasa aproximada, en producción obtener de API

export function solToDolar(soles) {
  return Number((soles / USD_TO_SOL_RATE).toFixed(2))
}

export function dolarToSol(dolares) {
  return Number((dolares * USD_TO_SOL_RATE).toFixed(2))
}

export function formatCurrency(amount, currency = "SOL") {
  const symbol = currency === "SOL" ? "S/." : "$"
  return `${symbol} ${amount.toFixed(2)}`
}