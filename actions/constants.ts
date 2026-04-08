// Storage defaults — change these in one place, not scattered across SQL strings
export const DEFAULT_STORAGE_LIMIT_BYTES =
  Number(process.env.DEFAULT_STORAGE_LIMIT_BYTES) || 5 * 1024 * 1024 * 1024; // 5 GB

export const FILE_LIST_PAGE_SIZE = 50;
