import type { TOptions } from 'i18next';

export type FormatPipeOptions = { format?: string; lng?: string };
export type PrependPipeOptions = {
  prependScope?: boolean;
  prependNamespace?: boolean;
};
export type PipeOptions = TOptions & FormatPipeOptions & PrependPipeOptions;
