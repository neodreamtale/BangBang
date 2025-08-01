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
        <button onClick={handleClick}>
            {theme === 'light' ? (<Sun size={20} />) : (<Moon size={20} />)}
        </button>
    )
}
