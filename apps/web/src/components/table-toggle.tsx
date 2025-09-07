'use client';

import { Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTableToggle } from '@/hooks/use-table-toggle';

export function TableToggle() {
  const { currentTableType, switchToTable, TABLE_TYPES } = useTableToggle();

  const handleValueChange = (value: string) => {
    switchToTable(value as 'students' | 'civil_war_orphans');
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="font-medium text-muted-foreground text-sm">View:</span>
      <Select onValueChange={handleValueChange} value={currentTableType}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TABLE_TYPES.STUDENTS}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Indigenous American Students
            </div>
          </SelectItem>
          <SelectItem value={TABLE_TYPES.CIVIL_WAR_ORPHANS}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Civil War Orphans
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
