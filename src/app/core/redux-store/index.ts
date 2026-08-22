import { Injectable, NgModule, NgZone, ApplicationRef } from '@angular/core';
import { createStore, applyMiddleware, compose, Store, Action } from 'redux';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NgRedux<RootState = any> {
  static instance: NgRedux<any> | undefined = undefined;

  private store$ = new BehaviorSubject<Observable<RootState> | null>(null);
  private _store: Store<RootState> | undefined = undefined;

  constructor(private ngZone: NgZone) {
    NgRedux.instance = this;
  }

  configureStore(
    rootReducer: any,
    initState: RootState,
    middleware: any[] = [],
    enhancers: any[] = []
  ) {
    const devToolsCompose =
      typeof window !== 'undefined' &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    const composer = devToolsCompose ? devToolsCompose : compose;
    const finalEnhancer =
      middleware.length > 0 || enhancers.length > 0
        ? composer(applyMiddleware(...middleware), ...enhancers)
        : undefined;

    const store = createStore(rootReducer, initState as any, finalEnhancer);
    this.setStore(store as any);
  }

  provideStore(store: Store<RootState>) {
    this.setStore(store);
  }

  private setStore(store: Store<RootState>) {
    this._store = store;
    const storeObservable = new Observable<RootState>((observer) => {
      observer.next(store.getState());
      const unsubscribe = store.subscribe(() => {
        observer.next(store.getState());
      });
      return () => {
        unsubscribe();
      };
    });
    this.store$.next(storeObservable);
  }

  getState(): RootState {
    return this._store ? this._store.getState() : (undefined as any);
  }

  subscribe(listener: () => void): () => void {
    return this._store ? this._store.subscribe(listener) : () => {};
  }

  dispatch<A extends Action = any>(action: A): A {
    if (!this._store) {
      throw new Error(
        'Dispatch failed: did you forget to configure your store?'
      );
    }
    if (!NgZone.isInAngularZone()) {
      return this.ngZone.run(() => this._store!.dispatch(action));
    }
    return this._store.dispatch(action);
  }

  select<Selected = any>(
    selector?: string | number | symbol | ((state: RootState) => Selected),
    comparator?: (a: Selected, b: Selected) => boolean
  ): Observable<Selected> {
    const selectorFn: (state: RootState) => Selected =
      typeof selector === 'function'
        ? selector
        : (state: any) =>
            state && selector !== undefined ? state[selector as any] : state;

    return this.store$.pipe(
      filter((s): s is Observable<RootState> => !!s),
      switchMap((storeObs) => storeObs),
      map(selectorFn),
      distinctUntilChanged(comparator)
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class DevToolsExtension {
  constructor(private appRef: ApplicationRef, private ngRedux: NgRedux<any>) {}

  isEnabled(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!((window as any).__REDUX_DEVTOOLS_EXTENSION__ || (window as any).devToolsExtension)
    );
  }

  enhancer(options?: any) {
    if (!this.isEnabled()) {
      return (noop: any) => noop;
    }
    return ((window as any).__REDUX_DEVTOOLS_EXTENSION__ || (window as any).devToolsExtension)(
      options || {}
    );
  }
}

export function select<T = any>(
  selector?: string | number | symbol | ((state: any) => any),
  comparator?: (a: any, b: any) => boolean
) {
  return function (target: any, key: string | symbol) {
    const bindingKey = selector !== undefined ? selector : key;
    function getter(this: any) {
      if (!NgRedux.instance) {
        return undefined;
      }
      return NgRedux.instance.select(bindingKey, comparator);
    }

    delete target[key];
    Object.defineProperty(target, key, {
      get: getter,
      enumerable: true,
      configurable: true,
    });
  };
}

export function select$<T = any>(
  selector?: string | number | symbol | ((state: any) => any),
  comparator?: (a: any, b: any) => boolean
) {
  return select<T>(selector, comparator);
}

@NgModule({
  providers: [DevToolsExtension, NgRedux],
})
export class NgReduxModule {}
