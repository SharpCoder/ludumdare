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
