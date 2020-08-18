import * as functions from 'firebase-functions';
import { join } from 'path';

// __non_webpack_require__ ensure webpack uses "require" at runtime
declare const __non_webpack_require__: any;
const expressApp = __non_webpack_require__('./project-manhattan/server/main').app();

export const ssr = functions
  .region('europe-west2')
  .runWith({"timeoutSeconds":60,"memory":"1GB"})
  .https
  .onRequest(expressApp);
