import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminSuggestionPage() {
  const suggestionReports = await prisma.suggestionReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">建议反馈管理</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期望</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报告ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suggestionReports.map(report => (
              <tr key={report.id}>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{report.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{report.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900 min-w-[8rem] max-w-[22rem]">
                  <div className="break-all line-clamp-6">{report.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 min-w-[8rem] max-w-[22rem]">
                  <div className="break-all line-clamp-6">{report.expected}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{report.contact || '无'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(report.createdAt).toLocaleString('zh-CN')}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{report.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {suggestionReports.length === 0 && <div className="text-center py-8 text-gray-500">暂无建议反馈记录</div>}
    </div>
  )
}
