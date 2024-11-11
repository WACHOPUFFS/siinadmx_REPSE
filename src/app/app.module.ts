import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalSuccessComponent } from './modal-success/modal-success.component';
import { RechazoModalComponent } from './rechazo-modal/rechazo-modal.component';
import { FormsModule } from '@angular/forms';

import { ActaConstitutivaModalComponent } from './acta-constitutiva-modal/acta-constitutiva-modal.component';
import { Afil01ModalComponent } from './afil01-modal/afil01-modal.component';
import { AutorizacionStpsModalComponent } from './autorizacion-stps-modal/autorizacion-stps-modal.component';
import { EstablecimientosModalComponent } from './establecimientos-modal/establecimientos-modal.component';
import { ContratoModalComponent } from './contrato-modal/contrato-modal.component';
import { RfcModalComponent } from './rfc-modal/rfc-modal.component';
import { ReviewInfoModalComponent } from './review-info-modal/review-info-modal.component';
import { AssignmentSummaryComponent } from './assignment-summary/assignment-summary.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { IncidentModalComponent } from './incident-modal/incident-modal.component';
import { ChangeHoursModalComponent } from './change-hours-modal/change-hours-modal.component';
import { CompanyInfoModalComponent } from './company-info-modal/company-info-modal.component';

import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

import { ProcessedListsModalComponent } from './processed-lists-modal/processed-lists-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalSuccessComponent,
    RechazoModalComponent,
    ActaConstitutivaModalComponent,
    Afil01ModalComponent,
    AutorizacionStpsModalComponent,
    EstablecimientosModalComponent,
    ContratoModalComponent,
    RfcModalComponent,
    ReviewInfoModalComponent,
    AssignmentSummaryComponent,
    IncidentModalComponent,
    ChangeHoursModalComponent,
    CompanyInfoModalComponent,
    EmployeeDetailsComponent,
    ProcessedListsModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule // Agrega ReactiveFormsModule aquí
   
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
