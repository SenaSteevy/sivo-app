import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, takeLast } from 'rxjs';
import { Job } from '../models/Job';
import { Planning } from 'src/models/Planning';
import { AuthService } from './authService';
import { Phase } from 'src/models/Phase';
import { Task } from 'src/models/Task';
import { Client } from 'src/models/Client';
import { Resource } from 'src/models/Resource';
import { Treatment } from 'src/models/Treatment';
import { UserRequest } from 'src/models/UserRequest';
import { AutoPlanning } from 'src/models/AutoPlanning';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  phaseList : Phase[] = []
  clientlist : Client[] = []
  treatmentList : Treatment[] = []
  resourceList : Resource[] = []

  async updateJobService(): Promise<void> {
    try {
      const clientsResponse = await this.getAllClients().toPromise();
      this.clientlist = clientsResponse || [];
  
      const phasesResponse = await this.getAllPhases().toPromise();
      this.phaseList = phasesResponse || [];
  
      const treatmentsResponse = await this.getTreatments().toPromise();
      this.treatmentList = treatmentsResponse || [];
  
      const resourcesResponse = await this.getAllResources().toPromise();
      this.resourceList = resourcesResponse || [];

    } catch (error) {
      console.error('Error while fetching data:', error);
    }
  }
  
  

  private apiUrl = environment.apiUrl+'ordo-service';


  constructor(private http: HttpClient,private authService : AuthService ) {
     this.updateJobService()
  }

  updateAutoPlanning(autoPlanning: AutoPlanning) {
    return this.http.post(`${this.apiUrl}/scheduler/updateAutoPlanning`,autoPlanning );  }
 
  getAutoPlanning(){
    return this.http.get<any>(`${this.apiUrl}/scheduler/getAutoPlanning` );

  }
  setAutoPlanning( value : string){
    return this.http.post(`${this.apiUrl}/scheduler/setAutoPlanning/${value}`, null );

  }

  simulateWithExcelFile(data: FormData) {
    return this.http.post(`${this.apiUrl}/scheduler/solveByExcelFile`, data, { responseType : 'blob'} );

  }

  getTreatments() {
    return this.http.get<Treatment[]>(`${this.apiUrl}/treatments/getAll` );
  }

  deleteTreatment(id : any){
    return this.http.post(`${this.apiUrl}/treatments/delete/${id}`, null );

  }

  getTreatmentById(id:any){
    return this.http.get<Treatment>(`${this.apiUrl}/treatments/findById/${id}` );

  }

  updateTreatment(id : any, data: any){
    return this.http.post<Treatment>(`${this.apiUrl}/treatments/updateById/${id}`,data );

  }

  createTreatment(data : any){
    return this.http.post<Treatment>(`${this.apiUrl}/treatments/save`,data );
  }
  
 
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/getAll` );
  }

  getAllPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.apiUrl}/plannings/getAll` );
  }

  getAllPhases() {
    return this.http.get<Phase[]>(`${this.apiUrl}/phases/getAll` )
  }

   makeNewPlanning()  {
    return this.http.get<Planning>(`${this.apiUrl}/scheduler/solve` )
  }

  deletePlanning(id: number) {
    return this.http.post(`${this.apiUrl}/scheduler/deleteById/${id}`, null )
  }

  updateJobList(jobList: Job[]) {
    return this.http.post<Job[]>(`${this.apiUrl}/scheduler/updateJobList`,jobList )
  }

  getAllClients() {
    return this.http.get<Client[]>(`${this.apiUrl}/clients/getAll` )
  }

  getAllResources() {
    return this.http.get<Resource[]>(`${this.apiUrl}/resources/getAll` )
    }

    newJob(job : Job){
      return this.http.post(`${this.apiUrl}/jobs/new`,job )  
    }
  
    deleteJob(numOrder : number){
      return this.http.post(`${this.apiUrl}/jobs/delete/${numOrder}`, null ) 
    }

    getJobById(id : string){
      return this.http.get<Job>(`${this.apiUrl}/jobs/findById/${id}` ) 
    }
    updateJob(numOrder : number, job : any){
      return this.http.post(`${this.apiUrl}/jobs/updateById/${numOrder}`, job ) 
    }

    getClients(){
      return this.http.get<Client[]>(`${this.apiUrl}/clients/getAll` ) 
    }

    getClientById(id : string){
      return this.http.get<Client>(`${this.apiUrl}/clients/findById/${id}` ) 
    }

    updateClient(id : number, data : any){
      return this.http.post<Client>(`${this.apiUrl}/clients/updateById/${id}`,data ) 
    }

    createClient(data : any){
      return this.http.post<Client>(`${this.apiUrl}/clients/new`,data ) 
    }

    deleteClient(id : number){
      return this.http.post(`${this.apiUrl}/clients/delete/${id}`, null ) 
    }

    getResources(){
      return this.http.get<Resource[]>(`${this.apiUrl}/resources/getAll` ) 
    }

    getResourceById(id : string){
      return this.http.get<Resource>(`${this.apiUrl}/resources/findById/${id}` ) 
    }

    updateResource(id : number, data : any){
      return this.http.post<Resource>(`${this.apiUrl}/resources/updateById/${id}`,data ) 
    }

    createResource(data : any){
      return this.http.post<Resource>(`${this.apiUrl}/resources/save`,data ) 
    }

    deleteResource(id : number){
      return this.http.post(`${this.apiUrl}/resources/delete/${id}`, null ) 
    }

    getPhaseById(id:any){
      return this.http.get<Phase>(`${this.apiUrl}/phases/findById/${id}` ) 
    }
    updatePhase(id : number, data : any){
      return this.http.post<Phase>(`${this.apiUrl}/phases/updateById/${id}`,data ) 
    }

    createPhase(data : any){
      return this.http.post<Phase>(`${this.apiUrl}/phases/save`,data ) 
    }

    deletePhase(id : number){
      return this.http.post(`${this.apiUrl}/phases/delete/${id}`, null ) 
    }

}


 
 
 

