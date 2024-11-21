import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './AuthGard';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { AppComponent } from './app.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';
import { EditResourceComponent } from './pages/edit-resource/edit-resource.component';
import { ProductionLineComponent } from './pages/production-line/production-line.component';
import { EditPhaseComponent } from './pages/edit-phase/edit-phase.component';
import { EditTreatmentComponent } from './pages/edit-treatment/edit-treatment.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { UserRequestsComponent } from './pages/user-requests/user-requests.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';


const routes: Routes = [
  { path : "login", pathMatch : "full", component : LoginComponent},
  { path : "home", pathMatch : "full", component : HomeComponent, canActivate : [AuthGuard]},
  { path : "register-requests", pathMatch : "full", component : UserRequestsComponent, canActivate : [AuthGuard]},
  { path : "resources/new", pathMatch : "full", component : EditResourceComponent, canActivate : [AuthGuard]},
  { path : "production-line/phases/new", pathMatch : "full", component : EditPhaseComponent, canActivate : [AuthGuard]},
  { path : "production-line/treatments/new", pathMatch : "full", component : EditTreatmentComponent, canActivate : [AuthGuard]},
  { path : "production-line/treatments/:id/edit", pathMatch : "full", component : EditTreatmentComponent, canActivate : [AuthGuard]},
  { path : "production-line/treatments", pathMatch : "full", component : TreatmentsComponent, canActivate : [AuthGuard]},
  { path : "production-line/phases/:id/edit", pathMatch : "full", component : EditPhaseComponent, canActivate : [AuthGuard]},
  { path : "production-line", pathMatch : "full", component : ProductionLineComponent, canActivate : [AuthGuard]},
  { path : "resources/:id/edit", pathMatch : "full", component : EditResourceComponent, canActivate : [AuthGuard]},
  { path : "resources", pathMatch : "full", component : StocksComponent, canActivate : [AuthGuard]},
  { path : "schedules/new", pathMatch : "full", component : ScheduleComponent, canActivate : [AuthGuard]},
  { path : "roles", pathMatch : "full", component : RolesComponent, canActivate : [AuthGuard]},
  { path : "clients/new", pathMatch : "full", component : EditClientComponent, canActivate : [AuthGuard]},
  { path : "clients/:id/edit", pathMatch : "full", component : EditClientComponent, canActivate : [AuthGuard]},
  { path : "clients", pathMatch : "full", component : ClientsComponent, canActivate : [AuthGuard]},
  { path : "schedules", pathMatch : "full", component : ScheduleComponent, canActivate : [AuthGuard]},
  { path : "users/:id/edit", pathMatch : "full", component : EditUserComponent, canActivate : [AuthGuard]},
  { path : "profile/:id", pathMatch : "full", component : EditUserComponent, canActivate : [AuthGuard]},
  { path : "users/new", pathMatch : "full", component : EditUserComponent, canActivate : [AuthGuard]},
  { path : "orders/:id/edit", pathMatch : "full", component : EditOrderComponent, canActivate : [AuthGuard]},
  { path : "orders/edit", pathMatch : "full", component : EditOrderComponent, canActivate : [AuthGuard]},
  { path : "orders/new", pathMatch : "full", component : EditOrderComponent, canActivate : [AuthGuard]},
  { path : "orders", pathMatch : "full", component : OrdersComponent, canActivate : [AuthGuard]},
  { path : "users", pathMatch : "full", component : UsersComponent, canActivate : [AuthGuard]},
  { path : "tasklist", pathMatch : "full", component : TaskListComponent, canActivate : [AuthGuard]},
  { path : "simulator", pathMatch : "full", component : SimulatorComponent, canActivate : [AuthGuard]},
  { path : "settings", pathMatch : "full", component : SettingsComponent, canActivate : [AuthGuard]},

  { path : "", pathMatch: 'full', redirectTo:"/home"},
  { path : "", component : AppComponent , canActivate : [AuthGuard] }


]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
