import { version } from '../../package.json';
import { env } from '@env/.env';

export const environment = {
  production: true,
  apiBaseUrl: '/api',
  googleApiKey: env.YOUTUBE_KEY || 'AIzaSyB7m0r7paaV5I5U6vjf0pDmocvD8-K-D-w',
  appVersion: version,
  elasticAPM: {
    serviceName: env.APM_NAME || 'nusantara-admin',
    serverUrl: env.APM_URL || 'https://apm.bhisma.cloud',
    serviceVersion: version,
    debug: false,
    active: env.APM_ACTIVE ? env.APM_ACTIVE.toLowerCase() === 'true' : false,
    environment: env.APM_ENVIRONMENT || 'production',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  },
  googleAnalytics: env.GA_MEASUREMENT_ID || 'G-SRHQS6T7J9'
};
