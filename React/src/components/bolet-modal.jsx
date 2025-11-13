"use client"

import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx"
import { generateBoletPDF } from "../lib/pdf-generator"
import { searchDniReniec } from "../lib/reniec-api"
import { solToDolar, formatCurrency } from "../lib/currency-converter"

export function BoletModal({ products, onClose }) {
  const [step, setStep] = useState("customer")
  const [dni, setDni] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [dniError, setDniError] = useState("")
  const [boletItems, setBoletItems] = useState([])
  const [loadingDni, setLoadingDni] = useState(false)
  const [currency, setCurrency] = useState("SOL")
  const modalRef = useRef(null)

  const handleSearchDni = async () => {
    setDniError("")
    if (!dni || dni.length !== 8) {
      setDniError("El DNI debe tener 8 dígitos")
      return
    }

    setLoadingDni(true)
    try {
      let name = await searchDniReniec(dni)

      if (name) {
        setCustomerName(name)
        setStep("items")
      } else {
        setDniError("DNI no encontrado en la base de datos")
      }
    } catch (error) {
      setDniError("Error al consultar el DNI")
      console.log("[v0] DNI search error:", error)
    } finally {
      setLoadingDni(false)
    }
  }

  const handleAddItem = (productId) => {
    const existingItem = boletItems.find((item) => item.productId === productId)
    if (existingItem) {
      const product = products.find((p) => p.id === productId)
      if (product && existingItem.quantity < product.stock) {
        setBoletItems(
          boletItems.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)),
        )
      }
    } else {
      setBoletItems([...boletItems, { productId, quantity: 1 }])
    }
  }

  const handleRemoveItem = (productId) => {
    setBoletItems(boletItems.filter((item) => item.productId !== productId))
  }

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
    } else {
      const product = products.find((p) => p.id === productId)
      if (product && quantity <= product.stock) {
        setBoletItems(boletItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
      }
    }
  }

  const calculateTotal = () => {
    return boletItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const totalInCurrency = currency === "USD" ? solToDolar(calculateTotal()) : calculateTotal()

  const handleGeneratePDF = () => {
    const boletData = {
      dni,
      customerName,
      items: boletItems.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        }
      }),
      total: calculateTotal(),
      currency,
    }

    generateBoletPDF(boletData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card ref={modalRef} className="w-full max-w-2xl shadow-2xl border-primary/20 animate-scale-in">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle>Generar Boleta</CardTitle>
            <CardDescription>
              {step === "customer" && "Ingresa el DNI del cliente"}
              {step === "items" && "Selecciona los productos"}
              {step === "review" && "Revisa la boleta antes de generar"}
            </CardDescription>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            ✕
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "customer" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">DNI del Cliente</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => {
                      setDni(e.target.value.replace(/\D/g, "").slice(0, 8))
                      setDniError("")
                    }}
                    placeholder="12345678"
                    maxLength={8}
                    className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Button
                    onClick={handleSearchDni}
                    disabled={loadingDni || dni.length !== 8}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    {loadingDni ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                {dniError && <p className="text-destructive text-sm">{dniError}</p>}
              </div>

              {customerName && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 animate-slide-in-left">
                  <p className="text-sm text-muted-foreground">Nombre del cliente</p>
                  <p className="font-semibold text-lg text-primary">{customerName}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (!customerName) {
                      setDniError("Por favor busca un DNI válido")
                    } else {
                      setStep("items")
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  disabled={!customerName}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {step === "items" && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {products.map((product) => {
                  const item = boletItems.find((i) => i.productId === product.id)
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                      </div>
                      {item ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(product.id, Number.parseInt(e.target.value) || 0)}
                            className="w-12 text-center border border-input rounded px-2 py-1"
                            min="1"
                            max={product.stock}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(product.id)}
                            className="text-destructive"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(product.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          + Agregar
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setStep("customer")} variant="outline" className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={() => setStep("review")}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                  disabled={boletItems.length === 0}
                >
                  Revisar ({boletItems.length})
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-end mb-4">
                <button
                  onClick={() => setCurrency("SOL")}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    currency === "SOL" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  S/.
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    currency === "USD" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  $
                </button>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="space-y-2 mb-4 pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{customerName}</p>
                  <p className="text-xs text-muted-foreground">DNI: {dni}</p>
                </div>

                <div className="space-y-2">
                  {boletItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId)
                    const itemPrice = currency === "USD" ? solToDolar(product.price) : product.price
                    const itemTotal = itemPrice * item.quantity
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {product.name} x{item.quantity}
                        </span>
                        <span className="font-medium">{formatCurrency(itemTotal, currency)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalInCurrency, currency)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setStep("items")} variant="outline" className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  className="flex-1 bg-gradient-to-r from-secondary to-orange-500 hover:shadow-lg"
                >
                  Descargar Boleta
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}