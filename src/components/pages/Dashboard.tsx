import { FileText, Globe, Bot, TrendingUp, Clock, ArrowUpRight, Zap } from 'lucide-react';
import { documents, intelligences, activities } from '@/data/mockData';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: '内部文档',
    value: documents.length.toString(),
    change: '+2',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: '论文收录',
    value: intelligences.filter(i => i.type === 'paper').length.toString(),
    change: '+5',
    icon: Globe,
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: '专利追踪',
    value: intelligences.filter(i => i.type === 'patent').length.toString(),
    change: '+3',
    icon: TrendingUp,
    color: 'from-orange-500 to-orange-600',
  },
  {
    label: 'AI 对话',
    value: '128',
    change: '+24',
    icon: Bot,
    color: 'from-green-500 to-green-600',
  },
];

const quickActions = [
  { label: '上传文档', icon: FileText },
  { label: '检索论文', icon: Globe },
  { label: '专利分析', icon: TrendingUp },
  { label: 'AI 问答', icon: Bot },
];

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">欢迎回来</h1>
        <p className="text-muted-foreground mt-1">固态电池知识管理系统 · 研发效率提升平台</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 border border-border/50"
            >
              <div className="flex items-start justify-between">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-apple border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              最近动态
            </h2>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  activity.type === 'document' && 'bg-blue-100 text-blue-600',
                  activity.type === 'intelligence' && 'bg-purple-100 text-purple-600',
                  activity.type === 'ai' && 'bg-green-100 text-green-600',
                )}>
                  {activity.type === 'document' && <FileText className="w-5 h-5" />}
                  {activity.type === 'intelligence' && <Globe className="w-5 h-5" />}
                  {activity.type === 'ai' && <Bot className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.action}</span>
                    {' '}
                    <span className="text-muted-foreground">·</span>
                    {' '}
                    <span className="truncate">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 shadow-apple border border-border/50">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-muted-foreground" />
            快速入口
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const pageMap: Record<string, string> = {
                '上传文档': 'documents',
                '检索论文': 'intelligence',
                '专利分析': 'intelligence',
                'AI 问答': 'assistant',
              };
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate(pageMap[action.label])}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-accent/50 hover:bg-accent text-left transition-all duration-200 hover:scale-[1.02] group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-card shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
