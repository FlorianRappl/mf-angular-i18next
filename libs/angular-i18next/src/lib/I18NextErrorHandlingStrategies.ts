import type { I18NextLoadResult } from './I18NextLoadResult';
import type { Callback } from 'i18next';

export interface I18NextErrorHandlingStrategy {
  handle(
    resolve: (thenableOrResult?: any) => void,
    reject: (error: any) => void
  ): Callback;
}

export class NativeErrorHandlingStrategy
  implements I18NextErrorHandlingStrategy
{
  handle(
    resolve: (thenableOrResult?: I18NextLoadResult) => void,
    reject: (error: any) => void
  ) {
    return (err: any, t?: Function) => {
      let result: I18NextLoadResult = {
        err: err,
        t: t,
      };
      resolve(result);
    };
  }
}

export class StrictErrorHandlingStrategy
  implements I18NextErrorHandlingStrategy
{
  handle(
    resolve: (thenableOrResult?: I18NextLoadResult) => void,
    reject: (error: any) => void
  ) {
    return (err: any, t?: any) => {
      let result: I18NextLoadResult = {
        err: err,
        t: t,
      };
      if (!err) {
        resolve(result);
        return;
      }
      reject(err);
    };
  }
}
