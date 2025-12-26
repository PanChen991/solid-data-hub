import { useState, useMemo } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { organizationStaff, departments, StaffMember } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Organization() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const filteredStaff = useMemo(() => {
    return organizationStaff.filter(staff => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || staff.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast.success('LIMS 数据同步完成', {
      description: `已同步 ${organizationStaff.length} 条员工记录`,
    });
  };

  const getSyncStatusBadge = (status: StaffMember['syncStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            已同步
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            待同步
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            同步失败
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">组织架构</h1>
          <p className="text-sm text-muted-foreground mt-1">组织人员数据由 LIMS 系统同步</p>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
          {isSyncing ? '同步中...' : '立即同步 LIMS 数据'}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900">数据来源说明</p>
          <p className="text-sm text-blue-700 mt-1">
            组织架构数据每日自动从 LIMS 系统同步，手动编辑已禁用。如需修改人员信息，请在 LIMS 系统中操作。
          </p>
        </div>
      </div>

      {/* Department Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedDepartment(null)}
          className={cn(
            "p-4 rounded-xl border text-left transition-all",
            !selectedDepartment 
              ? "bg-primary/10 border-primary/30" 
              : "bg-card border-border/50 hover:border-primary/30"
          )}
        >
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-sm font-medium text-foreground">全部</p>
          <p className="text-xs text-muted-foreground">{organizationStaff.length} 人</p>
        </button>
        {departments.map(dept => {
          const count = organizationStaff.filter(s => s.department === dept.name).length;
          const isSelected = selectedDepartment === dept.name;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(isSelected ? null : dept.name)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                isSelected 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-card border-border/50 hover:border-primary/30"
              )}
            >
              <Users className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground truncate">{dept.name.replace('部', '')}</p>
              <p className="text-xs text-muted-foreground">{count} 人</p>
            </button>
          );
        })}
      </div>

      {/* Search and Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索姓名、工号、部门或角色..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-medium">姓名</TableHead>
              <TableHead className="font-medium">工号</TableHead>
              <TableHead className="font-medium">部门</TableHead>
              <TableHead className="font-medium">职位</TableHead>
              <TableHead className="font-medium">同步状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  未找到匹配的员工记录
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {staff.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {staff.employeeId}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {staff.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{staff.role}</TableCell>
                  <TableCell>{getSyncStatusBadge(staff.syncStatus)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            显示 {filteredStaff.length} 条记录，共 {organizationStaff.length} 条
          </p>
          <p className="text-xs text-muted-foreground">
            上次同步时间: 2025-01-15 08:00
          </p>
        </div>
      </div>
    </div>
  );
}
