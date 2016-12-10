Drawable = require('../core/drawable')

module.exports = class TestArea extends Drawable

  name: "TestArea"

  constructor: ->
    super
    title = new Drawable({
      name: "title"
      font: "24pt 'Josefin Sans'"
      x: 200
      y: 200
      text: "Death by a thousand cuts"
    })
    @addAsset(title)


  doDraw: (activeScene, ctx) =>
    ctx.rect(0, 0, 800, 600)
    ctx.fillStyle = "#000"
    ctx.fill()

    super activeScene, ctx
