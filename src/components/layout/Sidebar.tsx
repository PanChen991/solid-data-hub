import { Home, FolderOpen, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import gotionLogo from '@/assets/gotion-logo.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '概览', icon: Home },
  { id: 'documents', label: '内部文档', icon: FolderOpen },
  { id: 'intelligence', label: '外部情报', icon: Globe },
  { id: 'assistant', label: 'AI 助手', icon: Sparkles },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-xl border-r border-border/30 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border/30">
        <div className="flex flex-col items-center gap-2">
          <img src={gotionLogo} alt="国轩高科" className="h-12 w-auto" />
          <h1 className="text-sm font-semibold text-foreground tracking-tight text-center">固态电池知识库管理平台</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className={cn('w-[18px] h-[18px]', isActive && 'text-primary')} />
              <span className="text-sm">{item.label}</span>
              {item.id === 'documents' && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-border/30">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-white">李</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Dr. Li</p>
            <p className="text-xs text-muted-foreground truncate">电解质部</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
