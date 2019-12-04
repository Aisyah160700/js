class gameoverScene3 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'gameoverScene3' });
    }

    preload() {
        this.load.image('gameover3','assets/gameoverScene3.png');

    }

    create () {

        this.add.image(0, 0, 'gameover3').setOrigin(0, 0);
        
        //this.add.text(0,580, 'Press Spacebar to continue and Press A to play again' , { font: '24px Courier', fill: '#000000' });

        console.log("This is gameoverScene");

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        var aDown = this.input.keyboard.addKey('A');

        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, reply game");
        this.scene.stop("gameoverScene3");
        this.scene.start("level3");
        }, this );

        aDown.on('down', function(){
         console.log("A pressed (main menu)");
         this.scene.stop("gameoverScene3");
          this.scene.start("mainScene");
        }, this );

    }

}
