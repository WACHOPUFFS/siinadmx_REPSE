// incident-viewer.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importar AuthService
import * as moment from 'moment'; // Importar moment.js para manejar fechas
import { IncidentModalComponent } from '../incident-modal/incident-modal.component';
import { ChangeHoursModalComponent } from '../change-hours-modal/change-hours-modal.component';

@Component({
  selector: 'app-incident-viewer',
  templateUrl: './incident-viewer.page.html',
  styleUrls: ['./incident-viewer.page.scss'],
})
export class IncidentViewerPage implements OnInit {
  weeks: any[] = []; // Lista de semanas laborales disponibles
  selectedWeek: any; // Semana laboral seleccionada
  assignedEmployees: any[] = []; // Lista de empleados asignados
  unassignedEmployees: any[] = []; // Lista de empleados no asignados
  filteredAssignedEmployees: any[] = []; // Lista filtrada de empleados asignados
  filteredUnassignedEmployees: any[] = []; // Lista filtrada de empleados no asignados
  searchAssigned: string = '';
  searchUnassigned: string = '';
  diasSemana: any[] = []; // Lista de días de la semana generados
  selectedDia: string = ''; // Día seleccionado
  companyId: string; // Usar tipo string para companyId, como lo proporciona el AuthService

  // Opciones de incidencia para empleados asignados y no asignados
  assignedIncidents = ['Asistencia', 'Retardo', 'Horas Extras'];
  unassignedIncidents = ['Incapacidad', 'Vacaciones', 'Falta', 'Día Festivo', 'Permiso sin Goce de Sueldo', 'Permiso con Goce de Sueldo', 'Día de castigo'];

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController,
    private authService: AuthService, // Inyectar AuthService
    private loadingController: LoadingController // Inyectar LoadingController
  ) {}

  ngOnInit() {
    this.companyId = this.authService.selectedId; // Obtener el companyId directamente desde AuthService
    this.loadWeeks(); // Cargar semanas laborales disponibles
    moment.locale('es'); // Configurar moment.js para usar el idioma español
  }

  async loadWeeks() {
    const selectedPeriod = this.authService.selectedPeriod; // Obtener el periodo seleccionado desde AuthService

    if (!selectedPeriod) {
      console.error('No se ha seleccionado un tipo de periodo');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando semanas...',
      spinner: 'circles',
    });
    await loading.present();

    this.http.get(`https://siinad.mx/php/get_weekly_periods.php?company_id=${this.companyId}&period_type_id=${selectedPeriod.period_type_id}`)
      .subscribe((data: any) => {
        this.weeks = data;
        this.selectedWeek = this.weeks.length ? this.weeks[0] : null;
        this.onWeekChange(this.selectedWeek);
        loading.dismiss();
      }, error => {
        console.error('Error al cargar las semanas', error);
        loading.dismiss();
      });
  }

  onWeekChange(week: any) {
    this.selectedWeek = week; // Actualizar la semana seleccionada
    this.generateDiasSemana(week.start_date, week.end_date); // Generar los días de la semana
    this.loadEmployees(); // Cargar empleados asignados y no asignados para la semana seleccionada
  }

  generateDiasSemana(startDate: string, endDate: string) {
    const start = moment(startDate);
    const end = moment(endDate);
    this.diasSemana = [];

    let day = start;
    while (day <= end) {
      this.diasSemana.push({
        date: day.format('YYYY-MM-DD'),
        display: day.format('dddd'), // Nombre del día de la semana (e.g., Lunes)
      });
      day = day.add(1, 'day');
    }
  }

  onDiaChange(dia: string): void {
    this.selectedDia = dia; // Actualizar el día seleccionado
    this.loadEmployees(); // Recargar los empleados asignados y no asignados para el día seleccionado
  }

  async loadEmployees() {
    if (!this.selectedWeek || !this.selectedDia) {
      console.error('No se ha seleccionado una semana laboral o día');
      return;
    }

    const { start_date, end_date, week_number } = this.selectedWeek;
    const day_of_week = this.selectedDia; // Usar el día seleccionado

    const loading = await this.loadingController.create({
      message: 'Cargando empleados...',
      spinner: 'circles',
    });
    await loading.present();

    // Cargar empleados asignados
    this.http.get(`https://siinad.mx/php/get_assigned_employees1.php?start_date=${start_date}&end_date=${end_date}&company_id=${this.companyId}&project_id=0&week_number=${week_number}&day_of_week=${day_of_week}`)
      .subscribe((data: any) => {
        this.assignedEmployees = data;
        this.filteredAssignedEmployees = [...this.assignedEmployees];
        loading.dismiss();
      }, error => {
        console.error('Error al cargar empleados asignados', error);
        loading.dismiss();
      });

    // Cargar empleados no asignados
    this.http.get(`https://siinad.mx/php/get_unassigned_employees.php?company_id=${this.companyId}&start_date=${start_date}&end_date=${end_date}&week_number=${week_number}&day_of_week=${day_of_week}`)
      .subscribe((data: any) => {
        this.unassignedEmployees = data;
        this.filteredUnassignedEmployees = [...this.unassignedEmployees];
        loading.dismiss();
      }, error => {
        console.error('Error al cargar empleados no asignados', error);
        loading.dismiss();
      });
  }

  filterAssignedEmployees() {
    const searchTerm = this.searchAssigned.toLowerCase();
    this.filteredAssignedEmployees = this.assignedEmployees.filter(emp =>
      (`${emp.first_name} ${emp.middle_name} ${emp.last_name}`).toLowerCase().includes(searchTerm)
    );
  }

  filterUnassignedEmployees() {
    const searchTerm = this.searchUnassigned.toLowerCase();
    this.filteredUnassignedEmployees = this.unassignedEmployees.filter(emp =>
      (`${emp.first_name} ${emp.middle_name} ${emp.last_name}`).toLowerCase().includes(searchTerm)
    );
  }

  // Obtener empleados seleccionados
  getSelectedEmployees(isAssigned: boolean) {
    return isAssigned
      ? this.filteredAssignedEmployees.filter(emp => emp.selected)
      : this.filteredUnassignedEmployees.filter(emp => emp.selected);
  }

  // Cambiar horas a empleados seleccionados
  async changeHoursToSelected(isAssigned: boolean) {
    const selectedEmployees = this.getSelectedEmployees(isAssigned);
    if (selectedEmployees.length === 0) {
      console.log('No hay empleados seleccionados.');
      return;
    }

    // Abrir el modal personalizado
    const modal = await this.modalController.create({
      component: ChangeHoursModalComponent,
      componentProps: {
        employees: selectedEmployees // Pasar todos los empleados seleccionados al modal
      }
    });

    // Recibir los datos del modal al cerrarse
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        for (const employee of selectedEmployees) {
          this.saveHours(employee, result.data);
        }
      }
    });

    return await modal.present();
  }

  saveHours(employee: any, data: any) {
    // Preparar los datos de las horas de trabajo para enviar al servidor
    const workHoursData = {
      employee_id: employee.employee_id, // ID del empleado
      period_id: this.selectedWeek.period_id, // ID del periodo de selectedWeek
      day_of_week: moment(this.selectedDia).format('YYYY-MM-DD'), // Fecha formateada como 'YYYY-MM-DD'
      work_week: this.selectedWeek.week_number, // Semana laboral obtenida de selectedWeek
      entry_time: data.entryTime, // Hora de entrada del modal
      lunch_start_time: data.lunchStart, // Hora de inicio de comida del modal
      lunch_end_time: data.lunchEnd, // Hora de fin de comida del modal
      exit_time: data.exitTime, // Hora de salida del modal
      second_lunch_start_time: data.secondLunchStart || null, // Segunda hora de inicio de comida (opcional)
      second_lunch_end_time: data.secondLunchEnd || null // Segunda hora de fin de comida (opcional)
    };
  
    // Hacer una solicitud HTTP POST para guardar las horas de trabajo
    this.http.post('https://siinad.mx/php/save_work_hours.php', workHoursData)
      .subscribe(
        (response) => {
          console.log('Work hours saved successfully:', response);
          // Opcionalmente, mostrar un mensaje de éxito
        },
        (error) => {
          console.error('Error saving work hours:', error);
          // Opcionalmente, manejar el error
        }
      );
  }
  
  

  // Asignar incidencia a empleados seleccionados
  async addIncidentToSelected(isAssigned: boolean) {
    const selectedEmployees = this.getSelectedEmployees(isAssigned);
    if (selectedEmployees.length === 0) {
      console.log('No hay empleados seleccionados.');
      return;
    }

    const incidentOptions = isAssigned ? this.assignedIncidents : this.unassignedIncidents;

    // Abrir solo un modal para todos los empleados seleccionados
    const modal = await this.modalController.create({
      component: IncidentModalComponent,
      componentProps: {
        incidentOptions,
        employees: selectedEmployees // Pasar todos los empleados seleccionados al modal
      }
    });

    // Guardar la misma incidencia para todos los empleados seleccionados
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        for (const employee of selectedEmployees) {
          this.saveIncident(employee, result.data);
        }
      }
    });

    await modal.present();
  }



  saveIncident(employee: any, data: any) {
    // Preparar datos para enviar al servidor
    const incidentData = {
      employee_id: employee.employee_id, // ID del empleado
      period_type_id: this.authService.selectedPeriod.period_type_id,
      period_id: this.selectedWeek.period_id, // ID del periodo obtenido del objeto selectedWeek
       day_of_week: moment(this.selectedDia).format('YYYY-MM-DD'), // Date formatted as 'YYYY-MM-DD
      work_week: this.selectedWeek.week_number, // Semana laboral obtenida de selectedWeek
      incident_type: data.incident, // Tipo de incidencia seleccionada
      description: data.description // Descripción de la incidencia (opcional)
    };
  
    // Realizar una solicitud HTTP para guardar la incidencia
    this.http.post('https://siinad.mx/php/save_incident.php', incidentData)
      .subscribe(
        (response) => {
          console.log('Incidencia guardada correctamente:', response);
          // Mostrar un mensaje de éxito (opcional)
        },
        (error) => {
          console.error('Error al guardar la incidencia:', error);
          // Manejar el error (opcional)
        }
      );
  }
  
  
}
