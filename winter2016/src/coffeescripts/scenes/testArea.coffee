Drawable = require('../core/drawable')

class OneThing extends Drawable
  name: "title_a"
  x: 330
  y: 202
  count: 0

  doDraw: (activeScene, ctx) ->
    
    @scale = 20 + Math.sin(@count * 0.2) * 10
    @x = 330 - (20 + Math.sin(@count * 0.2) * 10)
    @count = (@count + 1) % (10 * Math.PI)
    super activeScene, ctx


module.exports = class TestArea extends Drawable

  name: "TestArea"

  constructor: ->
    super

    one = new OneThing({
      src: "ball.png"
    })
    title = new Drawable({
      name: "title"
      font: "24pt 'Oxygen'"
      x: 150
      y: 200
      text: "Get to the           escape pod"
    })

    #@addAsset(title)
    @addAsset(one)


  doDraw: (activeScene, ctx) =>
    ctx.rect(0, 0, 800, 600)
    ctx.fillStyle = "#000"
    ctx.fill()

    super activeScene, ctx
