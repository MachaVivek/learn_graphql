import UserService, { ICreateUserPayload, IGetUserToken } from "../../services/user"

const queries={
    getUserToken: async(_:any, paylaod: IGetUserToken)=>{
        const token= await UserService.getUserToken(paylaod);
        return token; 
    },
    getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
        if (context && context.user) {
          const id = context.user.id;
          const user = await UserService.getUserById(id);
          return user;
        }
        throw new Error("I dont know who are you");
      },
}

const mutations = {
    createUser: async(_:any, payload: ICreateUserPayload)=>{
        const response = await UserService.createUser(payload);
        return response.id
    }
}

export const resolvers= {queries, mutations}