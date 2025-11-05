"use client";

import type { CivilWarOrphan } from "@/components/civil-war-orphans-columns";
import type { Student } from "@/components/columns";
import { CivilWarOrphanDetails } from "./civil-war-orphan-details";
import { StudentDetails } from "./student-details";

type RowDetailsProps = {
  item: Student | CivilWarOrphan;
};

export function RowDetails({ item }: RowDetailsProps) {
  if ("indianName" in item && "englishGivenName" in item) {
    return <StudentDetails student={item as Student} />;
  }
  return <CivilWarOrphanDetails orphan={item as CivilWarOrphan} />;
}
