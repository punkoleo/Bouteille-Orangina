/// <reference path="MonkeyPatch.ts" />
/// <reference path="Events.ts" />
/// <reference path="EventDispatcher.ts" />
/// <reference path="Class.ts" />
/// <reference path="Drawing/Color.ts" />
/// <reference path="Util/Log.ts" />
/// <reference path="Collision/Side.ts" />
/// <reference path="Scene.ts" />
/// <reference path="Actor.ts" />
/// <reference path="UIActor.ts" />
/// <reference path="Trigger.ts" />
/// <reference path="Particles.ts" />
/// <reference path="Drawing/Animation.ts" />
/// <reference path="Camera.ts" />
/// <reference path="Sound.ts" />
/// <reference path="Loader.ts" />
/// <reference path="Promises.ts" />
/// <reference path="Util/Util.ts" />
/// <reference path="Util/Detector.ts" />
/// <reference path="Binding.ts" />
/// <reference path="TileMap.ts" />
/// <reference path="Label.ts" />
/// <reference path="PostProcessing/IPostProcessor.ts"/>
/// <reference path="Input/IEngineInput.ts"/>
/// <reference path="Input/Pointer.ts"/>
/// <reference path="Input/Keyboard.ts"/>
/// <reference path="Input/Gamepad.ts"/>

/**
 * # Welcome to the Excalibur API
 *
 * This documentation is automatically generated from the Excalibur
 * source code on [GitHub](http://github.com/excaliburjs/Excalibur).
 *
 * If you're just starting out, we recommend reading the tutorials and guides
 * on [Excaliburjs.com](http://excaliburjs.com/docs). If you have questions,
 * feel free to get help on the [Excalibur.js mailing list](https://groups.google.com/forum/#!forum/excaliburjs).
 *
 * If you're looking for a specific method or property, you can search the documentation
 * using the search icon at the top or just start typing.
 *
 * ## Where to Start
 *
 * These are the core concepts of Excalibur that you should become
 * familiar with.
 *
 * - [[Engine|Intro to the Engine]]
 *   - [[EventDispatcher|Eventing]]
 * - [[Scene|Working with Scenes]]
 *   - [[BaseCamera|Working with Cameras]]
 * - [[Actor|Working with Actors]]
 *   - [[Label|Labels]]
 *   - [[Trigger|Triggers]]
 *   - [[UIActor|UI Actors (HUD)]]
 *   - [[ActionContext|Action API]]
 *   - [[Group|Groups]]
 *
 * ## Working with Resources
 *
 * Excalibur provides easy ways of loading assets, from images to JSON files.
 *
 * - [[Loader|Working with the Loader]]
 * - [[Texture|Loading Textures]]
 * - [[Sound|Loading Sounds]]
 * - [[Resource|Loading Generic Resources]]
 *
 * ## Working with Input
 *
 * Excalibur comes built-in with support for mouse, keyboard, touch, and controllers.
 *
 * - [[Pointers|Mouse and Touch]]
 * - [[Keyboard]]
 * - [[Gamepads|Controller Support]]
 * 
 * ## Working with Media
 *
 * Add sounds, images, and animations to your game.
 *
 * - [[Sprite|Working with Sprites]]
 * - [[Sound|Working with Sounds]]
 * - [[SpriteSheet|Working with SpriteSheets]]
 * - [[Animation|Working with Animations]]
 * - [[TileMap|Working with TileMaps]]
 *
 * ## Effects and Particles
 *
 * Every game needs an explosion or two. Add sprite effects such as lighten,
 * darken, and colorize.
 *
 * - [[Effects|Sprite Effects]]
 * - [[ParticleEmitter|Particle Emitters]]
 * - [[IPostProcessor|Post Processors]]
 *
 * ## Math
 *
 * These classes provide the basics for math & algebra operations.
 *
 * - [[Point]]
 * - [[Vector]]
 * - [[Ray]]
 * - [[Line]]
 * - [[Projection]]
 *
 * ## Utilities
 *
 * - [[Util|Utility Functions]] 
 * - [[Promise|Promises and Async]]
 * - [[Logger|Logging]]
 * - [[Color|Colors]]
 * - [[Timer|Timers]]
 */
module ex {

   /**
    * Defines the available options to configure the Excalibur engine at constructor time.
    */
   export interface IEngineOptions {
      /**
       * Configures the width of the game optionlaly.
       */
      width?: number;

      /**
       * Configures the height of the game optionally.
       */
      height?: number;

      /**
       * Configures the canvas element Id to use optionally.
       */
      canvasElementId?: string;

      /**
       * Configures the display mode.
       */
      displayMode?: ex.DisplayMode;

      /**
       * Configures the pointer scope. Pointers scoped to the 'Canvas' can only fire events within the canvas viewport; whereas, 'Document'
       * (default) scoped will fire anywhere on the page.
       */
      pointerScope?: ex.Input.PointerScope;
   }

   /**
    * The Excalibur Engine
    *
    * The [[Engine]] is the main driver for a game. It is responsible for 
    * starting/stopping the game, maintaining state, transmitting events, 
    * loading resources, and managing the scene.
    *
    * Excalibur uses the HTML5 Canvas API for drawing your game to the screen.
    * The canvas is available to all `draw` functions for raw manipulation,
    * but Excalibur is meant to simplify or completely remove the need to use
    * the canvas directly.
    *
    * ## Creating a Game
    *
    * To create a new game, create a new instance of [[Engine]] and pass in
    * the configuration ([[IEngineOptions]]). Excalibur only supports a single
    * instance of a game at a time, so it is safe to use globally.
    *
    * You can then call [[start]] which starts the game and optionally accepts
    * a [[Loader]] which you can use to pre-load assets.
    *
    * ```js
    * var game = new ex.Engine({ width: 800, height: 600 });
    *
    * // call game.start, which is a Promise
    * game.start().then(function () {
    *   // ready, set, go!
    * });
    * ```
    *
    * ## The Main Loop
    *
    * The Excalibur engine uses a simple main loop. The engine updates and renders
    * the "scene graph" which is the [[Scene|scenes]] and the tree of [[Actor|actors]] within that
    * scene. Only one [[Scene]] can be active at a time. The engine does not update/draw any other
    * scene, which means any actors will not be updated/drawn if they are part of a deactivated scene.
    *
    * ![Engine Lifecycle](/assets/images/docs/EngineLifeCycle.png)
    *
    * **Scene Graph**
    *
    * ```
    * Engine
    *   |_ Scene 1 (activated)
    *     |_ Actor 1
    *       |_ Child Actor 1
    *     |_ Actor 2
    *   |_ Scene 2 (deactiveated)
    *   |_ Scene 3 (deactiveated)
    * ```
    *
    * The engine splits the game into two primary responsibilities: updating and drawing. This is
    * to keep your game smart about splitting duties so that you aren't drawing when doing
    * logic or performing logic as you draw.
    *
    * ### Update Loop
    *
    * The first operation run is the [[Engine._update|update]] loop. [[Actor]] and [[Scene]] both implement
    * an overridable/extendable `update` method. Use it to perform any logic-based operations
    * in your game for a particular class.
    *
    * ### Draw Loop
    *
    * The next step is the [[Engine._draw|draw]] loop. A [[Scene]] loops through its child [[Actor|actors]] and
    * draws each one. You can override the `draw` method on an actor to customize its drawing.
    * You should **not** perform any logic in a draw call, it should only relate to drawing.
    *
    * ## Working with Scenes
    *
    * The engine automatically creates a "root" [[Scene]]. You can use this for whatever you want.
    * You can manipulate scenes using [[Engine.add|add]], [[Engine.remove|remove]], 
    * and [[Engine.goToScene|goToScene]]. You can overwrite or remove the `root` scene if 
    * you want. There always has to be at least one scene and only **one** scene can be 
    * active at any one time.
    *
    * Learn more about the [[Scene|scene lifecycle]].
    *
    * ### Adding a scene
    *
    * ```js
    * var game = new ex.Engine();
    *
    * // create a new level
    * var level1 = new ex.Scene();
    *
    * // add level 1 to the game
    * game.add("level1", level1);
    *
    * // in response to user input, go to level 1
    * game.goToScene("level1");
    *
    * // go back to main menu
    * game.goToScene("root");
    * ```
    *
    * ### Accessing the current scene
    * 
    * To add actors and other entities to the current [[Scene]], you can use [[Engine.add|add]]. Alternatively,
    * you can use [[Engine.currentScene]] to directly access the current scene.
    *
    * ## Managing the Viewport
    *
    * Excalibur supports multiple [[DisplayMode|display modes]] for a game. Pass in a `displayMode`
    * option when creating a game to customize the viewport.    
    *
    * ## Extending the Engine
    *
    * For complex games, any entity that inherits [[Class]] can be extended to override built-in
    * functionality. This is recommended for [[Actor|actors]] and [[Scene|scenes]], especially.
    *
    * You can customize the options or provide more for your game by extending [[Engine]].
    *
    * **TypeScript**
    *
    * ```ts
    * class Game extends ex.Engine {
    * 
    *   constructor() {
    *     super({ width: 800, height: 600, displayMode: DisplayMode.FullScreen });
    *   }
    * 
    *   public start() {
    *     // add custom scenes
    *     this.add("mainmenu", new MainMenu());
    *
    *     return super.start(myLoader).then(() => {
    *
    *       this.goToScene("mainmenu");
    *
    *       // custom start-up
    *     });
    *   }
    * }
    *
    * var game = new Game();
    * game.start();
    * ```
    *
    * **Javascript**
    *
    * ```js
    * var Game = ex.Engine.extend({
    * 
    *   constructor: function () {
    *     Engine.call(this, { width: 800, height: 600, displayMode: DisplayMode.FullScreen });
    *   }
    * 
    *   start: function() {
    *     // add custom scenes
    *     this.add("mainmenu", new MainMenu());
    *
    *     var _this = this;
    *     return Engine.prototype.start.call(this, myLoader).then(function() {
    *
    *       _this.goToScene("mainmenu");
    *
    *       // custom start-up
    *     });
    *   }
    * });
    *
    * var game = new Game();
    * game.start();
    * ```
    */
   export class Engine extends ex.Class {

      /**
       * Direct access to the engine's canvas element
       */
      public canvas: HTMLCanvasElement;

      /**
       * Direct access to the engine's 2D rendering context
       */
      public ctx: CanvasRenderingContext2D;

      /**
       * Direct access to the canvas element ID, if an ID exists
       */
      public canvasElementId: string;

      /**
       * The width of the game canvas in pixels
       */
      public width: number;
      /**
       * The height of the game canvas in pixels
       */
      public height: number;

      /**
       * Access engine input like pointer, keyboard, or gamepad
       */
      public input: ex.Input.IEngineInput;

      /**
       * Gets or sets the [[CollisionStrategy]] for Excalibur actors
       */
      public collisionStrategy: CollisionStrategy = CollisionStrategy.DynamicAABBTree;

      private _hasStarted: boolean = false;

      /**
       * Current FPS
       */
      public fps: number = 0;
      
      /**
       * Gets or sets the list of post processors to apply at the end of drawing a frame (such as [[ColorBlindCorrector]])
       */
      public postProcessors: IPostProcessor[] = [];

      /**
       * The current [[Scene]] being drawn and updated on screen
       */
      public currentScene: Scene;

      /**
       * The default [[Scene]] of the game, use [[Engine.goToScene]] to transition to different scenes.
       */
      public rootScene: Scene;

      /**
       * Contains all the scenes currently registered with Excalibur
       */
      public scenes: {[key: string]: Scene; } = {};
      
      private _animations: AnimationNode[] = [];
      
      /**
       * Indicates whether the engine is set to fullscreen or not
       */
      public isFullscreen: boolean = false;

      /**
       * Indicates the current [[DisplayMode]] of the engine.
       */
      public displayMode: DisplayMode = DisplayMode.FullScreen;

      /**
       * Indicates whether audio should be paused when the game is no longer visible.
       */
      public pauseAudioWhenHidden: boolean = true;

      /**
       * Indicates whether the engine should draw with debug information
       */
      public isDebug: boolean = false;
      public debugColor: Color = new Color(255, 255, 255);
      /**
       * Sets the background color for the engine.
       */
      public backgroundColor: Color = new Color(0, 0, 100);
      
      /**
       * The action to take when a fatal exception is thrown
       */
      public onFatalException = (e) => { Logger.getInstance().fatal(e); };

      private _logger: Logger; 
      private _isSmoothingEnabled: boolean = true;
      
      // this is a reference to the current requestAnimationFrame return value
      private _requestId: number;
      
      // this determines whether excalibur is compatible with your browser
      private _compatible: boolean;

      // loading
      private _loader: ILoadable;
      private _isLoading: boolean = false;
      private _progress: number = 0;
      private _total: number = 1;
      private _loadingDraw: (ctx: CanvasRenderingContext2D, loaded: number, total: number) => void;

      /**
       * Creates a new game using the given [[IEngineOptions]]
       */
      constructor(options: IEngineOptions);
      /**
       * Creates a new game with the given options
       * @param width            The width in pixels of the Excalibur game viewport
       * @param height           The height in pixels of the Excalibur game viewport
       * @param canvasElementId  If this is not specified, then a new canvas will be created and inserted into the body.
       * @param displayMode      If this is not specified, then it will fall back to fixed if a height and width are specified, else the 
       * display mode will be FullScreen.
       * @obsolete Use [[Engine.constructor]] with [[IEngineOptions]]
       */
      constructor(width?: number, height?: number, canvasElementId?: string, displayMode?: DisplayMode);
      /**
       * @internal
       */
      constructor(args: any) {

         super();
         var width: number;
         var height: number;
         var canvasElementId: string;
         var displayMode: DisplayMode;
         var options: IEngineOptions = null;

         if (typeof arguments[0] === 'number') {
            width = <number>arguments[0];
            height = <number>arguments[1];
            canvasElementId = <string>arguments[2];
            displayMode = <DisplayMode>arguments[3];
         } else {
            options = <IEngineOptions>arguments[0] || {width: 0, height: 0, canvasElementId: '', displayMode: DisplayMode.FullScreen};
            width = options.width;
            height = options.height;
            canvasElementId = options.canvasElementId;
            displayMode = options.displayMode;
         }
         
         // Check compatibility 
         var detector = new ex.Detector();
         if(!(this._compatible = detector.test())) {
            var message = document.createElement('div');
            message.innerText = 'Sorry, your browser does not support all the features needed for Excalibur';
            document.body.appendChild(message);
            
            detector.failedTests.forEach(function(test){
               var testMessage = document.createElement('div');
               testMessage.innerText = 'Browser feature missing ' + test;
               document.body.appendChild(testMessage);
            });
            
            if(canvasElementId) {
               var canvas = document.getElementById(canvasElementId);
               if(canvas) {
                  canvas.parentElement.removeChild(canvas);
               }
            }
            
            return;
         }
         
         this._logger = Logger.getInstance();
         
         this._logger.info('Powered by Excalibur.js visit", "http://excaliburjs.com", "for more information.');
         
         this._logger.debug('Building engine...');

         this.canvasElementId = canvasElementId;

         if (canvasElementId) {
            this._logger.debug('Using Canvas element specified: ' + canvasElementId);
            this.canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);
         } else {
            this._logger.debug('Using generated canvas element');
            this.canvas = <HTMLCanvasElement>document.createElement('canvas');
         }
         if (width && height) {
            if (displayMode === undefined) {
               this.displayMode = DisplayMode.Fixed;
            }
            this._logger.debug('Engine viewport is size ' + width + ' x ' + height);
            this.width = width; 
            this.canvas.width = width;
            this.height = height; 
            this.canvas.height = height;

         } else if (!displayMode) {
            this._logger.debug('Engine viewport is fullscreen');
            this.displayMode = DisplayMode.FullScreen;
         }
                  
       
         this._loader = new Loader();

         this._initialize(options);

         this.rootScene = this.currentScene = new Scene(this);

         this.addScene('root', this.rootScene);
         this.goToScene('root');
      }

      /**
       * Plays a sprite animation on the screen at the specified `x` and `y`
       * (in game coordinates, not screen pixels). These animations play
       * independent of actors, and will be cleaned up internally as soon
       * as they are complete. Note animations that loop will never be
       * cleaned up.
       *
       * @param animation  Animation to play
       * @param x          x game coordinate to play the animation
       * @param y          y game coordinate to play the animation
       */
      public playAnimation(animation: Animation, x: number, y: number) {
         this._animations.push(new AnimationNode(animation, x, y));
      }

      /**
       * Adds an actor to the [[currentScene]] of the game. This is synonymous
       * to calling `engine.currentScene.addChild(actor)`.
       *
       * Actors can only be drawn if they are a member of a scene, and only
       * the [[currentScene]] may be drawn or updated.
       *
       * @param actor  The actor to add to the [[currentScene]]
       * 
       * @obsolete Use [[add]] instead.
       */
      public addChild(actor: Actor) {
         this.currentScene.addChild(actor);
      }

      /**
       * Removes an actor from the [[currentScene]] of the game. This is synonymous
       * to calling `engine.currentScene.removeChild(actor)`.
       * Actors that are removed from a scene will no longer be drawn or updated.
       *
       * @param actor  The actor to remove from the [[currentScene]].      
       */
      public removeChild(actor: Actor) {
         this.currentScene.removeChild(actor);
      }

      /**
       * Adds a [[TileMap]] to the [[currentScene]], once this is done the TileMap 
       * will be drawn and updated.
       */
      public addTileMap(tileMap: TileMap) {
         this.currentScene.addTileMap(tileMap);
      }

      /**
       * Removes a [[TileMap]] from the [[currentScene]], it will no longer be drawn or updated.
       */
      public removeTileMap(tileMap: TileMap) {
         this.currentScene.removeTileMap(tileMap);
      }
      
      /**
       * Adds a [[Timer]] to the [[currentScene]].
       * @param timer  The timer to add to the [[currentScene]].
       */
      public addTimer(timer: Timer): Timer {
         return this.currentScene.addTimer(timer);
      }

      /**
       * Removes a [[Timer]] from the [[currentScene]].
       * @param timer  The timer to remove to the [[currentScene]].       
       */
      public removeTimer(timer: Timer): Timer {
         return this.currentScene.removeTimer(timer);
      }

      /**
       * Adds a [[Scene]] to the engine, think of scenes in Excalibur as you
       * would levels or menus.
       *
       * @param key  The name of the scene, must be unique
       * @param scene The scene to add to the engine       
       */
      public addScene(key: string, scene: Scene) {
         if (this.scenes[key]) {
            this._logger.warn('Scene', key, 'already exists overwriting');
         }
         this.scenes[key] = scene;
         scene.engine = this;
      }

      /**
       * Removes a [[Scene]] instance from the engine
       * @param scene  The scene to remove
       */
      public removeScene(scene: Scene): void;
      /**
       * Removes a scene from the engine by key
       * @param key  The scene key to remove
       */
      public removeScene(key: string): void;
      /**
       * @internal
       */
      public removeScene(entity: any): void {
         if (entity instanceof Scene) {
            // remove scene
            for (var key in this.scenes) {
               if (this.scenes.hasOwnProperty(key)) {
                  if (this.scenes[key] === entity) {
                     delete this.scenes[key];
                  }
               }
            }
         }

         if (typeof entity === 'string') {
            // remove scene
            delete this.scenes[entity];
         }
      }

      /**
       * Adds a [[Scene]] to the engine, think of scenes in Excalibur as you
       * would levels or menus.
       * @param sceneKey  The key of the scene, must be unique
       * @param scene     The scene to add to the engine       
       */
      public add(sceneKey: string, scene: Scene): void;
      /**
       * Adds a [[Timer]] to the [[currentScene]].
       * @param timer  The timer to add to the [[currentScene]].
       */
      public add(timer: Timer): void;
      /**
       * Adds a [[TileMap]] to the [[currentScene]], once this is done the TileMap 
       * will be drawn and updated.
       */
      public add(tileMap: TileMap): void;
      /**
       * Adds an actor to the [[currentScene]] of the game. This is synonymous
       * to calling `engine.currentScene.add(actor)`.
       *
       * Actors can only be drawn if they are a member of a scene, and only
       * the [[currentScene]] may be drawn or updated.
       *
       * @param actor  The actor to add to the [[currentScene]]
       */
      public add(actor: Actor): void;

      /**
       * Adds a [[UIActor]] to the [[currentScene]] of the game, 
       * UIActors do not participate in collisions, instead the 
       * remain in the same place on the screen.
       * @param uiActor  The UIActor to add to the [[currentScene]]
       */
      public add(uiActor: UIActor): void;
      public add(entity: any): void {
         if (entity instanceof UIActor) {
            this.currentScene.addUIActor(entity);
            return;
         } 
         if (entity instanceof Actor) {
            this.addChild(entity);
         }
         if (entity instanceof Timer) {
            this.addTimer(entity);
         }

         if (entity instanceof TileMap) {
            this.addTileMap(entity);
         }

         if (arguments.length === 2) {
            this.addScene((<string>arguments[0]), (<Scene>arguments[1]));
         }
      }

      /**
       * Removes a scene instance from the engine
       * @param scene  The scene to remove
       */
      public remove(scene: Scene): void;
      /**
       * Removes a scene from the engine by key
       * @param sceneKey  The scene to remove
       */
      public remove(sceneKey: string): void;
      /**
       * Removes a [[Timer]] from the [[currentScene]].
       * @param timer  The timer to remove to the [[currentScene]].       
       */
      public remove(timer: Timer): void;
      /**
       * Removes a [[TileMap]] from the [[currentScene]], it will no longer be drawn or updated.
       */
      public remove(tileMap: TileMap): void;
      /**
       * Removes an actor from the [[currentScene]] of the game. This is synonymous
       * to calling `engine.currentScene.removeChild(actor)`.
       * Actors that are removed from a scene will no longer be drawn or updated.
       *
       * @param actor  The actor to remove from the [[currentScene]].      
       */
      public remove(actor: Actor): void;
      /**
       * Removes a [[UIActor]] to the scene, it will no longer be drawn or updated
       * @param uiActor  The UIActor to remove from the [[currentScene]]
       */
      public remove(uiActor: UIActor): void;
      public remove(entity: any): void {
         if (entity instanceof UIActor) {
            this.currentScene.removeUIActor(entity);
            return;
         } 
         if (entity instanceof Actor) {
            this.removeChild(entity);
         }
         if (entity instanceof Timer) {
            this.removeTimer(entity);
         }

         if (entity instanceof TileMap) {
            this.removeTileMap(entity);
         }

         if (entity instanceof Scene) {
            this.removeScene(entity);
         }

         if (typeof entity === 'string') {
            this.removeScene(entity);
         }
      }


      /**
       * Changes the currently updating and drawing scene to a different,
       * named scene. Calls the [[Scene]] lifecycle events.
       * @param key  The key of the scene to trasition to.       
       */
      public goToScene(key: string) {
         if (this.scenes[key]) {
            var oldScene = this.currentScene;
            var newScene = this.scenes[key];

            this._logger.debug('Going to scene:', key);

            // only deactivate when initialized
            if (this.currentScene.isInitialized) {
               this.currentScene.onDeactivate.call(this.currentScene);
               this.currentScene.eventDispatcher.emit('deactivate', new DeactivateEvent(newScene));
            }

            // set current scene to new one
            this.currentScene = newScene;

            if (!this.currentScene.isInitialized) {
               this.currentScene.onInitialize.call(this.currentScene, this);
               this.currentScene.eventDispatcher.emit('initialize', new InitializeEvent(this));
               this.currentScene.isInitialized = true;
            }

            this.currentScene.onActivate.call(this.currentScene);
            this.currentScene.eventDispatcher.emit('activate', new ActivateEvent(oldScene));
         } else {
            this._logger.error('Scene', key, 'does not exist!');
         }
      }

      /**
       * Returns the width of the engine's drawing surface in pixels.
       */
      public getWidth(): number {
         if(this.currentScene && this.currentScene.camera) {
            return this.width / this.currentScene.camera.getZoom();
         }
         return this.width;
      }

      /**
       * Returns the height of the engine's drawing surface in pixels.
       */
      public getHeight(): number {
         if(this.currentScene && this.currentScene.camera) {
            return this.height / this.currentScene.camera.getZoom();
         }
         return this.height;
      }

      /**
       * Transforms the current x, y from screen coordinates to world coordinates
       * @param point  Screen coordinate to convert
       */
      public screenToWorldCoordinates(point: Point): Point {
         
         var newX = point.x;
         var newY = point.y;

         // transform back to world space
         newX = (newX / this.canvas.clientWidth) * this.getWidth();
         newY = (newY / this.canvas.clientHeight) * this.getHeight();
         
         
         // transform based on zoom
         newX = newX - this.getWidth() / 2;
         newY = newY - this.getHeight() / 2;

         // shift by focus
         if (this.currentScene && this.currentScene.camera) {
            var focus = this.currentScene.camera.getFocus();
            newX += focus.x;
            newY += focus.y;
         }

         return new Point(Math.floor(newX), Math.floor(newY));
      }

      /**
       * Transforms a world coordinate, to a screen coordinate
       * @param point  World coordinate to convert
       */
      public worldToScreenCoordinates(point: Point): Point {
         
         var screenX = point.x;
         var screenY = point.y;

         // shift by focus
         if (this.currentScene && this.currentScene.camera) {
            var focus = this.currentScene.camera.getFocus();
            screenX -= focus.x;
            screenY -= focus.y;
         }

         // transfrom back on zoom
         screenX = screenX + this.getWidth() / 2;
         screenY = screenY + this.getHeight() / 2;

         // transform back to screen space
         screenX = (screenX * this.canvas.clientWidth) / this.getWidth();
         screenY = (screenY * this.canvas.clientHeight) / this.getHeight();

         return new Point(Math.floor(screenX), Math.floor(screenY));
      }

      /**
       * Sets the internal canvas height based on the selected display mode.
       */
      private _setHeightByDisplayMode(parent: any) {
         if (this.displayMode === DisplayMode.Container) {
            this.width = this.canvas.width = parent.clientWidth;
            this.height = this.canvas.height = parent.clientHeight;
         }

         if (this.displayMode === DisplayMode.FullScreen) {
            document.body.style.margin = '0px';
            document.body.style.overflow = 'hidden';
            this.width = this.canvas.width = parent.innerWidth;
            this.height = this.canvas.height = parent.innerHeight;
         }
      }

      /**
       * Initializes the internal canvas, rendering context, displaymode, and native event listeners
       */
      private _initialize(options?: IEngineOptions) {
         if (this.displayMode === DisplayMode.FullScreen || this.displayMode === DisplayMode.Container) {


            var parent = <any>(this.displayMode === DisplayMode.Container ? 
               <any>(this.canvas.parentElement || document.body) : <any>window);

            this._setHeightByDisplayMode(parent);

            window.addEventListener('resize', (ev: UIEvent) => {
               this._logger.debug('View port resized');
               this._setHeightByDisplayMode(parent);
               this._logger.info('parent.clientHeight ' + parent.clientHeight);
               this.setAntialiasing(this._isSmoothingEnabled);
            });
         }

         // initialize inputs
         this.input = {
            keyboard: new ex.Input.Keyboard(this),
            pointers: new ex.Input.Pointers(this),
            gamepads: new ex.Input.Gamepads(this)
         };
         this.input.keyboard.init();
         this.input.pointers.init(options ? options.pointerScope : ex.Input.PointerScope.Document);
         this.input.gamepads.init();
         

         // Issue #385 make use of the visibility api
         // https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
         document.addEventListener('visibilitychange', () => {
            if (document.hidden || document.msHidden) {
               this.eventDispatcher.emit('hidden', new HiddenEvent());
               this._logger.debug('Window hidden');
            } else {
               this.eventDispatcher.emit('visible', new VisibleEvent());
               this._logger.debug('Window visible');
            }
         });

         /*
         // DEPRECATED in favor of visibility api
         window.addEventListener('blur', () => {
            this.eventDispatcher.publish(EventType[EventType.Blur], new BlurEvent());
         });

         window.addEventListener('focus', () => {
            this.eventDispatcher.publish(EventType[EventType.Focus], new FocusEvent());
         });*/
         
         this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
         if (!this.canvasElementId) {
            document.body.appendChild(this.canvas);
         }

      }

      /**
       * If supported by the browser, this will set the antialiasing flag on the
       * canvas. Set this to `false` if you want a 'jagged' pixel art look to your
       * image resources.
       * @param isSmooth  Set smoothing to true or false       
       */
      public setAntialiasing(isSmooth: boolean) {
         this._isSmoothingEnabled = isSmooth;
         (<any>this.ctx).imageSmoothingEnabled = isSmooth;
         (<any>this.ctx).webkitImageSmoothingEnabled = isSmooth;
         (<any>this.ctx).mozImageSmoothingEnabled = isSmooth;
         (<any>this.ctx).msImageSmoothingEnabled = isSmooth;
      }

      /**
       * Return the current smoothing status of the canvas
       */
      public getAntialiasing(): boolean {
         return (<any>this.ctx).imageSmoothingEnabled || 
                (<any>this.ctx).webkitImageSmoothingEnabled || 
                (<any>this.ctx).mozImageSmoothingEnabled || 
                (<any>this.ctx).msImageSmoothingEnabled;
      }

      
      /**
       * Updates the entire state of the game
       * @param delta  Number of milliseconds elapsed since the last update.
       */
      private _update(delta: number) {
         if (this._isLoading) {
            // suspend updates untill loading is finished
            return;
         }
         this.emit('preupdate', new PreUpdateEvent(this, delta, this));
         // process engine level events
         this.currentScene.update(this, delta);

         // update animations
         this._animations = this._animations.filter(function (a) {
            return !a.animation.isDone();
         });

         // Update input listeners
         this.input.keyboard.update(delta);
         this.input.pointers.update(delta);
         this.input.gamepads.update(delta);

         // Publish update event
         this.eventDispatcher.emit('update', new UpdateEvent(delta));
         this.emit('postupdate', new PreUpdateEvent(this, delta, this));
      }

      /**
       * Draws the entire game
       * @param draw  Number of milliseconds elapsed since the last draw.
       */
      private _draw(delta: number) {
         var ctx = this.ctx;
         this.emit('predraw', new PreDrawEvent(ctx, delta, this));
         if (this._isLoading) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, this.width, this.height);
            this._drawLoadingBar(ctx, this._progress, this._total);
            // Drawing nothing else while loading
            return;
         }

         ctx.clearRect(0, 0, this.width, this.height);
         ctx.fillStyle = this.backgroundColor.toString();
         ctx.fillRect(0, 0, this.width, this.height);
         
         this.currentScene.draw(this.ctx, delta);

         // todo needs to be a better way of doing this
         var a = 0, len = this._animations.length;
         for (a; a < len; a++) {
            this._animations[a].animation.draw(ctx, this._animations[a].x, this._animations[a].y);
         }

         this.fps = 1.0 / (delta / 1000);

         // Draw debug information
         if (this.isDebug) {

            this.ctx.font = 'Consolas';
            this.ctx.fillStyle = this.debugColor.toString();
            var keys = this.input.keyboard.getKeys();
            for (var j = 0; j < keys.length; j++) {
               this.ctx.fillText(keys[j].toString() + ' : ' + (Input.Keys[keys[j]] ? Input.Keys[keys[j]] : 'Not Mapped'), 100, 10 * j + 10);
            }
            
            this.ctx.fillText('FPS:' + this.fps.toFixed(2).toString(), 10, 10);
         }

         // Post processing
         for (var i = 0; i < this.postProcessors.length; i++) {
            this.postProcessors[i].process(this.ctx.getImageData(0, 0, this.width, this.height), this.ctx);
         }

         this.emit('postdraw', new PreDrawEvent(ctx, delta, this));
      }

      /**
       * Starts the internal game loop for Excalibur after loading
       * any provided assets. 
       * @param loader  Optional resources to load before starting the main loop. Some [[ILoadable]] such as a [[Loader]] collection, 
       * [[Sound]], or [[Texture]].
       */
      public start(loader?: ILoadable) : Promise<any> {
         if(!this._compatible) {
            var promise = new Promise();
            return promise.reject('Excalibur is incompatible with your browser');
         }
         
         var loadingComplete: Promise<any>;
         if (loader) {
            loader.wireEngine(this);
            loadingComplete = this.load(loader);
         } else {
            loadingComplete = Promise.wrap();
         }

         if (!this._hasStarted) {
            this._hasStarted = true;
            this._logger.debug('Starting game...');
            


            // Mainloop
            var lastTime = Date.now();
            var game = this;
            (function mainloop() {
               if (!game._hasStarted) {
                  return;
               }
               try {
                     game._requestId = window.requestAnimationFrame(mainloop);
   
                     // Get the time to calculate time-elapsed
                     var now = Date.now();
                     var elapsed = Math.floor(now - lastTime) || 1;
                     // Resolves issue #138 if the game has been paused, or blurred for 
                     // more than a 200 milliseconds, reset elapsed time to 1. This improves reliability 
                     // and provides more expected behavior when the engine comes back
                     // into focus
                     if(elapsed > 200) {
                        elapsed = 1;
                     }
                     game._update(elapsed);
                     game._draw(elapsed);
   
                     lastTime = now;
               
                  } catch (e) {
                     window.cancelAnimationFrame(game._requestId);
                     game.stop();
                     game.onFatalException(e);
                  }
            })();
            this._logger.debug('Game started');
            
         } else {
            // Game already started;
         }
         return loadingComplete;

      }

      /**
       * Stops Excalibur's main loop, useful for pausing the game.
       */
      public stop() {
         if (this._hasStarted) {
            this._hasStarted = false;
            this._logger.debug('Game stopped');
         }
      }
      
      /**
       * Takes a screen shot of the current viewport and returns it as an
       * HTML Image Element.
       */
      public screenshot(): HTMLImageElement {
         var result = new Image();
         var raw = this.canvas.toDataURL('image/png');
         result.src = raw;
         return result;
      }

      /**
       * Draws the Excalibur loading bar
       * @param ctx     The canvas rendering context
       * @param loaded  Number of bytes loaded
       * @param total   Total number of bytes to load
       */
      private _drawLoadingBar(ctx: CanvasRenderingContext2D, loaded: number, total: number) {
         if (this._loadingDraw) {
            this._loadingDraw(ctx, loaded, total);
            return;
         }

         var y = this.canvas.height / 2;
         var width = this.canvas.width / 3;
         var x = width;
         

         // loading image
         var image = new Image();
         /* tslint:disable:max-line-length */
         // 64 bit string encoding of the excalibur logo
         image.src = '';
BAr
         /* tslint:enable:max-line-length */
         var imageHeight = width * 3 / 8;
         var oldAntialias = this.getAntialiasing();
         this.setAntialiasing(true);
         ctx.drawImage(image, 0, 0, 800, 300, x, y - imageHeight - 20, width, imageHeight);

         // loading box
         ctx.strokeStyle = 'white';
         ctx.lineWidth = 2;
         ctx.strokeRect(x, y, width, 20);

         var progress = width * (loaded / total);
         ctx.fillStyle = 'white';
         var margin = 5;
         var progressWidth = progress - margin * 2;
         var height = 20 - margin * 2;
         ctx.fillRect(x + margin, y + margin, progressWidth > 0 ? progressWidth : 0, height);
         this.setAntialiasing(oldAntialias);
      }

      /**
       * Sets the loading screen draw function if you want to customize the draw
       * @param fcn  Callback to draw the loading screen which is passed a rendering context, the number of bytes loaded, and the total 
       * number of bytes to load.
       */
      public setLoadingDrawFunction(fcn: (ctx: CanvasRenderingContext2D, loaded: number, total: number) => void) {
         this._loadingDraw = fcn;
      }

      /**
       * Another option available to you to load resources into the game. 
       * Immediately after calling this the game will pause and the loading screen
       * will appear.
       * @param loader  Some [[ILoadable]] such as a [[Loader]] collection, [[Sound]], or [[Texture]].
       */
      public load(loader: ILoadable): Promise<any> {
         var complete = new Promise<any>();

         this._isLoading = true;

         loader.onprogress = (e) => {
            this._progress = <number>e.loaded;
            this._total = <number>e.total;
            this._logger.debug('Loading ' + (100 * this._progress / this._total).toFixed(0));
         };
         loader.oncomplete = () => {
            setTimeout(() => {
               this._isLoading = false;
               complete.resolve();
            }, 500);
         };
         loader.load();
         
         return complete;
      }

   }

   /**
    * Enum representing the different display modes available to Excalibur
    */
   export enum DisplayMode {
      /** 
       * Show the game as full screen 
       */
      FullScreen,
      /** 
       * Scale the game to the parent DOM container 
       */
      Container,
      /** 
       * Show the game as a fixed size 
       */
      Fixed
   }

   /**
    * @internal
    */
   class AnimationNode {
      constructor(public animation: Animation, public x: number, public y: number) { }
   }

}
