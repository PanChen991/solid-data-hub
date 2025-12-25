import { useState } from 'react';
import { Search, X, Filter, FileText, FileSpreadsheet, FileType, Folder, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface SearchFilters {
  query: string;
  types: string[];
  authors: string[];
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isActive: boolean;
}

const fileTypes = [
  { value: 'folder', label: '文件夹', icon: Folder, color: 'text-amber-500' },
  { value: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
  { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600' },
  { value: 'docx', label: 'Word', icon: FileType, color: 'text-blue-600' },
];

const authors = [
  { value: 'Wang', label: 'Wang' },
  { value: 'Zhang', label: 'Zhang' },
  { value: 'Li', label: 'Li' },
  { value: 'Chen', label: 'Chen' },
];

export function SearchBar({ onSearch, onClear, isActive }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      query: query.trim(),
      types: selectedTypes,
      authors: selectedAuthors,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedAuthors([]);
    onClear();
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors(prev => 
      prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
    );
  };

  const activeFilterCount = selectedTypes.length + selectedAuthors.length;

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索文件名..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 bg-background/50"
        />
        {(query || isActive) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              'gap-2',
              activeFilterCount > 0 && 'border-primary text-primary'
            )}
          >
            <Filter className="w-4 h-4" />
            筛选
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 p-4">
          <div className="space-y-4">
            {/* File Types */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">文件类型</h4>
              <div className="space-y-2">
                {fileTypes.map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={selectedTypes.includes(type.value)}
                      onCheckedChange={() => toggleType(type.value)}
                    />
                    <Label 
                      htmlFor={`type-${type.value}`} 
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <type.icon className={cn('w-4 h-4', type.color)} />
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Authors */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">上传者</h4>
              <div className="space-y-2">
                {authors.map((author) => (
                  <div key={author.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`author-${author.value}`}
                      checked={selectedAuthors.includes(author.value)}
                      onCheckedChange={() => toggleAuthor(author.value)}
                    />
                    <Label 
                      htmlFor={`author-${author.value}`} 
                      className="text-sm cursor-pointer"
                    >
                      {author.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex gap-2 pt-2 border-t border-border/30">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedAuthors([]);
                }}
              >
                重置
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  handleSearch();
                  setFilterOpen(false);
                }}
              >
                应用筛选
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button size="sm" onClick={handleSearch} className="gap-2">
        <Search className="w-4 h-4" />
        搜索
      </Button>
    </div>
  );
}
