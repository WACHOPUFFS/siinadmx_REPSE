import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-processed-attendance',
  templateUrl: './processed-attendance.page.html',
  styleUrls: ['./processed-attendance.page.scss'],
})
export class ProcessedAttendancePage implements OnInit {
  processedWeeks: any[] = []; // Lista de semanas procesadas
  selectedWeek: any; // Semana procesada seleccionada
  diasSemana: any[] = []; // Días de la semana seleccionada
  empleadosSemana: any[] = []; // Lista de empleados con sus horarios e incidencias
  file: File | null = null; // Archivo seleccionado

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    moment.locale('es'); // Configurar moment.js para usar el idioma español
    this.loadProcessedWeeks(); // Cargar las semanas procesadas al iniciar la página
  }

  // Cargar las semanas procesadas
  async loadProcessedWeeks() {
    const loading = await this.loadingController.create({
      message: 'Cargando semanas procesadas...',
    });
    await loading.present();

    const companyId = this.authService.selectedId; // Obtener el ID de la empresa desde AuthService
    const periodTypeId = this.authService.selectedPeriod?.period_type_id; // Obtener el tipo de periodo desde AuthService

    if (!companyId || !periodTypeId) {
      console.error('No se proporcionaron company_id o period_type_id');
      loading.dismiss();
      return;
    }

    // Construir la URL con los parámetros necesarios para obtener semanas procesadas
    const url = `https://siinad.mx/php/get-processed-weeks.php?company_id=${companyId}&period_type_id=${periodTypeId}`;

    this.http.get(url).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.processedWeeks = data; // Actualizar la lista de semanas procesadas
        } else {
          console.error('Datos recibidos no son un array', data);
        }
        loading.dismiss();
      },
      (error) => {
        console.error('Error al cargar semanas procesadas', error);
        loading.dismiss();
      }
    );
  }

  // Cargar los días de la semana y los empleados al seleccionar una semana
  async onWeekChange(week: any) {
    if (week && week.start_date && week.end_date) {
      this.selectedWeek = week;
      this.generateWeekDays(week.start_date, week.end_date); // Usar start_date y end_date directamente del objeto week
      await this.loadEmployeesForWeek();
    } else {
      console.error('La semana seleccionada no contiene información de fechas de inicio y fin');
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

  // Generar el PDF con los datos de asistencia
  async generatePDF() {
    const loading = await this.loadingController.create({
      message: 'Generando PDF...',
    });
    await loading.present();
  
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para orientación landscape
    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginX = 10;
    const marginY = 10;
    const rowHeight = 8; // Reducir la altura de la fila
  
    // Ajustar el ancho de las columnas
    const codeWidth = 15;
    const nameWidth = 40;
    const entryWidth = 20;
  
    // Definir días de la semana para mostrar cada uno en una nueva página
    this.diasSemana.forEach((dia) => {
      // Nueva página para cada día
      if (pdf.internal.pages.length > 1) {
        pdf.addPage();
      }
      let currentY = marginY + rowHeight; // Posición inicial en Y
  
      // Título de la tabla
      pdf.setFontSize(12); // Reducir el tamaño de la fuente del título
      pdf.text(`Lista de Asistencia para ${dia.display} (${dia.date})`, marginX, currentY);
      currentY += rowHeight;
  
      // Cabecera de la tabla
      pdf.setFontSize(8); // Reducir el tamaño de la fuente para la cabecera
      pdf.setFillColor(240, 240, 240);
      pdf.rect(marginX, currentY, pageWidth - marginX * 2, rowHeight, 'F'); // Fondo gris para la cabecera
      pdf.text('Código', marginX + 2, currentY + 5);
      pdf.text('Empleado', marginX + codeWidth + 2, currentY + 5);
      pdf.text('Entrada', marginX + codeWidth + nameWidth + 2, currentY + 5);
      pdf.text('Entrada Comida', marginX + codeWidth + nameWidth + entryWidth + 5, currentY + 5);
      pdf.text('Salida Comida', marginX + codeWidth + nameWidth + entryWidth * 2 + 5, currentY + 5);
      pdf.text('Salida', marginX + codeWidth + nameWidth + entryWidth * 3 + 5, currentY + 5);
      pdf.text('Incidencia', marginX + codeWidth + nameWidth + entryWidth * 4 + 5, currentY + 5);
      pdf.text('Empresa y Obra', marginX + codeWidth + nameWidth + entryWidth * 5 + 5, currentY + 5);
      pdf.text('Firma', marginX + codeWidth + nameWidth + entryWidth * 8 + 8, currentY + 5); // Nueva columna de Firma
  
      currentY += rowHeight;
  
      // Filas de empleados
      this.empleadosSemana.forEach((emp) => {
        // Ajustar el nombre del empleado para que no sobresalga
        const nameText = `${emp.first_name} ${emp.middle_name} ${emp.last_name}`;
        const nameLines = pdf.splitTextToSize(nameText, nameWidth - 5);
  
        // Datos del día específico para el empleado
        const workHours = emp.work_hours[dia.date] || {};
  
        // Ajustar la altura dinámica de la fila según el número de líneas del nombre
        const rowHeightDynamic = rowHeight * nameLines.length;
  
        // Ajustar filas dinámicas si hay muchas líneas
        pdf.text(emp.employee_code.toString(), marginX + 2, currentY + 5);
        pdf.text(nameLines, marginX + codeWidth + 2, currentY + 5);
  
        pdf.text(workHours.entry_time || '--:--', marginX + codeWidth + nameWidth + 2, currentY + 5);
        pdf.text(workHours.lunch_start_time || '--:--', marginX + codeWidth + nameWidth + entryWidth + 5, currentY + 5);
        pdf.text(workHours.lunch_end_time || '--:--', marginX + codeWidth + nameWidth + entryWidth * 2 + 5, currentY + 5);
        pdf.text(workHours.exit_time || '--:--', marginX + codeWidth + nameWidth + entryWidth * 3 + 5, currentY + 5);
        pdf.text(workHours.incident || 'N/A', marginX + codeWidth + nameWidth + entryWidth * 4 + 5, currentY + 5);
        pdf.text(workHours.project_name || 'No Asignado', marginX + codeWidth + nameWidth + entryWidth * 5 + 5, currentY + 5);
  
        // Espacio para firma
        pdf.text('_____________________', marginX + codeWidth + nameWidth + entryWidth * 8 + 8, currentY + 5);
  
        // Incrementar la posición Y para la siguiente fila
        currentY += rowHeightDynamic;
      });
    });
  
    // Guardar el PDF
    pdf.save('asistencia-semanal.pdf');
    loading.dismiss();
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0]; // Guardar el archivo seleccionado
    }
  }
  

  async uploadPDF() {
    if (!this.file) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor seleccione un archivo PDF.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    // Verificar si la semana seleccionada tiene el campo 'period_type_id'
    if (!this.selectedWeek || !this.selectedWeek.period_type_id) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La semana seleccionada no tiene un period_type_id válido.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Subiendo PDF...',
    });
    await loading.present();
  
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('pdf', this.file, this.file.name);
    formData.append('company_id', this.authService.selectedId);
    formData.append('week_number', this.selectedWeek.week_number);
    formData.append('period_type_id', this.selectedWeek.period_type_id); // Usar el period_type_id de la semana seleccionada
    formData.append('status', 'Subido'); // Define el estado inicial
  
    // Realizar la solicitud HTTP para subir el archivo
    this.http.post('https://siinad.mx/php/upload-pdf.php', formData).subscribe(
      async (response) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'El PDF se ha subido correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
      },
      async (error) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al subir el PDF. Intente nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
        console.error('Error al subir el PDF:', error);
      }
    );
  }
  
  
  
  
  
  
  

}
