'use client';

import React from 'react';
import type { CivilWarOrphan } from '@/components/civil-war-orphans-columns';

type CivilWarOrphanDetailsProps = {
  orphan: CivilWarOrphan;
};

export function CivilWarOrphanDetails({ orphan }: CivilWarOrphanDetailsProps) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-muted-foreground">Family Name:</span>
          <p className="mt-1">{orphan.familyName || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Given Name:</span>
          <p className="mt-1">{orphan.givenName || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Birth Date:</span>
          <p className="mt-1">{orphan.birthDate || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Arrival:</span>
          <p className="mt-1">{orphan.arrival || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Departure:</span>
          <p className="mt-1">{orphan.departure || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Scholarships:</span>
          <p className="mt-1">{orphan.scholarships || '-'}</p>
        </div>
      </div>

      {orphan.aliases && (
        <div>
          <span className="font-medium text-muted-foreground">Aliases:</span>
          <p className="mt-1 text-sm">{orphan.aliases}</p>
        </div>
      )}

      {orphan.comments && (
        <div>
          <span className="font-medium text-muted-foreground">Comments:</span>
          <p className="mt-1 text-sm">{orphan.comments}</p>
        </div>
      )}

      {orphan.references && (
        <div>
          <span className="font-medium text-muted-foreground">References:</span>
          <p className="mt-1 text-sm">{orphan.references}</p>
        </div>
      )}
    </div>
  );
}


