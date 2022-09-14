import type {
  InitOptions,
  Callback,
  Modules,
  Module,
  Services,
  ResourceStore,
  i18n,
  TFunction,
  Newable,
  NewableModule,
  FormatFunction,
  ExistsFunction,
} from 'i18next';
import type { I18NextLoadResult } from './I18NextLoadResult';
import type { ITranslationEvents } from './ITranslationEvents';

type Modify<T, R> = Omit<T, keyof R> & R;

export type ITranslationService = Modify<
  Partial<i18n>,
  {
    events: ITranslationEvents;

    language: string;
    languages: readonly string[];
    options: InitOptions;
    modules: Modules;
    services: Services;
    store: ResourceStore;
    resolvedLanguage: string;

    use<T extends Module>(
      module: T | NewableModule<T> | Newable<T>
    ): ITranslationService;

    init(options: InitOptions): Promise<I18NextLoadResult>;

    change(instance: i18n): Promise<void>;

    waitLoaded(): Promise<void>;

    t: TFunction;

    format: FormatFunction;

    exists: ExistsFunction;

    getFixedT(
      lng: string | readonly string[],
      ns?: string | readonly string[],
      keyPrefix?: string
    ): TFunction;
    getFixedT(
      lng: null,
      ns: string | readonly string[] | null,
      keyPrefix?: string
    ): TFunction;

    setDefaultNamespace(ns: string): void;

    dir(lng: string): string;

    changeLanguage(lng: string): Promise<any>;

    loadNamespaces(namespaces: string[]): Promise<any>;
    loadLanguages(
      lngs: string | readonly string[],
      callback?: Callback
    ): Promise<void>;

    loadResources(callback?: (err: any) => void): void;

    getDataByLanguage(
      lng: string
    ): { translation: { [key: string]: string } } | undefined;

    reloadResources(
      lngs?: string | readonly string[],
      ns?: string | readonly string[],
      callback?: () => void
    ): Promise<void>;
    reloadResources(
      lngs: null,
      ns: string | readonly string[],
      callback?: () => void
    ): Promise<void>;

    getResource(
      lng: string,
      ns: string,
      key: string,
      options?: Pick<InitOptions, 'keySeparator' | 'ignoreJSONStructure'>
    ): any;
    addResource(
      lng: string,
      ns: string,
      key: string,
      value: string,
      options?: { keySeparator?: string; silent?: boolean }
    ): i18n;
    addResources(lng: string, ns: string, resources: any): i18n;
    addResourceBundle(
      lng: string,
      ns: string,
      resources: any,
      deep?: boolean,
      overwrite?: boolean
    ): i18n;
    hasResourceBundle(lng: string, ns: string): boolean;
    getResourceBundle(lng: string, ns: string): any;
    removeResourceBundle(lng: string, ns: string): i18n;
  }
>;
