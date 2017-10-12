/// <reference path="Util/Log.ts" />
// Promises/A+ Spec http://promises-aplus.github.io/promises-spec/

module ex {
   /**
    * Valid states for a promise to be in
    */
   export enum PromiseState {
      Resolved,
      Rejected,
      Pending,
   }

   export interface IPromise<T> {
      then(successCallback?: (value?: T) => any, rejectCallback?: (value?: T) => any): IPromise<T>;
      error(rejectCallback?: (value?: any) => any): IPromise<T>;

      //Cannot define static methods on interfaces
      //wrap<T>(value?: T): IPromise<T>;

      resolve(value?: T): IPromise<T>;
      reject(value?: any): IPromise<T>;

      state(): PromiseState;
   }

   /**
    * Promises/A+ spec implementation of promises
    *
    * Promises are used to do asynchronous work and they are useful for
    * creating a chain of actions. In Excalibur they are used for loading,
    * sounds, animation, actions, and more.
    *
    * ## A Promise Chain
    *
    * Promises can be chained together and can be useful for creating a queue
    * of functions to be called when something is done.
    *
    * The first [[Promise]] you will encounter is probably [[Engine.start]]
    * which resolves when the game has finished loading.
    *
    * ```js
    * var game = new ex.Engine();
    *
    * // perform start-up logic once game is ready
    * game.start().then(function () {
    *
    *   // start-up & initialization logic
    *
    * });
    * ```
    *
    * ## Handling errors
    *
    * You can optionally pass an error handler to [[Promise.then]] which will handle
    * any errors that occur during Promise execution.
    *
    * ```js
    * var game = new ex.Engine();
    *
    * game.start().then(
    *   // success handler
    *   function () {
    *   },
    *
    *   // error handler
    *   function (err) {
    *   }
    * );
    * ```
    *
    * Any errors that go unhandled will be bubbled up to the browser.
    */
   export class Promise<T> implements IPromise<T> {
      private _state: PromiseState = PromiseState.Pending;
      private _value: T;
      private _successCallbacks: { (value?: T): any }[] = [];
      private _rejectCallback: (value?: any) => any = () => { return; };
      private _errorCallback: (value?: any) => any;
      private _logger : Logger = Logger.getInstance();

      /**
       * Wrap a value in a resolved promise
       * @param value  An optional value to wrap in a resolved promise
       */
      public static wrap<T>(value?: T): Promise<T> {
         var promise = (new Promise<T>()).resolve(value);

         return promise;
      }

      /**
       * Returns a new promise that resolves when all the promises passed to it resolve, or rejects
       * when at least 1 promise rejects.
       */
      public static join<T>(...promises: Promise<T>[]) {
         var joinedPromise = new Promise<T>();
         if(!promises || !promises.length) {
            return joinedPromise.resolve();
         }

         var total = promises.length;
         var successes = 0;
         var rejects = 0;
         var errors = [];

         promises.forEach((p) => {
            p.then(
               () => {
                  successes += 1;
                  if(successes === total) {
                     joinedPromise.resolve();
                  } else if (successes + rejects + errors.length === total) {
                     joinedPromise.reject(errors);
                  }
               },
               () => {
                  rejects += 1;
                  if (successes + rejects + errors.length === total) {
                     joinedPromise.reject(errors);
                  }
               }
            ).error((e) => {
               errors.push(e);
               if ((errors.length + successes + rejects) === total) {
                  joinedPromise.reject(errors);
               }
            });
         });


         return joinedPromise;
      }

      /**
       * Chain success and reject callbacks after the promise is resovled
       * @param successCallback  Call on resolution of promise
       * @param rejectCallback   Call on rejection of promise
       */
      public then(successCallback?: (value?: T) => any, rejectCallback?: (value?: any) => any) {
         if (successCallback) {
            this._successCallbacks.push(successCallback);

            // If the promise is already resovled call immediately
            if (this.state() === PromiseState.Resolved) {
               try {
                  successCallback.call(this, this._value);
               } catch (e) {
                  this._handleError(e);
               }
            }
         }
         if (rejectCallback) {
            this._rejectCallback = rejectCallback;

            // If the promise is already rejected call immediately
            if (this.state() === PromiseState.Rejected) {
               try {
                  rejectCallback.call(this, this._value);
               } catch (e) {
                  this._handleError(e);
               }
            }
         }

         return this;
      }

      /**
       * Add an error callback to the promise 
       * @param errorCallback  Call if there was an error in a callback
       */
      public error(errorCallback?: (value?: any) => any) {
         if (errorCallback) {
            this._errorCallback = errorCallback;
         }
         return this;
      }

      /**
       * Resolve the promise and pass an option value to the success callbacks
       * @param value  Value to pass to the success callbacks
       */
      public resolve(value?: T) : Promise<T> {
         if (this._state === PromiseState.Pending) {
            this._value = value;
            try {
               this._state = PromiseState.Resolved;
               this._successCallbacks.forEach((cb) => {
                  cb.call(this, this._value);
               });

            } catch (e) {
               this._handleError(e);
            }
         } else {
            throw new Error('Cannot resolve a promise that is not in a pending state!');
         }
         return this;
      }

      /**
       * Reject the promise and pass an option value to the reject callbacks
       * @param value  Value to pass to the reject callbacks
       */
      public reject(value?: any) {
         if (this._state === PromiseState.Pending) {
            this._value = value;
            try {
               this._state = PromiseState.Rejected;
               this._rejectCallback.call(this, this._value);
            } catch (e) {
               this._handleError(e);
            }
         } else {
            throw new Error('Cannot reject a promise that is not in a pending state!');
         }
         return this;
      }

      /**
       * Inpect the current state of a promise
       */
      public state(): PromiseState {
         return this._state;
      }

      private _handleError(e: any) {
         if (this._errorCallback) {
            this._errorCallback.call(this, e);
         } else {
            // rethrow error
            throw e;
         }
      }
   }
}