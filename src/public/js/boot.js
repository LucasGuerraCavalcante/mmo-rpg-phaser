
/***
 * 
 * 
 *  BOOT 
 * 
 */
 

var BootScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function BootScene (){
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function (){
        this.load.image('tiles', 'public/assets/map/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'public/assets/map/map.json');
        this.load.spritesheet('player', 'public/assets/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemies', 'public/assets/enemies.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('background','public/assets/ground.png');
    },
 
    create: function (){
        
        this.scene.start('WorldScene');

    }
});

/***
 * 
 * 
 *  WORLD SCENE
 * 
 */
 
var WorldScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function WorldScene (){
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function (){
        
    },
    
    create: function (){
        var self = this;
        this.socket = io()
 	
        // Creating the world / Criando Cenario

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('spritesheet', 'tiles');
	    var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        
        obstacles.setCollisionByExclusion([-1]);

        // Creating the player / Jogador

        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        this.physics.add.collider(this.player, obstacles);
        
        // Setting up the controls / Controles

        this.cursors = this.input.keyboard.createCursorKeys();

        // Generating enemies / Gerar inimigos
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 15; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            this.spawns.create(x, y, 20, 20);            
        }   

        // Enemy collider / colisor de inimigos
        this.physics.add.overlap(this.player, this.spawns, this.overlapEnemy, false, this);     

        // Controls and Animations / Controles e Animacao

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 0, 2 ] }),
            frameRate: 10,
            repeat: -1
        });  

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [3, 4, 3, 5] }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [8, 7, 8, 6]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [9, 10, 9, 11]}),
            frameRate: 10,
            repeat: -1
        });       

        // Camera 
	
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        // we listen for 'wake' event
        this.sys.events.on('wake', this.wake, this);

    },
    wake: function() {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    },

    overlapEnemy: function(player, zone) {

        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        // start battle / iniciar batalha

        this.cameras.main.shake(300);

        // switch to BattleScene / ir para a Cena de Batalha (BattleScene)
        this.scene.switch('BattleScene');

    },

    exitBattle: function() {
        this.scene.sleep('UIScene');
        this.scene.switch('WorldScene');
    },

    update: function (time, delta)
    {
        this.player.body.setVelocity(0);

        // Horizontal 
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical 
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }    

        // Animating / Animando
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
});