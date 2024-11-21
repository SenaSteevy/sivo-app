import { FileHandle } from "./FileHandle"
import { Role } from "./Role"

export interface User{
    id : string
    email : string,
    gender : string,
    firstName : string,
    lastName : string,
    password : string
    post : string,
    role : Role[],
    profile : FileHandle | null
}