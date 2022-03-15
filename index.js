const { ApolloServer, UserInputError } = require('apollo-server')
const { books, authors } = require('./data')
const typeDefs = require('./typeDefs')
const QuoteAPI  = require('./quoteApi')

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    book(parent, args) {
      logger.log("info: Getting detail book")
      if (args.id < 1) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'id',
        });
      }

      return books.find(book => book.id == args.id)
    },
    randomBook(parent, args, context) {
      logger.log("info: Getting random book")
      return context.getRandomBook()
    },
    quote(parent, args, { dataSources }) {
      logger.log("info: Getting a quote")
      return dataSources.quoteAPI.getQuote()
    },
  },
  Book: {
    author(parent, args) {
      return authors.find(author => author.id == parent.authorId)
    }
  },
  Mutation: {
    addBook(_, payload) {
      const newBook = {
        id: 456,
        ...payload
      }

      books.push(newBook)
      return newBook
    }
  }
};

// get random book
const getRandomBook = async () => {
  const index =  Math.floor(Math.random() * (books.length))

  return books[index].title
}

// use console log in resolvers
const logger = {
  log: msg => console.log(msg)
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context: {
    getRandomBook,
    logger,
  },
  dataSources: () => {
    return {
      quoteAPI: new QuoteAPI(),
    }
  },
  formatError: (err) => {
    if (err.extensions.code == 'GRAPHQL_VALIDATION_FAILED') {
      return new Error('Validate failed!');
    }

    return err
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});