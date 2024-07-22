import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FilterPipe } from './filter.pipe';
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

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    ModalSuccessComponent,
    RechazoModalComponent,
    ActaConstitutivaModalComponent,
    Afil01ModalComponent,
    AutorizacionStpsModalComponent,
    EstablecimientosModalComponent,
    ContratoModalComponent,
    RfcModalComponent,
    ReviewInfoModalComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
   
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
