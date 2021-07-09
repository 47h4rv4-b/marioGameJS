config= {
    type:Phaser.AUTO,
    scale: {
        mode:Phaser.Scale.FIT,
        height:500,
        width :800,
    },
    
    physics:{
        
        default:'arcade',
        arcade:{
            gravity:{
                y:1000,
            },
            debug:false,
        }
    },
    
    backgroundColor: 0xff00cc,
    
    scene:{
        preload:preload,
        
        create:create,
        update:update,
    },
    
};

let game = new Phaser.Game(config);

function preload(){
    this.load.image("ground","Assets/topground.png")
    this.load.image("sky","Assets/background.png")
    this.load.spritesheet("player","Assets/dude.png",{frameHeight:48, frameWidth:32})
    this.load.image("apple","Assets/apple.png")
   
}

function create(){
    W= game.config.width;
    H= game.config.height;
    
    //repeating Image **tileSprite** Coordinates of topLeft of img, Kaha tak stretch
    let ground=this.add.tileSprite(0,H-128,W,H-128,'ground')
    ground.setOrigin(0,0)
    
    
    let sky=this.add.sprite(0,0,'sky')
    sky.setOrigin(0,0)
    sky.depth=-1
    sky.displayWidth=W;
    
    this.cursors= this.input.keyboard.createCursorKeys();
    
    this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate:10,
        repeat:-1,
    });
    
    let apples=this.physics.add.group({
        key:"apple",
        repeat:7,
        setScale:{x:0.3,y:0.3},
        setXY :{X:40, Y:40, stepX:111},
        
    })
    let platforms=this.physics.add.staticGroup();
    platforms.create(690,250,'ground').setScale(1.5,0.6).refreshBody();
    platforms.create(0,150,'ground').setScale(1.4,0.8).refreshBody();
    platforms.create(350,300,'ground').setScale(1.7,0.7).refreshBody();
    platforms.add(ground)        
    apples.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7))
    })
    this.player= this.physics.add.sprite(100,100,'player',4)
    this.player.setBounce(0.4)
    this.physics.add.existing(ground)
    ground.body.allowGravity=false
    this.physics.add.collider(platforms,this.player)
    this.physics.add.collider(apples,platforms)
    this.physics.add.overlap(this.player,apples,eat,null,this);
    
    //player not out of frame
    this.player.setCollideWorldBounds(true)
    ground.body.immovable=true
    
}


function update(){
    
    if(this.cursors.left.isDown){
//        console.log("pressed")
        this.player.setVelocityX(-150)
        this.player.anims.play('left',true)
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(150)
        
    }
    else{
        this.player.setVelocityX(0)
        
    }
    if(this.cursors.up.isDown){
//        console.log("pressed")
    this.player.setVelocityY(-150)
}
    
    
    
}

function eat(player,fruits){
    fruits.disableBody(true,true);
}