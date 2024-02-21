const { ApolloServer, gql } = require("apollo-server");
const typeDefs = gql`
  type Query {
    message: String
  }
  type Query {
    about: String
  }
`;

const resolvers = {
  Query: {
    message: () => "Hello from GraphQL",
    about: () => "About GraphQL",
  },
};

// console.log(typeDefs);
const server = new ApolloServer({ typeDefs, resolvers });
server
  .listen(9000)
  .then(({ url }) => console.log(`server started and listening on ${url}`));
