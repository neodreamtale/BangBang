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
        // 检查保存的主题偏好
        const savedTheme = localStorage.getItem('theme') as Theme | null
        const initialTheme = savedTheme || 'light'

        setTheme(initialTheme)

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
        // Tailwind标准：根据主题添加或移除dark类
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        localStorage.setItem('theme', theme)
        console.log('Theme applied:', theme, 'Has dark class:', document.documentElement.classList.contains('dark'))
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        console.log('Toggling theme from', theme, 'to', newTheme)
        setTheme(newTheme)
    }

    return (<ThemeContext.Provider value={{ theme, toggleTheme }}>
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