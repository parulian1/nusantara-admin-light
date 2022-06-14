// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { version } from '../../package.json';
import { env } from '@env/.env';

export const environment = {
  production: false,
  apiBaseUrl: '/api',
  googleApiKey: env.YOUTUBE_KEY || 'AIzaSyB7m0r7paaV5I5U6vjf0pDmocvD8-K-D-w',
  appVersion: version,
  elasticAPM: {
    serviceName: env.APM_NAME || 'nusantara-admin',
    serverUrl: env.APM_URL || 'https://apm.bhisma.cloud',
    serviceVersion: version,
    debug: true,
    active: env.APM_ACTIVE ? env.APM_ACTIVE.toLowerCase() === 'true' : false,
    environment: env.APM_ENVIRONMENT || 'development',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  },
  googleAnalytics: env.GA_MEASUREMENT_ID || 'G-SRHQS6T7J9'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
