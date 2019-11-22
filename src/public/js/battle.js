

// "random" integer function / funcao para gerar inteiros "aleatorios"

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

/***
 * 
 * 
 *  BATTLE SCENE
 * 
 */
 

var BattleScene = new Phaser.Class({

    Extends: Phaser.Scene,
 
    initialize:
 
    function BattleScene ()
    {

        Phaser.Scene.call(this, { key: "BattleScene" });
    },

    create: function ()
    {
        this.add.image(160,120,'background');
        this.startBattle()

        this.sys.events.on('wake', this.startBattle, this);  
    },

    startBattle: function() {

        this.load.spritesheet('enemies', 'src/public/assets/enemies.png', { frameWidth: 32, frameHeight: 32 });
        
        // player character / jogador
        var warrior = new Hero(this, 140, 130, 'player', 9, 'Hero', 100);        
        this.add.existing(warrior);
        this.heroes = [warrior]

        var randomNum = getRndInteger(1,3)

        if (randomNum == 1) {

            // One random enemy

            var mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
            var ent = new Enemy(this, 175, 70, 'enemies', 1, 'Ent', 20);
            var duck = new Enemy(this, 175, 70, 'enemies', 3, 'Mad Duck', 20);
            var pig = new Enemy(this, 175, 70, 'enemies', 4, 'Magik Pig', 20);
            var flower = new Enemy(this, 175, 70, 'enemies', 5, 'Flower', 20);

            var grimoire1 = [mushroom, ent, duck, pig, flower]

            var enemy1 = grimoire1[getRndInteger(0,grimoire1.length)]
            this.add.existing(enemy1);
            this.enemies = [enemy1];

        } else if (randomNum == 2) {

            // Two random enemies

            var mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
            var ent = new Enemy(this, 175, 70, 'enemies', 1, 'Ent', 20);
            var duck = new Enemy(this, 210, 70, 'enemies', 3, 'Mad Duck', 20);
            var pig = new Enemy(this, 210, 70, 'enemies', 4, 'Magik Pig', 20);

            var grimoire1 = [mushroom, ent]
            var grimoire2 = [duck, pig]

            var enemy1 = grimoire1[getRndInteger(0,grimoire1.length)]
            var enemy2 = grimoire2[getRndInteger(0,grimoire2.length)]

            this.add.existing(enemy1);
            this.add.existing(enemy2);

            this.enemies = [enemy1, enemy2];

        } else if (randomNum == 3) {

            // Tree random enemies

            var mushroom = new Enemy(this, 175, 70, 'enemies', 0, 'Shroom', 20);
            var ent = new Enemy(this, 175, 70, 'enemies', 1, 'Ent', 20);
            var duck = new Enemy(this, 210, 70, 'enemies', 3, 'Mad Duck', 20);
            var pig = new Enemy(this, 210, 70, 'enemies', 4, 'Magik Pig', 20);
            var flower = new Enemy(this, 245, 70, 'enemies', 5, 'Flower', 20);

            var grimoire1 = [mushroom, ent]
            var grimoire2 = [duck, pig]
            var grimoire3 = [flower]

            var enemy1 = grimoire1[getRndInteger(0,grimoire1.length)]
            var enemy2 = grimoire2[getRndInteger(0,grimoire2.length)]
            var enemy3 = grimoire3[getRndInteger(0,grimoire3.length)]

            this.add.existing(enemy1);
            this.add.existing(enemy2);
            this.add.existing(enemy3);

            this.enemies = [enemy1, enemy2, enemy3];

        }

        // array with both parties, who will attack / herois e inimigos, quem ira atacar
        this.units = this.heroes.concat(this.enemies);

        this.index = -1;  

        // Run UI Scene 
        this.scene.launch('UIScene');
     
    },
    nextTurn: function() {  
        // if we have victory or game over / dectar fim de jogo ou vitoria
        if(this.checkEndBattle()) {           
            this.endBattle();
            return;
        }
        do {
            // currently active unit / unidade ativa atual
            this.index++;

            if(this.index >= this.units.length) {
                this.index = 0;
            }            
        } while(!this.units[this.index].living);

        // if its player hero / se a unidade for o jogador
        if(this.units[this.index] instanceof Hero) {
            // we need the player to select action and then enemy / o jogador precisa selecionar a acao
            this.events.emit("PlayerSelect", this.index);

        } else { // if its enemy unit / se a unidade for um inimigo

            var r;
            do {
                r = Math.floor(Math.random() * this.heroes.length);
            } while(!this.heroes[r].living) 
            // call the enemy's attack function / inimigo ira atacar (chama a funcao atacar)
            this.units[this.index].attack(this.heroes[r]);  
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
        }
    },      
    // check for game over or victory / checar game over ou vitoria
    checkEndBattle: function() {        
        var victory = true;
        // if all enemies are dead we have victory / checar se todos inimigos estao mortos (vitoria)
        for(var i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].living)
                victory = false;
        }
        var gameOver = true;
        // if all heroes are dead we have game over / checar se todos herois estao mortos (game over)
        for(var i = 0; i < this.heroes.length; i++) {
            if(this.heroes[i].living)
                gameOver = false;
        }
        return victory || gameOver;
    },
    // when the player have selected the enemy to be attacked / quando o jogador selecionar o inimigo que sera atacado
    receivePlayerSelection: function(action, target) {
        if(action == "attack") {            
            this.units[this.index].attack(this.enemies[target]);              
        }
        // next turn in 3 seconds / iniciar proximo turno em 3 segundos
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });        
    },  
    endBattle: function() {       
        // clear state, remove sprites / limpar sprites
        this.heroes.length = 0;
        this.enemies.length = 0;
        for(var i = 0; i < this.units.length; i++) {

            this.units[i].destroy();            
        }
        this.units.length = 0;
        this.heroes.hp = 100;
        this.enemies.hp = 40;

        this.scene.sleep('UIScene');

        this.scene.switch('WorldScene');
    }

});

var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;   
        this.living = true;         
        this.menuItem = null;
    },
    // we will use this to notify the menu item when the unit is dead
    setMenuItem: function(item) {
        this.menuItem = item;
    },
    // attack the target unit / ataca a unidade alvo
    attack: function(target) {
        if(target.living) {
            damage = getRndInteger(0,10)
            target.takeDamage(damage);
            this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + damage + " damage");
        }
    },    
    takeDamage: function(damage) {
        this.hp -= damage;
        if(this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKilled();
            this.living = false;
            this.visible = false;   
            this.menuItem = null;
        }
    }    
});

var Enemy = new Phaser.Class({
    Extends: Unit,

    initialize:
    function Enemy(scene, x, y, texture, frame, type, hp) {
        Unit.call(this, scene, x, y, texture, frame, type, hp);
    }
});

var Hero = new Phaser.Class({
    Extends: Unit,
 
    initialize:
    function Hero(scene, x, y, texture, frame, type, hp) {
        Unit.call(this, scene, x, y, texture, frame, type, hp);
        
        this.setScale(5);
    }
});

var MenuItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,
    
    initialize:
            
    function MenuItem(x, y, text, scene) {
        Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: "#ffffff", align: "left", fontSize: 15});
    },
    
    select: function() {
        this.setColor("#f8ff38");
    },
    
    deselect: function() {
        this.setColor("#ffffff");
    },

    unitKilled: function() {
        this.active = false;
        this.visible = false;
    }
    
});

var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    
    initialize:
            
    function Menu(x, y, scene, heroes) {
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;        
        this.selected = false;
    },     
    addMenuItem: function(unit) {
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem); 
        return menuItem;
    },  
    // menu navigation 
    moveSelectionUp: function() {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex--;
            if(this.menuItemIndex < 0)
                this.menuItemIndex = this.menuItems.length - 1;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },
    moveSelectionDown: function() {
        this.menuItems[this.menuItemIndex].deselect();
        do {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
        } while(!this.menuItems[this.menuItemIndex].active);
        this.menuItems[this.menuItemIndex].select();
    },
    // select the menu as a whole and highlight the choosen element
    select: function(index) {
        if(!index)
            index = 0;       
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        while(!this.menuItems[this.menuItemIndex].active) {
            this.menuItemIndex++;
            if(this.menuItemIndex >= this.menuItems.length)
                this.menuItemIndex = 0;
            if(this.menuItemIndex == index)
                return;
        }        
        this.menuItems[this.menuItemIndex].select();
        this.selected = true;
    },
    // deselect this menu
    deselect: function() {        
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    },
    confirm: function() {
        // when the player confirms his slection, do the action
    },
    // clear menu and remove all menu items
    clear: function() {
        for(var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },
    // recreate the menu items
    remap: function(units) {
        this.clear();        
        for(var i = 0; i < units.length; i++) {
            var unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));            
        }
        this.menuItemIndex = 0;
    }
});

var HeroesMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function HeroesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);                    
    }
});

var ActionsMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function ActionsMenu(x, y, scene) {
        Menu.call(this, x, y, scene);   
        this.addMenuItem("Attack");
    },
    confirm: function() { 
        // we select an action and go to the next menu and choose from the enemies to apply the action
        this.scene.events.emit("SelectedAction");        
    }
    
});

var EnemiesMenu = new Phaser.Class({
    Extends: Menu,
    
    initialize:
            
    function EnemiesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);        
    },       
    confirm: function() {      
        // the player has selected the enemy and we send its id with the event
        this.scene.events.emit("Enemy", this.menuItemIndex);
    }
});

var UIScene = new Phaser.Class({
 
    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: "UIScene" });
    },
 
    create: function ()

    {    

        // get data from battlescene  / puxando dados da cena de batalha
        this.battleScene = this.scene.get('BattleScene');
    
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(-2,0x000000);
        this.graphics.fillStyle(0x031f4c, 1);        
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);

        this.menus = this.add.container();
        
        this.heroesMenu = new HeroesMenu(9, 153, this);           
        this.actionsMenu = new ActionsMenu(100, 153, this);            
        this.enemiesMenu = new EnemiesMenu(195, 153, this);   
    
        this.currentMenu = this.actionsMenu;
        
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);
                
        this.battleScene = this.scene.get("BattleScene");                                

        this.input.keyboard.on("keydown", this.onKeyInput, this);   
        
        // when its player cunit turn to move
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        
        // when the action on the menu is selected
        // for now we have only one action so we dont send and action id
        this.events.on("SelectedAction", this.onSelectedAction, this);
        
        // an enemy is selected
        this.events.on("Enemy", this.onEnemy, this);
        
        // when the scene receives wake event
        this.sys.events.on('wake', this.createMenu, this);
        
        // the message describing the current action
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);        
        
        this.createMenu();  
        
    },
    createMenu: function() {
        // map hero menu items to heroes
        this.remapHeroes();
        // map enemies menu items to enemies
        this.remapEnemies();
        // first move
        this.battleScene.nextTurn(); 
    },
    onEnemy: function(index) {
        // when the enemy is selected, we deselect all menus and send event with the enemy id
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);   
    },
    onPlayerSelect: function(id) {
        // when its player turn, we select the active hero item and the first action
        // then we make actions menu active
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },
    // we have action selected and we make the enemies menu active
    // the player needs to choose an enemy to attack
    onSelectedAction: function() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },
    remapHeroes: function() {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },
    onKeyInput: function(event) {
        if(this.currentMenu && this.currentMenu.selected) {
            if(event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if(event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if(event.code === "ArrowLeft" || event.code === "Shift") {

            } else if(event.code === "Enter" || event.code === "ArrowRight") {
                this.currentMenu.confirm();
            } 
        }
    },
});

var Message = new Phaser.Class({

    Extends: Phaser.GameObjects.Container,

    initialize:
    function Message(scene, events) {
        Phaser.GameObjects.Container.call(this, scene, 160, 30);
        var graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.fillStyle(0x031f4c, 0.3);        
        graphics.strokeRect(-90, -15, 180, 30);
        graphics.fillRect(-90, -15, 180, 30);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: "#ffffff", align: "center", fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true }});
        this.add(this.text);
        this.text.setOrigin(0.5);        
        events.on("Message", this.showMessage, this);
        this.visible = false;
    },
    showMessage: function(text) {
        this.text.setText(text);
        this.visible = true;
        if(this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
    },
    hideMessage: function() {
        this.hideEvent = null;
        this.visible = false;
    }
});

