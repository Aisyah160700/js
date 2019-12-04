// collect stars, no enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
        // Put global variable here
        this.lifeCount = 3;
        this.cheeseCount = 0;
        this.isDead = false;
    }
    
    
    
    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map2', 'assets/level2.json');
        this.load.spritesheet('tiles', 'assets/platform64x64.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('collectibles', 'assets/collectibles.png');
        this.load.atlas('player', 'assets/rat.png', 'assets/rat.json');
        this.load.atlas('dog', 'assets/dog.png', 'assets/dog.json');
        this.load.image('cheese', 'assets/cheese.png');
        this.load.audio('blaster', 'assets/blaster.mp3');
        this.load.audio('ping', 'assets/ping.mp3');
        this.load.image('forest_bg', 'assets/forest_bg.png');
        this.load.image('forest_fg', 'assets/forest_fg.png');
        this.load.image('life', 'assets/life.png');
        this.load.image('level_02_end', 'assets/house.png');
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
        // this.lives = this.map.createDynamicLayer('lives', Cb, 0, 0);

                // Set starting and ending position using object names in tiles
    this.startPoint = this.map.findObject("start_end_point", obj => obj.name === "startPoint");
    this.endPoint = this.map.findObject("start_end_point", obj => obj.name === "endPoint");

    // Make it global variable for troubleshooting
    window.startPoint = this.startPoint;
    window.endPoint = this.endPoint;

    // Place an image manually on the endPoint
    this.add.image(this.endPoint.x, this.endPoint.y, 'level_02_end').setOrigin(0, 0);
    
    
        /////////////////////
        // CREATE the this.player 
    
        // bounce, setSize, limit movement inside the map
        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setBounce(0.5); // our this.player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map    
        this.player.body.setSize(this.player.width*.6, this.player.height);
        this.player.setScale(.5);
    
        window.player = this.player;

    
        
    
        ////create audio
    
        this.blasterSnd=this.sound.add('blaster');
        this.pingSnd=this.sound.add('ping');
    
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



    this.add.text(50,520, 'Level 2', { font: '24px Courier', fill: '#ffffff' }).setScrollFactor(0);

    // this text will show the score
    this.cheeseText = this.add.text(750, 30, '0', {
        fontSize: '24px Courier',
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
    
         // Add animation for dog
         this.anims.create({
            key: 'dogwalk',
            frames: this.anims.generateFrameNames('dog', {prefix: 'dog-', start: 1, end: 2, zeroPad: 2}),
            frameRate: 5,
            repeat: -1
        });

         // create dog physics group
     this.dogs=this.physics.add.group();
    
     // Add members to mummies group
     this.dogs.create(800, 300, 'dog').setScale(1);
     this.dogs.create(1600, 300, 'dog').setScale(1);
     this.dogs.create(2400, 300, 'dog').setScale(1);
     this.dogs.create(3200, 300, 'dog').setScale(1);
     this.dogs.create(4000, 300, 'dog').setScale(1);
     this.dogs.create(4800, 300, 'dog').setScale(1);


     // Iterate all the children and play the 'walk' animation
     this.dogs.children.iterate(dog=> {
     dog.play('dogwalk')
     })
     
     // Check for end of screen at right , reset to left
     this.dogs.children.iterate(dog=> {
        if ( dog.x>this.physics.world.bounds.width*.3 ) {
            dog.x=-10;
          }
        });
    

        // Add random stars
        this.cheese = this.physics.add.group({
            key: 'cheese',
            repeat: 15,
            setXY: { x: 300, y: 0, stepX: Phaser.Math.Between(100, 4000) }
        });     
         
    //////////////////////
        // Collider Section

    // Collide platform with stars
        this.physics.add.collider(this.platform, this.cheese);

        this.physics.add.overlap(this.player, this.cheese,this.collectCheese, null, this );
    
        // What will collider with what layers
        this.physics.add.collider(this.platform, this.player);
        this.physics.add.collider(this.platform, this.dogs);
        this.physics.add.collider(this.platform, this.cheese);
        //this.physics.add.overlap(this.player, this.cheese, );

    
        ///////////////////
        // Overlap Section
    
        //  "firstgid":17 , this is the index number
        // coin.setTileIndexCallback(17, collectCoin, this);
        // this.physics.add.overlap(this.player, coin, collectCoin, null, this);

        // call hit bomb function
	this.physics.add.overlap(this.player, this.dogs, this.hitDog, null, this );


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
    
        // Add life image at the end 
        this.life1 = this.add.image(50,50, 'life').setScrollFactor(0);
        this.life2 = this.add.image(110,50,'life').setScrollFactor(0);
        this.life3 = this.add.image(170,50,'life').setScrollFactor(0);


    } // end of create()


     //////////////////
        // Score Section

        hitDog(player,dogs) {
            dogs.disableBody(true, true);
              this.lifeCount -= 1;
              console.log('Hit element, deduct lives, balance is',this.lifeCount);
          
              // Default is 3 lives
              if ( this.lifeCount === 2) {
                  this.blasterSnd.play();
                  this.cameras.main.shake(100);
                  this.life3.setVisible(false);
              } else if ( this.lifeCount === 1) {
                this.blasterSnd.play();
                this.cameras.main.shake(100);
                  this.life2.setVisible(false);
              } else if ( this.lifeCount === 0) {
                this.blasterSnd.play();
                this.cameras.main.shake(500);
                  this.life1.setVisible(false);
                  this.isDead = true;
              }
      
                 // No more lives, shake screen and restart the game
          if ( this.isDead ) {
              console.log("Player is dead!!!")
              // delay 1 sec
              this.time.delayedCall(1000,function() {
                  // Reset counter before a restart
                  this.isDead = false;
                  this.lifeCount = 3;
                  this.scene.stop("level2");
                  this.scene.start("gameoverScene");
              },[], this);
              }
      
              return false;
              }


    collectCheese(player, cheese) {
        cheese.disableBody(true, true);
        this.cheeseCount += 1; 
        console.log(this.cheeseCount);
        this.pingSnd.play();
        this.cheeseText.setText(this.cheeseCount); // set the text to show the current score
        return false;
    }
    
    
    
    update() {
    
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
            this.player.anims.play('walk', true); // walk left
            this.player.flipX = true; // flip the sprite to the left
            //this.blasterSnd.play();
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200);
            this.player.anims.play('walk', true);
            this.player.flipX = false; // use the original sprite looking to the right
            //this.blasterSnd.play();
    
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
        this.dogs.setVelocityX(-200);
    
    
        ////////////////
        //background
        this.forest_bg.tilePositionX=this.cameras.main.scrollX*.2;
        this.forest_fg.tilePositionX=this.cameras.main.scrollX*.7;

            // Check for more then 5 stars
    //if ( this.cheeseCount > 5 ) {
    //    console.log('Collected 1 cheese, jump to level 2');
     //   this.scene.stop("level2");
     //   this.scene.start("level3");
    //}

       	// end point
	let distX = this.endPoint.x - this.player.x;
    let distY = this.endPoint.y - this.player.y;
    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x) {
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level2");
        this.scene.start("level3");
    }

    
    } // end of update()

}