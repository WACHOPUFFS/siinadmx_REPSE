import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirm-week',
  templateUrl: './confirm-week.page.html',
  styleUrls: ['./confirm-week.page.scss'],
})
export class ConfirmWeekPage implements OnInit {
  diasSemana: any[] = [];
  filteredEmployees: any[] = [];
  currentSemana: string = '';
  periodStartDate: string = '';
  periodEndDate: string = '';
  selectedDia: any; // Día seleccionado por el usuario
  empleadosDia: any[] = []; // Lista de empleados para el día seleccionado
  currentPeriodId: string = '';
  isWeekConfirmed: boolean = false; // Verificar si la semana está confirmada
  empleadosIncidencias: any[] = [];

  filteredEmpleadosDia: any[] = []; // Lista filtrada de empleados asignados
  filteredEmpleadosIncidencias: any[] = []; // Lista filtrada de empleados con incidencias
  searchTerm: string = ''; // Término de búsqueda


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadWeekData();
  }

  // Método para cargar los días confirmados de la semana más antigua no confirmada
  async loadWeekData() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos de la semana...',
    });
    await loading.present();

    const companyId = this.authService.selectedId;
    const periodTypeId = this.authService.selectedPeriod.period_type_id;

    if (!companyId || !periodTypeId) {
      console.error('No se proporcionaron company_id o period_type_id');
      loading.dismiss();
      return;
    }

    // URL de la API para obtener los días confirmados
    const url = `https://siinad.mx/php/get-week-data.php?company_id=${companyId}&period_type_id=${periodTypeId}`;

    this.http.get(url).subscribe(
      (data: any) => {
        if (data && data.length > 0 && !data.error) {
          this.diasSemana = data;
          this.filteredEmployees = [...this.diasSemana];

          // Obtener detalles de la semana actual
          const semanaActual = this.diasSemana[0];
          this.currentSemana = semanaActual.week_number;
          this.periodStartDate = semanaActual.period_start_date;
          this.periodEndDate = semanaActual.period_end_date;
          this.currentPeriodId = semanaActual.period_id;

          // Generar días para la semana
          this.generarDiasDeSemana(this.periodStartDate, this.periodEndDate, this.currentPeriodId);

          // Verificar si la semana está confirmada
          this.verificarConfirmacionSemana(companyId, this.currentPeriodId);
        } else {
          console.error('No se encontraron días confirmados para la semana.');
          this.mostrarAlerta('Sin datos', 'No hay días confirmados para la semana actual.');
        }
        loading.dismiss();
      },
      (error) => {
        console.error('Error al cargar los datos de la semana', error);
        loading.dismiss();
      }
    );
  }


  verificarConfirmacionSemana(companyId: string, periodId: string) {
    const confirmUrl = `https://siinad.mx/php/get-week-confirmations.php?company_id=${companyId}&period_id=${periodId}`;

    this.http.get(confirmUrl).subscribe(
      (response: any) => {
        this.isWeekConfirmed = response && response.length > 0;
      },
      (error) => {
        console.error('Error al verificar la confirmación de la semana', error);
      }
    );
  }

  generarDiasDeSemana(startDate: string, endDate: string, periodId: string) {
    const start = moment(startDate);
    const end = moment(endDate);
    const dias = [];

    while (start.isSameOrBefore(end)) {
      const date = start.format('YYYY-MM-DD');
      const dayData = this.diasSemana.find(dia => dia.day_of_week === date);

      dias.push({
        date: date,
        status: dayData ? dayData.status : 'pending',
        company_id: dayData ? dayData.company_id : this.authService.selectedId,
        period_id: dayData ? dayData.period_id : periodId,
      });

      start.add(1, 'days');
    }

    this.diasSemana = dias;
  }

  // Método para obtener la información de los empleados para un día específico
  async cargarEmpleadosDia(dia: any) {
    const loading = await this.loadingController.create({
      message: 'Cargando empleados para el día seleccionado...',
    });
    await loading.present();

    // Limpiar listas de empleados asignados e incidencias antes de cargar los nuevos datos
    this.empleadosDia = []; // Lista de empleados asignados
    this.empleadosIncidencias = []; // Lista de empleados con incidencias

    const companyId = dia.company_id;
    const periodId = dia.period_id;
    const date = dia.date;

    const url = `https://siinad.mx/php/get-employee-assignments-days.php?company_id=${companyId}&period_id=${periodId}&date=${date}`;

    try {
      const data: any = await this.http.get(url).toPromise();

      if (data) {
        // Asignar los empleados asignados y con incidencias
        this.empleadosDia = data.empleados_asignados || [];
        this.empleadosIncidencias = data.empleados_incidencias || [];

        // Crear una lista de empleados combinados
        this.empleadosDia = this.empleadosDia.map(empAsignado => {
          // Verificar si el empleado también tiene una incidencia
          const incidencia = this.empleadosIncidencias.find(inc => inc.employee_id === empAsignado.employee_id);

          // Si el empleado tiene una incidencia, combinar los datos
          if (incidencia) {
            return {
              ...empAsignado,
              incident_type: incidencia.incident_type,
              description: incidencia.description,
              hasIncidencia: true // Bandera para indicar que tiene una incidencia
            };
          }

          // Si no tiene incidencia, devolver el empleado tal cual
          return empAsignado;
        });

        // Filtrar empleados con incidencias que no están en `empleadosDia`
        this.empleadosIncidencias = this.empleadosIncidencias.filter(
          inc => !this.empleadosDia.some(emp => emp.employee_id === inc.employee_id)
        );

        // Inicializar las listas filtradas con los datos recién cargados
        this.filteredEmpleadosDia = [...this.empleadosDia];
        this.filteredEmpleadosIncidencias = [...this.empleadosIncidencias];

        if (this.empleadosDia.length === 0 && this.empleadosIncidencias.length === 0) {
          console.error('No se encontraron empleados para el día seleccionado.');
        }
      } else {
        console.error('No se encontraron empleados para el día seleccionado.');
      }
    } catch (error) {
      console.error('Error al cargar los empleados para el día seleccionado', error);
    } finally {
      loading.dismiss();
    }
  }

  // Mostrar detalles del día seleccionado
  async mostrarInfoDia(dia: any) {
    this.selectedDia = dia;
    await this.cargarEmpleadosDia(dia);

    if (this.empleadosDia.length === 0) {
      const alert = await this.alertController.create({
        header: `Información del Día: ${dia.date}`,
        message: 'No hay empleados asignados a este día.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  // Verificar si todos los días de la semana están confirmados
  allDaysConfirmed(): boolean {
    return this.diasSemana.every(dia => dia.status === 'confirmed');
  }

  // Confirmar toda la semana
  async confirmarSemana() {
    const alert = await this.alertController.create({
      header: 'Confirmar Semana',
      message: '¿Estás seguro de que quieres confirmar toda la semana?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirmación de semana cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarSemanaCompleta();
          }
        }
      ]
    });
    await alert.present();
  }

  // Enviar la solicitud para confirmar toda la semana
  async confirmarSemanaCompleta() {
    const loading = await this.loadingController.create({
      message: 'Confirmando semana...',
    });
    await loading.present();

    const companyId = this.authService.selectedId;
    const periodId = this.currentPeriodId;
    const periodTypeId = this.authService.selectedPeriod.period_type_id;
    const weekNumber = this.currentSemana;

    if (!companyId || !periodId || !periodTypeId || !weekNumber) {
      console.error('Faltan datos para confirmar la semana');
      loading.dismiss();
      return;
    }

    const body = {
      company_id: companyId,
      period_id: periodId,
      period_type_id: periodTypeId,
      week_number: weekNumber,
    };

    const url = `https://siinad.mx/php/confirm-week.php`;

    this.http.post(url, body).subscribe(
      async (response: any) => {
        if (response && response.success) {
          console.log('Semana confirmada correctamente');
          await this.mostrarAlerta('Semana confirmada', 'La semana se ha confirmado exitosamente.');
        } else {
          console.error('Error al confirmar la semana:', response.message);
          await this.mostrarAlerta('Error', 'Hubo un problema al confirmar la semana. Inténtalo de nuevo.');
        }
        loading.dismiss();
      },
      async (error) => {
        console.error('Error en la solicitud de confirmación de la semana:', error);
        await this.mostrarAlerta('Error', 'Hubo un problema al conectar con el servidor. Inténtalo de nuevo.');
        loading.dismiss();
      }
    );
  }

  // Método para mostrar alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para filtrar empleados asignados e incidencias
  filterEmployees() {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtrar empleados asignados
    this.filteredEmpleadosDia = this.empleadosDia.filter(emp =>
      emp.employee_code.toLowerCase().includes(searchTermLower) ||
      emp.first_name.toLowerCase().includes(searchTermLower) ||
      emp.last_name.toLowerCase().includes(searchTermLower) ||
      (emp.middle_name && emp.middle_name.toLowerCase().includes(searchTermLower))
    );

    // Filtrar empleados con incidencias
    this.filteredEmpleadosIncidencias = this.empleadosIncidencias.filter(emp =>
      emp.employee_code.toLowerCase().includes(searchTermLower) ||
      emp.first_name.toLowerCase().includes(searchTermLower) ||
      emp.last_name.toLowerCase().includes(searchTermLower) ||
      (emp.middle_name && emp.middle_name.toLowerCase().includes(searchTermLower))
    );
  }
}
