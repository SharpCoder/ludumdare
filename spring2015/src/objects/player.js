var buttons = {
    right: false,
    left: false,
    space: false
};

var health = 100;
var inventory = [];
var hasSword = false;

function getAnimationName(base) {
  if ( hasSword )
    return base + "Sword";
  return base;
}

module.exports = new Drawable({
  name: 'player',
  animated: true,
  topMost: true,
  x: 250,
  y: 360,
  width: 32 + 16,
  listeners: {
    onload: function() {
      this.isAttacking = false;
      this.hasSword = false;
      this.jumped = false;
      this.noleft = false;
      this.noright = false;

      this.addAnimation("idle", ['shiroe.png']);
      this.addAnimation("walk", ['shiroe_Walk_0.png', 'shiroe_Walk_1.png', 'shiroe_Walk_2.png']);
      this.addAnimation("fall", ['shiroe_Fall_0.png']);
      this.addAnimation("fallSide", ['shiroe_FallSide_0.png']);
      this.addAnimation("idleSword", ['shiroe_IdleSword_0.png']);
      this.addAnimation("walkSword", ['shiroe_WalkSword_0.png', 'shiroe_WalkSword_1.png', 'shiroe_WalkSword_2.png']);
      this.addAnimation("fallSword", ['shiroe_FallSword_0.png']);
      this.addAnimation("fallSideSword", ['shiroe_FallSideSword_0.png']);
      this.addAnimation("attackSword", ['shiroe_Attack_1.png','shiroe_Attack_2.png','shiroe_Attack_3.png','shiroe_Attack_4.png','shiroe_Attack_5.png']);
    },
    onitempickup: function(item) {
      if ( item == 'sword' ) {
        hasSword = true;
        this.hasSword = true;
      }
    },
    onanimationover: function() {
      if ( this.isAttacking )
        this.isAttacking = false;
    },
    oncollision: function(evt) {
      var other = (evt.bodyA == this.physObj) ? evt.bodyB : evt.bodyA;
      if ( evt.bodyA == this.physObj || evt.bodyB == this.physObj ) {
          this.jumped = false;
      }
    },
    onupdate: function() {
      var canJump = this.checkIfCanJump();
      if ( buttons.right && !this.noright ) {
        this.setVX(300);
        this.setAnimation(getAnimationName("walk"));
      } else if ( buttons.left && !this.noleft) {
        this.setAnimation(getAnimationName("walk"));
        this.setVX(-300);
      } else {
        if ( canJump ) {
          this.setVX(0);
          this.setAnimation(getAnimationName("idle"));
        }
      }

      if ( !canJump) {
        // If we're falling
        if ( this.physObj.velocity[0] != 0 ) {
          this.setAnimation(getAnimationName("fallSide"));
        } else {
          this.setAnimation(getAnimationName("fall"));
        }
      }
    },
    onmousedown: function() {
      if ( this.hasSword ) {
        this.setAnimation(getAnimationName("attack"), true);
        this.isAttacking = true;
      }
    },
    onkeyup: function(key) {
      if ( key == 68 ) {
        buttons.right = false;
      } else if ( key == 65 ) {
        buttons.left = false;
      } else if ( key == 87 ) {
        buttons.space = false;
      }

    },
    onkeydown: function(key) {
      if ( key == 68 && !this.noright ) {
        buttons.right = true;
      } else if ( key == 65 && !this.noleft) {
        buttons.left = true;
      }

      if ( key == 32 ) {
        if ( this.hasSword ) {
          this.setAnimation(getAnimationName("attack"), true);
          this.isAttacking = true;
        }
      }

      if ( key == 87 ) {
        buttons.space = true;
        this.jumped = true;
        this.jump();

        if ( this.hasSword ) {
          if ( Math.random() > 0.6 ) {
            var camera = Framework.GetCamera();
            camera.doZoom();
          }
        }
      }
    }
  }
});
