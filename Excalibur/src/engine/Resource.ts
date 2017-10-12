/// <reference path="Interfaces/ILoadable.ts" />

module ex {

   /**
    * Generic Resources
    *
    * The [[Resource]] type allows games built in Excalibur to load generic resources.
    * For any type of remote resource it is recommended to use [[Resource]] for preloading.
    *
    * [[Resource]] is an [[ILoadable]] so it can be passed to a [[Loader]] to pre-load before
    * a level or game.
    *
    * Example usages: JSON, compressed files, blobs.
    *
    * ## Pre-loading generic resources
    *
    * ```js
    * var resLevel1 = new ex.Resource("/assets/levels/1.json", "application/json");
    * var loader = new ex.Loader(resLevel1);
    *
    * // attach a handler to process once loaded
    * resLevel1.processDownload = function (data) {
    *
    *   // process JSON
    *   var json = JSON.parse(data);
    *
    *   // create a new level (inherits Scene) with the JSON configuration
    *   var level = new Level(json);
    *
    *   // add a new scene
    *   game.add(level.name, level);
    * }
    *
    * game.start(loader);
    * ```
    */
   export class Resource<T> implements ILoadable {
      public data: T = null;
      public logger: Logger = Logger.getInstance();
      private _engine: Engine;

      /**
       * @param path          Path to the remote resource
       * @param responseType  The Content-Type to expect (e.g. `application/json`)
       * @param bustCache     Whether or not to cache-bust requests
       */
      constructor(public path: string, public responseType: string, public bustCache: boolean = true) {}

      /**
       * Returns true if the Resource is completely loaded and is ready
       * to be drawn.
       */
      public isLoaded(): boolean {
         return !!this.data;
      }

      public wireEngine(engine: Engine) {
         this._engine = engine;
      }

      private _cacheBust(uri: string): string {
         var query: RegExp = /\?\w*=\w*/;
         if (query.test(uri)) {
            uri += ('&__=' + Date.now());
         } else {
            uri += ('?__=' + Date.now());
         }
         return uri;
      }

      private _start(e: any) {
         this.logger.debug('Started loading resource ' + this.path);
      }

      /**
       * Begin loading the resource and returns a promise to be resolved on completion
       */
      public load(): Promise<T> {
         var complete = new Promise<T>();

         var request = new XMLHttpRequest();
         request.open('GET', this.bustCache ? this._cacheBust(this.path) : this.path, true);
         request.responseType = this.responseType;
         request.onloadstart = (e) => { this._start(e); };
         request.onprogress = this.onprogress;
         request.onerror = this.onerror;
         request.onload = (e) => {
            if(request.status !== 200) {
               this.logger.error('Failed to load resource ', this.path, ' server responded with error code', request.status);
               this.onerror(request.response);
               complete.resolve(request.response);
               return;
            }

            this.data = this.processDownload(request.response);

            this.oncomplete();
            this.logger.debug('Completed loading resource', this.path);
            complete.resolve(this.data);
         };
         request.send();

         return complete;
      }


      /**
       * Returns the loaded data once the resource is loaded
       */
      public getData(): any {
         return this.data;
      }

      /**
       * This method is meant to be overriden to handle any additional
       * processing. Such as decoding downloaded audio bits.
       */
      public processDownload(data: T): any {
         // Handle any additional loading after the xhr has completed.
         return URL.createObjectURL(data);
      }

      public onprogress: (e: any) => void = () => { return; };

      public oncomplete: () => void = () => { return; };

      public onerror: (e: any) => void = () => { return; };
   }
}