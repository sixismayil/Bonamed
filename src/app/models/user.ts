export interface User {
    uid?: string;
    username: string;
    isAdmin:boolean
    isActive:boolean
    createDate:Date
    password:string
 }
 export interface UserData {
    data: User;
 }
