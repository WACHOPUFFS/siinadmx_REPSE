import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-process-weekly-lists',
  templateUrl: './process-weekly-lists.page.html',
  styleUrls: ['./process-weekly-lists.page.scss'],
})
export class ProcessWeeklyListsPage implements OnInit {
  confirmedWeeks: any[] = []; // Lista de semanas confirmadas
  selectedWeek: any; // Semana confirmada seleccionada
  diasSemana: any[] = []; // Días de la semana seleccionada
  empleadosSemana: any[] = []; // Lista de empleados con sus horarios y incidencias

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    moment.locale('es'); // Configurar moment.js para usar el idioma español
    this.loadConfirmedWeeks(); // Cargar las semanas confirmadas al iniciar la página
  }

  // Cargar las semanas confirmadas
  async loadConfirmedWeeks() {
    const loading = await this.loadingController.create({
      message: 'Cargando semanas confirmadas...',
    });
    await loading.present();

    const companyId = this.authService.selectedId; // Obtener el ID de la empresa desde AuthService
    const periodTypeId = this.authService.selectedPeriod?.period_type_id; // Obtener el tipo de periodo desde AuthService

    if (!companyId || !periodTypeId) {
      console.error('No se proporcionaron company_id o period_type_id');
      loading.dismiss();
      return;
    }

    // Construir la URL con los parámetros necesarios
    const url = `https://siinad.mx/php/get-confirmations-week.php?company_id=${companyId}&period_type_id=${periodTypeId}`;

    this.http.get(url).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.confirmedWeeks = data;
        } else {
          console.error('Datos recibidos no son un array', data);
        }
        loading.dismiss();
      },
      (error) => {
        console.error('Error al cargar semanas confirmadas', error);
        loading.dismiss();
      }
    );
  }

  // Cargar los días de la semana y los empleados al seleccionar una semana
  async onWeekChange(week: any) {
    if (week && week.payroll_period && week.payroll_period.start_date && week.payroll_period.end_date) {
      this.selectedWeek = week;
      this.generateWeekDays(week.payroll_period.start_date, week.payroll_period.end_date);
      await this.loadEmployeesForWeek();
    } else {
      console.error('La semana seleccionada no contiene información de payroll_period o las fechas no están definidas');
    }
  }

  // Generar los días de la semana en un rango de fechas
  generateWeekDays(startDate: string, endDate: string) {
    const start = moment(startDate);
    const end = moment(endDate);
    this.diasSemana = [];

    while (start.isSameOrBefore(end)) {
      this.diasSemana.push({
        date: start.format('YYYY-MM-DD'),
        display: start.format('dddd'),
      });
      start.add(1, 'days');
    }
  }

  // Cargar los empleados y sus horas de trabajo para la semana seleccionada
  async loadEmployeesForWeek() {
    if (!this.selectedWeek) return;

    const loading = await this.loadingController.create({
      message: 'Cargando datos de empleados...',
    });
    await loading.present();

    const url = `https://siinad.mx/php/get-employees-weekly-data.php?week_number=${this.selectedWeek.week_number}`;
    this.http.get(url).subscribe(
      (data: any) => {
        const processedData = this.processEmployeeData(data);
        this.empleadosSemana = processedData;
        loading.dismiss();
      },
      (error) => {
        console.error('Error al cargar datos de empleados', error);
        loading.dismiss();
      }
    );
  }

  // Procesar los datos de los empleados para organizar por fecha y evitar repetición
  processEmployeeData(data: any[]): any[] {
    const employeesMap: any = {};

    data.forEach((record) => {
      const employeeId = record.employee_id;
      const date = record.day_of_week;

      if (!employeesMap[employeeId]) {
        employeesMap[employeeId] = {
          employee_code: record.employee_code,
          first_name: record.first_name,
          middle_name: record.middle_name,
          last_name: record.last_name,
          work_hours: {},
        };
      }

      employeesMap[employeeId].work_hours[date] = {
        entry_time: record.entry_time,
        lunch_start_time: record.lunch_start_time,
        lunch_end_time: record.lunch_end_time,
        exit_time: record.exit_time,
        incident: record.incident_type,
        project_name: record.project_name,
      };
    });

    return Object.values(employeesMap);
  }

  // Procesar la semana seleccionada
  async processSelectedWeek() {
    if (!this.selectedWeek) return;

    const loading = await this.loadingController.create({
      message: 'Procesando semana seleccionada...',
    });
    await loading.present();

    const companyId = this.authService.selectedId;
    const periodTypeId = this.authService.selectedPeriod?.period_type_id;
    const startDate = this.selectedWeek.payroll_period?.start_date;
    const endDate = this.selectedWeek.payroll_period?.end_date;

    const url = 'https://siinad.mx/php/process-week.php';
    const data = {
      week_number: this.selectedWeek.week_number,
      company_id: companyId,
      period_type_id: periodTypeId,
      start_date: startDate,
      end_date: endDate,
    };

    this.http.post(url, data).subscribe(
      async (response: any) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La semana ha sido procesada exitosamente.',
          buttons: ['OK'],
        });
        await alert.present();
      },
      async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al procesar la semana. Por favor, intente nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
        console.error('Error al procesar la semana', error);
      }
    );
  }
}