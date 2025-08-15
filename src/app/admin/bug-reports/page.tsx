import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const bugReports = await prisma.bugReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      crashLogs: true,
    },
  })
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bug 反馈管理</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">崩溃日志</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bugReports.map(report => {
              return (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{report.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.userId || 'Anonymous'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.priority === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : report.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : report.priority === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {report.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.crashLogs && report.crashLogs.length > 0 ? (
                      <span className="text-green-600">有</span>
                    ) : (
                      <span className="text-gray-400">无</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleString('zh-CN')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {bugReports.length === 0 && <div className="text-center py-8 text-gray-500">暂无 Bug 反馈记录</div>}
    </div>
  )
}
