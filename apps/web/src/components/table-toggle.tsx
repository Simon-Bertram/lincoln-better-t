'use client';

import { Database, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTableToggle } from '@/hooks/use-table-toggle';

export function TableToggle() {
  const {
    currentTableType,
    toggleTable,
    isStudentsTable,
    isCivilWarOrphansTable,
    TABLE_TYPES,
  } = useTableToggle();

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-muted-foreground text-sm">View:</span>
      <Button
        aria-label={`Switch to ${isStudentsTable ? 'Civil War Orphans' : 'Students'} table`}
        className="gap-2"
        onClick={() => toggleTable()}
        size="sm"
        variant={isStudentsTable ? 'default' : 'outline'}
      >
        {isStudentsTable ? (
          <>
            <Users className="h-4 w-4" />
            Indigenous American Students
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            Civil War Orphans
          </>
        )}
      </Button>
    </div>
  );
}
