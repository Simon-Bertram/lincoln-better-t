'use client';

import React from 'react';
import type { Student } from '@/components/columns';

type StudentDetailsProps = {
  student: Student;
};

export function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-muted-foreground">Tribal Name:</span>
          <p className="mt-1">{student.indianName || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Sex:</span>
          <p className="mt-1">{student.sex || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Year of Birth:</span>
          <p className="mt-1">{student.yearOfBirth || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Nation:</span>
          <p className="mt-1">{student.nation || '-'}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Arrival Date:</span>
          <p className="mt-1">
            {student.arrivalAtLincoln
              ? new Date(student.arrivalAtLincoln).toLocaleDateString()
              : '-'}
          </p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Departure Date:</span>
          <p className="mt-1">
            {student.departureFromLincoln
              ? new Date(student.departureFromLincoln).toLocaleDateString()
              : '-'}
          </p>
        </div>
      </div>

      {student.source && (
        <div>
          <span className="font-medium text-muted-foreground">Source:</span>
          <p className="mt-1 text-sm">{student.source}</p>
        </div>
      )}

      {student.comments && (
        <div>
          <span className="font-medium text-muted-foreground">Comments:</span>
          <p className="mt-1 text-sm">{student.comments}</p>
        </div>
      )}

      {student.relevantLinks && (
        <div>
          <span className="font-medium text-muted-foreground">Relevant Links:</span>
          <a
            className="mt-1 block text-sm underline"
            href={student.relevantLinks}
            rel="noopener noreferrer"
            target="_blank"
          >
            {student.relevantLinks}
          </a>
        </div>
      )}
    </div>
  );
}


