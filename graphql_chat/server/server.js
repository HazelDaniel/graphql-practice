const fs = require("fs");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const port = 9000;
const jwtSecret = Buffer.from("xkMBdsE+P6242Z2dPV3RD91BPbLIko7t", "base64");

const typeDefs = fs.readFileSync("./schema.graphql", { encoding: "utf8" });
const resolvers = require("./resolvers");

function context({ req }) {
  if (req && req.user) {
    return { userId: req.user.sub };
  }
  return {};
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  expressJwt({
    credentialsRequired: false,
    secret: jwtSecret,
    algorithms: ["HS256"],
  }).unless({ path: ['/login'] }) // unless middleware to exclude '/login' from authentication
);

// Routes
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const user = db.users.get(name);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

// Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers, context });
apolloServer.applyMiddleware({ app, path: "/graphql" });

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  } else {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () => console.log(`Server started on port ${port}`));