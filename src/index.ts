import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
    const app= express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json())  // it parses incomming requests into JSON body
    const graphql_server= new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }`,   // we write the schema for graphql
        resolvers: {
            Query:{
                hello: () => `Working grahpql`
            }
        }  // actual function which are executed
    })
    await graphql_server.start();


    app.get("/", (req, res) => {
        res.status(200).json({message:"Backend is working"})
    })

    app.use('/graphql', expressMiddleware(graphql_server)) // here apply the middleware and 
    app.listen(port, ()=>{
        console.log(`Server started at port: ${port}`)
    })
}

init();
