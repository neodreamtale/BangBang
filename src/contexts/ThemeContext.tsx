'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    // 初始化主题
    useEffect(() => {
        // 检查保存的主题偏好
        const savedTheme = localStorage.getItem('theme') as Theme | null
        const initialTheme = savedTheme || 'light'

        setTheme(initialTheme)
        setMounted(true)

        // Tailwind标准：添加或移除dark类
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        console.log('Theme initialized:', initialTheme)
    }, [])

    // 应用主题变化
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        console.log('Toggling theme from', theme, 'to', newTheme)
        setTheme(newTheme)
    }

    return (<ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
        {children}
    </ThemeContext.Provider>)
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}