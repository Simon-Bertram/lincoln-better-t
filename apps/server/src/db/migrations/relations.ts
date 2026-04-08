import { relations } from "drizzle-orm/relations";
import { agencies, enrollments, nations, students } from "../schema";

export const studentsRelations = relations(students, ({ one, many }) => ({
  nation: one(nations, {
    fields: [students.nationId],
    references: [nations.nationId],
  }),
  agency: one(agencies, {
    fields: [students.agencyId],
    references: [agencies.agencyId],
  }),
  enrollments: many(enrollments),
}));

export const nationsRelations = relations(nations, ({ many }) => ({
  students: many(students),
}));

export const agenciesRelations = relations(agencies, ({ many }) => ({
  students: many(students),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.studentId],
  }),
}));
