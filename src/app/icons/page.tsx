import { 
  // 反馈相关
  MessageSquare, MessageCircle, Mail, Send, 
  // 分类相关
  Bug, Lightbulb, Zap, AlertCircle, 
  // 优先级相关
  AlertTriangle, Info, CheckCircle, XCircle,
  // 文件相关
  Paperclip, Upload, Download, File,
  // 用户相关
  User, Users, UserCheck, Settings,
  // 界面相关
  Menu, X, ChevronDown, Plus, Search,
  // 状态相关
  Clock, Check, Eye, Heart
} from 'lucide-react';

export default function IconsDemo() {
  const iconSections = [
    {
      title: '反馈相关图标',
      icons: [
        { component: MessageSquare, name: 'MessageSquare', desc: '意见反馈' },
        { component: MessageCircle, name: 'MessageCircle', desc: '消息对话' },
        { component: Mail, name: 'Mail', desc: '邮件反馈' },
        { component: Send, name: 'Send', desc: '发送' },
      ]
    },
    {
      title: '问题分类图标',
      icons: [
        { component: Bug, name: 'Bug', desc: 'Bug反馈' },
        { component: Lightbulb, name: 'Lightbulb', desc: '功能建议' },
        { component: Zap, name: 'Zap', desc: '改进建议' },
        { component: AlertCircle, name: 'AlertCircle', desc: '其他问题' },
      ]
    },
    {
      title: '优先级图标',
      icons: [
        { component: AlertTriangle, name: 'AlertTriangle', desc: '高优先级' },
        { component: Info, name: 'Info', desc: '中等优先级' },
        { component: CheckCircle, name: 'CheckCircle', desc: '低优先级' },
        { component: XCircle, name: 'XCircle', desc: '已解决' },
      ]
    },
    {
      title: '文件操作图标',
      icons: [
        { component: Paperclip, name: 'Paperclip', desc: '附件' },
        { component: Upload, name: 'Upload', desc: '上传' },
        { component: Download, name: 'Download', desc: '下载' },
        { component: File, name: 'File', desc: '文件' },
      ]
    },
    {
      title: '界面操作图标',
      icons: [
        { component: Menu, name: 'Menu', desc: '菜单' },
        { component: X, name: 'X', desc: '关闭' },
        { component: ChevronDown, name: 'ChevronDown', desc: '下拉' },
        { component: Plus, name: 'Plus', desc: '添加' },
        { component: Search, name: 'Search', desc: '搜索' },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        意见反馈系统 - 图标库展示
      </h1>
      
      {iconSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
            {section.title}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {section.icons.map((icon, iconIndex) => {
              const IconComponent = icon.component;
              return (
                <div 
                  key={iconIndex}
                  className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg mb-3">
                    <IconComponent size={32} className="text-blue-600" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1">
                    {icon.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {icon.desc}
                  </p>
                  
                  {/* 使用示例代码 */}
                  <div className="mt-3 text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    &lt;{icon.name} /&gt;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* 使用说明 */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎯 使用方法</h3>
        <div className="space-y-2 text-sm">
          <p><strong>1. 导入图标：</strong></p>
          <code className="block bg-white p-2 rounded text-xs">
            import &#123; MessageSquare, Bug, Send &#125; from 'lucide-react';
          </code>
          
          <p><strong>2. 使用图标：</strong></p>
          <code className="block bg-white p-2 rounded text-xs">
            &lt;MessageSquare size=&#123;24&#125; className="text-blue-600" /&gt;
          </code>
          
          <p><strong>3. 常用属性：</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>size</code>: 图标大小 (16, 24, 32 等)</li>
            <li><code>className</code>: CSS 类名，可以设置颜色等</li>
            <li><code>strokeWidth</code>: 线条粗细 (1-3)</li>
          </ul>
        </div>
      </div>
      
      {/* 颜色示例 */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎨 颜色示例</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Bug className="text-red-500" size={24} />
            <span className="text-sm">text-red-500 (错误)</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={24} />
            <span className="text-sm">text-yellow-500 (建议)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            <span className="text-sm">text-green-500 (成功)</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="text-blue-500" size={24} />
            <span className="text-sm">text-blue-500 (信息)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
