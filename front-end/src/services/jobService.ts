import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, takeLast } from 'rxjs';
import { Job } from '../models/Job';
import { Planning } from 'src/models/Planning';
import { Phase } from 'src/models/Phase';
import { Treatment } from 'src/models/Treatment';
import { AutoPlanning } from 'src/models/AutoPlanning';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class JobService {

  phaseList : Phase[] = []
  treatmentList : Treatment[] = []

  async updateJobService(): Promise<void> {
    try {
      
      const phasesResponse = await this.getAllPhases().toPromise();
      this.phaseList = phasesResponse || [];
  
      const treatmentsResponse = await this.getTreatments().toPromise();
      this.treatmentList = treatmentsResponse || [];

    } catch (error) {
      console.error('Error while fetching data:', error);
    }
  }
  
  

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) {
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


 
 
 

