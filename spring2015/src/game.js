


Framework.AddListener("onload", function() {
  var titleScreen = require('./objects/scene_title');
  var gameoverScrene = require('./objects/gameover');

  Framework.SetScore(100);
  Framework.AddScene(titleScreen);
  Framework.AddScene(gameoverScrene);
});
