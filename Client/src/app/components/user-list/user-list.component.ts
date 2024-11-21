import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from 'src/services/userService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { User } from 'src/models/User';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { FileHandle } from 'src/models/FileHandle';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [
    trigger('showOrHide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ])
  ]
  
})
export class UserListComponent implements  AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChildren('row') rows!: QueryList<ElementRef>;

  userList: User[];
  displayedColumns: string[];
  filterText: string;
  filteredUserList: any[];
  dataSource: MatTableDataSource<any>;
  selectedUser : any
  animateRows = false;
  state : 'loading' | 'error' | 'ready' = 'loading';
  
  constructor(private userService: UserService, 
    private dialog: MatDialog, 
    private sanitizer : DomSanitizer) {
    this.userList = [];
    this.displayedColumns = ['Profile', 'Name', 'Email','Post', 'Role'];
    this.filterText = '';
    this.filteredUserList = [];
    this.dataSource = new MatTableDataSource<any>([]);

      }

  ngOnInit(): void {
    this.getAllUsers();
  }
  ngAfterViewInit() {
    this.rows.changes.subscribe(() => {
      this.animateRows = true;
    });
  
    this.dataSource.paginator = this.paginator;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.userList = response;
        this.dataSource =  new MatTableDataSource(this.userList);
        this.loadProfileImages();
        this.state = 'ready'
      },
      (error: any) => {
        console.log(error);
        this.state='error';
      }
    );
  }

  loadProfileImages() {
    this.userList.forEach(user => {
      this.getImage(user.email).subscribe(
        (res: any) => {
          if (res && res.picByte) {
            const file: File = new File([res.picByte], res.name, { type: res.type });
            const url: string = 'data:image/jpeg;base64,' + res.picByte;
            const fileHandle: FileHandle = { file :file, 
              url :this.sanitizer.bypassSecurityTrustUrl(url) };
            user.profile = fileHandle;
          } else {
            user.profile = null;
          }
        },
        (error : any ) => {
          console.error(error);
        }
      );
    });
  }
  

  getImage(username: string) {
    return this.userService.getImage(username);
  }


  confirmDelete(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { user },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        // Call your delete user API here
        this.userService.deleteUser(user.username).subscribe(
          response => {
            console.log('User deleted successfully');
            // Refresh the user list after deletion
            this.getAllUsers();
          },
          error => {
            console.error('Error deleting user', error);
          }
        );
      }
    });
  }

 

  calculateAnimationDelay(index: number): number {
    return (index + 1) * 200; 
  }
  
  selectUser(user : User){
    this.selectedUser = null
    setTimeout( () => {
      this.selectedUser = user
    }, 1000)
  }

  reloadDataTable(){
    this.getAllUsers();
    this.selectedUser = null;

  }
}
