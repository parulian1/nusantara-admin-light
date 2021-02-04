// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { version } from '../../package.json';

export const environment = {
  production: false,
  apiBaseUrl: 'https://staging.bhisma.cloud',
  googleApiKey: 'AIzaSyB7m0r7paaV5I5U6vjf0pDmocvD8-K-D-w',
  appVersion: version,
  elasticAPM: {
    serviceName: 'nusantara-admin',
    serverUrl: 'https://f51291eec6a94ce2a7309a312be33aa7.apm.ap-southeast-1.aws.cloud.es.io:443',
    serviceVersion: version,
    debug: true,
    active: true,
    environment: 'development',
    breakdownMetrics: true,
    distributedTracingOrigins: [ ],
    ignoreTransactions: [],
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
