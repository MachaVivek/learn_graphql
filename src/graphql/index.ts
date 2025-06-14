import { ApolloServer } from "@apollo/server";

import { User } from "./user";

async function createApolloGraphqlServer () {
    const graphql_server= new ApolloServer({
        // we write the schema for graphql
        typeDefs: `
            ${User.typeDefs}
            type Query {
                ${User.queries}
            }
            type Mutation{
                ${User.mutations}
            }
        `,
        //  we write actual function which are executed
        resolvers: {
            Query:{
                ...User.resolvers.queries
            },
            Mutation:{
                ...User.resolvers.mutations
            }
        }
    })
    await graphql_server.start();
    return graphql_server;
}
export default createApolloGraphqlServer;