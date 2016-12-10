module.exports = function(x,y) {
  return new Drawable({
    x: x,
    y: y,
    name: 'zombie',
    image: 'zombie_Idle_0.png',
    animated: true,
    rotation: 0,
    listeners: {
      onload: function() {
        this.speed = 20 + (Math.random() * 220);
        this.dead = false;
        this.health = 1;
        this.addAnimation("walk", ['zombie_Walk_0.png', 'zombie_Walk_1.png', 'zombie_Walk_2.png']);
        this.addAnimation("death", ['zombie_Die_0.png', 'zombie_Die_1.png', 'zombie_Die_2.png', 'zombie_Die_3.png']);
        this.addAnimation("dead", ['zombie_Die_3.png']);
      },
      onhit: function() {
        this.health--;
        if ( this.health <= 0 ) {
          // Death
          this.dead = true;
          this.setAnimation("death", true);

          // Remove self from world.
          var world = Framework.GetWorld();
          var x = this.physObj.position[0];
          var y = this.physObj.position[1];

          if ( y > 100 ) y = 100;

          world.removeBody( this.physObj );
          this.physObj = new p2.Body({
            mass: 0,
            type: p2.Body.STATIC,
            position: [x,y]
          });
          //this.physObj.addShape(new p2.Rectangle(0,0));
          world.addBody(this.physObj);
        }
      },
      onanimationover: function() {
        if ( this.dead ) {
          this.setAnimation("dead");
        }
      },
      onupdate: function() {
        if ( this.dead ) {
          var c = Framework.GetCamera();
          this.rox = c.x - c.virtualX;
          return;
        }

        var camera = Framework.GetCamera();
        var player = this.parent.getAsset("player");
        if ( player !== undefined ) {
          if ( player.x() > this.x() ) {
            this.setVX(this.speed);
          } else if ( player.x() < this.x() ) {
            this.setVX(-this.speed);
          }
        }
      }
    }
  });
}
