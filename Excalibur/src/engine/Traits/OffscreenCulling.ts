/// <reference path="../Interfaces/IActorTrait.ts" />
/// <reference path="../Util/CullingBox.ts" />

module ex.Traits {
   export class OffscreenCulling implements IActorTrait {

      public cullingBox: ex.CullingBox = new ex.CullingBox();

      public update(actor: Actor, engine: Engine, delta: number) {
         var eventDispatcher = actor.eventDispatcher;
         var anchor = actor.anchor;
         var globalScale = actor.getGlobalScale();
         var width = globalScale.x * actor.getWidth() / actor.scale.x;
         var height = globalScale.y * actor.getHeight() / actor.scale.y;
         var actorScreenCoords = engine.worldToScreenCoordinates(new Point(actor.getWorldX() - anchor.x * width, 
                                                                           actor.getWorldY() - anchor.y * height));

         var zoom = 1.0;
         if (actor.scene && actor.scene.camera) {
            zoom = actor.scene.camera.getZoom();   
         }
         
         var isSpriteOffScreen = true;
         if (actor.currentDrawing != null) {
            isSpriteOffScreen = this.cullingBox.isSpriteOffScreen(actor, engine);
         }
         
         if (!actor.isOffScreen) {
            if((actorScreenCoords.x + width * zoom < 0 || 
               actorScreenCoords.y + height * zoom < 0 ||
               actorScreenCoords.x > engine.width ||
               actorScreenCoords.y > engine.height) &&
               isSpriteOffScreen ) {
               
               eventDispatcher.emit('exitviewport', new ExitViewPortEvent());
               actor.isOffScreen = true;
            }
         } else {
            if((actorScreenCoords.x + width * zoom > 0 &&
               actorScreenCoords.y + height * zoom > 0 &&
               actorScreenCoords.x < engine.width &&
               actorScreenCoords.y < engine.height) ||
               !isSpriteOffScreen) {
               
               eventDispatcher.emit('enterviewport', new EnterViewPortEvent());               
               actor.isOffScreen = false;
            }
         }
      }
   }
}