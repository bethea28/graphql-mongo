require('dotenv').config()

const { ApolloClient, InMemoryCache } = require('@apollo/client')
const {
  ApolloServer,
  gql,
  PubSub,
  withFilter,
} = require('apollo-server-express')
const { GraphQLScalarType } = require('graphql')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const books = require('./data/books.json')
const libraries = require('./data/libraries.json')
const posts = require('./data/posts.json')
var Schemas = require('./models.js')

const pubsub = new PubSub()
const app = express()
const db = mongoose.connection
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(process.env.REACT_APP_NOT_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let Book = mongoose.model('Book', Schemas.BookSchema)

const typeDefs = gql`
  type BookPayload {
    title: String
    author: String
  }
  type Query {
    getAllBooks: [BookPayload]
  }

  type Mutation {
    createBook(title: String, author: String): BookPayload
  }
`
const resolvers = {
  Query: {
    getAllBooks: (parent, args) => {
      return Book.find()
    },
  },
  Mutation: {
    createBook: (parents, args) => {
      Book.create({
        title: args.title,
        author: args.author,
      })
      return {
        title: args.title,
        author: args.author,
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app })

// The `listen` method launches a web server.
app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
)
