// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: openapi-to-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict'

let server // holds server object for shutdown

/**
 * Starts the server at the given port
 */
function startServer(PORT) {
  const express = require('express')
  const app = express()

  const bodyParser = require('body-parser')
  app.use(bodyParser.json())

  app.get('/api/shapes', (req, res) => {
    res.send([
      {
        type: 'square',
        height: 10,
        width: 20
      },
      {
        type: 'round',
        radius: 30
      }
    ])
  })

  app.post('/api/shapes', (req, res) => {
    res.send(req.body)
  })

  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Example API accessible on port ${PORT}`)
      resolve()
    })
  })
}

/**
 * Stops server.
 */
function stopServer() {
  return new Promise((resolve) => {
    server.close(() => {
      console.log(`Stopped API server`)
      resolve()
    })
  })
}

// If run from command line, start server:
if (require.main === module) {
  startServer(3002)
}

module.exports = {
  startServer,
  stopServer
}
