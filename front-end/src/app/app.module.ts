import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

import { ProductionLineComponent } from './pages/production-line/production-line.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CardComponent } from './components/card/card.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { LottieModule } from 'ngx-lottie';
import * as lottie from 'lottie-web';
const player = lottie.default;
import { LottieAnimationViewComponent } from './components/lottie-animation-view/lottie-animation-view.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { DurationFormatPipe } from '../models/DurationFormatPipe';
import { LocalDateTimeFormatPipe } from '../models/LocalDateTimeFormatPipe';
import { DatePipe } from '@angular/common';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { EditOrderComponent } from './pages/edit-order/edit-order.component';
import { PhaseFormComponent } from './components/phase-form/phase-form.component';
import { EditPhaseComponent } from './pages/edit-phase/edit-phase.component';
import { PhaseComponent } from './components/phase/phase.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TreatmentsComponent } from './pages/treatments/treatments.component';
import { EditTreatmentComponent } from './pages/edit-treatment/edit-treatment.component';
import { TreatmentFormComponent } from './components/treatment-form/treatment-form.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScheduleComponent,
    ProductionLineComponent,
    FooterComponent,
    DialogComponent,
    CardComponent,
    OrdersComponent,
    ConfirmDialogComponent,
    DoughnutChartComponent,
    LottieAnimationViewComponent,
    TaskListComponent,
    DurationFormatPipe,
    LocalDateTimeFormatPipe,
    OrderFormComponent,
    EditOrderComponent,
    PhaseFormComponent,
    EditPhaseComponent,
    PhaseComponent,
    TreatmentsComponent,
    EditTreatmentComponent,
    TreatmentFormComponent,
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
  entryComponents:[ ],
  providers: [ DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
