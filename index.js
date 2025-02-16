const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};


const app = express();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    
    const token = req.headers.authorization || '';
    
    
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user };
    } catch (err) {
      return { user: null };
    }
  }
});


const PORT = process.env.PORT || 4000;
const startServer = async () => {
  await connectDB();
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};


startServer();
