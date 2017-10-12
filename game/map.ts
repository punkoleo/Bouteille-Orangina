class Map extends ex.Scene {
   public static CellSize = 24;
   public static MapSize = 40;
    
   private _map: ex.Actor;
   public _player: Monster;
   private _lootProgress: ex.UIActor;
   private _monsterProgress: ex.UIActor;
   private _vg: ex.UIActor;
   private _damageEffectTimeLeft: number = 0;
   private _takingDamage: boolean = false;
   private _survivalTimer = 0;
   
   constructor(engine: ex.Engine) {
      super(engine);
   }
   
   public damageEffect(): void {
      this._takingDamage = true;
      this._vg.setDrawing("red");
      this.camera.shake(3, 3, 200);
      this._damageEffectTimeLeft = Config.RedVignetteDuration;
   }
   
   public onInitialize(engine: ex.Engine) {
      this._map = new ex.Actor(0, 0, 960, 960);
      this._map.anchor.setTo(0, 0);
      this._map.addDrawing(Resources.TextureMap);
      this.add(this._map);
       
      this._vg = new ex.UIActor(0, 0, game.getWidth(), game.getHeight());
      var blackVignette = Resources.TextureVignette.asSprite().clone();
      var redVignette = Resources.TextureVignette.asSprite().clone();
      redVignette.colorize(new ex.Color(70, 0, 0));
      var anim = new ex.Animation(engine, [], 100, false);
      
      this._vg.addDrawing("red", redVignette);
      this._vg.addDrawing("black", blackVignette);
      this._vg.setDrawing("black");
      
      this.add(this._vg);
      this.buildWalls();
      
      // GUI
      
      this._lootProgress = new ex.UIActor(60, 27, 0, 32);
      this._lootProgress.anchor.setTo(0, 0);
      this._lootProgress.color = ex.Color.fromHex("#f25500");
      this.add(this._lootProgress);
      
      this._monsterProgress = new ex.UIActor(game.getWidth() - 66, 27, Config.MonsterProgressSize, 32);
      this._monsterProgress.anchor.setTo(1, 0);
      this._monsterProgress.color = ex.Color.fromHex("#ab2800");
      this.add(this._monsterProgress);
      
      var monsterIndicator = new ex.UIActor(game.getWidth() - 74, 10, 64, 64);
      monsterIndicator.addDrawing(Resources.TextureMonsterIndicator);
      this.add(monsterIndicator);
         
      var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
      this._player = new Monster(playerSpawn.x, playerSpawn.y);
      
      this.add(this._player);
   }
   
   public onActivate() {
      SoundManager.start();    
      this._survivalTimer = 0;
   }
   
   public onDeactivate() {      
      game.canvas.className = "";
   }
   
   public getPlayer(): Monster {
      return this._player;
   }
   
   public resetPlayer() {
      this._player.health = Config.MonsterHealth;
      var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
      this._player.x = playerSpawn.x;
      this._player.y = playerSpawn.y;
   }
    
   public getSpawnPoints(): ex.Point[] {      
      return [
         this.getCellPos(0, 19),
         this.getCellPos(39, 19)
      ]
   }
   
   public buildWalls() {
      var x, y, cell, wall: ex.Actor;
      for (x = 0; x < Map.MapSize; x++) {
         for (y = 0; y < Map.MapSize; y++) {
            cell = this._walls[x + y * Map.MapSize];
            
            if (cell !== 0) {
               wall = new ex.Actor(x * Map.CellSize, y * Map.CellSize, Map.CellSize, Map.CellSize);
               wall.traits.length = 0;
               wall.traits.push(new ex.Traits.OffscreenCulling());
               wall.anchor.setTo(0, 0);               
               wall.collisionType = ex.CollisionType.Fixed;
               
               this.add(wall);
            }
         }
      }
   }
   
   public isWall(x: number, y: number) {
      var cellX = Math.floor(x / Map.CellSize)
      var cellY = Math.floor(y / Map.CellSize); 
      
      if (cellX < 0 || cellX > Map.MapSize || cellY < 0 || cellY > Map.MapSize) return true;
      
      return this._walls[cellX + cellY * Map.MapSize] !== 0;
   }
   
   public getCellPos(x: number, y: number): ex.Point {
      return new ex.Point(Map.CellSize * x, Map.CellSize * y);
   }
   
   public getSurvivalTime() {
      return this._survivalTimer;
   }
   
   private _cameraVel = new ex.Vector(0, 0);
   
   public update(engine: ex.Engine, delta: number) {
      super.update(engine, delta);
      
      this._survivalTimer += delta;
      
      if(this._takingDamage){
         this._damageEffectTimeLeft -= delta;
         if(this._damageEffectTimeLeft <= 0){
            this._takingDamage = false;
            this._vg.setDrawing("black");
         }
      }
       
      var monsterHealth = this._player.health;
      var progress = monsterHealth / Config.MonsterHealth;
      
      this._monsterProgress.setWidth(Math.floor(progress * Config.MonsterProgressSize));
            
      var focus = game.currentScene.camera.getFocus().toVector();
      var position = new ex.Vector(this._player.x, this._player.y);
      var stretch = position.minus(focus).scale(Config.CameraElasticity);
      this._cameraVel = this._cameraVel.plus(stretch);
      var friction = this._cameraVel.scale(-1).scale(Config.CameraFriction);
      this._cameraVel = this._cameraVel.plus(friction);
      focus = focus.plus(this._cameraVel);
      game.currentScene.camera.setFocus(focus.x, focus.y);
   }
   
   public _gameOver(type: GameOverType) {
      isGameOver = true;      
      game.goToScene('gameover');
      gameOver.setType(type);      
   }
   private _walls: number[] = [179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 292, 293, 293, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 509, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 509, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 185, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 509, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 295, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 296, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 300, 179, 179, 179, 179, 298, 299, 179, 179, 179, 188, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 189, 179, 179, 179, 179, 179, 179, 179, 179, 179];
}