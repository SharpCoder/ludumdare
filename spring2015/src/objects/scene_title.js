var MapHelper = require('./map_helper');
var ToolTip = require('./tooltip');
var Zombie = require('./zombie');
var gameover = require('./gameover');

var level1 = false;
var level2 = false;
var levelCount = 0;
var nextLevel = 1;
var zombiesAlive = 0;
var zombiesSlain = 0;
var playerMaxHealth = 10;
var playerHealth = playerMaxHealth;

function makeText(str, x, y) {
  return new Drawable({
    x: x,
    y: y,
    text: str,
    fontColor: "#FF0000",
    font: "bold 16pt 'Open Sans'",
    inactive: true,
    gravity: false,
    listeners: {
      onupdate: function() {
        this.y(this.y() - 4);
        if ( this.y() < 0 ){
          this.parent.removeAsset(this);
        }
      }
    }
  });
}

function initLevel(omap) {
  // Do things to initialize the level.
  var player = omap.getAsset("player");
  var camera = Framework.GetCamera();
  var posX = 200 + (Math.random() * 800);


  // Make the map
  var map = new Drawable({
    name: 'hell',
    image: 'hell.png',
    x: posX,
    y: 800 * 1.5,
    gravity: false,
    inactive: true,
    topMost: false,
    listeners: {
      onload: function() {
        this.runonce = false;
        this.active = false;
        this.count = 20;
      },
      onupdate: function() {
        var camera = Framework.GetCamera();
        this.x(camera.x);
        if ( zombiesSlain != zombiesAlive ) return;

        // If we get here, all teh zombies are dead.
        if ( !this.runonce ) {

          var levelPortal = MapHelper.MakePlatform(posX, 65 * 1.5, 128, true, 'portal');
          omap.addAsset(levelPortal);
          this.runonce = true;
        }

        if ( !this.active ) return;
        if ( this.count-- > 0 ) return;

        if ( this.y() > 0 ) {
          this.y(this.y() - 4);
          omap.y(omap.y() - 4);
          player.setAnimation("fallSword");
          player.physObj.velocity[1] += 8;
          Framework.Rumble();
        } else {
          // Reset state and swap image.

          // Remove all zombies.
          var toRemove = [];
          for ( var i = 0; i < omap.assets.length; i++ ) {
            if ( omap.assets[i].name == "zombie" )
              toRemove.push(omap.assets[i]);
          }

          for ( var i = 0; i < toRemove.length; i++ )
            omap.removeAsset(toRemove[i]);

          // Now add more zombies!
          var camera = Framework.GetCamera();
          for ( var i = 0; i < 5 * (levelCount + 1); i++ ) {
            zombiesAlive++;
            var zx = -150 + (Math.random() * 2400);
            if ( zx > camera.x && zx < camera.x + camera.width )
              zx = camera.width + 128;

            omap.addAsset(new Zombie(zx,200));
          }

          omap.removeAsset(omap.getAsset("skyblade"));
          omap.y(0);
          omap.x(0);
          player.x(player.x());
          Framework.UpdateCamera(100,100,100,100,600,700);
          levelCount++;
          nextLevel++;

          omap.image = Assets.Get("hell.png");
          omap.width = omap.image.width;
          omap.height = omap.image.height;
          omap.removeAsset(this);
          omap.canProgress = false;
          initLevel(omap);
        }
      }
    }
  });
  omap.addAsset(map);
}

module.exports = new Drawable({
  name: 'titlescreen',
  image: 'arena.png',
  x: 0,
  y: 0,
  gravity: false,
  listeners: {
    onload: function() {
      this.canProgress = true;
      var title = new Drawable({
        text: 'Skyblade',
        gravity: false,
        font: "34pt 'Indie Flower'",
        fontColor: 'black',
        x: 310,
        y: 210,
        listeners: {
          onupdate: function() {
            if ( levelCount > 0 ) {
              this.fontColor = "#fff";
              this.text = "Level " + levelCount;
            }
          },
          ondraw: function(ctx) {
            var offsets = ctx.measureText(this.text);
            var camera = Framework.GetCamera();
            if ( levelCount > 0 ) {
              this.x(camera.x + (camera.width / 2) - (offsets.width / 2) * 3);
            }
          }
        }
      });

      // x, y, virtualX, virtualY, width, height
      Framework.UpdateCamera(200,100,200,100,400,400);
      var map = MapHelper.MakePlatform(200,330,400);
      map.name = "map";

      var player = require('./player');
      var sword = new Drawable({
        name: 'sword',
        image: 'sword.png',
        animate: false,
        x: 500,
        y: 330,
        width: 1,
        height: 1
      });

      var HUD = new Drawable({
        gravity: false,
        listeners: {
          ondraw: function(ctx) {
            var camera = Framework.GetCamera();
            var health = (playerHealth / playerMaxHealth) * (camera.width - 20);
            var x = camera.x + 10;
            var y = camera.y + 10;

            ctx.fillStyle = "#FF0000";
            ctx.fillRect(x,y,health,10);

            if ( levelCount > 0 )
              ctx.fillStyle = "#FFF";
            else
              ctx.fillStyle = "#000";

            ctx.font = "24pt 'Open Sans'";
            ctx.fillText( zombiesSlain, x, y + 65 );

            ctx.font = "10pt 'Open Sans'";
            if ( zombiesSlain == zombiesAlive )
              ctx.fillText("Find the Portal", x, y + 30);
          }
        }
      });

      this.addAsset(title);
      this.addAsset(sword);
      this.addAsset(player);
      this.addAsset(map);
      this.addAsset(HUD);

      initLevel(this);

    },
    onupdate: function() {
      var player = this.getAsset("player");
      var camera = Framework.GetCamera();
      if ( ((player.x() - player.rox) - (camera.x + (camera.x - camera.virtualX))) > ((!level1 || !level2) ? 320  : 400) ) {
        if ( player.hasSword  && level1 ) {
          player.noright = false;
          camera.virtualX -= 300/60;
        } else {
          player.noright = true;
        }
      } else {
        player.noright = false;
      }

      if ( ((player.x() - player.rox) - (camera.x + (camera.x - camera.virtualX))) < 80 ) {
        if ( player.hasSword && level1 ) {
          player.noleft = false;
          camera.virtualX += 300/60;
        } else {
          player.noleft = true;
        }
      } else {
        player.noleft = false;
      }

      // Check for map boundaries.
      if ( (player.x() - player.rox) <= 0 ) player.noleft = true;
      if ( (player.x() - player.rox) >= ((this.width/1.5)-55) ) player.noright = true;

      // Check for map boundaries on level 1.
      if ( !level1 ) {
        var px = (player.x() - player.rox) - (camera.x + (camera.x - camera.virtualX));
        if ( px <= 20 ) player.noleft = true;
        if ( px >= 300 ) player.noright = true;
      }
    },
    oncollision: function(evt) {
      var player = this.getAsset("player");
      var camera = Framework.GetCamera();
      var playerInvolved = false;
      if ( evt.bodyA == player.physObj || evt.bodyB == player.physObj )
        playerInvolved = true;


      // Check if the player collided with the sword.
      if ( !player.hasSword ) {
        var sword = this.getAsset("sword");
        if ( (evt.bodyA == sword.physObj || evt.bodyA == player.physObj)
          && (evt.bodyB == sword.physObj || evt.bodyB == player.physObj)) {
            this.removeAsset(sword);
            player.doInvoke("onitempickup", "sword");
          }
      } else if (!level1) {
        if ( playerInvolved && player.jumped ) {
          level1 = true;
          var floor = this.getAsset("map");
          floor.activate();
          Framework.UpdateCamera(200,100,200,100,400,700);
        }
      }

      if ( playerInvolved ) {
        var otherBody = (evt.bodyA == player.physObj) ? evt.bodyB : evt.bodyA;
        var other = Framework.FindAssetByBody(otherBody);

        if ( other !== undefined && other.name == "zombie" ) {
          // If the player is attacking...
          if ( player.isAttacking || player.jumped ) {
            var nx = (other.physObj.position[0] - (camera.x - camera.virtualX));
            var ny = other.y();

            this.addAsset(makeText("-" + (Math.round(Math.random() * 36)), nx,ny));
            other.doInvoke("onhit");
            otherBody.velocity = [-1000,300];
            zombiesSlain++;
          } else {
            this.addAsset(makeText("-1", player.x(), player.y()));
            player.physObj.velocity = [-80,300];
            playerHealth--;
            if ( playerHealth <= 0 ) {
              Framework.SetScore(zombiesSlain);
              Framework.LoadScene("gameover");
            }
          }
        }
      }

      // Check for advancing to hell.
      if ( playerInvolved ) { //}&& (player.jumped || player.isAttacking) ) {
          var otherBody = (evt.bodyA == player.physObj) ? evt.bodyB : evt.bodyA;
          var other = Framework.FindAssetByBody(otherBody);
          if ( other != undefined && other.name == "portal" ) {

            // Create level 2.
            var level2Map = this.getAsset("hell");
            level2Map.active = true;
            other.activate();
          }
      }


    },
    onkeydown: function(key) {
      if ( key == 84 ) {
        var camera = Framework.GetCamera();
        camera.doZoom();
      }
    }
  }
});
