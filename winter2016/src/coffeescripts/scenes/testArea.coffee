Drawable = require('../core/drawable')

class OneThing extends Drawable
  name : "title_a"
  name: "title_a"
  font: "24pt 'Oxygen'"
  fontColor: "#FF0000"
  x: 330
  y: 202
  text: "ONE"
  fontSize: 24
  fontDir: true
  count: 0

  doDraw: (activeScene, ctx) ->
    @fontSize = 20 + Math.sin(@count * 0.2) * 10
    @x = 330 - (20 + Math.sin(@count * 0.2) * 10)
    @count = (@count + 1) % (10 * Math.PI)

    @font = Math.round(@fontSize) + "pt 'Oxygen'"
    super activeScene, ctx


module.exports = class TestArea extends Drawable

  name: "TestArea"

  constructor: ->
    super

    one = new OneThing()
    title = new Drawable({
      name: "title"
      font: "24pt 'Oxygen'"
      x: 150
      y: 200
      text: "Get to the           escape pod"
    })

    @addAsset(title)
    @addAsset(one)


  doDraw: (activeScene, ctx) =>
    ctx.rect(0, 0, 800, 600)
    ctx.fillStyle = "#000"
    ctx.fill()

    super activeScene, ctx
