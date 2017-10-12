enum HeroStates {
   Searching,
   Looting,
   Attacking,
   Fleeing,
   Stunned
}

class HeroSpawner {
   private static _spawned: number = 0;
   private static _heroes: Hero[] = [];
   private static _tombstones: ex.Actor[] = [];
   
   public static spawnHero() {
      var i, spawnPoints, spawnPoint, hero;           
      
      for (i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
         spawnPoints = map.getSpawnPoints();
         spawnPoint = Util.pickRandom(spawnPoints);
         
         if (Stats.numHeroesKilled > Config.HardThreshold) {
            heroTimer.interval = Config.HeroSpawnIntervalHard;
         } else if (Stats.numHeroesKilled > Config.MedThreshold) {
            heroTimer.interval = Config.HeroSpawnIntervalMed;
         } else if (Stats.numHeroesKilled > Config.EasyThreshold) {
            heroTimer.interval = Config.HeroSpawnIntervalEasy;
         }
         HeroSpawner._spawn(spawnPoint);
         HeroSpawner._spawned++;
      }
      
      if (HeroSpawner._spawned === 0) {
         spawnPoint = map.getSpawnPoints()[0];
         HeroSpawner._spawn(spawnPoint);
         HeroSpawner._spawned++;
      }
   }
   
   private static _spawn(point: ex.Point) {
      var hero  = new Hero(point.x, point.y);
      game.add(hero);
      this._heroes.push(hero);
   }
   
   public static getHeroes(): Array<Hero> {
      return this._heroes;
   }

   public static despawn(h: Hero) { 
      h.kill();
      _.remove(this._heroes, h);
   }
   
   public static cleanupTombstones() {
      _.forIn(HeroSpawner._tombstones, (tombstone: ex.Actor) => {
         tombstone.kill();
      });
   }
    
   public static reset() {
      HeroSpawner._spawned = 0;
   }
   
   public static getSpawnCount() {
      return HeroSpawner._spawned;
   }
}

class Hero extends ex.Actor {   
   public Health: number = Config.HeroHealth;
   
   private _lootIndicator: ex.Actor;
   private _fsm: TypeState.FiniteStateMachine<HeroStates>;
   private _attackCooldown: number = Config.HeroAttackCooldown;
   private _hasHitMinotaur: boolean = true; 
   private _isAttacking: boolean = false;
   private _timeLeftAttacking: number = 0;
   private _direction: string;
   private _stunnedTime: number= 0;

   constructor(x: number, y: number) {
      super(x, y, 24, 24);
            
      this._fsm = new TypeState.FiniteStateMachine<HeroStates>(HeroStates.Searching);
      
      this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
      this._fsm.from(HeroStates.Attacking).to(HeroStates.Searching);
      this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
      this._fsm.fromAny(HeroStates).to(HeroStates.Stunned);
      this._fsm.from(HeroStates.Stunned).toAny(HeroStates);
      
      this._fsm.on(HeroStates.Stunned, this.onStunned.bind(this));
      this._fsm.onExit(HeroStates.Stunned, this.onExitStunned.bind(this));    
      this._fsm.on(HeroStates.Fleeing, this.onFleeing.bind(this));
      this._fsm.on(HeroStates.Attacking, this.onAttacking.bind(this));
   }
   
   onInitialize(engine: ex.Engine) {
      this.setZIndex(1);
      
      this._lootIndicator = new ex.Actor(5, -24, 24, 24);
      this._lootIndicator.addDrawing(Resources.TextureHeroLootIndicator);
      this._lootIndicator.scale.setTo(1.5, 1.5);
      this._lootIndicator.moveBy(5, -32, 200).moveBy(5, -24, 200).repeatForever();
      
      var spriteSheet = new ex.SpriteSheet(Resources.TextureHero, 7, 1, 28, 28);
      var idleAnim = spriteSheet.getAnimationByIndices(engine, [0, 1, 2], 300);
      idleAnim.loop = true;
      idleAnim.scale.setTo(2, 2);      
      this.addDrawing("idleLeft", idleAnim);
      
      var rightDamange = spriteSheet.getSprite(0).clone();
      rightDamange.flipHorizontal = true;
      rightDamange.lighten(100);
      rightDamange.scale.setTo(2, 2);
      
      this.addDrawing("damageRight", rightDamange);
      
      var leftDamage = rightDamange.clone();
      leftDamage.flipHorizontal = true;
      
      this.addDrawing("damageLeft", leftDamage);
      
      var rightAnim = spriteSheet.getAnimationByIndices(engine, [0, 1, 2], 300);
      rightAnim.flipHorizontal = true;
      rightAnim.loop = true;
      rightAnim.scale.setTo(2, 2);      
      this.addDrawing("idleRight", rightAnim);
      
      var attackAnim = spriteSheet.getAnimationByIndices(engine, [3, 4, 5, 6], 100);
      attackAnim.loop = true;
      attackAnim.scale.setTo(2, 2);      
      this.addDrawing("attackLeft", attackAnim);
      
      var attackRightAnim = spriteSheet.getAnimationByIndices(engine, [3, 4, 5, 6], 100);
      attackRightAnim.flipHorizontal = true;
      attackRightAnim.loop = true;
      attackRightAnim.scale.setTo(2, 2);      
      this.addDrawing("attackRight", attackRightAnim);
      
      this.collisionType = ex.CollisionType.Passive;
      
      this.on('collision', (e?: ex.CollisionEvent) => {
         if (e.other instanceof Monster) {
            var hero = <Hero>e.actor;
            
            if (hero._attackCooldown == 0 && hero._hasHitMinotaur) {
               var monster = <Monster>e.other;
               if (!monster.isDashing()) {
                  monster.health--;
               }
               map.damageEffect();
               
               Stats.damageTaken++;
               hero._attackCooldown = Config.HeroAttackCooldown;
               if(!hero._isAttacking){
                  if(this._direction === 'right') {
                     hero.setDrawing('attackRight');
                  } else {
                     hero.setDrawing('attackLeft');
                  }
                  hero._isAttacking = true;
                  hero._timeLeftAttacking = 300;
               }
               
               var origin = new ex.Vector(hero.x, hero.y);
               var dest = new ex.Vector(monster.x, monster.y);
               var a = dest.subtract(origin).toAngle(); 
            } 
            
                      
            if (!hero._hasHitMinotaur) {
               hero._hasHitMinotaur = true;
               hero._attackCooldown = Config.HeroAttackCooldown;
            }
         }
      });  
   }
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      if (this.Health <= 0) { 
            Stats.numHeroesKilled++;
            HeroSpawner.despawn(this);
      }
      this.setZIndex(this.y);
      this._attackCooldown = Math.max(this._attackCooldown - delta, 0);
      
      var heroVector = new ex.Vector(this.x, this.y);
      var monsterVector = new ex.Vector(map._player.x, map._player.y);
      
      if(this.dx > 0) {
         if(this._direction !== "right") {
            this._direction = "right";
            this.setDrawing("idleRight");
         }   
      }
      
      if(this.dx < 0) {
         if(this._direction !== "left") {
            this._direction = "left";
            this.setDrawing("idleLeft");
         }
      }
      
      if(this._fsm.currentState === HeroStates.Stunned){
         if(this._direction == "left"){
            this.setDrawing("damageLeft");
         }
         if(this._direction == "right"){
            this.setDrawing("damageRight");
         }
      }

      if(this._isAttacking) {
         this._timeLeftAttacking -= delta;
         if(this._timeLeftAttacking <= 0) {
            if(this._direction == "right") {
               this.setDrawing("idleRight");
            }else{
               this.setDrawing("idleLeft");
            }
            
            this._isAttacking = false;
         }
      }
      
      switch (this._fsm.currentState) {
         case HeroStates.Stunned:
            this._stunnedTime -= delta; 
         break;
         case HeroStates.Searching:
            if (heroVector.distance(monsterVector) <= Config.HeroAggroDistance) {
               this._fsm.go(HeroStates.Attacking);
            }
         break;
         case HeroStates.Attacking:
            if (heroVector.distance(monsterVector) > Config.HeroAggroDistance) {
               this.clearActions();
               this._fsm.go(HeroStates.Searching);
            } else if (heroVector.distance(monsterVector) <= Config.HeroAggroDistance) {
               this.clearActions();
               this.meet(map._player, Config.HeroSpeed); 
               if (heroVector.distance(monsterVector) < Config.HeroMeleeRange) {
                  this.clearActions();
               }
            }
         break;
      }
   }

   public getLines() {
      var lines = new Array<ex.Line>();

      var beginPoint1 = new ex.Point(this.x, this.y);
      var endPoint1 = new ex.Point(this.x + this.getWidth(), this.y);
      var newLine1 = new ex.Line(beginPoint1, endPoint1);

      // beginPoint2 is endPoint1
      var endPoint2 = new ex.Point(endPoint1.x, endPoint1.y + this.getHeight());
      var newLine2 = new ex.Line(endPoint1, endPoint2);

      // beginPoint3 is endPoint2
      var endPoint3 = new ex.Point(this.x, this.y + this.getHeight());
      var newLine3 = new ex.Line(endPoint2, endPoint3);

      // beginPoint4 is endPoint3
      // endPoint4 is beginPoint1
      var newLine4 = new ex.Line(endPoint3, beginPoint1);

      lines.push(newLine1);
      lines.push(newLine2);
      lines.push(newLine3);
      lines.push(newLine4);
      
      var half = this.getWidth()/4;
      lines.forEach(function(l){
         l.begin.x -= half;
         l.begin.y -= half;
         l.end.x -= half;
         l.end.y -= half;
      })
      
      return lines;
   }
   
   public debugDraw(ctx: CanvasRenderingContext2D): void{
      var lines = this.getLines();
      lines.forEach(function(l){
         ex.Util.drawLine(ctx, ex.Color.Green.toString(), l.begin.x, l.begin.y, l.end.x, l.end.y);
      });
   }
   
   public stun(direction: ex.Vector){      
      this._fsm.go(HeroStates.Stunned);
      var dir = direction.normalize().scale(Config.KnockBackForce);
      this.dx = dir.x;
      this.dy = dir.y;
   }
   
   private onFleeing(from?: HeroStates) {
      var exits = map.getSpawnPoints();
      var exit = Util.pickRandom(exits);
      
      this.moveTo(exit.x, exit.y, Config.HeroFleeingSpeed).callMethod(() => this.onExit());
   }
   
   private onAttacking(from?: HeroStates) {
      this.clearActions();
      this.meet(map._player, Config.HeroSpeed);
   }
   
   private onStunned(from?: HeroStates) {
      this.clearActions();
      this._stunnedTime = Config.HeroStunnedTime;
   }
   
   private onExitStunned(from?: HeroStates) {
      if(this._direction === "left"){
         this.setDrawing("idleLeft");   
      }
      if(this._direction === "right") {
         this.setDrawing("idleRight");
      }
      return true;
   }
   
   private onExit() {
      Stats.numHeroesEscaped++;
      HeroSpawner.despawn(this);
   }
}