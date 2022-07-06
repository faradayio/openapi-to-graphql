// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: openapi-to-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict'

import { graphql } from 'graphql'
import { afterAll, beforeAll, expect, test } from '@jest/globals'

import * as openAPIToGraphQL from '../src/index'
import { startServer, stopServer } from './oneof_type_union_server'

const oas = require('./fixtures/oneof_type_union.json')
const PORT = 3004
// Update PORT for this test case:
oas.servers[0].variables.port.default = String(PORT)

let createdSchema

/**
 * Set up the schema first and run example API server
 */
beforeAll(() => {
  return Promise.all([
    openAPIToGraphQL.createGraphQLSchema(oas).then(({ schema, report }) => {
      createdSchema = schema
    }),
    startServer(PORT)
  ])
})

/**
 * Shut down API server
 */
afterAll(() => {
  return stopServer()
})

test('Querying a type union', () => {
  const query = `query {
    shapes {
      __typename
      ... on SquareShapeOptions {
        height
        width
      }
      ... on RoundShapeOptions {
        radius
      }
      ... on RectangleShapeOptions {
        height
        width
      }
    }
  }`
  return graphql(createdSchema, query).then((result) => {
    expect(result).toEqual({
      data: {
        shapes: [
          {
            __typename: 'SquareShapeOptions',
            height: 10,
            width: 20
          },
          {
            __typename: 'RoundShapeOptions',
            radius: 30
          },
          {
            __typename: 'RectangleShapeOptions',
            height: 30,
            width: 40
          }
        ]
      }
    })
  })
})

test('Posting a type union', () => {
  // Supposedly this is the best we can do with GraphQL mutations and type
  // unions?
  //
  // See https://github.com/graphql/graphql-spec/issues/488
  const query = `mutation {
    createShape (shapeOptionsPostInput: {
      type: "square"
      width: 50
      height: 50
    }) { 
      __typename
      ... on SquareShapeOptions {
        height
        width
      }
      ... on RoundShapeOptions {
        radius
      }
    }
  }`
  return graphql(createdSchema, query).then((result) => {
    expect(result).toEqual({
      data: {
        createShape: {
          __typename: 'SquareShapeOptions',
          height: 50,
          width: 50
        }
      }
    })
  })
})
