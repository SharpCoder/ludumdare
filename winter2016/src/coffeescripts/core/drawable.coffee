

module.exports = class Drawable

  x: 0
  y: 0
  vx: 0
  vy: 0
  ox: 0
  oy: 0
  width: 0
  height: 0
  scale: 1.0
  text: null
  font: "12pt 'Oxygen'"
  fontColor: "#FFFFFF"
  animate: false
  animation_index: 0
  rotation: 0
  rox: 0
  roy: 0
  parent: null
  name: null
  visible: true


  constructor: (config={}) ->
    # Objects need to be reinstantiated for reasons of pass-by-reference.
    @animations = new Array()

    for key, value of config
      @[key] = value

    @children = new Array()
    @events = {}

    if config.listeners?
      for key, value of config.listeners
        @events[key] = value

    if config.image? || config.src?
      @image = AssetManager.get(config.image || config.src)
      if @width == 0
        @width = @image.width
      if @height == 0
        @height = @image.height


  show: ->
    @visible = true


  hide: ->
    @visible = false


  invoke: (event, arg1, arg2) ->
    return
    # if @events[event]?
    #   @events[event].call(@, arg1, arg2)

    # Bubble the events down
    #_.map(@assets, (asset) -> asset.invoke(event, arg1, arg2))


  doDraw: (scene, ctx) ->
    return unless @visible

    if @image?
      if @rotation?
        ctx.drawImage(@image, @x + @ox, @y + @oy, @width * @scale, @height * @scale)
      else
        cx = @x
        cy = @y
        px = @x - (@width / 2) + @rox
        py = @y - (@height / 2) + @roy
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(@rotation * Math.PI / 180)
        ctx.translate(-cx, -cy)
        ctx.drawImage(@image, px + @ox, py + @oy, @width * @scale, @height * @scale)
        ctx.restore()

    if @text? and @text.length > 0
      ctx.save()
      ctx.translate(@x, @y)
      ctx.rotate(@rotation * Math.PI / 180)
      ctx.translate(-@x, -@y)
      ctx.font = @font
      ctx.fillStyle = @fontColor
      ctx.fillText(@text, @x + @ox, @y + @oy)
      ctx.restore()


    #@invoke("ondraw")
    for asset in @children
      asset.doDraw.call(asset, scene, ctx)


  addAsset: (asset) ->
    @invoke("onaddasset")
    if asset?
      @children.push(asset)


  removeAsset: (assetToRemove) ->
    items = _.filter(@children, (asset) -> asset != assetToRemove)
    delete @childrn
    @children = items


  getAssets: (name) ->
    return _.filter(@children, (asset) -> asset.name == name)


  getAsset: (name) ->
    return _.find(@children, (asset) -> asset.name == name)


  doUpdate: ->
    @invoke("onupdate")
    @x += @vx
    @y += @vy

    @invoke("onupdateassets")
    #_.map(@children, (asset) -> asset.doUpdate())
