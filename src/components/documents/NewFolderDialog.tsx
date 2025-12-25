import { useState, useEffect } from 'react';
import { Folder, Lock, Users, Building2, Globe, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export interface ParentPermission {
  type: 'all' | 'department' | 'project' | 'private' | 'inherit';
  label: string;
  description: string;
}

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  onCreate: (name: string, permission: string) => void;
  parentPermission?: ParentPermission;
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

export function NewFolderDialog({ open, onOpenChange, currentPath, onCreate, parentPermission }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [permission, setPermission] = useState('inherit');
  const [error, setError] = useState('');

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setFolderName('');
      setPermission('inherit');
      setError('');
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

    onCreate(folderName.trim(), permission);
    handleClose();
  };

  const handleClose = () => {
    setFolderName('');
    setPermission('inherit');
    setError('');
    onOpenChange(false);
  };

  const selectedPermission = permissionOptions.find(p => p.value === permission);
  const ParentIcon = parentPermission ? getPermissionIcon(parentPermission.type) : Folder;
  const parentColors = parentPermission ? getPermissionColor(parentPermission.type) : getPermissionColor('inherit');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] bg-card/95 backdrop-blur-xl border-border/50">
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
