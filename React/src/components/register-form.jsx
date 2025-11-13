"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx"
import { searchDniReniec } from "../lib/reniec-api"

export function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loadingDni, setLoadingDni] = useState(false)
  const [name, setName] = useState("")

  const handleSearchDni = async () => {
    setError("")
    if (!dni || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos")
      return
    }

    setLoadingDni(true)
    try {
      let dniName = await searchDniReniec(dni)

      if (dniName) {
        setName(dniName)
      } else {
        setError("DNI no encontrado. Intenta con otro")
      }
    } catch (err) {
      setError("Error al consultar el DNI")
      console.log("[v0] Search DNI error:", err)
    } finally {
      setLoadingDni(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!dni || !password || !confirmPassword || !name) {
      setError("Por favor completa todos los campos")
      return
    }

    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.find((u) => u.dni === dni)) {
      setError("Este DNI ya está registrado")
      return
    }

    users.push({ dni, password, name })
    localStorage.setItem("users", JSON.stringify(users))

    onRegister(dni, name)
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
        <CardDescription>Crea tu cuenta para comenzar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">DNI</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.replace(/\D/g, "").slice(0, 8))
                  setError("")
                }}
                placeholder="12345678"
                maxLength={8}
                className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Button
                type="button"
                onClick={handleSearchDni}
                disabled={loadingDni || dni.length !== 8}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {loadingDni ? "..." : "Buscar"}
              </Button>
            </div>
          </div>

          {name && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-slide-in-left">
              <p className="text-sm text-muted-foreground">Tu nombre</p>
              <p className="font-semibold text-primary">{name}</p>
            </div>
          )}

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
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={!name}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
          >
            Registrarse
          </Button>
        </form>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">¿Ya tienes cuenta?</p>
          <Button
            type="button"
            variant="outline"
            className="w-full hover:bg-primary/5 bg-transparent"
            onClick={onSwitchToLogin}
          >
            Iniciar Sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}