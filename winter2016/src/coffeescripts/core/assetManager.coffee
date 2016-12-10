module.exports = class AssetManager

    images: ["ball.png"]
    sounds: []
    loaded: {}
    loaded_sounds: {}

    _processSound: (index, callback) ->
      if index >= @sounds.length
        if callback?
          callback()
          return

      sound = new Audio('./sounds/' + @sounds[index])
      @loaded_sounds[@sounds[index]] = sound
      @_processSound(index + 1, callback)


    _process: (index, callback) ->
      console.log @images
      if index >= @images.length
        @_processSound(0, callback)
        return

      image = new Image()
      image.onload = () =>
        @_process(index + 1, callback)

      image.src = './assets/' + @images[index]
      @loaded[@images[index]] = image


    initialize: (callback) ->
      @_process(0, callback)


    get: (asset) ->
      if @loaded[asset]?
        return @loaded[asset] 
      else
        throw "Asset '#{asset}' not found"
