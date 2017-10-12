﻿module ex {

   export interface ICollisionResolver {
      register(target: Actor);
      remove(tartet: Actor);
      evaluate(targets: Actor[]): CollisionPair[];
      update(targets: Actor[]): number;
      debugDraw(ctx, delta): void;
   }
 }