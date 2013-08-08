FactualApi = require 'factual-api'
config = require('../config.json').api
factual = new FactualApi config.key, config.secret
factual.setBaseURI(config.baseUrl) if config.baseUrl
#factual.startDebug()

class Factual
  constructor: ->
    
  getData: (point, radius, cb)->
    factual.get '/t/places',
      select: 'name,address,address_extended,latitude,longitude'
      geo: {
        "$circle": {
          "$center": point
          "$meters": radius
        }
      }
      limit: 500
      BYPASS: 1
    , (error, res) =>
      if error
        console.log error
        return cb(error)
      return cb(null, res.data)


module.exports = new Factual()
