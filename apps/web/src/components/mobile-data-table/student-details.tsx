"use client";

import type { Student } from "@/components/columns";

interface StudentDetailsProps {
  student: Student;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-muted-foreground">
            Tribal Name:
          </span>
          <p className="mt-1">{student.indianName || "-"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Sex:</span>
          <p className="mt-1">{student.sex || "-"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">
            Year of Birth:
          </span>
          <p className="mt-1">{student.birthYear || "-"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Nation:</span>
          <p className="mt-1">{student.nation || "-"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Agency:</span>
          <p className="mt-1">{student.agency || "-"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">
            Arrival Date:
          </span>
          <p className="mt-1">
            {student.arrivalDateFull
              ? new Date(student.arrivalDateFull).toLocaleDateString()
              : "-"}
          </p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">
            Departure Date:
          </span>
          <p className="mt-1">
            {student.departureDateFull
              ? new Date(student.departureDateFull).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      {student.trade && (
        <div>
          <span className="font-medium text-muted-foreground">Trade:</span>
          <p className="mt-1 text-sm">{student.trade}</p>
        </div>
      )}

      {student.diedAtLincoln !== null && (
        <div>
          <span className="font-medium text-muted-foreground">
            Died At Lincoln:
          </span>
          <p className="mt-1 text-sm">{student.diedAtLincoln ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
