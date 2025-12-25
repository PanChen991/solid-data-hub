import { useState } from 'react';
import { 
  Folder, 
  FileText, 
  FileSpreadsheet, 
  FileType, 
  ChevronRight, 
  ChevronLeft,
  Lock,
  Globe,
  Building2,
  Users,
  Clock,
  User,
  HardDrive
} from 'lucide-react';
import { rootSpaces, FolderItem } from '@/data/mockData';
import { cn } from '@/lib/utils';

const getFileIcon = (type: string, isLocked?: boolean) => {
  if (type === 'folder') {
    if (isLocked) {
      return { icon: Lock, bgColor: 'bg-red-50', iconColor: 'text-red-500' };
    }
    return { icon: Folder, bgColor: 'bg-amber-50', iconColor: 'text-amber-500' };
  }
  switch (type) {
    case 'pdf':
      return { icon: FileText, bgColor: 'bg-red-50', iconColor: 'text-red-500' };
    case 'xlsx':
      return { icon: FileSpreadsheet, bgColor: 'bg-green-50', iconColor: 'text-green-600' };
    case 'docx':
      return { icon: FileType, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' };
    case 'pptx':
      return { icon: FileText, bgColor: 'bg-orange-50', iconColor: 'text-orange-500' };
    default:
      return { icon: FileText, bgColor: 'bg-muted', iconColor: 'text-muted-foreground' };
  }
};

const getRootIcon = (id: string) => {
  switch (id) {
    case 'public':
      return Globe;
    case 'departments':
      return Building2;
    case 'projects':
      return Users;
    default:
      return Folder;
  }
};

const getBadgeColor = (color?: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-700';
    case 'amber':
      return 'bg-amber-100 text-amber-700';
    case 'green':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface BreadcrumbItem {
  id: string;
  name: string;
}

export function Documents() {
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [currentItems, setCurrentItems] = useState<FolderItem[]>(rootSpaces);

  const navigateToFolder = (item: FolderItem) => {
    if (item.type !== 'folder' || item.isLocked) return;
    
    if (item.children && item.children.length > 0) {
      setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
      setCurrentItems(item.children);
    }
  };

  const navigateBack = () => {
    if (currentPath.length === 0) return;
    
    const newPath = currentPath.slice(0, -1);
    setCurrentPath(newPath);
    
    // Navigate back through the tree
    let items = rootSpaces;
    for (const crumb of newPath) {
      const folder = items.find(i => i.id === crumb.id);
      if (folder?.children) {
        items = folder.children;
      }
    }
    setCurrentItems(items);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
      setCurrentItems(rootSpaces);
      return;
    }
    
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    let items = rootSpaces;
    for (const crumb of newPath) {
      const folder = items.find(i => i.id === crumb.id);
      if (folder?.children) {
        items = folder.children;
      }
    }
    setCurrentItems(items);
  };

  const isRootLevel = currentPath.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">内部文档</h1>
        <p className="text-muted-foreground mt-1 text-sm">三层空间体系 · 分级权限管理</p>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        {currentPath.length > 0 && (
          <button
            onClick={navigateBack}
            className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => navigateToBreadcrumb(-1)}
            className={cn(
              'px-2 py-1 rounded-md transition-colors',
              isRootLevel 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            根目录
          </button>
          
          {currentPath.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              <button
                onClick={() => navigateToBreadcrumb(index)}
                className={cn(
                  'px-2 py-1 rounded-md transition-colors max-w-[200px] truncate',
                  index === currentPath.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className={cn(
        'grid gap-3',
        isRootLevel ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      )}>
        {currentItems.map((item) => {
          const isFolder = item.type === 'folder';
          const isRoot = isRootLevel;
          const { icon: Icon, bgColor, iconColor } = getFileIcon(item.type, item.isLocked);
          const RootIcon = isRoot ? getRootIcon(item.id) : Icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigateToFolder(item)}
              disabled={item.isLocked}
              className={cn(
                'group text-left transition-all duration-200',
                isRoot 
                  ? 'bg-card rounded-2xl p-6 border border-border/40 shadow-sm hover:shadow-md hover:border-border/60 hover:scale-[1.01]'
                  : 'bg-card rounded-xl p-4 border border-border/30 hover:bg-accent/30 hover:border-border/50',
                item.isLocked && 'opacity-60 cursor-not-allowed'
              )}
            >
              {isRoot ? (
                // Root level cards - larger style
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      item.id === 'public' && 'bg-blue-100',
                      item.id === 'departments' && 'bg-amber-100',
                      item.id === 'projects' && 'bg-green-100'
                    )}>
                      <RootIcon className={cn(
                        'w-6 h-6',
                        item.id === 'public' && 'text-blue-600',
                        item.id === 'departments' && 'text-amber-600',
                        item.id === 'projects' && 'text-green-600'
                      )} />
                    </div>
                    {item.badge && (
                      <span className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        getBadgeColor(item.badgeColor)
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.children?.length || 0} 个子文件夹
                    </p>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ) : (
                // Nested level - compact style
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    bgColor
                  )}>
                    <Icon className={cn('w-5 h-5', iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'text-sm font-medium text-foreground truncate',
                      isFolder && !item.isLocked && 'group-hover:text-primary'
                    )}>
                      {item.name}
                    </h3>
                    {item.isLocked ? (
                      <p className="text-xs text-red-500 mt-0.5">需要管理员权限</p>
                    ) : isFolder ? (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.children?.length || 0} 个项目
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        {item.size && (
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {item.size}
                          </span>
                        )}
                        {item.updatedAgo && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.updatedAgo}
                          </span>
                        )}
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.author}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent/50 mx-auto flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">此文件夹为空</p>
        </div>
      )}
    </div>
  );
}
