
module.exports = {
  MakePlatform: function(x,y,width,ashen,name) {
    name = name || 'platform';
    ashen = ashen || false;
    var BOX_WIDTH = ((ashen) ? 64 : 32) * 1.5;
    var BOX_HEIGHT = ((ashen) ? 64 : 16) ;

    function box(bx,by) {
      return new Drawable({
        x: bx,
        y: by,
        name: name,
        image: (ashen) ? 'ashenfloor.png' : 'ground.png',
        inactive: true,
        listeners: {
          onupdate: function() {
            if ( this.y() < 0 ) {
              this.visible = false;
              Framework.GetActiveScene().removeAsset(this);
            }

            this.rotation = this.physObj.angle;
          }
        }
      });
    }
    var groundMaterial = new p2.Material();
    var container = new p2.Body({
      mass: 0,
      position: [x + (width/2),y - 64 + 32]
    });
    var containerShape = new p2.Rectangle(width,BOX_HEIGHT);
    containerShape.material = groundMaterial;
    container.addShape(containerShape);

    return new Drawable({
      gravity: false,
      name: name,
      physObj2: container,
      listeners: {
        onactivated: function() {
          // Create the upward thrust.
          var world = Framework.GetWorld();
          world.removeBody(container);
          this.countdown = true;
          this.count = 2;
        },
        onafterload: function() {
          if ( this.afterload ) return;

          this.afterload = true;
          var count = (width/BOX_WIDTH);
          for ( var i = 0; i < count; i++ ) {
            this.addAsset(box(x + (BOX_WIDTH * i), y - 64 + 16 - 4));
          }

          var world = Framework.GetWorld();
          world.addBody( container );
        }
      }
    });

  }
};
