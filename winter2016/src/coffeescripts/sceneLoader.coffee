TestArea = require('./scenes/testArea')

module.exports = class SceneLoader
  
  constructor: (framework) ->
    framework.addScene(new TestArea())
