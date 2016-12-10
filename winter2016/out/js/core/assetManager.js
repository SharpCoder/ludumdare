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
