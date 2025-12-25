import { useState, useCallback } from 'react';
import { X, Upload, FileText, FileSpreadsheet, FileType, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' };
    case 'xlsx':
    case 'xls':
      return { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' };
    case 'docx':
    case 'doc':
      return { icon: FileType, color: 'text-blue-600', bg: 'bg-blue-50' };
    default:
      return { icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted' };
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function UploadDialog({ open, onOpenChange, currentPath }: UploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [permission, setPermission] = useState('inherit');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    // Simulate upload progress
    files.forEach((f, index) => {
      if (f.status === 'pending') {
        setTimeout(() => {
          setFiles(prev => prev.map(file => 
            file.id === f.id ? { ...file, status: 'uploading' as const, progress: 0 } : file
          ));
          
          // Simulate progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              setFiles(prev => prev.map(file => 
                file.id === f.id ? { ...file, status: 'complete' as const, progress: 100 } : file
              ));
            } else {
              setFiles(prev => prev.map(file => 
                file.id === f.id ? { ...file, progress } : file
              ));
            }
          }, 200);
        }, index * 300);
      }
    });
  };

  const handleClose = () => {
    setFiles([]);
    setPermission('inherit');
    onOpenChange(false);
  };

  const allComplete = files.length > 0 && files.every(f => f.status === 'complete');
  const hasPending = files.some(f => f.status === 'pending');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">上传文件</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Current Path */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">上传到:</span>
            <span className="font-medium text-foreground bg-accent/50 px-2 py-0.5 rounded">
              {currentPath || '根目录'}
            </span>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer',
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border/60 hover:border-border hover:bg-accent/20'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors',
              isDragOver ? 'bg-primary/10' : 'bg-accent/50'
            )}>
              <Upload className={cn(
                'w-6 h-6',
                isDragOver ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <p className="text-foreground font-medium">拖拽文件至此</p>
            <p className="text-muted-foreground text-sm mt-1">或点击选择文件</p>
            <p className="text-muted-foreground/60 text-xs mt-2">支持 PDF、Word、Excel、图片等格式</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.map((uploadFile) => {
                const { icon: Icon, color, bg } = getFileIcon(uploadFile.file.name);
                return (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg"
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
                      <Icon className={cn('w-4 h-4', color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {uploadFile.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(uploadFile.file.size)}
                        </span>
                        {uploadFile.status === 'uploading' && (
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-200"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        )}
                        {uploadFile.status === 'complete' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    {uploadFile.status === 'pending' && (
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Permission Setting */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">访问权限</span>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">继承父文件夹</SelectItem>
                <SelectItem value="private">仅自己可见</SelectItem>
                <SelectItem value="department">部门可见</SelectItem>
                <SelectItem value="all">全员可见</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              {allComplete ? '完成' : '取消'}
            </Button>
            {!allComplete && (
              <Button 
                onClick={handleUpload}
                disabled={files.length === 0 || !hasPending}
                className="bg-primary hover:bg-primary/90"
              >
                开始上传 {files.length > 0 && `(${files.length})`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
