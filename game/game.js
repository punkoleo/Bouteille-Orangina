var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Config = {
    PlayerCellSpawnX: 10,
    PlayerCellSpawnY: 19,

    MonsterHealth: 6,
    MonsterWidth: 48,
    MonsterHeight: 48,
    MonsterSpeed: 200,
    MonsterWalkFrameSpeed: 100,

    MonsterAttackRange: 100,
    CloseMonsterAttackRange: 10,
    MonsterProgressSize: 200,
    MonsterAttackTime: 300,
    MonsterAttackCooldown: 500,
    KnockBackForce: 200,
    RedVignetteDuration: 500,
    MonsterDamageCameraShakeDuration: 300,
    CameraElasticity: 0.1,
    CameraFriction: 0.5,
    CameraShake: 0,
    CameraShakeDuration: 0,
    HeroSpawnInterval: 10000,
    HeroSpawnIntervalEasy: 7500,
    HeroSpawnIntervalMed: 6000,
    HeroSpawnIntervalHard: 4000,
    EasyThreshold: 10,
    MedThreshold: 20,
    HardThreshold: 30,
    HeroSpawnPoolMax: 5,
    HeroHealth: 3,
    HeroSpeed: 100,
    HeroFleeingSpeed: 80,
    HeroAttackCooldown: 1500,
    HeroAggroDistance: 1500,
    HeroMeleeRange: 30,
    HeroStunnedTime: 100
};
var Resources = {
    SoundMusic: new ex.Sound('sounds/music.mp3', 'sounds/music.wav'),
    GameOver: new ex.Sound('sounds/fail.mp3', 'sounds/fail.wav'),
    TextureShift: new ex.Texture("images/shift.png"),
    TextureVignette: new ex.Texture("images/vignette.png"),
    //TextureHero: new ex.Texture("images/hero.png"),
    TextureHero: new ex.Texture("images/bomb.png"),
//    TextureHeroLootIndicator: new ex.Texture("images/loot-indicator.png"),
    TextureMonsterDown: new ex.Texture("images/minotaurv3.png"),
    TextureMonsterRight: new ex.Texture("images/minotaurv3.png"),
    TextureMonsterUp: new ex.Texture("images/minotaurv3.png"),
    TextureMonsterAim: new ex.Texture("images/aiming.png"),
    TextureMonsterCharge: new ex.Texture("images/fireball.png"),

    TextureMonsterCharge: new ex.Texture("images/fireball.png"),
    TextureTreasure: new ex.Texture("images/treasure.png"),
    TextureTreasureEmpty: new ex.Texture("images/treasure-empty.png"),
    TextureMonsterIndicator: new ex.Texture("images/mino-indicator.png"),
    TextureMap: new ex.Texture("images/map.png"),
    TextureWall: new ex.Texture("images/wall.png"),
    TextureHeroDead: new ex.Texture("images/hero-dead.png"),
    TextureHeroDead2: new ex.Texture("images/hero-dead-2.png"),
    TextureHeroDead3: new ex.Texture("images/hero-dead-3.png"),
    TextureHeroDead4: new ex.Texture("images/hero-dead-4.png"),
    TextureGameOverBg: new ex.Texture("images/game-over-bg.png"),
    TextureGameOverSlain: new ex.Texture("images/game-over-slain.png"),
    TextureGameOverHoard: new ex.Texture("images/game-over-hoard.png"),
    TextureGameOverRetry: new ex.Texture("images/try-again.png")
};
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.pickRandom = function (arr) {
        return arr[ex.Util.randomIntInRange(0, arr.length - 1)];
    };
    return Util;
}());
var Map = /** @class */ (function (_super) {
    __extends(Map, _super);
    function Map(engine) {
        var _this = _super.call(this, engine) || this;
        _this._damageEffectTimeLeft = 0;
        _this._takingDamage = false;
        _this._survivalTimer = 0;
        _this._cameraVel = new ex.Vector(0, 0);
        _this._walls = [179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 292, 293, 293, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 509, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 179, 179, 179, 509, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 179, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 179, 179, 179, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 291, 186, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 188, 187, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 185, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 739, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1131, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 183, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 509, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 291, 179, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 295, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 296, 179, 179, 179, 179, 179, 179, 179, 179, 188, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 186, 189, 179, 179, 179, 179, 179, 179, 179, 300, 179, 179, 179, 179, 298, 299, 179, 179, 179, 188, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 189, 179, 179, 179, 179, 179, 179, 179, 179, 179];
        return _this;
    }
    Map.prototype.damageEffect = function () {
        this._takingDamage = true;
        this._vg.setDrawing("red");
        this.camera.shake(3, 3, 200);
        this._damageEffectTimeLeft = Config.RedVignetteDuration;
    };
    Map.prototype.onInitialize = function (engine) {
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
    };
    Map.prototype.onActivate = function () {
        SoundManager.start();
        this._survivalTimer = 0;
    };
    Map.prototype.onDeactivate = function () {
        game.canvas.className = "";
    };
    Map.prototype.getPlayer = function () {
        return this._player;
    };
    Map.prototype.resetPlayer = function () {
        this._player.health = Config.MonsterHealth;
        var playerSpawn = this.getCellPos(Config.PlayerCellSpawnX, Config.PlayerCellSpawnY);
        this._player.x = playerSpawn.x;
        this._player.y = playerSpawn.y;
    };
    Map.prototype.getSpawnPoints = function () {
        return [
            this.getCellPos(0, 19),
            this.getCellPos(39, 19)
        ];
    };
    Map.prototype.buildWalls = function () {
        var x, y, cell, wall;
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
    };
    Map.prototype.isWall = function (x, y) {
        var cellX = Math.floor(x / Map.CellSize);
        var cellY = Math.floor(y / Map.CellSize);
        if (cellX < 0 || cellX > Map.MapSize || cellY < 0 || cellY > Map.MapSize)
            return true;
        return this._walls[cellX + cellY * Map.MapSize] !== 0;
    };
    Map.prototype.getCellPos = function (x, y) {
        return new ex.Point(Map.CellSize * x, Map.CellSize * y);
    };
    Map.prototype.getSurvivalTime = function () {
        return this._survivalTimer;
    };
    Map.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this._survivalTimer += delta;
        if (this._takingDamage) {
            this._damageEffectTimeLeft -= delta;
            if (this._damageEffectTimeLeft <= 0) {
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
    };
    Map.prototype._gameOver = function (type) {
        isGameOver = true;
        game.goToScene('gameover');
        gameOver.setType(type);
    };
    Map.CellSize = 24;
    Map.MapSize = 40;
    return Map;
}(ex.Scene));
/// <reference path="game.ts" />
/// <reference path="config.ts" />
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(x, y) {
        var _this = _super.call(this, x, y, Config.MonsterWidth, Config.MonsterHeight) || this;
        _this.health = Config.MonsterHealth;
        _this._rotation = 0;
        _this._isAttacking = false;
        _this._hasMoved = false;
        _this._timeLeftAttacking = 0;
        _this._direction = "none";
        _this._lastSwing = 0;
        _this.color = ex.Color.Red;
        _this._mouseX = 0;
        _this._mouseY = 0;
        _this._rays = new Array();
        _this._closeRays = new Array();
        _this._attackable = new Array();
        _this.collisionType = ex.CollisionType.Active;
        return _this;
    }
    Monster.prototype.onInitialize = function (engine) {
        var _this = this;
        var that = this;
        engine.input.pointers.primary.on('move', function (ev) {
            _this._mouseX = ev.x;
            _this._mouseY = ev.y;
        });
        this._aimSprite = Resources.TextureMonsterAim.asSprite();
        this._aimSprite.scale.setTo(2, 2);
        this._aimSprite.anchor = new ex.Point(.5, .5);
        this._aimSprite.opacity(0);
        this._aimSprite.colorize(ex.Color.Black);
        this._aimSprite.colorize(ex.Color.Black);
        var shiftButton = new ex.SpriteSheet(Resources.TextureShift, 3, 1, 48, 48);
        var shiftAnimation = shiftButton.getAnimationForAll(engine, 100);
        shiftAnimation.loop = true;
        shiftAnimation.scale.setTo(1, 1);
        this._shiftIndicator = new ex.Actor(7, 70, 24, 24);
        this._shiftIndicator.addDrawing("shift", shiftAnimation);
        var downSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterDown, 14, 1, 96, 96);
        var rightSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterRight, 14, 1, 96, 96);
        var upSpriteSheet = new ex.SpriteSheet(Resources.TextureMonsterUp, 14, 1, 96, 96);
        var attackDownAnim = downSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackDownAnim.scale.setTo(2, 2);
        attackDownAnim.loop = true;
        this.addDrawing("attackDown", attackDownAnim);
        var walkDownAnim = downSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkDownAnim.scale.setTo(2, 2);
        walkDownAnim.loop = true;
        this.addDrawing("walkDown", walkDownAnim);
        var attackUpAnim = upSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackUpAnim.scale.setTo(2, 2);
        attackUpAnim.loop = true;
        this.addDrawing("attackUp", attackUpAnim);
        var walkUpAnim = upSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkUpAnim.scale.setTo(2, 2);
        walkUpAnim.loop = true;
        this.addDrawing("walkUp", walkUpAnim);
        var attackRightAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackRightAnim.scale.setTo(2, 2);
        attackRightAnim.loop = true;
        this.addDrawing("attackRight", attackRightAnim);
        var walkRightAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkRightAnim.scale.setTo(2, 2);
        walkRightAnim.loop = true;
        this.addDrawing("walkRight", walkRightAnim);
        var attackLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 9, 13, Config.MonsterAttackTime / 4);
        attackLeftAnim.flipHorizontal = true;
        attackLeftAnim.scale.setTo(2, 2);
        attackLeftAnim.loop = true;
        this.addDrawing("attackLeft", attackLeftAnim);
        var walkLeftAnim = rightSpriteSheet.getAnimationByIndices(engine, [2, 3, 4, 5, 6, 7], Config.MonsterWalkFrameSpeed);
        walkLeftAnim.flipHorizontal = true;
        walkLeftAnim.scale.setTo(2, 2);
        walkLeftAnim.loop = true;
        this.addDrawing("walkLeft", walkLeftAnim);
        var idleAnim = downSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleAnim.loop = true;
        idleAnim.scale.setTo(2, 2);
        this.addDrawing("idleDown", idleAnim);
        var idleUpAnim = upSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleUpAnim.loop = true;
        idleUpAnim.scale.setTo(2, 2);
        this.addDrawing("idleUp", idleUpAnim);
        var idleRightAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleRightAnim.scale.setTo(2, 2);
        idleRightAnim.loop = true;
        this.addDrawing("idleRight", idleRightAnim);
        var idleLeftAnim = rightSpriteSheet.getAnimationBetween(engine, 0, 2, 400);
        idleLeftAnim.flipHorizontal = true;
        idleLeftAnim.scale.setTo(2, 2);
        idleLeftAnim.loop = true;
        this.addDrawing("idleLeft", idleLeftAnim);
        var sprite = Resources.TextureMonsterRight.asSprite().clone();
        sprite.scale.setTo(2, 2);
        this.addDrawing("idleRight", sprite);
        this.setDrawing("idleDown");
        var yValues = new Array(-0.62, -.40, -0.25, -.15, 0, .15, 0.25, .40, 0.62);
        _.forIn(yValues, function (yValue) {
            var rayVector = new ex.Vector(1, yValue);
            var rayPoint = new ex.Point(_this.x, _this.y);
            var ray = new ex.Ray(rayPoint, rayVector);
            that._rays.push(ray);
        });
        var closeXValues = new Array(1, 0.71, 0, -0.71, -1);
        var closeYValues = new Array(0, 0.71, 1, -0.71, 0);
        _.forIn(closeYValues, function (closeYValue) {
            _.forIn(closeXValues, function (closeXValue) {
                var rayVector = new ex.Vector(closeXValue, closeYValue);
                var rayPoint = new ex.Point(_this.x, _this.y);
                var ray = new ex.Ray(rayPoint, rayVector);
                that._closeRays.push(ray);
            });
        });
        // attack
        engine.input.pointers.primary.on("down", function (evt) {
            var currentTime = Date.now();
            if (currentTime - that._lastSwing > Config.MonsterAttackCooldown) {
                that._attack();
                that._isAttacking = true;
                that._timeLeftAttacking = Config.MonsterAttackTime;
                that._lastSwing = currentTime;
            }
        });
    };
    Monster.prototype._findFirstValidPad = function (engine) {
        var gamePad;
        for (var i = 1; i < 5; i++) {
            gamePad = engine.input.gamepads.at(i);
            if (gamePad && gamePad._buttons && gamePad._buttons.length > 0) {
                return gamePad;
            }
        }
    };
    Monster.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        if (this.health <= 0) {
            map._gameOver(GameOverType.Slain);
        }
        if (this.getLeft() < 0) {
            this.x = this.getWidth();
        }
        if (this.getTop() < 0) {
            this.y = this.getHeight();
        }
        if (this.getTop() > Map.MapSize * Map.CellSize) {
            this.y = (Map.MapSize * Map.CellSize) - this.getHeight();
        }
        if (this.getRight() > Map.MapSize * Map.CellSize) {
            this.x = (Map.MapSize * Map.CellSize) - this.getWidth();
        }
        this._attackable.length = 0;
        this._detectAttackable();
        var prevRotation = this._rotation;
        this._rotation = ex.Util.canonicalizeAngle(new ex.Vector(this._mouseX - this.x, this._mouseY - this.y).toAngle());
        _.forIn(this._rays, function (ray) {
            ray.pos = new ex.Point(_this.x, _this.y);
            var rotationAmt = _this._rotation - prevRotation;
            ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
        });
        _.forIn(this._closeRays, function (ray) {
            ray.pos = new ex.Point(_this.x, _this.y);
            var rotationAmt = _this._rotation - prevRotation;
            ray.dir = ray.dir.rotate(rotationAmt, new ex.Point(0, 0));
        });
        this.dx = 0;
        this.dy = 0;
        var pad = this._findFirstValidPad(engine);
        if (pad) {
            var leftAxisY = pad.getAxes(ex.Input.Axes.LeftStickY);
            var leftAxisX = pad.getAxes(ex.Input.Axes.LeftStickX);
            var rightAxisX = pad.getAxes(ex.Input.Axes.RightStickX);
            var rightAxisY = pad.getAxes(ex.Input.Axes.RightStickY);
            var leftVector = new ex.Vector(leftAxisX, leftAxisY);
            var rightVector = new ex.Vector(rightAxisX, rightAxisY);
            if (pad.getButton(ex.Input.Buttons.RightTrigger) > .2 ||
                pad.getButton(ex.Input.Buttons.Face1) > 0) {
                this._attack();
                this._isAttacking = true;
                this._timeLeftAttacking = Config.MonsterAttackTime;
            }
            if (leftVector.distance() > .2) {
                this._rotation = ex.Util.canonicalizeAngle(leftVector.normalize().toAngle());
                if (!this._isAttacking) {
                    var speed = leftVector.scale(Config.MonsterSpeed);
                    this.dx = speed.x;
                    this.dy = speed.y;
                    if (Math.abs(this.dx) > Math.abs(this.dy) && this.dx > 0) {
                        if (this._direction !== "walkRight") {
                            this.setDrawing("walkRight");
                            this._direction = "walkRight";
                        }
                    }
                    if (Math.abs(this.dy) > Math.abs(this.dx) && this.dy < 0) {
                        if (this._direction !== "walkUp") {
                            this.setDrawing("walkUp");
                            this._direction = "walkUp";
                        }
                    }
                    if (Math.abs(this.dx) > Math.abs(this.dy) && this.dx < 0) {
                        if (this._direction !== "walkLeft") {
                            this.setDrawing("walkLeft");
                            this._direction = "walkLeft";
                        }
                    }
                    if (Math.abs(this.dy) > Math.abs(this.dx) && this.dy > 0) {
                        if (this._direction !== "walkDown") {
                            this.setDrawing("walkDown");
                            this._direction = "walkDown";
                        }
                    }
                }
            }
        }
        // Gestion des touches ZQSD.
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Z) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
            if (!this._hasMoved) {
                this._hasMoved = true;
            }
            if (!this._isAttacking) {
                this.dy = -Config.MonsterSpeed;
                this.setDrawing("walkUp");
            }
        }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.S) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
            if (!this._hasMoved) {
                this._hasMoved = true;
            }
            if (!this._isAttacking) {
                this.dy = Config.MonsterSpeed;
                this.setDrawing("walkDown");
            }
        }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Q) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
            if (!this._hasMoved) {
                this._hasMoved = true;
            }
            if (!this._isAttacking) {
                this.dx = -Config.MonsterSpeed;
                if (this.dy === 0) {
                    this.setDrawing("walkLeft");
                }
            }
        }
        if ((engine.input.keyboard.isHeld(ex.Input.Keys.D) ||
            engine.input.keyboard.isHeld(ex.Input.Keys.Right))) {
            if (!this._hasMoved) {
                this._hasMoved = true;
            }
            if (!this._isAttacking) {
                this.dx = Config.MonsterSpeed;
                if (this.dy === 0) {
                    this.setDrawing("walkRight");
                }
            }
        }
        if (this.dx == 0 && this.dy == 0 && !this._isAttacking) {
            this.setDrawing("idleDown");
        }
        if (this._isAttacking) {
            if (this._rotation < Math.PI / 4 || this._rotation > Math.PI * (7 / 4)) {
                this.setDrawing("attackRight");
            }
            if (this._rotation > Math.PI / 4 && this._rotation < Math.PI * (3 / 4)) {
                this.setDrawing("attackDown");
            }
            if (this._rotation > Math.PI * (3 / 4) && this._rotation < Math.PI * (5 / 4)) {
                this.setDrawing("attackLeft");
            }
            if (this._rotation > Math.PI * (5 / 4) && this._rotation < Math.PI * (7 / 4)) {
                this.setDrawing("attackUp");
            }
            this._direction = "attack";
            this._timeLeftAttacking -= delta;
            if (this._timeLeftAttacking <= 0) {
                this._isAttacking = false;
            }
        }
        this.setZIndex(this.y);
    };
    Monster.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        this._aimSprite.rotation = this._rotation;
        this._aimSprite.draw(ctx, this.x, this.y);
    };
    Monster.prototype._detectAttackable = function () {
        var _this = this;
        _.forIn(HeroSpawner.getHeroes(), function (hero) {
            if (_this._isHeroAttackable(hero)) {
                _this._attackable.push(hero);
            }
        });
    };
    Monster.prototype._isHeroAttackable = function (hero) {
        var heroLines = hero.getLines();
        for (var i = 0; i < this._rays.length; i++) {
            for (var j = 0; j < heroLines.length; j++) {
                var distanceToIntersect = this._rays[i].intersect(heroLines[j]);
                if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.MonsterAttackRange)) {
                    return true;
                }
            }
        }
        for (var i = 0; i < this._closeRays.length; i++) {
            for (var j = 0; j < heroLines.length; j++) {
                var distanceToIntersect = this._closeRays[i].intersect(heroLines[j]);
                if ((distanceToIntersect > 0) && (distanceToIntersect <= Config.CloseMonsterAttackRange)) {
                    return true;
                }
            }
        }
    };
    Monster.prototype._attack = function () {
        var _this = this;
        var hitHero = false;
        _.forIn(this._attackable, function (hero) {
            game.currentScene.camera.shake(5, 5, 200);
            hero.Health--;
            hitHero = true;
            var origin = new ex.Vector(hero.x, hero.y);
            var dest = new ex.Vector(_this.x, _this.y);
            var vectorBetween = origin.subtract(dest);
            hero.stun(vectorBetween);
        });
    };
    Monster.prototype.getRotation = function () {
        return this._rotation;
    };
    Monster.prototype.debugDraw = function (ctx) {
        _super.prototype.debugDraw.call(this, ctx);
        _.forIn(this._rays, function (ray) {
            ctx.beginPath();
            ctx.moveTo(ray.pos.x, ray.pos.y);
            var end = ray.getPoint(Config.MonsterAttackRange);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = ex.Color.Chartreuse.toString();
            ctx.stroke();
            ctx.closePath();
        });
        _.forIn(this._closeRays, function (ray) {
            ctx.beginPath();
            ctx.moveTo(ray.pos.x, ray.pos.y);
            var end = ray.getPoint(Config.CloseMonsterAttackRange);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = ex.Color.Azure.toString();
            ctx.stroke();
            ctx.closePath();
        });
    };
    return Monster;
}(ex.Actor));
var HeroStates;
(function (HeroStates) {
    HeroStates[HeroStates["Searching"] = 0] = "Searching";
    // Removing the looting state
    HeroStates[HeroStates["Looting"] = 1] = "Looting";
    HeroStates[HeroStates["Attacking"] = 2] = "Attacking";
    HeroStates[HeroStates["Fleeing"] = 3] = "Fleeing";
    HeroStates[HeroStates["Stunned"] = 4] = "Stunned";
})(HeroStates || (HeroStates = {}));
var HeroSpawner = /** @class */ (function () {
    function HeroSpawner() {
    }
    HeroSpawner.spawnHero = function () {
        var i, spawnPoints, spawnPoint, hero;
        for (i = 0; i < Math.min(Config.HeroSpawnPoolMax, HeroSpawner._spawned); i++) {
            spawnPoints = map.getSpawnPoints();
            spawnPoint = Util.pickRandom(spawnPoints);
            if (Stats.numHeroesKilled > Config.HardThreshold) {
                heroTimer.interval = Config.HeroSpawnIntervalHard;
            }
            else if (Stats.numHeroesKilled > Config.MedThreshold) {
                heroTimer.interval = Config.HeroSpawnIntervalMed;
            }
            else if (Stats.numHeroesKilled > Config.EasyThreshold) {
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
    };
    HeroSpawner._spawn = function (point) {
        var hero = new Hero(point.x, point.y);
        game.add(hero);
        this._heroes.push(hero);
    };
    HeroSpawner.getHeroes = function () {
        return this._heroes;
    };
    HeroSpawner.despawn = function (h) {
        h.kill();
        _.remove(this._heroes, h);
    };
    HeroSpawner.cleanupTombstones = function () {
        _.forIn(HeroSpawner._tombstones, function (tombstone) {
            tombstone.kill();
        });
    };
    HeroSpawner.reset = function () {
        HeroSpawner._spawned = 0;
    };
    HeroSpawner.getSpawnCount = function () {
        return HeroSpawner._spawned;
    };
    HeroSpawner._spawned = 0;
    HeroSpawner._heroes = [];
    HeroSpawner._tombstones = [];
    return HeroSpawner;
}());
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(x, y) {
        var _this = _super.call(this, x, y, 24, 24) || this;
        _this.Health = Config.HeroHealth;
        _this._attackCooldown = Config.HeroAttackCooldown;
        _this._hasHitMinotaur = true;
        _this._isAttacking = false;
        _this._timeLeftAttacking = 0;
        _this._stunnedTime = 0;
        _this._fsm = new TypeState.FiniteStateMachine(HeroStates.Searching);
        _this._fsm.from(HeroStates.Searching).to(HeroStates.Attacking, HeroStates.Looting);
        _this._fsm.from(HeroStates.Attacking).to(HeroStates.Searching);
        _this._fsm.from(HeroStates.Looting).to(HeroStates.Fleeing);
        _this._fsm.fromAny(HeroStates).to(HeroStates.Stunned);
        _this._fsm.from(HeroStates.Stunned).toAny(HeroStates);
        _this._fsm.on(HeroStates.Stunned, _this.onStunned.bind(_this));
        _this._fsm.onExit(HeroStates.Stunned, _this.onExitStunned.bind(_this));
        _this._fsm.on(HeroStates.Fleeing, _this.onFleeing.bind(_this));
        _this._fsm.on(HeroStates.Attacking, _this.onAttacking.bind(_this));
        return _this;
    }
    Hero.prototype.onInitialize = function (engine) {
        var _this = this;
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
        this.on('collision', function (e) {
            if (e.other instanceof Monster) {
                var hero = e.actor;
                if (hero._attackCooldown == 0 && hero._hasHitMinotaur) {
                    var monster = e.other;
                    monster.health--;
                    map.damageEffect();
                    Stats.damageTaken++;
                    hero._attackCooldown = Config.HeroAttackCooldown;
                    if (!hero._isAttacking) {
                        if (_this._direction === 'right') {
                            hero.setDrawing('attackRight');
                        }
                        else {
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
    };
    Hero.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.Health <= 0) {
            Stats.numHeroesKilled++;
            HeroSpawner.despawn(this);
        }
        this.setZIndex(this.y);
        this._attackCooldown = Math.max(this._attackCooldown - delta, 0);
        var heroVector = new ex.Vector(this.x, this.y);
        var monsterVector = new ex.Vector(map._player.x, map._player.y);
        if (this.dx > 0) {
            if (this._direction !== "right") {
                this._direction = "right";
                this.setDrawing("idleRight");
            }
        }
        if (this.dx < 0) {
            if (this._direction !== "left") {
                this._direction = "left";
                this.setDrawing("idleLeft");
            }
        }
        if (this._fsm.currentState === HeroStates.Stunned) {
            if (this._direction == "left") {
                this.setDrawing("damageLeft");
            }
            if (this._direction == "right") {
                this.setDrawing("damageRight");
            }
        }
        if (this._isAttacking) {
            this._timeLeftAttacking -= delta;
            if (this._timeLeftAttacking <= 0) {
                if (this._direction == "right") {
                    this.setDrawing("idleRight");
                }
                else {
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
                }
                else if (heroVector.distance(monsterVector) <= Config.HeroAggroDistance) {
                    this.clearActions();
                    this.meet(map._player, Config.HeroSpeed);
                    if (heroVector.distance(monsterVector) < Config.HeroMeleeRange) {
                        this.clearActions();
                    }
                }
                break;
        }
    };
    Hero.prototype.getLines = function () {
        var lines = new Array();
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
        var half = this.getWidth() / 4;
        lines.forEach(function (l) {
            l.begin.x -= half;
            l.begin.y -= half;
            l.end.x -= half;
            l.end.y -= half;
        });
        return lines;
    };
    Hero.prototype.debugDraw = function (ctx) {
        var lines = this.getLines();
        lines.forEach(function (l) {
            ex.Util.drawLine(ctx, ex.Color.Green.toString(), l.begin.x, l.begin.y, l.end.x, l.end.y);
        });
    };
    Hero.prototype.stun = function (direction) {
        this._fsm.go(HeroStates.Stunned);
        var dir = direction.normalize().scale(Config.KnockBackForce);
        this.dx = dir.x;
        this.dy = dir.y;
    };
    Hero.prototype.onFleeing = function (from) {
        var _this = this;
        var exits = map.getSpawnPoints();
        var exit = Util.pickRandom(exits);
        this.moveTo(exit.x, exit.y, Config.HeroFleeingSpeed).callMethod(function () { return _this.onExit(); });
    };
    Hero.prototype.onAttacking = function (from) {
        this.clearActions();
        this.meet(map._player, Config.HeroSpeed);
    };
    Hero.prototype.onStunned = function (from) {
        this.clearActions();
        this._stunnedTime = Config.HeroStunnedTime;
    };
    Hero.prototype.onExitStunned = function (from) {
        if (this._direction === "left") {
            this.setDrawing("idleLeft");
        }
        if (this._direction === "right") {
            this.setDrawing("idleRight");
        }
        return true;
    };
    Hero.prototype.onExit = function () {
        Stats.numHeroesEscaped++;
        HeroSpawner.despawn(this);
    };
    return Hero;
}(ex.Actor));
var Stats = /** @class */ (function () {
    function Stats() {
    }
    Stats.numHeroesKilled = 0;
    Stats.numHeroesEscaped = 0;
    Stats.goldLost = 0;
    Stats.damageTaken = 0;
    return Stats;
}());
var Options = {
    music: true,
    sound: true
};
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Settings.prototype.onInitialize = function (engine) {
        var musicToggle = new ex.Actor(game.width / 2, game.height / 2, 50, 50, ex.Color.Red);
        this.add(musicToggle);
        musicToggle.on('pointerdown', function (e) {
            if (Options.music) {
                Options.music = false;
                musicToggle.color = ex.Color.DarkGray;
            }
            else {
                Options.music = true;
                musicToggle.color = ex.Color.Red;
            }
        });
        var soundToggle = new ex.Actor(game.width / 2, -100 + game.height / 2, 50, 50, ex.Color.Red);
        this.add(soundToggle);
        soundToggle.on('pointerdown', function (e) {
            if (Options.sound) {
                Options.sound = false;
                soundToggle.color = ex.Color.DarkGray;
            }
            else {
                Options.sound = true;
                soundToggle.color = ex.Color.Red;
            }
        });
    };
    return Settings;
}(ex.Scene));
var GameOverType;
(function (GameOverType) {
    GameOverType[GameOverType["Hoard"] = 0] = "Hoard";
    GameOverType[GameOverType["Slain"] = 1] = "Slain";
})(GameOverType || (GameOverType = {}));
var GameOver = /** @class */ (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameOver.prototype.onInitialize = function (engine) {
        game.backgroundColor = ex.Color.Black;
        var bg = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
        bg.anchor.setTo(0, 0);
        bg.addDrawing(Resources.TextureGameOverBg);
        this.add(bg);
        this._type = new ex.Actor(0, 0, game.getWidth(), game.getHeight());
        this._type.anchor.setTo(0, 0);
        this._type.addDrawing("hoard", Resources.TextureGameOverHoard.asSprite());
        this._type.addDrawing("slain", Resources.TextureGameOverSlain.asSprite());
        this.add(this._type);
        // stats
        var statY = 420;
        this._labelSurvivalTime = new ex.Label(null, game.getWidth() / 2, 300, "Arial");
        this._labelSurvivalTime.textAlign = ex.TextAlign.Center;
        this._labelSurvivalTime.fontSize = 60;
        this._labelHeroesKilled = new ex.Label(null, 223, statY, "Arial");
        this._labelHeroesKilled.textAlign = ex.TextAlign.Center;
        this._labelHeroesKilled.fontSize = 30;
        this._labelHeroesEscaped = new ex.Label(null, 408, statY, "Arial");
        this._labelHeroesEscaped.textAlign = ex.TextAlign.Center;
        this._labelHeroesEscaped.fontSize = 30;
        this._labelGoldLost = new ex.Label(null, 575, statY, "Arial");
        this._labelGoldLost.textAlign = ex.TextAlign.Center;
        this._labelGoldLost.fontSize = 30;
        this._labelDamageTaken = new ex.Label(null, 748, statY, "Arial");
        this._labelDamageTaken.textAlign = ex.TextAlign.Center;
        this._labelDamageTaken.fontSize = 30;
        this._labelSurvivalTime.color = ex.Color.fromHex("#e7a800");
        this._labelHeroesKilled.color = ex.Color.White;
        this._labelHeroesEscaped.color = ex.Color.White;
        this._labelGoldLost.color = ex.Color.White;
        this._labelDamageTaken.color = ex.Color.White;
        this.add(this._labelSurvivalTime);
        this.add(this._labelHeroesKilled);
        this.add(this._labelHeroesEscaped);
        this.add(this._labelGoldLost);
        this.add(this._labelDamageTaken);
        var retryButton = new ex.Actor(game.width / 2, 500, 252, 56);
        retryButton.addDrawing(Resources.TextureGameOverRetry);
        this.add(retryButton);
        retryButton.on('pointerdown', function (e) {
            isGameOver = false;
            Stats.numHeroesKilled = 0;
            Stats.numHeroesEscaped = 0;
            Stats.goldLost = 0;
            Stats.damageTaken = 0;
            map.resetPlayer();
            HeroSpawner.reset();
            for (var i = HeroSpawner.getHeroes().length - 1; i >= 0; i--) {
                HeroSpawner.despawn(HeroSpawner.getHeroes()[i]);
            }
            HeroSpawner.cleanupTombstones();
            game.goToScene('map');
        });
    };
    GameOver.prototype.onActivate = function () {
        _super.prototype.onActivate.call(this);
        Resources.SoundMusic.stop();
        Resources.GameOver.play();
    };
    GameOver.prototype.onDeactivate = function () {
        _super.prototype.onDeactivate.call(this);
        Resources.GameOver.stop();
    };
    GameOver.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this._labelHeroesKilled.text = Stats.numHeroesKilled.toString() + ' (' + Math.floor(100 * (Stats.numHeroesKilled / HeroSpawner.getSpawnCount())).toString() + '%)';
        this._labelHeroesEscaped.text = Stats.numHeroesEscaped.toString() + ' (' + Math.floor(100 * (Stats.numHeroesEscaped / HeroSpawner.getSpawnCount())).toString() + '%)';
        this._labelDamageTaken.text = Math.floor(100 * (Stats.damageTaken / Config.MonsterHealth)).toString() + '%';
        var survival = map.getSurvivalTime();
        var mins = Math.floor(survival / 1000 / 60);
        var secs = Math.floor((survival / 1000) - (60 * mins));
        this._labelSurvivalTime.text = mins.toString() + "m" + secs.toString() + "s";
    };
    GameOver.prototype.setType = function (type) {
        this._type.setDrawing(type === GameOverType.Hoard ? "hoard" : "slain");
        Stats.gameOverType = type;
    };
    return GameOver;
}(ex.Scene));
var SoundManager = /** @class */ (function () {
    function SoundManager() {
    }
    SoundManager.start = function () {
        if (Options.sound) {
            SoundManager.setSoundEffectLevels(1);
        }
        else {
            SoundManager.setSoundEffectLevels(0);
        }
        if (Options.music) {
            Resources.SoundMusic.setVolume(0.03);
            if (!Resources.SoundMusic.isPlaying()) {
                Resources.SoundMusic.play();
                Resources.SoundMusic.setLoop(true);
            }
            Resources.GameOver.setVolume(0.1);
        }
        else {
            Resources.SoundMusic.setVolume(0);
            Resources.GameOver.setVolume(0);
        }
    };
    SoundManager.setSoundEffectLevels = function (volume) {
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound && (resource != Resources.SoundMusic) && (resource != Resources.GameOver)) {
                resource.setVolume(volume);
            }
        });
    };
    SoundManager.stop = function () {
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(0);
                if (resource != Resources.SoundMusic) {
                    resource.stop();
                }
            }
        });
    };
    return SoundManager;
}());
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="util.ts" />
/// <reference path="map.ts" />
/// <reference path="monster.ts" />
/// <reference path="hero.ts" />
/// <reference path="stats.ts" />
/// <reference path="options.ts" />
/// <reference path="gameover.ts" />
/// <reference path="soundmanager.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: 960,
    height: 640
});
game.setAntialiasing(false);
game.canvas.oncontextmenu = function (e) {
    e.preventDefault();
    return false;
};
var loader = new ex.Loader();
_.forIn(Resources, function (resource) {
    loader.addResource(resource);
});
var logger = ex.Logger.getInstance();
document.getElementById("toggle-sounds").addEventListener("click", function () {
    SoundManager.stop();
    Options.sound = !Options.sound;
    SoundManager.start();
});
document.getElementById("toggle-music").addEventListener("click", function () {
    SoundManager.stop();
    Options.music = !Options.music;
    SoundManager.start();
});
game.input.gamepads.enabled = true;
var map = new Map(game);
var settings = new Settings(game);
var gameOver = new GameOver(game);
var isGameOver = false;
var heroTimer;
game.start(loader).then(function () {
    game.backgroundColor = ex.Color.Black;
    game.add('map', map);
    game.goToScene('map');
    game.add('settings', settings);
    game.add('gameover', gameOver);
    game.currentScene.camera.zoom(1.5);
    var defendIntro = new ex.UIActor(game.width / 2, game.height / 2, 858, 105);
    defendIntro.anchor.setTo(0.5, 0.5);
    defendIntro.opacity = 0;
    defendIntro.previousOpacity = 0;
    game.add(defendIntro);
    defendIntro.delay(1000).callMethod(function () {
        defendIntro.opacity = 1;
    }).delay(2000).callMethod(function () {
        defendIntro.kill();
        HeroSpawner.spawnHero();
    });
    heroTimer = new ex.Timer(function () { return HeroSpawner.spawnHero(); }, Config.HeroSpawnInterval, true);
    game.add(heroTimer);
});
