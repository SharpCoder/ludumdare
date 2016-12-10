(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var AssetManager;

  module.exports = AssetManager = (function() {
    function AssetManager() {}

    AssetManager.prototype.images = [];

    AssetManager.prototype.sounds = [];

    AssetManager.prototype.loaded = {};

    AssetManager.prototype.loaded_sounds = {};

    AssetManager.prototype._processSound = function(index, callback) {
      var sound;
      if (index >= this.sounds.length) {
        if (callback != null) {
          callback();
          return;
        }
      }
      sound = new Audio('./sounds/' + this.sounds[index]);
      this.loaded_sounds[this.sounds[index]] = sound;
      return this._processSound(index + 1, callback);
    };

    AssetManager.prototype._process = function(index, callback) {
      var image;
      if (index >= this.images.length) {
        this._processSound(0, callback);
        return;
      }
      image = new Image();
      image.onload = (function(_this) {
        return function() {
          return _this._process(index + 1, callback);
        };
      })(this);
      image.src = './assets/' + this.images[index];
      return this.loaded[images[index]] = image;
    };

    AssetManager.prototype.initialize = function(callback) {
      return this._process(0, callback);
    };

    AssetManager.prototype.get = function(asset) {
      if (this.loaded[asset] != null) {
        return this.loaded[asset];
      } else {
        throw "Asset '" + asset + "' not found";
      }
    };

    return AssetManager;

  })();

}).call(this);

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function() {
  var AssetManagerImpl, Drawable, GameEngine, SceneLoader;

  Drawable = require('./core/drawable');

  AssetManagerImpl = require('./core/assetManager');

  SceneLoader = require('./sceneLoader');

  window.AssetManager = new AssetManagerImpl();

  GameEngine = (function() {
    GameEngine.prototype.activeScene = null;

    GameEngine.prototype.scenes = [];

    function GameEngine() {
      this.width = 800;
      this.height = 600;
    }

    GameEngine.prototype.initialize = function(callback) {
      console.log("initlaize");
      return AssetManager.initialize((function(_this) {
        return function() {
          return _this.canvas = document.getElementById('canvas');
        };
      })(this), this.ctx = canvas.getContext('2d'), new SceneLoader(this), callback());
    };

    GameEngine.prototype.loadScene = function(name) {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = this.scenes.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (this.scenes[i].name === name) {
          this.activeScene = this.scenes[i];
          results.push(this.activeScene.invoke("onreset"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    GameEngine.prototype.addScene = function(scene) {
      this.scenes.push(scene);
      if (this.activeScene == null) {
        this.activeScene = scene;
        return this.activeScene.invoke("onreset");
      }
    };

    GameEngine.prototype.doDraw = function() {
      if (this.activeScene != null) {
        this.ctx.clearRect(0, 0, 800, 800);
        return this.activeScene.doDraw(this.activeScene, this.ctx);
      }
    };

    GameEngine.prototype.doUpdate = function() {
      var ref;
      if (this.activeScene != null) {
        return (ref = this.activeScene) != null ? ref.doUpdate(this.activeScene) : void 0;
      }
    };

    GameEngine.prototype.doMouseDown = function(x, y) {
      if (this.activeScene != null) {
        return this.activeScene.invoke("onmousedown", x, y);
      }
    };

    GameEngine.prototype.doMouseMove = function(x, y) {
      if (this.activeScene != null) {
        return this.activeScene.invoke("onmousemove", x, y);
      }
    };

    return GameEngine;

  })();

  window.Framework = new GameEngine();

}).call(this);

},{"./core/assetManager":1,"./core/drawable":2,"./sceneLoader":4}],4:[function(require,module,exports){
(function() {
  var SceneLoader, TestArea;

  TestArea = require('./scenes/testArea');

  module.exports = SceneLoader = (function() {
    function SceneLoader(framework) {
      framework.addScene(new TestArea());
    }

    return SceneLoader;

  })();

}).call(this);

},{"./scenes/testArea":5}],5:[function(require,module,exports){
(function() {
  var Drawable, OneThing, TestArea,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Drawable = require('../core/drawable');

  OneThing = (function(superClass) {
    extend(OneThing, superClass);

    function OneThing() {
      return OneThing.__super__.constructor.apply(this, arguments);
    }

    OneThing.prototype.name = "title_a";

    OneThing.prototype.name = "title_a";

    OneThing.prototype.font = "24pt 'Oxygen'";

    OneThing.prototype.fontColor = "#FF0000";

    OneThing.prototype.x = 330;

    OneThing.prototype.y = 202;

    OneThing.prototype.text = "ONE";

    OneThing.prototype.fontSize = 24;

    OneThing.prototype.fontDir = true;

    OneThing.prototype.count = 0;

    OneThing.prototype.doDraw = function(activeScene, ctx) {
      this.fontSize = 20 + Math.sin(this.count * 0.2) * 10;
      this.x = 330 - (20 + Math.sin(this.count * 0.2) * 10);
      this.count = (this.count + 1) % (10 * Math.PI);
      this.font = Math.round(this.fontSize) + "pt 'Oxygen'";
      return OneThing.__super__.doDraw.call(this, activeScene, ctx);
    };

    return OneThing;

  })(Drawable);

  module.exports = TestArea = (function(superClass) {
    extend(TestArea, superClass);

    TestArea.prototype.name = "TestArea";

    function TestArea() {
      this.doDraw = bind(this.doDraw, this);
      var one, title;
      TestArea.__super__.constructor.apply(this, arguments);
      one = new OneThing();
      title = new Drawable({
        name: "title",
        font: "24pt 'Oxygen'",
        x: 150,
        y: 200,
        text: "Get to the           escape pod"
      });
      this.addAsset(title);
      this.addAsset(one);
    }

    TestArea.prototype.doDraw = function(activeScene, ctx) {
      ctx.rect(0, 0, 800, 600);
      ctx.fillStyle = "#000";
      ctx.fill();
      return TestArea.__super__.doDraw.call(this, activeScene, ctx);
    };

    return TestArea;

  })(Drawable);

}).call(this);

},{"../core/drawable":2}]},{},[3])