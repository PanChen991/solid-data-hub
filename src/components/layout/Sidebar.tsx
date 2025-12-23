import { Home, FileText, Globe, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '概览', icon: Home },
  { id: 'documents', label: '内部文档', icon: FileText },
  { id: 'intelligence', label: '外部情报', icon: Globe },
  { id: 'assistant', label: 'AI 助手', icon: Bot },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/75 backdrop-blur-xl border-r border-border/50 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-apple">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">SSB-KMS</h1>
            <p className="text-xs text-muted-foreground">固态研发</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-apple'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">研</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">研发团队</p>
            <p className="text-xs text-muted-foreground">固态电池实验室</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
