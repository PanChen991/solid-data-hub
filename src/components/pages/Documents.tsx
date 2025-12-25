import { useState, useMemo, useCallback } from 'react';
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
  HardDrive,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  Upload,
  Download,
  Pencil,
  Trash2,
  FolderPlus,
  Eye,
  Check
} from 'lucide-react';
import { rootSpaces, FolderItem } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UploadDialog } from '@/components/documents/UploadDialog';
import { NewFolderDialog, ParentPermission } from '@/components/documents/NewFolderDialog';
import { FilePreviewDialog } from '@/components/documents/FilePreviewDialog';
import { SearchBar, SearchFilters } from '@/components/documents/SearchBar';
import { BatchActions } from '@/components/documents/BatchActions';
import { MoveDialog } from '@/components/documents/MoveDialog';
import { toast } from 'sonner';

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

// Get parent permission based on current path
const getParentPermission = (path: BreadcrumbItem[]): ParentPermission | undefined => {
  if (path.length === 0) {
    return undefined; // Root level - no parent
  }
  
  // Determine permission based on root space
  const rootId = path[0]?.id;
  switch (rootId) {
    case 'public':
      return { type: 'all', label: '全员可见', description: '所有人可访问' };
    case 'departments':
      return { type: 'department', label: '部门可见', description: '本部门成员可访问' };
    case 'projects':
      return { type: 'project', label: '项目组可见', description: '项目成员可访问' };
    default:
      return { type: 'inherit', label: '继承上级', description: '与上级目录权限一致' };
  }
};

interface BreadcrumbItem {
  id: string;
  name: string;
}

type ViewMode = 'grid' | 'list';

export function Documents() {
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [currentItems, setCurrentItems] = useState<FolderItem[]>(rootSpaces);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FolderItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchActive, setSearchActive] = useState(false);
  const [filteredItems, setFilteredItems] = useState<FolderItem[] | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  const isRootLevel = currentPath.length === 0;
  const isLevel2 = currentPath.length === 1;
  const isLevel3 = currentPath.length >= 2;
  
  const displayItems = filteredItems ?? currentItems;
  const parentPermission = getParentPermission(currentPath);
  
  // Check if current folder contains files (not just folders)
  const hasFiles = useMemo(() => {
    return displayItems.some(item => item.type !== 'folder');
  }, [displayItems]);

  // Auto-switch view mode based on level
  const effectiveViewMode = useMemo(() => {
    if (isRootLevel || isLevel2) return 'grid';
    if (isLevel3 && hasFiles) return viewMode;
    return 'grid';
  }, [isRootLevel, isLevel2, isLevel3, hasFiles, viewMode]);

  const navigateToFolder = (item: FolderItem) => {
    if (item.type !== 'folder' || item.isLocked) return;
    
    if (item.children && item.children.length > 0) {
      setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
      setCurrentItems(item.children);
      // Auto-switch to list view when entering Level 3 with files
      if (currentPath.length >= 1) {
        const hasFilesInChildren = item.children.some(child => child.type !== 'folder');
        if (hasFilesInChildren) {
          setViewMode('list');
        }
      }
    }
  };

  const navigateBack = () => {
    if (currentPath.length === 0) return;
    
    const newPath = currentPath.slice(0, -1);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Open upload dialog with dropped files
    setUploadDialogOpen(true);
  };

  const handleCreateFolder = (name: string, permission: string) => {
    console.log('Creating folder:', name, 'with permission:', permission);
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      children: [],
    };
    setCurrentItems(prev => [newFolder, ...prev]);
    toast.success(`文件夹 "${name}" 创建成功`);
  };

  const handleSearch = useCallback((filters: SearchFilters) => {
    if (!filters.query && filters.types.length === 0 && filters.authors.length === 0) {
      setFilteredItems(null);
      setSearchActive(false);
      return;
    }
    
    setSearchActive(true);
    const filtered = currentItems.filter(item => {
      const matchesQuery = !filters.query || item.name.toLowerCase().includes(filters.query.toLowerCase());
      const matchesType = filters.types.length === 0 || filters.types.includes(item.type);
      const matchesAuthor = filters.authors.length === 0 || (item.author && filters.authors.includes(item.author));
      return matchesQuery && matchesType && matchesAuthor;
    });
    setFilteredItems(filtered);
  }, [currentItems]);

  const handleClearSearch = () => {
    setFilteredItems(null);
    setSearchActive(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchDownload = () => {
    toast.success(`正在下载 ${selectedItems.size} 个文件...`);
    setSelectedItems(new Set());
  };

  const handleBatchDelete = () => {
    toast.success(`已删除 ${selectedItems.size} 个项目`);
    setSelectedItems(new Set());
  };

  const handleBatchMove = (targetPath: string) => {
    toast.success(`已移动 ${selectedItems.size} 个项目`);
    setSelectedItems(new Set());
  };

  const handlePreviewFile = (item: FolderItem) => {
    if (item.type !== 'folder') {
      setPreviewFile(item);
      setPreviewOpen(true);
    }
  };

  const currentPathString = currentPath.map(p => p.name).join(' / ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">内部文档</h1>
        <p className="text-muted-foreground mt-1 text-sm">三层空间体系 · 分级权限管理</p>
      </div>

      {/* Search Bar - only show at Level 3 */}
      {isLevel3 && (
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isActive={searchActive} />
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 bg-card/60 backdrop-blur-xl rounded-xl px-4 py-3 border border-border/40">
        {/* Left: Back button + Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {currentPath.length > 0 && (
            <button
              onClick={navigateBack}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          <div className="flex items-center gap-1 text-sm min-w-0">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className={cn(
                'px-2 py-1 rounded-md transition-colors flex-shrink-0',
                isRootLevel 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              根目录
            </button>
            
            {currentPath.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={cn(
                    'px-2 py-1 rounded-md transition-colors max-w-[180px] truncate',
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isLevel3 && hasFiles && (
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-all duration-200',
                  viewMode === 'grid' 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-all duration-200',
                  viewMode === 'list' 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          <Button variant="outline" onClick={() => setNewFolderDialogOpen(true)} className="rounded-full px-4 gap-2">
            <FolderPlus className="w-4 h-4" />
            新建文件夹
          </Button>

          <Button onClick={() => setUploadDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            上传文件
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} currentPath={currentPathString} parentPermission={parentPermission} />
      <NewFolderDialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen} currentPath={currentPathString} onCreate={handleCreateFolder} parentPermission={parentPermission} />
      <FilePreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} file={previewFile} />
      <MoveDialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen} selectedCount={selectedItems.size} onMove={handleBatchMove} />
      <BatchActions selectedCount={selectedItems.size} onDownload={handleBatchDownload} onMove={() => setMoveDialogOpen(true)} onDelete={handleBatchDelete} onClear={() => setSelectedItems(new Set())} />

      {/* Content Area */}
      {currentItems.length === 0 ? (
        /* Empty State with Drag & Drop Zone */
        <div 
          className={cn(
            'flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl transition-all duration-200',
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border/60 hover:border-border'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors',
            isDragOver ? 'bg-primary/10' : 'bg-accent/50'
          )}>
            <Upload className={cn(
              'w-8 h-8 transition-colors',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <p className="text-foreground font-medium mb-1">拖拽文件至此</p>
          <p className="text-muted-foreground text-sm">或 点击上传</p>
        </div>
      ) : effectiveViewMode === 'list' && isLevel3 ? (
        /* List View - Table Style */
        <div 
          className={cn(
            'bg-card/60 backdrop-blur-xl rounded-xl border border-border/40 overflow-hidden',
            isDragOver && 'ring-2 ring-primary ring-offset-2'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_140px_80px_100px_48px] gap-4 px-4 py-3 border-b border-border/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>名称</div>
            <div>修改日期</div>
            <div>大小</div>
            <div>上传者</div>
            <div className="text-center">操作</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border/20">
            {currentItems.map((item) => {
              const { icon: Icon, bgColor, iconColor } = getFileIcon(item.type, item.isLocked);
              const isFolder = item.type === 'folder';
              
              return (
                <div 
                  key={item.id}
                  onClick={() => navigateToFolder(item)}
                  className={cn(
                    'grid grid-cols-[1fr_140px_80px_100px_48px] gap-4 px-4 py-3 items-center transition-colors',
                    isFolder && !item.isLocked && 'cursor-pointer',
                    'hover:bg-accent/30',
                    item.isLocked && 'opacity-60'
                  )}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      bgColor
                    )}>
                      <Icon className={cn('w-4 h-4', iconColor)} />
                    </div>
                    <span className={cn(
                      'text-sm font-medium text-foreground truncate',
                      isFolder && !item.isLocked && 'hover:text-primary'
                    )}>
                      {item.name}
                    </span>
                    {item.isLocked && (
                      <span className="text-xs text-red-500 flex-shrink-0">需要权限</span>
                    )}
                  </div>
                  
                  {/* Date Modified */}
                  <div className="text-sm text-muted-foreground">
                    {item.updatedAgo || '-'}
                  </div>
                  
                  {/* Size */}
                  <div className="text-sm text-muted-foreground">
                    {item.size || '-'}
                  </div>
                  
                  {/* Author */}
                  <div className="text-sm text-muted-foreground truncate">
                    {item.author || '-'}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Download className="w-4 h-4" />
                          下载
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Pencil className="w-4 h-4" />
                          重命名
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div 
          className={cn(
            'grid gap-3',
            isRootLevel ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
            isDragOver && isLevel3 && 'ring-2 ring-primary ring-offset-4 rounded-2xl'
          )}
          onDragOver={isLevel3 ? handleDragOver : undefined}
          onDragLeave={isLevel3 ? handleDragLeave : undefined}
          onDrop={isLevel3 ? handleDrop : undefined}
        >
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
      )}
    </div>
  );
}
