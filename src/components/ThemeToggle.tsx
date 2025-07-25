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
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
            {theme === 'light' ? (<Sun size={20} className="text-yellow-500" />) : (<Moon size={20} className="text-blue-400" />)}
        </button>
    )
}
