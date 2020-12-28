import { version } from '../../package.json';

export const environment = {
  production: true,
  apiBaseUrl: 'https://staging.bhisma.cloud',
  googleApiKey: 'AIzaSyBDzoc2X_SL6sGNblij_ProxAlrMiCXKok',
  appVersion: version,
  elasticAPM: {
    serviceName: 'nusantara-admin',
    serverUrl: 'https://7586e6a80fa145ce9f1ba48b8f246e1d.apm.ap-southeast-1.aws.cloud.es.io:443',
    serviceVersion: version,
    debug: false,
    active: true,
    environment: 'production',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  }
};
