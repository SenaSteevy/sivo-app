import { Permission } from "./Permission";

export interface Role{
    id : number,
    roleName : string,
    roleDescription : string,
    permissionList : Permission[]
}