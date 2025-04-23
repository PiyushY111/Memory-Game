"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { LogOut, Menu, X } from "lucide-react"
import "./Header.css"

export default function Header({ onLoginClick }) {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    setError("")
    try {
      await logout()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLoginButtonClick = () => {
    if (onLoginClick) onLoginClick()
  }

  const displayName = currentUser?.displayName || currentUser?.email || "User"

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Logo */}
        <div className="left-slot">
          <Link to="/" aria-label="Go to home" className="logo-container">
            <img src="/logo.svg" alt="MatchUp logo" className="logo" />
          </Link>
        </div>

        {/* Center: Welcome */}
        <div className="center-slot">
          {currentUser && (
            <div className="user-info">
              <span className="welcome-text">Welcome, </span>
              <span className="user-name">{displayName}</span>
            </div>
          )}
        </div>

        {/* Right: Logout/Login */}
        <div className="right-slot">
          {currentUser ? (
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="logout-icon" />
              Logout
            </button>
          ) : (
            <button onClick={handleLoginButtonClick} className="login-button">
              Login / Signup
            </button>
          )}

          <div className="mobile-menu-button">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {currentUser ? (
            <div className="mobile-user-info">
              <div className="welcome-text">Welcome, {displayName}</div>
              <button onClick={handleLogout} className="mobile-logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLoginButtonClick} className="mobile-login-button">
              Login / Signup
            </button>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </header>
  )
}
