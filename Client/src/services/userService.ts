import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authService';
import { Role } from 'src/models/Role';
import { FormGroup } from '@angular/forms';
import { User } from 'src/models/User';
import { UserRequest } from 'src/models/UserRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  connectedUser: any;
  connectedUserHasChanged: boolean = false;

  PATH_OF_API = environment.apiUrl;



  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.connectedUser = authService.getUser();
  }

  uploadImage(imageData: FormData, username: string, headers: HttpHeaders): Observable<HttpResponse<any>> {
    return this.httpClient.post(this.PATH_OF_API + `user-service/images/upload?username=${username}`, imageData, {
      reportProgress: true,
      observe: 'response'
    });
  }

  deleteImage(id: string) {
    return this.httpClient.post(this.PATH_OF_API + `user-service/images/delete?id=${id}`, null);
  }

  getAllRoles() {
    return this.httpClient.get<Role[]>(this.PATH_OF_API + 'user-service/roles/getAll');
  }

  getRoleByName(roleName: string) {
    return this.httpClient.get(`${this.PATH_OF_API}user-service/roles/getRoleByName/${roleName}`);
  }
  createUser(data: any) {
    return this.httpClient.post(this.PATH_OF_API + 'user-service/users/registerNewUser', data);
  }

  updateUser(userId: any, formGroup: FormGroup) {
    return this.httpClient.post<User>(this.PATH_OF_API + 'user-service/users/updateUserById/' + userId, formGroup.value);
  }

  public login(loginData: any) {
    return this.httpClient.post(this.PATH_OF_API+"api/authenticate", loginData);
  }

  public newRegisterRequest(formData: any) {
    return this.httpClient.post(this.PATH_OF_API + 'user-service/users/newRegisterRequest', formData);
  }

  getAllUsers() {
    return this.httpClient.get<User[]>(this.PATH_OF_API + 'user-service/users/getAll');
  }

  deleteUser(userId: string) {
    return this.httpClient.delete(this.PATH_OF_API + "user-service/users/deleteUserById/" + userId);
  }

  getUserById(userId: any) {
    return this.httpClient.get<User>(this.PATH_OF_API + "user-service/users/getById/" + userId);
  }

  getImage(username: string) {
    return this.httpClient.get(this.PATH_OF_API + `user-service/images/getImage?username=${username}`);
  }

  getUserRequests() {
    return this.httpClient.get<UserRequest[]>(`${this.PATH_OF_API}user-service/userRequests/getAll`);
  }

  deleteUserRequest(id: any) {
    return this.httpClient.post(`${this.PATH_OF_API}user-service/userRequests/delete/${id}`,null);
  }
}
