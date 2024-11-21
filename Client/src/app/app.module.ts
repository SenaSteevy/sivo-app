import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { UsersComponent } from './pages/users/users.component';
import { StocksComponent } from './pages/stocks/stocks.component';
import { ProductionLineComponent } from './pages/production-line/production-line.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CardComponent } from './components/card/card.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { LottieModule } from 'ngx-lottie';
import * as lottie from 'lottie-web';
const player = lottie.default;
import { LottieAnimationViewComponent } from './components/lottie-animation-view/lottie-animation-view.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DurationFormatPipe } from '../models/DurationFormatPipe';
import { LocalDateTimeFormatPipe } from '../models/LocalDateTimeFormatPipe';
import { DatePipe } from '@angular/common';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { RolesComponent } from './pages/roles/roles.component';
import { AuthInterceptor } from './AuthInterceptor';
import { ClientsComponent } from './pages/clients/clients.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { EditResourceComponent } from './pages/edit-resource/edit-resource.component';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { PhaseFormComponent } from './components/phase-form/phase-form.component';
import { EditPhaseComponent } from './pages/edit-phase/edit-phase.component';
import { PhaseComponent } from './components/phase/phase.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { EditTreatmentComponent } from './pages/edit-treatment/edit-treatment.component';
import { TreatmentFormComponent } from './components/treatment-form/treatment-form.component';
import { UserRequestsComponent } from './pages/user-requests/user-requests.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';

export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ScheduleComponent,
    UsersComponent,
    StocksComponent,
    ProductionLineComponent,
    SettingsComponent,
    FooterComponent,
    DialogComponent,
    CardComponent,
    OrdersComponent,
    UserListComponent,
    ConfirmDialogComponent,
    UserFormComponent,
    DoughnutChartComponent,
    LottieAnimationViewComponent,
    TaskListComponent,
    EditUserComponent,
    DurationFormatPipe,
    LocalDateTimeFormatPipe,
    OrderFormComponent,
    EditOrderComponent,
    RolesComponent,
    ClientsComponent,
    EditClientComponent,
    ClientFormComponent,
    EditResourceComponent,
    ResourceFormComponent,
    PhaseFormComponent,
    EditPhaseComponent,
    PhaseComponent,
    TreatmentsComponent,
    EditTreatmentComponent,
    TreatmentFormComponent,
    UserRequestsComponent,
    SimulatorComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
    DragDropModule
    
  ],
  entryComponents:[
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
