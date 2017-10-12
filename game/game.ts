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

game.canvas.oncontextmenu = function(e){
   e.preventDefault();
   return false;
};

var loader = new ex.Loader();
 
_.forIn(Resources, (resource) => {
   loader.addResource(resource);
});
 
var logger = ex.Logger.getInstance();
document.getElementById("toggle-sounds").addEventListener("click", () => {
   SoundManager.stop();
   Options.sound = !Options.sound;
   SoundManager.start();
});

document.getElementById("toggle-music").addEventListener("click", () => {
   SoundManager.stop();
   Options.music = !Options.music;
   SoundManager.start();
});
  
game.input.gamepads.enabled = true;
 
var map = new Map(game);
var settings = new Settings(game);
var gameOver = new GameOver(game);
var isGameOver = false;
var heroTimer: ex.Timer;

game.start(loader).then(() => {
   
   game.backgroundColor = ex.Color.Black;
   
   game.add('map', map);
   game.goToScene('map');
   game.add('settings', settings);
   game.add('gameover', gameOver);
   
   game.currentScene.camera.zoom(1.5);
   
   var defendIntro = new ex.UIActor(game.width/2, game.height/2, 858, 105);
   defendIntro.anchor.setTo(0.5, 0.5); 
   defendIntro.opacity = 0;   
   defendIntro.previousOpacity = 0;
   game.add(defendIntro);
   defendIntro.delay(1000).callMethod(() => {
      defendIntro.opacity = 1;   
   }).delay(2000).callMethod(() => {
      defendIntro.kill(); 
      HeroSpawner.spawnHero();       
   });
         
   heroTimer = new ex.Timer(() => HeroSpawner.spawnHero(), Config.HeroSpawnInterval, true);
   game.add(heroTimer);    
});