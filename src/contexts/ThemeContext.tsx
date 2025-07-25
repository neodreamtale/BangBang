'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')

    // 初始化主题
    useEffect(() => {
        // 简单直接的初始化
        const savedTheme = localStorage.getItem('theme') as Theme
        const initialTheme = savedTheme === 'dark' ? 'dark' : 'light'

        setTheme(initialTheme)
        document.documentElement.className = initialTheme

        console.log('Theme initialized:', initialTheme)
    }, [])

    // 应用主题变化
    useEffect(() => {
        document.documentElement.className = theme
        localStorage.setItem('theme', theme)
        console.log('Theme applied:', theme, 'HTML class:', document.documentElement.className)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        console.log('Toggling theme from', theme, 'to', newTheme)
        setTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}