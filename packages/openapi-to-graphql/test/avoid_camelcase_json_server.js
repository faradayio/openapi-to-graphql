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

  app.get('/api/test_json', (req, res) => {
    res.send({
      payload_test: 'test',
      age_test: 20,
      valid_test: true,
      payload: {
        user_input_should_be_snake_case: {
          column_name: 'cat_owner',
          format: 'none'
        }
      }
    })
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
