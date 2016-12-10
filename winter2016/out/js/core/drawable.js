(function() {
  var Drawable;

  module.exports = Drawable = (function() {
    Drawable.prototype.x = 0;

    Drawable.prototype.y = 0;

    Drawable.prototype.vx = 0;

    Drawable.prototype.vy = 0;

    Drawable.prototype.ox = 0;

    Drawable.prototype.oy = 0;

    Drawable.prototype.width = 0;

    Drawable.prototype.height = 0;

    Drawable.prototype.scale = 1.0;

    Drawable.prototype.text = null;

    Drawable.prototype.font = "12pt 'Oxygen'";

    Drawable.prototype.fontColor = "#FFFFFF";

    Drawable.prototype.animate = false;

    Drawable.prototype.animation_index = 0;

    Drawable.prototype.rotation = 0;

    Drawable.prototype.rox = 0;

    Drawable.prototype.roy = 0;

    Drawable.prototype.parent = null;

    Drawable.prototype.name = null;

    Drawable.prototype.visible = true;

    function Drawable(config) {
      var key, ref, value;
      if (config == null) {
        config = {};
      }
      this.animations = new Array();
      for (key in config) {
        value = config[key];
        this[key] = value;
      }
      this.children = new Array();
      this.events = {};
      if (config.listeners != null) {
        ref = config.listeners;
        for (key in ref) {
          value = ref[key];
          this.events[key] = value;
        }
      }
      if ((config.image != null) || (config.src != null)) {
        this.image = AssetManager.get(config.image || config.src);
        if (this.width === 0) {
          this.width = this.image.width;
        }
        if (this.height === 0) {
          this.height = this.image.height;
        }
      }
    }

    Drawable.prototype.show = function() {
      return this.visible = true;
    };

    Drawable.prototype.hide = function() {
      return this.visible = false;
    };

    Drawable.prototype.invoke = function(event, arg1, arg2) {};

    Drawable.prototype.doDraw = function(scene, ctx) {
      var asset, cx, cy, i, len, px, py, ref, results;
      if (!this.visible) {
        return;
      }
      if (this.image != null) {
        if (this.rotation != null) {
          ctx.drawImage(this.image, this.x + this.ox, this.y + this.oy, this.width * this.scale, this.height * this.scale);
        } else {
          cx = this.x;
          cy = this.y;
          px = this.x - (this.width / 2) + this.rox;
          py = this.y - (this.height / 2) + this.roy;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(this.rotation * Math.PI / 180);
          ctx.translate(-cx, -cy);
          ctx.drawImage(this.image, px + this.ox, py + this.oy, this.width * this.scale, this.height * this.scale);
          ctx.restore();
        }
      }
      if ((this.text != null) && this.text.length > 0) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.text, this.x + this.ox, this.y + this.oy);
        ctx.restore();
      }
      ref = this.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        asset = ref[i];
        results.push(asset.doDraw.call(asset, scene, ctx));
      }
      return results;
    };

    Drawable.prototype.addAsset = function(asset) {
      this.invoke("onaddasset");
      if (asset != null) {
        return this.children.push(asset);
      }
    };

    Drawable.prototype.removeAsset = function(assetToRemove) {
      var items;
      items = _.filter(this.children, function(asset) {
        return asset !== assetToRemove;
      });
      delete this.childrn;
      return this.children = items;
    };

    Drawable.prototype.getAssets = function(name) {
      return _.filter(this.children, function(asset) {
        return asset.name === name;
      });
    };

    Drawable.prototype.getAsset = function(name) {
      return _.find(this.children, function(asset) {
        return asset.name === name;
      });
    };

    Drawable.prototype.doUpdate = function() {
      this.invoke("onupdate");
      this.x += this.vx;
      this.y += this.vy;
      return this.invoke("onupdateassets");
    };

    return Drawable;

  })();

}).call(this);
