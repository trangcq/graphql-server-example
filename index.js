const { ApolloServer, gql } = require('apollo-server')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: Author
  }

  type Author {
    id: ID
    name: String
    age: Int
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book],
    authors: [Author],
    book(id: ID!): Book,
    randomBook: String,
  }

  type Mutation {
    addBook(title: String): Book
  }
`;

const { books, authors } = require('./data');

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    book(parent, args) {
      logger.log("info: Getting detail book")
      return books.find( book => book.id == args.id )
    },
    randomBook(parent, args, context) {
      logger.log("info: Getting random book")
      return context.getRandomBook()
    },
  },
  Book: {
    author(parent, args) {
      return authors.find( author => author.id == parent.authorId )
    }
  },
  Mutation: {
    addBook(_, payload) {
      const newBook = {
        id: 4,
        ...payload
      }

      books.push(newBook)
      return newBook
    }
  }
};

// get random book
const getRandomBook = async () => {
  const index =  Math.floor( Math.random() * (books.length))

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
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});