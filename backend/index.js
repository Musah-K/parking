import express from 'express';
import { config } from 'dotenv';
import http from 'http';
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


config();
const app = express();
app.use(cors())

const httpServer = http.createServer(app);

const mongoSessionStore = ConnectMongo(session);
configPassport();
// Connecting Passport to mongo db session store ****

const store = new mongoSessionStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
})

store.on("error",(error)=>console.log(error));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie:{
        maxAge: 1000*60*60*24,
        httpOnly: true,
    }
}));

app.use(passport.initialize());
app.use(passport.session());


// ************

const server = new  ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

});

await server.start();

app.use('/graphql', express.json(), expressMiddleware(server,{context:({req,res})=>buildContext({req,res}),}));

await new Promise(resolve => httpServer.listen({port:7000}, resolve))

await connectDb();

console.log('Server ready at:  http://localhost:7000/graphql');