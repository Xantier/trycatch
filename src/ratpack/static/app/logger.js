import createLog from 'localstorage-logger';

const log = createLog({
  logName: 'B2BLoyalty',
  maxLogSizeInBytes: 500 * 1024 // 500KB
});

// debug | info | warn | error
export default log;
export const getLogs = log.exportToArray();
