class missioncompleteScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'missioncompleteScene' });
    }

    preload() {
        this.load.image('missioncomplete','assets/missioncompleteScene.png');

    }

    create () {

        this.add.image(0, 0,).setOrigin(0, 0);
        
        this.add.text(0,580, 'Press Spacebar to play again' , { font: '24px Courier', fill: '#000000' });

        console.log("This is missioncompleteScene");

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        //var aDown = this.input.keyboard.addKey('A');

        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, reply game");
        this.scene.stop("missioncompleteScene");
        this.scene.start("mainScene");
        }, this );

        //aDown.on('down', function(){
            //console.log("A pressed (main menu)");
            //this.scene.stop("gameoverScene");
            //this.scene.start("mainScene");
            // }, this );

    }

}
