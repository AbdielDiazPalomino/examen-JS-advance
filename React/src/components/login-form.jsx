"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx"
import { searchDniReniec } from "../lib/reniec-api"

export function LoginForm({ onLogin, onSwitchToRegister }) {
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!dni || !password) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos")
      setLoading(false)
      return
    }

    try {
      // Buscar nombre desde API RENIEC o mock
      let customerName = await searchDniReniec(dni)

      if (!customerName) {
        setError("DNI no encontrado en la base de datos")
        setLoading(false)
        return
      }

      // Verificar contraseña contra usuarios registrados
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u) => u.dni === dni && u.password === password)

      if (!user) {
        setError("DNI o contraseña incorrectos")
        setLoading(false)
        return
      }

      onLogin(dni, customerName)
    } catch (err) {
      setError("Error al procesar la solicitud")
      console.log("[v0] Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/20 animate-scale-in">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <CardTitle className="text-2xl">ProBill</CardTitle>
        </div>
        <CardDescription>Inicia sesión en tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">DNI</label>
            <input
              type="text"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value.replace(/\D/g, "").slice(0, 8))
                setError("")
              }}
              placeholder="12345678"
              maxLength={8}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
          >
            {loading ? "Validando..." : "Iniciar Sesión"}
          </Button>
        </form>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">¿No tienes cuenta?</p>
          <Button
            type="button"
            variant="outline"
            className="w-full hover:bg-primary/5 bg-transparent"
            onClick={onSwitchToRegister}
          >
            Crear Cuenta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}