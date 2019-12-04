
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    backgroundColor: '#000055',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    
    scene: [mainScene, main2Scene, storyScene, story2Scene, level1, level2, level3, gameoverScene]


};

let game = new Phaser.Game(config);



