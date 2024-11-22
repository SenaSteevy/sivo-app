import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Treatment } from 'src/models/Treatment';
import { JobService } from 'src/services/jobService';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})
export class TreatmentsComponent implements OnInit {
  displayedColumns: string[] = [ 'select','id','description','phaseName', 'actions'];
  treatmentsDataSource: MatTableDataSource<Treatment> = new MatTableDataSource<Treatment>();
  paginatedData: MatTableDataSource<Treatment> = new MatTableDataSource<Treatment>();
  @ViewChild(MatPaginator) paginator: any;
  treatmentList: Treatment[] = [];
  state : 'loading' | 'error' | 'ready' = 'loading';
  selection = new SelectionModel<Treatment>(true, []);
  selectAllChecked = false;

  constructor(private jobService : JobService,
    private dialog : MatDialog,
    private _snackBar : MatSnackBar
    ) { }

  ngOnInit(): void {
    this.getDataSource()
  }

   getDataSource() {
    this.treatmentsDataSource = new MatTableDataSource<Treatment>();
    this.paginatedData = new MatTableDataSource<Treatment>();
    this.jobService.getTreatments().subscribe({
      next: (response: Treatment[]) => {
        this.treatmentsDataSource.data.push(...response);
        this.paginatedData = new MatTableDataSource<Treatment>( this.treatmentsDataSource.data.slice(0, 10))
        this.treatmentList = response
        this.state= 'ready'
      },
      error: (error: any) =>{
        this.state = 'error'
        console.log('error during getAllTreatments:', error)
      },
      complete :  () => {
        this.treatmentsDataSource.paginator = this.paginator; 
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    const paginatedData = this.treatmentsDataSource.data.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Treatment>(paginatedData);
  }

  selectRow(checked: boolean, row: Treatment): void {
    if (checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }
  applyAction(action: string): void {
    const selectedTreatments = this.selection.selected;
    // Apply the action to selected tasks
    switch (action) {
      case 'Delete':
        this.deleteTreatments(selectedTreatments);
  
    }
  }

  selectAllRows(): void {
    if (this.selectAllChecked) {
      this.selection.clear();
    } else {
      this.selection.select(...this.paginatedData.data);
    }
    this.selectAllChecked = !this.selectAllChecked;
  }

  deleteTreatments(treatment: Treatment[]): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete Treatments ?", content : `Are you sure you want to delete these treatments ? This will delete all related orders who need these treatments.`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){
      let errors = 0;
      treatment.forEach((treatment) => {
        this.jobService.deleteTreatment(treatment.id).subscribe({
          error : (error : any ) => {
            console.log("error during deleting treatment :"+treatment.description, error) 
            errors++}
        })    
      })
      if(errors == 0){ 
        setTimeout(()=>{
          this.getDataSource();
        this.openSnackBar("Treatment list selected was deleted successfully.")
        }, 2000)
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Custom filtering function
    this.treatmentsDataSource.filterPredicate = (treatment: Treatment, filter: string) => {
      const id = treatment.id.toString()
      const description = treatment.description.toLowerCase();
      const phaseName = treatment.phase.name.toLowerCase();
     
      return (
        id.includes(filter) ||
        description.includes(filter) ||
        phaseName.includes(filter)
      );
    };
    // Apply the filter
    this.treatmentsDataSource.filter = filterValue;
    // Reset the paginator to the first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
    // Update the paginatedData with the filtered data
    const startIndex = this.paginator?.pageIndex * this.paginator?.pageSize || 0;
    const endIndex = startIndex + (this.paginator?.pageSize || 10);
    const paginatedData = this.treatmentsDataSource.filteredData.slice(startIndex, endIndex);
    this.paginatedData = new MatTableDataSource<Treatment>(paginatedData);
  }

  deleteTreatment(treatment : any){
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {

      width: '400px',
      data : { title : "Delete Treatment ?", content : `Are you sure you want to delete  treatment ${treatment.name} ? This will delete all related orders phases of this treatments.`}
    })

    dialogRef.afterClosed().subscribe((result : string) =>{
      if(result=="yes"){

        this.jobService.deleteTreatment(treatment.id).subscribe({
          next : (response : any)  => {  
            this.openSnackBar(" Treatment Deleted.")
            this.getDataSource()
          },
          error : (error: any) => { console.error('Error deleting treatment', error); } ,
          complete : () => { this.getDataSource()}

        })
      }
    })
  }

  openSnackBar(message : string) {
    this._snackBar.open( message , '', {
      duration: 2000
    });
  }



}

