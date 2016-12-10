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
