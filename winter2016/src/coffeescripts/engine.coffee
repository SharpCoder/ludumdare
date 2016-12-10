Drawable = require('./core/drawable')
AssetManagerImpl = require('./core/assetManager')
SceneLoader = require('./sceneLoader')

window.AssetManager = new AssetManagerImpl()

class GameEngine

  activeScene: null
  scenes: []

  constructor: ->
    @width = 800
    @height = 600

  
  postInitialize: (callback) =>
    @canvas = document.getElementById('canvas')
    @ctx = canvas.getContext('2d')
    new SceneLoader(@)
    if callback?
      callback()


  initialize: (callback) ->
    console.log "initlaize"
    AssetManager.initialize(@postInitialize.bind(@, callback))


  loadScene: (name) ->
    for i in [0 .. @scenes.length - 1]
      if @scenes[i].name == name
        @activeScene = @scenes[i]
        @activeScene.invoke("onreset")


  addScene: (scene) ->
    @scenes.push(scene)
    unless @activeScene?
      @activeScene = scene
      @activeScene.invoke("onreset")


  doDraw: ->
    if @activeScene?
      @ctx.clearRect(0, 0, 800, 800)
      @activeScene.doDraw(@activeScene, @ctx)


  doUpdate: ->
    if @activeScene?
      @activeScene?.doUpdate(@activeScene)


  doMouseDown: (x, y) ->
    if @activeScene?
      @activeScene.invoke("onmousedown", x, y)


  doMouseMove: (x, y) ->
    if @activeScene?
      @activeScene.invoke("onmousemove", x, y)


window.Framework = new GameEngine()
