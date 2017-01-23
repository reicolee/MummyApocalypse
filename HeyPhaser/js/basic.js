//a single state that has 3 funtions

var gameWidth = 1200;
var gameHeight = 600;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'area', {
    init: init,
    preload: preload,
    create: create,
    preRender: preRender,
    update: update
})


function init() {
    game.world.resize(640 * 5, 600);
    //setting up the world, created a sky
    game.physics.startSystem(Phaser.Physics.ARCADE);

}

//called first
function preload() {
    game.load.image('sky', 'assets/sky2.png');
    game.load.image('deepSpace', 'assets/deep-space.jpg');
    game.load.image('starfield', 'assets/starfield.png');

    game.load.image('mountains-back', 'assets/mountains-back.png');
    game.load.image('mountains-mid1', 'assets/mountains-mid1.png');
    game.load.image('mountains-mid2', 'assets/mountains-mid2.png');
    game.load.image('sun', 'assets/sun.png');
    game.load.image('moon', 'assets/moon.png');



    game.load.image('ground', 'assets/platform.png');
    game.load.image('airplat', 'assets/airplat.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('cloud-platform', 'assets/cloud-platform.png');


    game.load.spritesheet('soldier', 'assets/metalslug_monster39x40.png', 39, 40, 16);
    game.load.spritesheet('mummy', 'assets/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.spritesheet('zombie', 'assets/dudezombie.png', 38, 48);
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bird', 'assets/robin.png', 240, 314, 22);


}

var platforms,
    player,
    enemies,
    birds,
    cursors = null,
    facing = 'right',
    score = 0,
    scoreText,
    gameOverText,
    welcomeText,
    bullets,
    stars,
    zombie,
    stationary,
    sun,
    clouds,
    cloud1,
    cloud2,
    cloud3,
    cloud4,
    cloud5,
    jumpTimer = 0,
    locked = false,
    lockedTo = null,
    wasLocked = false,
    willJump = false;



function create() {


    // game.add.sprite(0, 0, 'sky');
    //background
    //________________________________________________________________________________________________

    game.stage.backgroundColor = '#1253A2';
    game.sky = game.add.tileSprite(0, 0, game.width, game.cache.getImage('sky').height, 'sky');
    game.sky.fixedToCamera = true;
    sun = game.add.sprite(800, 10, 'sun');
    sun.fixedToCamera = true;


    game.mountainsBack = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-back').height + 500, game.width, game.cache.getImage('mountains-back').height, 'mountains-back');
    game.mountainsBack.tileScale.setTo(0.5, 0.5);
    game.mountainsBack.fixedToCamera = true;
    game.mountainsMid1 = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-mid1').height + 500, game.width, game.cache.getImage('mountains-mid1').height, 'mountains-mid1');
    game.mountainsMid1.tileScale.setTo(0.5, 0.5);
    game.mountainsMid1.fixedToCamera = true;
    game.mountainsMid2 = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-mid1').height + 500, game.width, game.cache.getImage('mountains-mid1').height, 'mountains-mid1');
    game.mountainsMid2.tileScale.setTo(0.5, 0.5);
    game.mountainsMid2.fixedToCamera = true;



    //immovable objects - platforms, ledges
    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(6, 6);
    ground.body.immovable = true;
    ground.fixedToCamera = true;
    // var ledge = platforms.create(300, 350, 'ground');
    // ledge.body.immovable = true;
    // ledge = platforms.create(-150, 200, 'ground');
    // ledge.body.immovable = true;



    //static platforms
    stationary = game.add.physicsGroup();
    stationary.create(140, 430, 'airplat').scale.setTo(0.2, 0.2);
    stationary.create(360, 380, 'airplat').scale.setTo(0.25, 0.25);
    stationary.create(570, 330, 'airplat').scale.setTo(0.23, 0.25);
    stationary.create(1350, 450, 'airplat').scale.setTo(0.15, 0.15);
    stationary.create(2000, 350, 'airplat').scale.setTo(0.19, 0.25);
    stationary.create(2150, 300, 'airplat').scale.setTo(0.18, 0.25);
    stationary.create(2650, 200, 'airplat').scale.setTo(0.23, 0.20);
    stationary.create(game.world.width-100, 230, 'airplat').scale.setTo(0.5, 0.5);


    stationary.setAll('body.allowGravity', false);
    stationary.setAll('body.immovable', true);

    //platforms that move
    clouds = game.add.physicsGroup();

    cloud1 = new CloudPlatform(game, 900, 300, 'cloud-platform', clouds);
    cloud1.scale.setTo(0.2, 0.2);
    cloud1.addMotionPath([
        { x: "+100", xSpeed: 1000, xEase: "Linear", y: "-100", ySpeed: 1000, yEase: "Sine.easeIn" },
        { x: "-100", xSpeed: 1000, xEase: "Linear", y: "-100", ySpeed: 1000, yEase: "Sine.easeOut" },
        { x: "-100", xSpeed: 1000, xEase: "Linear", y: "+100", ySpeed: 1000, yEase: "Sine.easeIn" },
        { x: "+100", xSpeed: 1000, xEase: "Linear", y: "+100", ySpeed: 1000, yEase: "Sine.easeOut" }
            ]);

    cloud2 = new CloudPlatform(game, 1250, 56, 'cloud-platform', clouds);
    cloud2.scale.setTo(0.25, 0.25);
    cloud2.addMotionPath([
        { x: "+0", xSpeed: 2000, xEase: "Linear", y: "+300", ySpeed: 2000, yEase: "Sine.easeIn" },
        { x: "-0", xSpeed: 2000, xEase: "Linear", y: "-300", ySpeed: 2000, yEase: "Sine.easeOut" }
        ]);

    cloud3 = new CloudPlatform(game, 1450, 290, 'cloud-platform', clouds);
    cloud3.scale.setTo(0.23, 0.23);
    cloud3.addMotionPath([
        { x: "+400", xSpeed: 3000, xEase: "Expo.easeIn", y: "-200", ySpeed: 2000, yEase: "Linear" },
        { x: "-400", xSpeed: 3000, xEase: "Expo.easeOut", y: "+200", ySpeed: 2000, yEase: "Linear" }
        ]);

    cloud4 = new CloudPlatform(game, 2400, 250, 'cloud-platform', clouds);
    cloud4.scale.setTo(0.20, 0.20);
    cloud4.addMotionPath([
        { x: "+0", xSpeed: 500, xEase: "Linear", y: "+60", ySpeed: 500, yEase: "Sine.easeIn" },
        { x: "-0", xSpeed: 500, xEase: "Linear", y: "-60", ySpeed: 500, yEase: "Sine.easeOut" }
        ]);

    //________________________________________________________________________________________________

    //setting up the player
    player = game.add.sprite(32, game.world.height - 500, 'dude');

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.5;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    game.camera.follow(player);

    //________________________________________________________________________________________________

    //setting up enemies
    enemies = game.add.group();
    game.physics.arcade.enable(enemies);
    enemies.enableBody = true;

    game.time.events.loop(Math.random()*400, createMummy, this);


    //setting up flyingAttackBirds
    birds = game.add.physicsGroup();
    game.physics.arcade.enable(birds);
    birds.enableBody = true;

    game.time.events.loop(900, createBirds, this);



    //________________________________________________________________________________________________

    //keyboard setup
    cursors = game.input.keyboard.createCursorKeys();

    //________________________________________________________________________________________________

    //stars
    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < 20; i++) {
        var star = stars.create(game.world.randomX, 0, 'star'); //create stars inside the star group
        star.body.gravity.y = 100; //gravity thing
        star.body.bounce.y = 1;
    }

    //________________________________________________________________________________________________

    //scoreText
    scoreText = game.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: "#FFFFFF"
    });


    scoreText.fixedToCamera = true;




    //________________________________________________________________________________________________
    clouds.callAll('start');
}

function removeWelcome (){
    game.input.onDown.remove(removeWelcome, this);
    welcomeText.kill();
}

function createMummy(){
    var mummy = enemies.create(game.world.randomX + 200, game.world.height - 100, 'mummy');
    mummy.animations.add('walk');
    mummy.animations.play('walk', 30, true);
}

function createBirds(){
    var bird = birds.create(game.world.width - 300, game.world.randomY - 400, 'bird');
    bird.scale.setTo(0.2, 0.2);
    bird.animations.add('fly');
    bird.animations.play('fly', 50, true);
}


function customStep(player, platform){
    if (!locked && player.body.velocity.y > 0){
        locked = true;
        lockedTo = platform;
        platform.playerLocked = true;

        player.body.velocity.y = 0;
    }
}

function checkLock(){
    player.body.velocity.y = 0;
    if (player.body.right < lockedTo.body.x || player.body.x > lockedTo.body.right){
        cancelLock();
    }
}

function cancelLock (){
    wasLocked = true;
    locked = false;
}

function preRender(){
    if (game.paused) {
        //  Because preRender still runs even if your game pauses!
        return;
    }

    if (locked || wasLocked) {
        player.x += lockedTo.deltaX;
        player.y = lockedTo.y - 48;

        if (player.body.velocity.x !== 0) {
            player.body.velocity.y = 0;
        }
    }

    if (willJump) {
        willJump = false;

        if (lockedTo && lockedTo.deltaY < 0 && wasLocked) {
            //  If the platform is moving up we add its velocity to the players jump
            player.body.velocity.y = -300 + (lockedTo.deltaY * 10);
        } else {
            player.body.velocity.y = -300;
        }

        jumpTimer = game.time.time + 750;
    }

    if (wasLocked) {
        wasLocked = false;
        lockedTo.playerLocked = false;
        lockedTo = null;
    }
}

function update() {


    if(score < 0){
        gameOverText = game.add.text(game.centerX+200, game.centerY-200, '\b \b \b \b \b \b \b \b GAME OVER \n PLEASE TRY AGAIN!', {
        fontSize: '100px',
        fill: "#FFFFFF"
    })
        score = 0;
        scoreText.text = 'Score: ' + score;
        player.kill();
    }

    //tilePosition Moving background
    // game.mountainsBack.tilePosition.x -= 0.5;
    // game.mountainsMid1.tilePosition.x -= 0.3;
    // game.mountainsMid2.tilePosition.x -= 0.75;


    //moving background when camera moves
    game.mountainsBack.tilePosition.x = -(game.camera.x * 0.9);
    game.mountainsMid1.tilePosition.x = -(game.camera.x * 0.6);
    game.mountainsMid2.tilePosition.x = -(game.camera.x * 2);

    //________________________________________________________________________________________________

    //player physics: collision
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    var hitAirPlat = game.physics.arcade.collide(player, stationary);
    var hitAirCloud = game.physics.arcade.collide(player, clouds, customStep, null, this);

    var standing = player.body.blocked.down || player.body.touching.down || locked;

    game.physics.arcade.collide(enemies, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(stars, stationary);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, enemies, enemiesHandler, null, this);
    game.physics.arcade.overlap(player, birds, birdsHandler, null, this);

    //________________________________________________________________________________________________

    //playser movement = keyboard movements;
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -200;
        player.animations.play('left');

    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 200;
        player.animations.play('right');

    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform || cursors.up.isDown && player.body.touching.down && hitAirPlat) {
        player.body.velocity.y = -400;
    }

    if(cursors.up.isDown && player.body.touching.down && hitAirCloud) {
        player.body.velocity.y = -300;
    }

    if (standing && cursors.up.isDown && game.time.time > jumpTimer) {
        if (locked) {
            cancelLock();
        }

        willJump = true;
    }

    if (locked) {
       checkLock();
    }

    //________________________________________________________________________________________________

    enemies.setAll('body.velocity.x', 130);
    enemies.forEach(checkMummy, this, true);

    birds.setAll('body.velocity.x', -300);
    birds.forEach(checkBird, this, true);
    // if (enemies.x > 640 * 4 - 2) {
    //     enemies.x = 2;

    // } else {
    //     enemies.setAll('body.velocity.x', 40);
    // }
    //zombie movement
    // zombie.body.velocity.x = 30;
    // zombie.animations.play('right');

}


function collectStar(player, star) { //kill star when collide with players
    star.kill();

    //update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function enemiesHandler() {
    player.x = 32;
    player.y = game.world.height - 500;
    score -= 20;
    scoreText.text = 'Score: ' + score;
}

function birdsHandler() {
    if (locked === true && lockedTo !== null) {
        return;
    } else {
        player.x = 32;
        player.y = game.world.height - 500;
        score -= 10;
        scoreText.text = 'Score: ' + score;
    }
}

function checkMummy (mummy){
    try {
        if (mummy.x > game.world.width) {
            enemies.remove(mummy, true);
        }
    } catch (e) {
        console.log(mummy);
    }
}

function checkBird (bird){
    try {
        if (bird.x < 200) {
            birds.remove(bird, true);
        }
    } catch (e) {
        console.log(bird);
    }
}

function CloudPlatform(game, x, y, key, group) {
    if (typeof group === 'undefined') {
        group = game.world;
    }

    Phaser.Sprite.call(this, game, x, y, key);

    game.physics.arcade.enable(this);

    this.anchor.x = 0.5;

    this.body.customSeparateX = true;
    this.body.customSeparateY = true;
    this.body.allowGravity = false;
    this.body.immovable = true;

    this.playerLocked = false;

    group.add(this);
}

CloudPlatform.prototype = Object.create(Phaser.Sprite.prototype);
CloudPlatform.prototype.constructor = CloudPlatform;

CloudPlatform.prototype.addMotionPath = function(motionPath) {

    this.tweenX = this.game.add.tween(this.body);
    this.tweenY = this.game.add.tween(this.body);

    //  motionPath is an array containing objects with this structure
    //  [
    //   { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" }
    //  ]

    for (var i = 0; i < motionPath.length; i++) {
        this.tweenX.to({
            x: motionPath[i].x
        }, motionPath[i].xSpeed, motionPath[i].xEase);
        this.tweenY.to({
            y: motionPath[i].y
        }, motionPath[i].ySpeed, motionPath[i].yEase);
    }

    this.tweenX.loop();
    this.tweenY.loop();

};

CloudPlatform.prototype.start = function() {

    this.tweenX.start();
    this.tweenY.start();

};

CloudPlatform.prototype.stop = function() {

    this.tweenX.stop();
    this.tweenY.stop();

};
