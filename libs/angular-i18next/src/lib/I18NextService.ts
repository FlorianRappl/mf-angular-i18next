import { Inject, Injectable, Optional, OnDestroy } from '@angular/core';
import * as i18n from 'i18next';
import {
  I18NEXT_ERROR_HANDLING_STRATEGY,
  I18NEXT_INSTANCE,
} from './I18NEXT_TOKENS';
import { I18NextErrorHandlingStrategy } from './I18NextErrorHandlingStrategies';
import { I18NextEvents } from './I18NextEvents';
import { I18NextLoadResult } from './I18NextLoadResult';
import { ITranslationEvents } from './ITranslationEvents';
import { ITranslationService } from './ITranslationService';

const i18nextGlobal: i18n.i18n = i18n.default;

@Injectable()
export class I18NextService implements ITranslationService, OnDestroy {
  private i18next: i18n.i18n;
  private unsubscribe: () => void = () => {};

  events: ITranslationEvents = new I18NextEvents();

  get language() {
    return this.i18next.language;
  }
  get languages() {
    return this.i18next.languages;
  }

  get options() {
    return this.i18next.options;
  }

  get modules() {
    return this.i18next.modules;
  }
  get services() {
    return this.i18next.services;
  }
  get store() {
    return this.i18next.store;
  }

  get resolvedLanguage() {
    return this.i18next.resolvedLanguage;
  }

  get isInitialized() {
    return this.i18next.isInitialized;
  }

  constructor(
    @Inject(I18NEXT_ERROR_HANDLING_STRATEGY)
    private errorHandlingStrategy: I18NextErrorHandlingStrategy,
    @Optional() @Inject(I18NEXT_INSTANCE) private instance: i18n.i18n
  ) {
    this.i18next = instance ?? i18nextGlobal;
  }

  public change(instance: i18n.i18n) {
    this.unsubscribeEvents();
    this.instance = instance;
    this.i18next = instance;
    return this.waitLoaded();
  }

  public waitLoaded() {
    this.subscribeEvents();

    if (this.instance && !this.instance.isInitialized) {
      return this.instance.init().then(() => {});
    }

    return Promise.resolve();
  }

  public use<T extends i18n.Module>(
    module: T | i18n.NewableModule<T> | i18n.Newable<T>
  ): ITranslationService {
    this.i18next.use(module);
    return this;
  }

  init(options: i18n.InitOptions): Promise<I18NextLoadResult> {
    return new Promise<I18NextLoadResult>((resolve, reject) => {
      this.i18next.init(
        Object.assign({}, options ?? {}),
        this.errorHandlingStrategy.handle(resolve, reject)
      );
    });
  }

  t(
    key: string | string[],
    options?:
      | (i18n.TOptionsBase &
          i18n.StringMap & { defaultValue?: string | undefined })
      | undefined
  ): i18n.DefaultTFuncReturn;
  t(
    key: string | string[] | (string | TemplateStringsArray)[],
    defaultValue: string,
    options?:
      | (i18n.TOptionsBase & i18n.StringMap & { defaultValue: string })
      | undefined
  ): i18n.DefaultTFuncReturn;
  t(
    key: unknown,
    defaultValueOrOptions?: unknown,
    options?: unknown
  ): i18n.DefaultTFuncReturn {
    const hasDefault =
      !!defaultValueOrOptions && typeof defaultValueOrOptions === 'string';

    this.i18next.t.bind(this.i18next);
    if (hasDefault) {
      return this.i18next.t(
        key as string | string[],
        defaultValueOrOptions as string,
        options as i18n.TOptionsBase
      );
    } else {
      return this.i18next.t(
        key as string | string[],
        defaultValueOrOptions as i18n.TOptionsBase
      );
    }
  }

  public format(value: any, format?: string, lng?: string): string {
    return this.i18next.format(value, format, lng);
  }

  public exists(key: string | string[], options: any) {
    return this.i18next.exists(key, options);
  }

  getFixedT(
    lng: string | readonly string[],
    ns?: string | readonly string[],
    keyPrefix?: string
  ): i18n.TFunction;
  getFixedT(
    lng: null,
    ns: string | readonly string[] | null,
    keyPrefix?: string
  ): i18n.TFunction;
  getFixedT(lng: any, ns?: any, keyPrefix?: any): i18n.TFunction {
    return this.i18next.getFixedT(lng, ns, keyPrefix);
  }

  public setDefaultNamespace(ns: string) {
    this.i18next.setDefaultNamespace(ns);
  }

  public dir(lng?: string) {
    return this.i18next.dir(lng);
  }

  public changeLanguage(lng: string): Promise<i18n.TFunction> {
    return new Promise<i18n.TFunction>(
      (
        resolve: (
          thenableOrResult: i18n.TFunction | PromiseLike<i18n.TFunction>
        ) => void,
        reject: (error: any) => void
      ) => {
        return this.i18next.changeLanguage(
          lng,
          this.errorHandlingStrategy.handle(resolve, reject)
        );
      }
    );
  }

  public loadNamespaces(namespaces: string | string[]): Promise<any> {
    return new Promise<I18NextLoadResult>(
      (
        resolve: (
          thenableOrResult: I18NextLoadResult | PromiseLike<I18NextLoadResult>
        ) => void,
        reject: (error: any) => void
      ) => {
        this.i18next.loadNamespaces(
          namespaces,
          this.errorHandlingStrategy.handle(resolve, reject)
        );
      }
    );
  }

  public loadLanguages(lngs: string | string[]) {
    return new Promise<void>(
      (
        resolve: (thenableOrResult: void | PromiseLike<void>) => void,
        reject: (error: any) => void
      ) => {
        this.i18next.loadLanguages(
          lngs,
          this.errorHandlingStrategy.handle(resolve, reject)
        );
      }
    );
  }

  //#region resource handling

  public loadResources(callback?: (err: any) => void): void {
    this.i18next.loadResources(callback);
  }

  public getDataByLanguage(lng: string) {
    return this.i18next.getDataByLanguage(lng);
  }

  public async reloadResources(...params: any) {
    await this.i18next.reloadResources.apply(params);
  }

  public getResource(lng: string, ns: string, key: string, options: any) {
    return this.i18next.getResource(lng, ns, key, options);
  }

  public addResource(
    lng: string,
    ns: string,
    key: string,
    value: any,
    options: any
  ): i18n.i18n {
    return this.i18next.addResource(lng, ns, key, value, options);
  }

  public addResources(lng: string, ns: string, resources: any): i18n.i18n {
    return this.i18next.addResources(lng, ns, resources);
  }

  public addResourceBundle(
    lng: string,
    ns: string,
    resources: any,
    deep: any,
    overwrite: any
  ): i18n.i18n {
    return this.i18next.addResourceBundle(lng, ns, resources, deep, overwrite);
  }

  public hasResourceBundle(lng: string, ns: string) {
    return this.i18next.hasResourceBundle(lng, ns);
  }

  public getResourceBundle(lng: string, ns: string) {
    return this.i18next.getResourceBundle(lng, ns);
  }

  public removeResourceBundle(lng: string, ns: string): i18n.i18n {
    return this.i18next.removeResourceBundle(lng, ns);
  }

  //#endregion

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  private unsubscribeEvents() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  private subscribeEvents() {
    const initialized = (options: i18n.InitOptions) =>
      this.events.initialized.next(options);
    const loaded = (loaded: boolean) =>
      this.events.loaded.next(loaded);
    const failedLoading = (lng: string, ns: string, msg: string) =>
      this.events.failedLoading.next({ lng, ns, msg });
    const languageChanged = (lng: string) =>
      this.events.languageChanged.next(lng);
    const missingKey = (
      lngs: string,
      namespace: string,
      key: string,
      res: string
    ) => this.events.missingKey.next({ lngs, namespace, key, res });
    const added = (lng: string, ns: string) =>
      this.events.added.next({ lng, ns });
    const removed = (lng: string, ns: string) =>
      this.events.removed.next({ lng, ns });

    this.i18next.on('initialized', initialized);
    this.i18next.on('loaded', loaded);
    this.i18next.on('failedLoading', failedLoading);
    this.i18next.on('languageChanged', languageChanged);
    this.i18next.on('missingKey', missingKey);
    this.i18next.on('added', added);
    this.i18next.on('removed', removed);

    this.unsubscribe = () => {
      this.i18next.off('initialized', initialized);
      this.i18next.off('loaded', loaded);
      this.i18next.off('failedLoading', failedLoading);
      this.i18next.off('languageChanged', languageChanged);
      this.i18next.off('missingKey', missingKey);
      this.i18next.off('added', added);
      this.i18next.off('removed', removed);
    };
  }
}
