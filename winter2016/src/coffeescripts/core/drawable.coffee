

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
  font: "12pt 'Josefin Sans'"
  fontColor: "#FFFFFF"
  animate: false
  animations: []
  animation_index: 0
  rotation: 0
  rox: 0
  roy: 0
  parent: null
  name: null
  visible: true


  constructor: (config={}) ->
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

    console.log @


  show: =>
    @visible = true


  hide: =>
    @visible = false


  invoke: (event, arg1, arg2) =>
    if @events[event]?
      @events[event].call(@, arg1, arg2)

    # Bubble the events down
    #_.map(@assets, (asset) => asset.invoke(event, arg1, arg2))


  doDraw: (scene, ctx) =>
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
      ctx.font = @font
      ctx.fillStyle = @fontColor
      ctx.fillText(@text, @x + @ox, @y + @oy)

    if @children.length > 0
      for asset in @children
        asset.doDraw(scene, ctx)


  addAsset: (asset) =>
    @invoke("onaddasset")
    if asset?
      @children.push(asset)


  removeAsset: (assetToRemove) =>
    items = _.filter(@children, (asset) => asset != assetToRemove)
    delete @childrn
    @children = items


  getAssets: (name) =>
    return _.filter(@children, (asset) => asset.name == name)


  getAsset: (name) =>
    return _.find(@children, (asset) => asset.name == name)


  doUpdate: =>
