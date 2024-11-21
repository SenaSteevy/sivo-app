import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  
sessionExpired : boolean = false;

  constructor() {
   } 

  public setRoles(roles : []){
     localStorage.setItem( "roles", JSON.stringify(roles))
  }

  public getRoles() : [] {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : [];
  }

  public setUser( user : any){
    localStorage.setItem("user", JSON.stringify(user))
  }

  public getUser(){
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : undefined
  }

  public setToken(jwtToken : string){
    localStorage.setItem("jwtToken", jwtToken)
  }

  public getToken() : string {
    const jwtToken = localStorage.getItem("jwtToken")
    return jwtToken ? jwtToken : "";
  }

  public clear(){
    localStorage.clear()
  }

  public isLoggedIn(){
    return this.getRoles() && this.getToken();
  }
}

