import { version } from '../../package.json';

export const environment = {
  production: true,
  apiBaseUrl: 'https://staging.bhisma.cloud',
  googleApiKey: 'AIzaSyB7m0r7paaV5I5U6vjf0pDmocvD8-K-D-w',
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
