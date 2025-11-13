"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx"
import { ProductForm } from "./product-form.jsx"
import { ProductList } from "./product-list"
import { BoletModal } from "./bolet-modal"

export function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([])
  const [showBoletModal, setShowBoletModal] = useState(false)

  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 animate-fade-in">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard ProBill
            </h1>
            <p className="text-muted-foreground mt-2">
              Bienvenido, {user.name} (DNI: {user.dni})
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors bg-transparent"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Formulario y botón */}
        <div className="lg:col-span-1 space-y-4 animate-slide-in-left">
          <ProductForm onAddProduct={handleAddProduct} />

          <Button
            onClick={() => setShowBoletModal(true)}
            className="w-full h-12 text-lg bg-gradient-to-r from-secondary to-orange-500 hover:shadow-lg hover:shadow-secondary/50 transition-all duration-300"
          >
            🧾 Boletear
          </Button>
        </div>

        {/* Lista de productos */}
        <div className="lg:col-span-2 animate-slide-in-right">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Mis Productos ({products.length})</CardTitle>
              <CardDescription>Gestiona tu catálogo de productos</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No hay productos registrados</p>
                  <p className="text-xs text-muted-foreground mt-2">Agrega tu primer producto en el formulario</p>
                </div>
              ) : (
                <ProductList products={products} onDelete={handleDeleteProduct} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de boleteo */}
      {showBoletModal && <BoletModal products={products} onClose={() => setShowBoletModal(false)} />}
    </div>
  )
}