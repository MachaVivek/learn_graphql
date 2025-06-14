import { prismaClient } from "../lib/db"
import {createHmac, randomBytes} from 'node:crypto'
import JWT from 'jsonwebtoken'

const JWT_SECRET= process.env.JWT_SECRET!;

export interface ICreateUserPayload{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface IGetUserToken{
    email: string,
    password: string
}

class UserService {

    private static generateHash(password: string, salt: string){
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
        return hashedPassword
    }

    private static generateJwtToken(id: string, email: string) {
        const token = JWT.sign({ id, email }, JWT_SECRET);
        return token;
    }

    public static decodeJwtToken(token: string){
        return JWT.verify(token, JWT_SECRET)
    }

    public static createUser(payload: ICreateUserPayload){
        const {firstName, lastName, email, password} = payload;
        const salt= randomBytes(32).toString('hex');
        const hashedPassword=  this.generateHash(password, salt);
        return prismaClient.users.create({
            data: {
                firstName, lastName, email, salt, 
                password: hashedPassword
            }
        })
    }

    private static async getUserByEmail(email: string){
        return prismaClient.users.findUnique({where:{email}})
    }

    public static async getUserById(id: string){
        return prismaClient.users.findUnique({where: {id}})
    }

    public static async getUserToken(paylaod: IGetUserToken){
        const {email, password} = paylaod;
        const user= await this.getUserByEmail(email)
        if(!user) throw new Error("User not found")
        const hashedPassword= this.generateHash(password, user.salt)
        if(user.password !== hashedPassword) throw new Error("Incorrect password")
        const token = this.generateJwtToken(user.id, user.password)
        return token;
    }
}

export default UserService