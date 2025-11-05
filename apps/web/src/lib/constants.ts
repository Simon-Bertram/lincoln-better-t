/**
 * Application constants to eliminate magic strings and numbers
 */

// Page size constants
const PAGE_SIZE_SMALL = 10;
const PAGE_SIZE_MEDIUM_SMALL = 20;
const PAGE_SIZE_MEDIUM = 25;
const PAGE_SIZE_LARGE = 30;
const PAGE_SIZE_EXTRA_LARGE = 40;
const PAGE_SIZE_MAX = 50;

// Table configuration
export const TABLE_CONFIG = {
  PAGE_SIZES: [
    PAGE_SIZE_SMALL,
    PAGE_SIZE_MEDIUM_SMALL,
    PAGE_SIZE_MEDIUM,
    PAGE_SIZE_LARGE,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_MAX,
  ] as const,
  DEFAULT_PAGE_SIZE: PAGE_SIZE_SMALL,
  MAX_SEARCH_LENGTH: 200,
  MAX_LIMIT: 100,
} as const;

// Layout configuration
export const LAYOUT_CONFIG = {
  CONTAINER_MAX_WIDTH: "max-w-8/10",
  CARD_MAX_WIDTH: "max-w-md",
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  STUDENTS: "students",
  CIVIL_WAR_ORPHANS: "civil-war-orphans",
} as const;

// User messages
export const MESSAGES = {
  LOADING: {
    STUDENTS: "Loading students...",
    CIVIL_WAR_ORPHANS: "Loading civil war orphans...",
  },
  EMPTY: {
    STUDENTS: "No students found.",
    CIVIL_WAR_ORPHANS: "No civil war orphans found.",
  },
  ERROR: {
    STUDENTS: "There was an error loading the student data. Please try again.",
    CIVIL_WAR_ORPHANS:
      "There was an error loading the civil war orphans data. Please try again.",
  },
  TITLES: {
    STUDENTS: "Indigenous American Students",
    CIVIL_WAR_ORPHANS: "Civil War Orphans",
  },
} as const;

// Table type constants
export const TABLE_TYPES = {
  STUDENTS: "students",
  CIVIL_WAR_ORPHANS: "civil_war_orphans",
} as const;

export type TableType = (typeof TABLE_TYPES)[keyof typeof TABLE_TYPES];
