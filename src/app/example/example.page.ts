import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.page.html',
  styleUrls: ['./example.page.scss'],
})
export class ExamplePage implements OnInit {

  // Variables para almacenar los días obtenidos del backend
  periodDays: string[] = [];  
  confirmedDays: any[] = [];
  pendingDays: any[] = [];
  
  // Empleados pendientes del día seleccionado
  selectedPendingEmployees: any[] = [];
  selectedDay: string = '';

  constructor(
    private http: HttpClient, 
    private loadingController: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    // Cargar los días pendientes al iniciar la página
    this.loadDiasPendientes();
  }

  // Método para cargar los días pendientes
  async loadDiasPendientes() {
    // Mostrar un spinner mientras se cargan los datos
    const loading = await this.loadingController.create({
      message: 'Cargando días pendientes...',
      spinner: 'circles',
    });
    await loading.present();
  
    // Obtener el ID de la compañía y el tipo de período seleccionado desde AuthService
    const companyId = this.authService.selectedId;
    const periodTypeId = this.authService.selectedPeriod?.period_type_id;
  
    // Si no hay período seleccionado, mostrar un error
    if (!periodTypeId) {
      console.error('No se ha seleccionado un tipo de período');
      loading.dismiss();
      return;
    }
  
    // Preparar el cuerpo de la solicitud JSON con company_id y period_type_id
    const body = {
      company_id: companyId,
      period_type_id: periodTypeId
    };
  
    // Hacer una solicitud HTTP POST a la API para obtener los días pendientes
    this.http.post('https://siinad.mx/php/get-pending-days.php', body)
      .subscribe((data: any) => {
        // Asegúrate de que los datos obtenidos sean válidos
        if (data.error) {
          console.error(data.error);
          loading.dismiss();
          return;
        }
  
        // Procesar los datos recibidos
        this.periodDays = data.period_days || [];
        this.confirmedDays = data.confirmed_days || [];
        this.pendingDays = data.pending_days || [];
  
        // Ocultar el spinner
        loading.dismiss();
      }, error => {
        console.error('Error al cargar los días pendientes', error);
        loading.dismiss();
      });
  }

  // Función que determina si un día está confirmado
  isConfirmed(day: string): boolean {
    return this.confirmedDays.some(confirmedDay => confirmedDay.assignment_date === day);
  }

  // Función para seleccionar un día y mostrar los empleados pendientes de ese día
  selectDay(day: string) {
    this.selectedDay = day;

    // Filtrar empleados que tienen asignaciones pendientes para el día seleccionado
    this.selectedPendingEmployees = this.pendingDays.filter(dia => dia.assignment_date === day);
  }

  goBack() {
    this.navCtrl.back();
  }
}
