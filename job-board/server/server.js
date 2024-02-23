const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const fs = require("fs");
const { gql, ApolloServer } = require("apollo-server-express");
const typeDefs = gql(
  fs.readFileSync("./schema.graphql", { encoding: "utf-8" })
);
const resolvers = require("./resolvers.js");
const apolloServer = new ApolloServer({ typeDefs, resolvers });

const port = 9000;
const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const app = express();

apolloServer.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressJwt({
      secret: jwtSecret,
      credentialsRequired: false,
    })
  );
  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.users.list().find((user) => user.email === email);
    if (!(user && user.password === password)) {
      res.sendStatus(401);
      return;
    }
    const token = jwt.sign({ sub: user.id }, jwtSecret);
    res.send({ token });
  });
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  app.listen(port, () => console.info(`Server started on port ${port}`));
});
