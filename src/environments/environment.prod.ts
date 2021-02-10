import { version } from '../../package.json';

export const environment = {
  production: true,
  apiBaseUrl: '/api',
  googleApiKey: 'AIzaSyB7m0r7paaV5I5U6vjf0pDmocvD8-K-D-w',
  appVersion: version,
  elasticAPM: {
    serviceName: 'nusantara-admin',
    serverUrl: 'https://f51291eec6a94ce2a7309a312be33aa7.apm.ap-southeast-1.aws.cloud.es.io:443',
    serviceVersion: version,
    debug: false,
    active: true,
    environment: 'production',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  }
};
