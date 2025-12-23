import { useState } from 'react';
import { FileText, FileSpreadsheet, Presentation, Search, Calendar, User, Tag, X } from 'lucide-react';
import { documents, Document } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return { icon: FileText, color: 'bg-red-100 text-red-600' };
    case 'docx':
      return { icon: FileText, color: 'bg-blue-100 text-blue-600' };
    case 'xlsx':
      return { icon: FileSpreadsheet, color: 'bg-green-100 text-green-600' };
    case 'pptx':
      return { icon: Presentation, color: 'bg-orange-100 text-orange-600' };
    default:
      return { icon: FileText, color: 'bg-gray-100 text-gray-600' };
  }
};

const getFileTypeLabel = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return 'PDF 文档';
    case 'docx': return 'Word 文档';
    case 'xlsx': return 'Excel 表格';
    case 'pptx': return 'PPT 演示';
    default: return '文档';
  }
};

export function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">内部文档</h1>
        <p className="text-muted-foreground mt-1">管理和检索研发相关的内部资料</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索文档名称或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-card rounded-2xl border border-border/50 shadow-apple focus:shadow-apple-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filteredDocuments.map((doc) => {
          const { icon: Icon, color } = getFileIcon(doc.type);
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDocument(doc)}
              className="bg-card rounded-2xl p-5 shadow-apple hover:shadow-apple-lg transition-all duration-300 border border-border/50 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">{doc.size}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {doc.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 2 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    +{doc.tags.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Document Detail Modal */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl bg-card border-border/50 shadow-apple-xl rounded-3xl p-0 overflow-hidden">
          {selectedDocument && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border/50">
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                      getFileIcon(selectedDocument.type).color
                    )}>
                      {(() => {
                        const { icon: Icon } = getFileIcon(selectedDocument.type);
                        return <Icon className="w-7 h-7" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-lg font-semibold text-foreground leading-snug">
                        {selectedDocument.name}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getFileTypeLabel(selectedDocument.type)} · {selectedDocument.size}
                      </p>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">创建者</p>
                      <p className="text-sm font-medium text-foreground">{selectedDocument.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">创建日期</p>
                      <p className="text-sm font-medium text-foreground">{selectedDocument.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="p-4 rounded-xl bg-accent/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">所属部门</p>
                  <p className="text-sm font-medium text-foreground">{selectedDocument.department}</p>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">标签</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">文档摘要</p>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-accent/30 p-4 rounded-xl border border-border/50">
                    {selectedDocument.summary}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border/50 flex gap-3">
                <button className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  下载文档
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="h-12 px-6 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/80 transition-colors"
                >
                  关闭
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
