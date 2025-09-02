import { Suspense } from 'react'
import CrashLogsClient from './CrashLogsClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <CrashLogsClient />
    </Suspense>
  )
}

