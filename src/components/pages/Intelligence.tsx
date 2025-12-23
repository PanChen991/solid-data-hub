import { useState } from 'react';
import { Search, BookOpen, FileCheck, Calendar, ExternalLink, Users } from 'lucide-react';
import { intelligences, Intelligence } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function IntelligencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'paper' | 'patent'>('all');

  const filteredIntelligences = intelligences.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.includes(searchQuery)) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">外部情报</h1>
        <p className="text-muted-foreground mt-1">追踪前沿论文与专利动态</p>
      </div>

      {/* Search Bar - Apple Style */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索论文或专利..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 pl-14 pr-6 bg-card rounded-2xl border border-border/50 shadow-apple-lg focus:shadow-apple-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: '全部' },
          { id: 'paper', label: '论文' },
          { id: 'patent', label: '专利' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
              filter === tab.id
                ? 'bg-primary text-primary-foreground shadow-apple'
                : 'bg-accent text-accent-foreground hover:bg-accent/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Intelligence Feed */}
      <div className="space-y-4 stagger-children">
        {filteredIntelligences.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 border border-border/50 group cursor-pointer hover:scale-[1.01]"
          >
            <div className="flex items-start gap-4">
              {/* Type Icon */}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                item.type === 'paper' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
              )}>
                {item.type === 'paper' ? (
                  <BookOpen className="w-6 h-6" />
                ) : (
                  <FileCheck className="w-6 h-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-primary/80">{item.source}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {item.publishedAt}
                  </span>
                  {item.authors && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.authors.slice(0, 2).join(', ')}
                      {item.authors.length > 2 && ` 等`}
                    </span>
                  )}
                  {item.patentNumber && (
                    <span className="font-mono text-xs">{item.patentNumber}</span>
                  )}
                </div>

                {/* Abstract */}
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                  {item.abstract}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIntelligences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">未找到匹配的结果</p>
        </div>
      )}
    </div>
  );
}
