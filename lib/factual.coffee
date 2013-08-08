FactualApi = require 'factual-api'
config = require('../config.json').api
factual = new FactualApi config.key, config.secret
factual.setBaseURI(config.baseUrl) if config.baseUrl

class Factual
  constructor: ->
    
  getData: (point, cb)->
    factual.get '/t/places',
      geo: {
        "$point": point
      }
    , (error, res) =>
      if error
        console.log error
        return cb(error)
      return cb(null, res.data)


module.exports = new Factual()
