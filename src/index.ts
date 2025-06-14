import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import UserService from './services/user';
import dotenv from 'dotenv';
dotenv.config();

async function init(){
    const app= express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json())  // it parses incomming requests into JSON body

    app.get("/", (req, res) => {
        res.status(200).json({message:"Backend is working"})
    })

    const graphql_server= await createApolloGraphqlServer()
    app.use('/graphql',
        express.json(), // <- parses incoming requests
        expressMiddleware(graphql_server, {
          context: async ({ req }) => {
            const token = req.headers["token"] || 'Token not present';
            try {
              const user = UserService.decodeJwtToken(token as string);
              return { user };
            } catch (error) {
              return {};
            }
          },
        })
      ); // here apply the middleware 

    app.listen(port, ()=>{
        console.log(`Server started at port: ${port}`)
    })
}

init();
