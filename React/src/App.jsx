import { useState, useEffect } from "react"
import { LoginForm } from "./components/login-form"
import { RegisterForm } from "./components/register-form"
import { Dashboard } from "./components/dashboard"

function App() {
  const [authState, setAuthState] = useState("login")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setAuthState("dashboard")
    }
  }, [])

  const handleLogin = (dni, name) => {
    const userData = { dni, name }
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setAuthState("dashboard")
  }

  const handleRegister = (dni, name) => {
    const userData = { dni, name }
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setAuthState("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("products")
    setUser(null)
    setAuthState("login")
  }

  if (authState === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex items-center justify-center min-h-screen p-4">
        {authState === "login" ? (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setAuthState("register")} />
        ) : (
          <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setAuthState("login")} />
        )}
      </div>
    </main>
  )
}

export default App