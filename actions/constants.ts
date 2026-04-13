// Storage defaults
// Storage limits are now managed by the `plans` table in NeonDB.
// No more hardcoded byte limits here — change them via SQL:
//   UPDATE plans SET storage_limit = ... WHERE id = 'free';

export const FILE_LIST_PAGE_SIZE = 30;
