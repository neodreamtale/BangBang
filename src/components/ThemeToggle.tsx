'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const handleClick = () => {
    console.log('Button clicked! Current theme:', theme)
    toggleTheme()
  }

  return (
    <button
      onClick={handleClick}
      className="theme-toggle"
      aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}
    >
      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
      <span className="theme-indicator">{theme}</span>
    </button>
  )
}
