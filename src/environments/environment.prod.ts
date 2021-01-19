import { version } from '../../package.json';

export const environment = {
  production: true,
  apiBaseUrl: 'https://staging.bhisma.cloud',
  googleApiKey: 'AIzaSyBDzoc2X_SL6sGNblij_ProxAlrMiCXKok',
  appVersion: version,
  elasticAPM: {
    serviceName: 'nusantara-admin',
    serverUrl: 'https://apm.bhisma.cloud',
    serviceVersion: version,
    debug: false,
    active: true,
    environment: 'production',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  }
};
