"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { LogOut, Menu, X, Trophy } from "lucide-react"
import "./Header.css"

export default function Header({ onLoginClick }) {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for header appearance change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    setError("")
    try {
      await logout()
      setMobileMenuOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLoginButtonClick = () => {
    if (onLoginClick) {
      onLoginClick()
      setMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const displayName = currentUser?.displayName || currentUser?.email || "User"

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Left: Logo */}
        <div className="left-slot">
          <Link to="/" aria-label="Go to home" className="logo-container">
            <img src="/logo.svg" alt="MatchUp logo" className="logo" />
          </Link>
        </div>

        {/* Center: Welcome - Only visible on desktop */}
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
          <div className="desktop-actions">
            {currentUser && (
              <Link to="/leaderboard" className="leaderboard-link">
                <Trophy className="leaderboard-icon" />
                <span>Leaderboard</span>
              </Link>
            )}
            {currentUser ? (
              <button onClick={handleLogout} className="logout-button">
                <LogOut className="logout-icon" />
                <span>Logout</span>
              </button>
            ) : (
              <button onClick={handleLoginButtonClick} className="login-button">
                Login / Signup
              </button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Visibility controlled by CSS class */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <div className="mobile-menu-content">
          {currentUser && (
            <div className="mobile-user-info">
              <span className="mobile-welcome">Welcome,</span>
              <span className="mobile-username">{displayName}</span>
            </div>
          )}

          {currentUser ? (
            <button onClick={handleLogout} className="mobile-logout-button">
              <LogOut className="logout-icon" />
              <span>Logout</span>
            </button>
          ) : (
            <button onClick={handleLoginButtonClick} className="mobile-login-button">
              Login / Signup
            </button>
          )}

          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/leaderboard" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Trophy className="mobile-nav-icon" />
              <span>Leaderboard</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {error && <div className="error-message">{error}</div>}
    </header>
  )
}