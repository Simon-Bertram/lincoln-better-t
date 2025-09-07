import {
  type CivilWarOrphan,
  civilWarOrphansColumns,
  civilWarOrphansMobileColumns,
} from '@/components/civil-war-orphans-columns';
import { columns, mobileColumns, type Student } from '@/components/columns';
import {
  createDataSectionConfig,
  type DataSectionConfig,
} from '@/components/enhanced-data-section';
import { MESSAGES, QUERY_KEYS } from '@/lib/constants';

// Students data section configuration
export const studentsConfig: DataSectionConfig<Student> =
  createDataSectionConfig({
    queryKey: QUERY_KEYS.STUDENTS,
    queryFn: async () => {
      const { orpc } = await import('@/utils/orpc');
      return orpc.getStudents.query();
    },
    columns,
    mobileColumns,
    messages: {
      empty: MESSAGES.EMPTY.STUDENTS,
      error: MESSAGES.ERROR.STUDENTS,
      loading: MESSAGES.LOADING.STUDENTS,
    },
    options: {
      retry: true,
      retryCount: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  });

// Civil War Orphans data section configuration
export const civilWarOrphansConfig: DataSectionConfig<CivilWarOrphan> =
  createDataSectionConfig({
    queryKey: QUERY_KEYS.CIVIL_WAR_ORPHANS,
    queryFn: async () => {
      const { orpc } = await import('@/utils/orpc');
      return orpc.getCivilWarOrphans.query();
    },
    columns: civilWarOrphansColumns,
    mobileColumns: civilWarOrphansMobileColumns,
    messages: {
      empty: MESSAGES.EMPTY.CIVIL_WAR_ORPHANS,
      error: MESSAGES.ERROR.CIVIL_WAR_ORPHANS,
      loading: MESSAGES.LOADING.CIVIL_WAR_ORPHANS,
    },
    options: {
      retry: true,
      retryCount: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  });

// Type-safe configuration map
export const dataSectionConfigs = {
  students: studentsConfig,
  civilWarOrphans: civilWarOrphansConfig,
} as const;

export type DataSectionType = keyof typeof dataSectionConfigs;
