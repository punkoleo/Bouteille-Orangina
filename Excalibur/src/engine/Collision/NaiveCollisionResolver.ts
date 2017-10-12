﻿/// <reference path="../Actor.ts"/>
/// <reference path="Side.ts"/>
/// <reference path="ICollisionResolver.ts"/> 

module ex {
   export class NaiveCollisionResolver implements ICollisionResolver {
      
      public register(target: Actor) {
         // pass
      }

      public remove(tartet: Actor) {
         // pass
      }

      public evaluate(targets: Actor[]): CollisionPair[] {

         // Retrieve the list of potential colliders, exclude killed, prevented, and self
         var potentialColliders = targets.filter((other) => {
            return !other.isKilled() && other.collisionType !== CollisionType.PreventCollision;
         });

         var actor1: Actor;
         var actor2: Actor;
         var collisionPairs = [];

         for (var j = 0, l = potentialColliders.length; j < l; j++) {

            actor1 = potentialColliders[j];

            for (var i = j + 1; i < l; i++) {

               actor2 = potentialColliders[i];

               var minimumTranslationVector;
               if (minimumTranslationVector = actor1.collides(actor2)) {
                  var side = actor1.getSideFromIntersect(minimumTranslationVector);
                  var collisionPair = new CollisionPair(actor1, actor2, minimumTranslationVector, side);
                  if (!collisionPairs.some((cp) => {
                     return cp.equals(collisionPair);
                  })) {
                     collisionPairs.push(collisionPair);
                  }
               }
            }

         }

         var k = 0, len = collisionPairs.length;
         for (k; k < len; k++) {
            collisionPairs[k].evaluate();
         }
         
         return collisionPairs;
      }

      public update(targets: Actor[]): number {
         return 0;
      }

      public debugDraw(ctx: CanvasRenderingContext2D, delta: number) {
         return;
      }
   }
}