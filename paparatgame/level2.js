// collect stars, no enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
        // Put global variable here
        this.cheeseCount = 0;
    }
    
    
    
    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map2', 'assets/level2.json');
        this.load.spritesheet('tiles', 'assets/platform64x64.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('collectibles', 'assets/collectibles.png');
        this.load.atlas('player', 'assets/rat.png', 'assets/rat.json');
        this.load.atlas('cat', 'assets/cat.png', 'assets/cat.json');
        this.load.image('cheese', 'assets/cheese.png');
        this.load.audio('blaster', 'assets/blaster.mp3');
        this.load.image('forest_bg', 'assets/forest_bg.png');
        this.load.image('forest_fg', 'assets/forest_fg.png');
    }
    
    create() {
    
            ////////////////
        //background
        this.forest_bg=this.add.tileSprite(0, 0, 800, game.config.height, "forest_bg");
        this.forest_bg.setOrigin(0, 0);
        this.forest_bg.setScrollFactor(0);
    
        this.forest_fg=this.add.tileSprite(0, 0, 800, game.config.height, "forest_fg");
        this.forest_fg.setOrigin(0, 0);
        this.forest_fg.setScrollFactor(0);
    
    
    
        // tilemap variable called map
        this.map = this.make.tilemap({key: 'map2'});
        
        
        ////////////////
        // Add tilesets
    
        // Must match tileSets name in Tiles
        // Must match tileSets name and filename
        var Tiles = this.map.addTilesetImage('platform64x64', 'tiles');
        var Cb = this.map.addTilesetImage('collectibles', 'collectibles');
    
        /////////////////
        // Create layers
    
        // CREATE the ground layer & platform layers
        this.platform = this.map.createDynamicLayer('platform', Tiles, 0, 0);
        //this.cheese = this.map.createDynamicLayer('cheese', Cb, 0, 0);
        this.lives = this.map.createDynamicLayer('lives', Cb, 0, 0);
    
        /////////////////////
        // CREATE the this.player 
    
        // bounce, setSize, limit movement inside the map
        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setBounce(0.5); // our this.player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map    
        this.player.body.setSize(this.player.width*.6, this.player.height);
    
        window.player = this.player;

    
        
    
        ////create audio
    
        this.blasterSnd=this.sound.add('blaster');
    
        //////////////////
        // Physics Section
    
        // Everything will collide with this layer
        // ground.setCollisionByExclusion([-1]);
        // platform.setCollisionByExclusion([-1]);
        this.platform.setCollisionByProperty({grass: true});
        // ground.setCollisionByProperty({danger: true});
        // ground.setCollisionByProperty({platform: true});
        // platform.setCollisionByProperty({grass: true});
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.platform.width;
        this.physics.world.bounds.height = this.platform.height;



    this.add.text(50,560, 'Level 2', { font: '24px Courier', fill: '#ffffff' }).setScrollFactor(0);

    // this text will show the score
    this.cheeseText = this.add.text(50, 40, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    this.cheeseText.setScrollFactor(0);
    this.cheeseText.visible = true;
        
    
    
        ////////////////////
        // ANIMATION section
        // this.player walk animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {prefix: 'rat-', start: 1, end: 6, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
    
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'rat-01'}],
            frameRate: 10,
        });
    
         // Add animation for cat
         this.anims.create({
            key: 'catwalk',
            frames: this.anims.generateFrameNames('cat', {prefix: 'cat-', start: 1, end: 2, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });

         // create cat physics group
     this.cats=this.physics.add.group();
    
     // Add members to mummies group
     this.cats.create(400, 300, 'cat').setScale(1);
     this.cats.create(800, 300, 'cat').setScale(1);
     this.cats.create(1200, 300, 'cat').setScale(1);
     this.cats.create(1600, 300, 'cat').setScale(1);
     this.cats.create(2000, 300, 'cat').setScale(1);
     
     // Iterate all the children and play the 'walk' animation
     this.cats.children.iterate(cat=> {
     cat.play('catwalk')
     })
     
     // Check for end of screen at right , reset to left
     this.cats.children.iterate(cat=> {
         if ( cat.x>this.physics.world.bounds.width+50 ) {
             cat.x=-10;
           }
         });
    

        // Add random stars
        this.cheese = this.physics.add.group({
            key: 'cheese',
            repeat: 10,
            setXY: { x: 300, y: 0, stepX: Phaser.Math.Between(100, 500) }
        });     
         
    //////////////////////
        // Collider Section

    // Collide platform with stars
        this.physics.add.collider(this.platform, this.cheese);

        this.physics.add.overlap(this.player, this.cheese,this.collectCheese, null, this );
    
        // What will collider with what layers
        this.physics.add.collider(this.platform, this.player);
        this.physics.add.collider(this.platform, this.cats);
        this.physics.add.collider(this.platform, this.cheese);
        //this.physics.add.overlap(this.player, this.cheese, );

    
        ///////////////////
        // Overlap Section
    
        //  "firstgid":17 , this is the index number
        // coin.setTileIndexCallback(17, collectCoin, this);
        // this.physics.add.overlap(this.player, coin, collectCoin, null, this);

        // call hit bomb function
	this.physics.add.overlap(this.player, this.cats, this.hitCat, null, this );


        ///////////////////
        // Keyboard section
        this.cursors = this.input.keyboard.createCursorKeys();
    
        /////////////////
        // CAMERA SECTION
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
        // make the camera follow the this.player
        this.cameras.main.startFollow(this.player);
    
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff');
    
        
    } // end of create()


     //////////////////
        // Score Section

        hitCat(player,cat) {
            //bombs.disableBody(true, true);
            console.log('Hit cat, restart game');
            this.cameras.main.shake(500);
            // delay 1 sec
            this.time.delayedCall(2000,function() {
        
                this.scene.restart();
               this.scene.start("gameoverScene");
            },[], this);
        }

    collectCheese(player, cheese) {
        cheese.disableBody(true, true);
        this.cheeseCount += 1; 
        console.log(this.cheeseCount);
        this.cheeseText.setText(this.cheeseCount); // set the text to show the current score
        return false;
    }
    
    
    
    update() {
    
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
            this.player.anims.play('walk', true); // walk left
            this.player.flipX = true; // flip the sprite to the left
            this.blasterSnd.play();
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200);
            this.player.anims.play('walk', true);
            this.player.flipX = false; // use the original sprite looking to the right
            this.blasterSnd.play();
    
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        // jump 
        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-500);        
        }
    
        // Make mummies walk at speed
        this.cats.setVelocityX(80);
    
    
        ////////////////
        //background
        this.forest_bg.tilePositionX=this.cameras.main.scrollX*.2;
        this.forest_fg.tilePositionX=this.cameras.main.scrollX*.7;

            // Check for more then 5 stars
    if ( this.cheeseCount > 5 ) {
        console.log('Collected 1 cheese, jump to level 2');
        this.scene.stop("level2");
        this.scene.start("level3");
    }

    
    } // end of update()
    
    


}