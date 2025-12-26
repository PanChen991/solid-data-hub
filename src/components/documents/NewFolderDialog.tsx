import { useState, useEffect, useMemo } from 'react';
import { Folder, Lock, Users, Building2, Globe, Info, UserPlus, X, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { organizationStaff, departments, StaffMember } from '@/data/mockData';

export interface ParentPermission {
  type: 'all' | 'department' | 'project' | 'private' | 'inherit';
  label: string;
  description: string;
}

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  onCreate: (name: string, permission: string, adminIds?: string[]) => void;
  parentPermission?: ParentPermission;
  isFirstLevel?: boolean; // Whether we're creating a first-level folder (project/department)
  spaceType?: 'projects' | 'departments' | 'public'; // Type of space we're in
}

const permissionOptions = [
  { value: 'inherit', label: '继承父文件夹', icon: Folder, description: '与上级目录权限一致' },
  { value: 'private', label: '仅自己可见', icon: Lock, description: '仅创建者可访问' },
  { value: 'department', label: '部门可见', icon: Building2, description: '本部门成员可访问' },
  { value: 'project', label: '项目组可见', icon: Users, description: '项目成员可访问' },
  { value: 'all', label: '全员可见', icon: Globe, description: '所有人可访问' },
];

const getPermissionIcon = (type: string) => {
  switch (type) {
    case 'private': return Lock;
    case 'department': return Building2;
    case 'project': return Users;
    case 'all': return Globe;
    default: return Folder;
  }
};

const getPermissionColor = (type: string) => {
  switch (type) {
    case 'private': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' };
    case 'department': return { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' };
    case 'project': return { bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-200' };
    case 'all': return { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' };
    default: return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
  }
};

export function NewFolderDialog({ 
  open, 
  onOpenChange, 
  currentPath, 
  onCreate, 
  parentPermission,
  isFirstLevel = false,
  spaceType
}: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [permission, setPermission] = useState('inherit');
  const [error, setError] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminPopoverOpen, setAdminPopoverOpen] = useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  // Show admin selection for first-level folders in project or department spaces
  const showAdminSelection = isFirstLevel && (spaceType === 'projects' || spaceType === 'departments');

  // Filter available staff
  const filteredStaff = useMemo(() => {
    return organizationStaff.filter(staff => {
      const notSelected = !selectedAdmins.includes(staff.id);
      const matchesSearch = 
        staff.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(adminSearchQuery.toLowerCase());
      return notSelected && matchesSearch;
    });
  }, [selectedAdmins, adminSearchQuery]);

  // Get selected admin details
  const selectedAdminDetails = useMemo(() => {
    return organizationStaff.filter(staff => selectedAdmins.includes(staff.id));
  }, [selectedAdmins]);

  // Group staff by department
  const staffByDepartment = useMemo(() => {
    const grouped: Record<string, StaffMember[]> = {};
    departments.forEach(dept => {
      const deptStaff = filteredStaff.filter(s => s.department === dept.name);
      if (deptStaff.length > 0) {
        grouped[dept.name] = deptStaff;
      }
    });
    return grouped;
  }, [filteredStaff]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setFolderName('');
      setPermission('inherit');
      setError('');
      setSelectedAdmins([]);
      setAdminSearchQuery('');
      setExpandedDepartments([]);
    }
  }, [open]);

  const handleCreate = () => {
    if (!folderName.trim()) {
      setError('请输入文件夹名称');
      return;
    }
    
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      setError('文件夹名称不能包含特殊字符');
      return;
    }

    onCreate(folderName.trim(), permission, showAdminSelection ? selectedAdmins : undefined);
    handleClose();
  };

  const handleClose = () => {
    setFolderName('');
    setPermission('inherit');
    setError('');
    setSelectedAdmins([]);
    onOpenChange(false);
  };

  const addAdmin = (staffId: string) => {
    setSelectedAdmins(prev => [...prev, staffId]);
  };

  const removeAdmin = (staffId: string) => {
    setSelectedAdmins(prev => prev.filter(id => id !== staffId));
  };

  const toggleDepartment = (deptName: string) => {
    setExpandedDepartments(prev => 
      prev.includes(deptName) 
        ? prev.filter(d => d !== deptName)
        : [...prev, deptName]
    );
  };

  const selectedPermission = permissionOptions.find(p => p.value === permission);
  const ParentIcon = parentPermission ? getPermissionIcon(parentPermission.type) : Folder;
  const parentColors = parentPermission ? getPermissionColor(parentPermission.type) : getPermissionColor('inherit');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "bg-card/95 backdrop-blur-xl border-border/50",
        showAdminSelection ? "sm:max-w-[520px]" : "sm:max-w-[440px]"
      )}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Folder className="w-4 h-4 text-amber-500" />
            </div>
            新建文件夹
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            在 <span className="font-medium text-foreground">{currentPath || '根目录'}</span> 中创建新文件夹
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Parent Folder Permission Info */}
          {parentPermission && (
            <div className={cn(
              'flex items-start gap-3 p-3 rounded-lg border',
              parentColors.bg,
              parentColors.border
            )}>
              <Info className={cn('w-4 h-4 mt-0.5 flex-shrink-0', parentColors.text)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">父文件夹权限</p>
                <div className="flex items-center gap-2 mt-1">
                  <ParentIcon className={cn('w-4 h-4', parentColors.text)} />
                  <span className="text-sm text-muted-foreground">
                    {parentPermission.label} · {parentPermission.description}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium">
              文件夹名称
            </Label>
            <Input
              id="folder-name"
              placeholder="输入文件夹名称..."
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className={cn(
                'bg-background/50',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
              autoFocus
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Admin Selection - Only show for first-level folders */}
          {showAdminSelection && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                管理员
                <span className="text-xs text-muted-foreground font-normal">(可选)</span>
              </Label>
              
              {/* Selected Admins */}
              {selectedAdminDetails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedAdminDetails.map(admin => (
                    <Badge 
                      key={admin.id} 
                      variant="secondary" 
                      className="pl-2 pr-1 py-1 gap-1"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        {admin.name.charAt(0)}
                      </span>
                      <span>{admin.name}</span>
                      <button
                        onClick={() => removeAdmin(admin.id)}
                        className="ml-1 p-0.5 hover:bg-muted rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Admin Button */}
              <Popover open={adminPopoverOpen} onOpenChange={setAdminPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
                    <UserPlus className="w-4 h-4" />
                    添加管理员
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-3 border-b border-border/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索人员..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="pl-9 h-8"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="p-2">
                      {Object.keys(staffByDepartment).length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          未找到人员
                        </div>
                      ) : (
                        Object.entries(staffByDepartment).map(([deptName, staff]) => {
                          const isExpanded = expandedDepartments.includes(deptName);
                          return (
                            <div key={deptName} className="mb-1">
                              <button
                                onClick={() => toggleDepartment(deptName)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors"
                              >
                                <ChevronRight 
                                  className={cn(
                                    "w-3.5 h-3.5 text-muted-foreground transition-transform",
                                    isExpanded && "rotate-90"
                                  )} 
                                />
                                <span className="text-sm font-medium flex-1 text-left">{deptName}</span>
                                <Badge variant="secondary" className="text-xs h-5">
                                  {staff.length}
                                </Badge>
                              </button>
                              
                              {isExpanded && (
                                <div className="ml-5 space-y-0.5">
                                  {staff.map(person => (
                                    <button
                                      key={person.id}
                                      onClick={() => {
                                        addAdmin(person.id);
                                        setAdminPopoverOpen(false);
                                      }}
                                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors"
                                    >
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center">
                                        <span className="text-xs font-medium text-primary-foreground">
                                          {person.name.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="flex-1 text-left">
                                        <p className="text-sm">{person.name}</p>
                                        <p className="text-xs text-muted-foreground">{person.role}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              
              <p className="text-xs text-muted-foreground">
                管理员可以管理文件夹成员和权限设置
              </p>
            </div>
          )}

          {/* Permission Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">访问权限</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="bg-background/50">
                <SelectValue>
                  {selectedPermission && (
                    <div className="flex items-center gap-2">
                      <selectedPermission.icon className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedPermission.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {permissionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <option.icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permission Preview - Show inherited permission info when "inherit" is selected */}
          {selectedPermission && (
            <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                permission === 'private' ? 'bg-red-50' : 
                permission === 'department' ? 'bg-amber-50' :
                permission === 'project' ? 'bg-green-50' :
                permission === 'all' ? 'bg-blue-50' : 'bg-muted'
              )}>
                <selectedPermission.icon className={cn(
                  'w-5 h-5',
                  permission === 'private' ? 'text-red-500' : 
                  permission === 'department' ? 'text-amber-500' :
                  permission === 'project' ? 'text-green-500' :
                  permission === 'all' ? 'text-blue-500' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{selectedPermission.label}</p>
                <p className="text-xs text-muted-foreground">
                  {permission === 'inherit' && parentPermission 
                    ? `将继承: ${parentPermission.label}` 
                    : selectedPermission.description}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!folderName.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              创建文件夹
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
