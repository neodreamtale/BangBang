'use client'

import Link from "next/link";
import { Hammer, Bug, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme, mounted } = useTheme();

  return (
    <div>
      {/* 主题切换按钮 - 去掉所有样式 */}
      <div>
        <ThemeToggle />
        <span>
          {mounted ? theme : 'light'}
        </span>
      </div>

      <main>
        <div>
          <Hammer size={48} />
          <h1>意见反馈33</h1>
        </div>

        <p>
          帮助我们改进产品体验，您的每一个反馈都很重要
        </p>

        <div>
          <Link href="/feedback/bug">
            <Bug size={32} />
            <h3>Bug反馈</h3>
            <p>报告程序错误和问题</p>
          </Link>

          <Link href="/feedback/suggestion">
            <AlertCircle size={32} />
            <h3>改进建议</h3>
            <p>优化现有功能体验</p>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <Link href="/icons">
            查看图标库
          </Link>
        )}
      </main>

      <footer>
        <span>© 2025 意见反馈系统</span>
        <span>·</span>
        <span>帮助改进产品体验</span>
      </footer>
    </div>
  );
}
