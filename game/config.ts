

var Config = {
   PlayerCellSpawnX: 10,
   PlayerCellSpawnY: 19,
   
   MonsterHealth: 30,
   MonsterWidth: 48,
   MonsterHeight: 48,
   MonsterSpeed: 200,
   MonsterWalkFrameSpeed: 100,
   MonsterAttackRange: 90,
   MonsterDashSpeed: 700,
   MonsterDashDuration: 700,
   MonsterDashCooldown: 10000,
   CloseMonsterAttackRange: 50,
   MonsterProgressSize: 200,
   MonsterSpecialProgressSize: 125,
   MonsterAttackTime: 300,
   MonsterAttackCooldown: 500,
   KnockBackForce: 200, 
   
   RedVignetteDuration: 500,
   MonsterDamageCameraShakeDuration: 300,
   
   CameraElasticity: 0.1,//.01,
	CameraFriction: 0.5,//0.21,
	CameraShake: 0,//7,
	CameraShakeDuration: 0,//200,//800,      
   
   // Spawn interval
   HeroSpawnInterval: 10000, // in ms
   HeroSpawnIntervalEasy: 7500,
   HeroSpawnIntervalMed: 6000,
   HeroSpawnIntervalHard: 4000,
   // the thresholds where we decrease the spawn interval
   EasyThreshold: 10,
   MedThreshold: 20,
   HardThreshold: 30,
   
   // Max heroes to spawn at once
   HeroSpawnPoolMax: 5,
   // How much health a hero has
   HeroHealth: 3,  
   // Hero speed (in px/s)
   HeroSpeed: 100,
   // Hero with loot speed (in px/s)
   HeroFleeingSpeed: 80,
   // The cooldown amount for a hero's attack
   HeroAttackCooldown: 1500,
   // The maximum distance a hero will aggro to the monster
   HeroAggroDistance: 150,

   HeroMeleeRange: 30,
   
   HeroStunnedTime: 100,
   
   // Amount of gold heroes can carry
   TreasureStealAmount: 1,   
   // Amount of gold in each treasure stash
   TreasureHoardSize: 5,
   // Treasure progress indicator width (in px)
   TreasureProgressSize: 600
}