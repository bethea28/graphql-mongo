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
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

mongoose.connect(process.env.REACT_APP_NOT_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let Book = mongoose.model('Book', Schemas.BookSchema)

const typeDefs = gql`
  type BookPayload {
    title: String
    author: String
    id: Int
  }

  type Query {
    getAllBooks(id: Int): [BookPayload]
  }

  type Mutation {
    createBook(title: String, author: String, id: Int): BookPayload
  }
`
const resolvers = {
  Query: {
    getAllBooks: async (parent, args) => {
      if (args.id) {
        let findAll = await Book.find()
        console.log('find one', findAll)
        return findAll.filter((a) => {
          return a.id === args.id
        })
      }
      return Book.find()
    },
  },
  Mutation: {
    createBook: (parents, args) => {
      console.log('args', args)
      Book.create({
        title: args.title,
        author: args.author,
        id: args.id,
      })
      return {
        title: args.title,
        author: args.author,
        id: args.id,
      }
    },
  },
}
const client = new ApolloClient({
  cache: new InMemoryCache(),
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  client,
})

server.applyMiddleware({ app })

// The `listen` method launches a web server.
app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
)
