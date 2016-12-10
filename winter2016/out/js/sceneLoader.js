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
