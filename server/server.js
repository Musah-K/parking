import express from 'express';
import { config } from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';  // <-- Add this
import ConnectMongo from 'connect-mongodb-session';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { buildContext } from 'graphql-passport';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import connectDb from './config/db.js';
import mergedResolvers from './resolvers/index.resolvers.js';
import mergedTypeDefs from './typedefs/index.typedef.js';
import configPassport from './config/passport.js';

// Load environment variables
config();

const app = express();
const httpServer = http.createServer(app);

// Use correct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow CORS with credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Connect to MongoDB
await connectDb();

// Set up MongoDB session store
const MongoSessionStore = ConnectMongo(session);
configPassport();

const store = new MongoSessionStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

store.on('error', (error) => console.error('Session store error:', error));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve React static files from the build output (dist folder)
// Now, __dirname is the directory of server.js (e.g., .../parking/server)
// So, '../dist' correctly points to .../parking/dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

// GraphQL endpoint
app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: ({ req, res }) => buildContext({ req, res }),
  })
);

// Fallback: Serve React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 7000;
await new Promise((resolve) => httpServer.listen(PORT, '0.0.0.0', resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
