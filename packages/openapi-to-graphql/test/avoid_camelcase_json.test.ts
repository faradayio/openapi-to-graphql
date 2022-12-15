'use strict'

import { afterAll, beforeAll, expect, test } from '@jest/globals'
import { graphql, GraphQLSchema, printSchema } from 'graphql'

import * as openAPIToGraphQL from '../src/index'
import { startServer, stopServer } from './avoid_camelcase_json_server'

const oas = require('./fixtures/avoid_camelcase_json_spec.json')
const PORT = 3004
// Update PORT for this test case:
oas.servers[0].variables.port.default = String(PORT)

let createdSchema: GraphQLSchema

// Set up the schema first and run example API server
beforeAll(() => {
  return Promise.all([
    openAPIToGraphQL
      .createGraphQLSchema(oas, {
        // if this is false, it camelcases fields and json keys
        simpleNames: false
      })
      .then(({ schema, report }) => {
        createdSchema = schema
      }),
    startServer(PORT)
  ])
})

// Shut down API server
afterAll(() => {
  return stopServer()
})

test('does not camelcase keys in a json graphql type', () => {
  console.log(printSchema(createdSchema))

  const query = `{
    response  {
      payload  
    }
  }`

  return graphql(createdSchema, query, null, {}).then((result) => {
    console.log('RESPONSE', JSON.stringify(result, null, 2))
    // expect(result).toEqual({
    //   data: {
    //     payload: {
    //       column_name: 'column_name'
    //     }
    //   }
    // })

    expect(false).toBeTruthy()
  })
})
