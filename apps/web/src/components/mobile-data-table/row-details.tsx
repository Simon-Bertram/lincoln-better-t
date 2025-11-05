'use client';

import React from 'react';
import type { CivilWarOrphan } from '@/components/civil-war-orphans-columns';
import type { Student } from '@/components/columns';
import { StudentDetails } from './student-details';
import { CivilWarOrphanDetails } from './civil-war-orphan-details';

type RowDetailsProps = {
  item: Student | CivilWarOrphan;
};

export function RowDetails({ item }: RowDetailsProps) {
  if ('indianName' in item && 'englishGivenName' in item) {
    return <StudentDetails student={item as Student} />;
  }
  return <CivilWarOrphanDetails orphan={item as CivilWarOrphan} />;
}


