import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init(){
    const app= express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json())  // it parses incomming requests into JSON body
    const graphql_server= new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
            type Mutation{
                createUser(firstName: String!, lastName: String!, email: String!, password: String!) : Boolean
            }
            `,   // we write the schema for graphql
            
        resolvers: {
            Query:{
                hello: () => `Working grahpql`
            },
            Mutation:{
                createUser: async (_, {firstName, lastName, email, password}:{firstName: string, lastName:string, email:string, password: string})=>{
                    {
                        await prismaClient.users.create({
                            data:{
                                firstName,
                                lastName,
                                email,
                                password,
                                salt: 'random_salt'
                            }
                        })
                        return true
                    };
                }
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
