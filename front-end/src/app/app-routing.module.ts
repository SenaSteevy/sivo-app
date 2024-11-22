import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { AppComponent } from './app.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { ProductionLineComponent } from './pages/production-line/production-line.component';
import { EditPhaseComponent } from './pages/edit-phase/edit-phase.component';
import { EditTreatmentComponent } from './pages/edit-treatment/edit-treatment.component';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';


const routes: Routes = [
  { path : "home", pathMatch : "full", component : HomeComponent},
  { path : "production-line/phases/new", pathMatch : "full", component : EditPhaseComponent},
  { path : "production-line/treatments/new", pathMatch : "full", component : EditTreatmentComponent},
  { path : "production-line/treatments/:id/edit", pathMatch : "full", component : EditTreatmentComponent},
  { path : "production-line/treatments", pathMatch : "full", component : TreatmentsComponent},
  { path : "production-line/phases/:id/edit", pathMatch : "full", component : EditPhaseComponent},
  { path : "production-line", pathMatch : "full", component : ProductionLineComponent},
  { path : "schedules/new", pathMatch : "full", component : ScheduleComponent},
  { path : "schedules", pathMatch : "full", component : ScheduleComponent},
  { path : "orders/:id/edit", pathMatch : "full", component : EditOrderComponent},
  { path : "orders/edit", pathMatch : "full", component : EditOrderComponent},
  { path : "orders/new", pathMatch : "full", component : EditOrderComponent},
  { path : "orders", pathMatch : "full", component : OrdersComponent},
  { path : "tasklist", pathMatch : "full", component : TaskListComponent},
  { path : "simulator", pathMatch : "full", component : SimulatorComponent},
  { path : "", pathMatch: 'full', redirectTo:"/home"},
  { path : "", component : AppComponent  }


]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
