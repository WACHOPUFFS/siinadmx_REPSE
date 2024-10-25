import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirm-day',
  templateUrl: './confirm-day.page.html',
  styleUrls: ['./confirm-day.page.scss'],
})
export class ConfirmDayPage implements OnInit {
  selectAll: boolean = false; // Bandera para seleccionar todos

  diasPendientes: any[] = [];
  filteredDias: any[] = [];
  currentFechaDias: any[] = [];  // Días de la fecha actual
  currentFecha: string = '';  // Fecha actual a mostrar
  searchTerm: string = '';
  currentSemana: string = '';
  currentPeriodId: string = ''; // Variable para almacenar el period_id

  periodStartDate: string = ''; // Fecha de inicio del periodo
  periodEndDate: string = '';   // Fecha de fin del periodo
  diasDelPeriodo: any[] = [];   // Días generados dentro del periodo

  isLastConfirmedDay: boolean = false; // Para verificar si se muestra el último día confirmado
  noDaysAvailable: boolean = false; // Nueva propiedad para manejar el caso de que no haya días
  isButtonDisabled: boolean = false; // Controla si el botón está deshabilitado


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadDiasPendientes();
  }

  async loadDiasPendientes() {
    const loading = await this.loadingController.create({
      message: 'Cargando días pendientes...',
    });
    await loading.present();

    const companyId = this.authService.selectedId;  // Obtener company_id desde AuthService
    const periodId = this.authService.selectedPeriod;  // Obtener period_id desde AuthService

    if (!companyId || !periodId) {
      console.error('No se proporcionaron company_id o period_id');
      loading.dismiss();
      return;
    }

    // Construir la URL con los parámetros necesarios
    const url = `https://siinad.mx/php/get-pending-days.php?company_id=${companyId}&period_id=${periodId.period_type_id}`;

    // Hacer la solicitud HTTP con los parámetros
    this.http.get(url)
      .subscribe((data: any) => {
        this.diasPendientes = data;
        this.filtrarPorFechaMasAntigua();  // Filtrar solo por la fecha más antigua
        this.filterRecords();  // Aplicar filtro de búsqueda al inicio
        loading.dismiss();
      }, error => {
        console.error('Error al cargar los días', error);
        loading.dismiss();
      });
  }

  filtrarPorFechaMasAntigua() {
    if (this.diasPendientes.length > 0) {
      console.log('Días pendientes inicial:', this.diasPendientes); // Mostrar todos los días pendientes
  
      this.noDaysAvailable = false; // Reiniciar si se encuentran días
  
      // Filtrar los días que están pendientes (asegúrate de que project_status sea exactamente "pending")
      const diasPendientes = this.diasPendientes.filter(dia => dia.project_status && dia.project_status.trim().toLowerCase() === 'pending');
      console.log('Días filtrados como pendientes:', diasPendientes); // Mostrar días pendientes después de filtrar por project_status
  
      if (diasPendientes.length > 0) {
        // Ordenar los días pendientes por fecha para encontrar el más antiguo
        diasPendientes.sort((a, b) => moment(a.day_of_week).diff(moment(b.day_of_week)));
        console.log('Días pendientes ordenados por fecha:', diasPendientes); // Mostrar días pendientes ordenados
  
        // Si hay días pendientes, mostrar el más antiguo
        this.isLastConfirmedDay = false;
        const fechaMasAntigua = diasPendientes[0].day_of_week;
        console.log('Fecha más antigua encontrada:', fechaMasAntigua); // Mostrar la fecha más antigua encontrada
  
        // Filtrar todos los días de esa fecha (incluir todos los empleados de la misma fecha)
        this.currentFechaDias = this.diasPendientes.filter(dia => dia.day_of_week === fechaMasAntigua);
        console.log('Días correspondientes a la fecha más antigua (todos los empleados):', this.currentFechaDias); // Mostrar días de la fecha más antigua con todos los empleados
        this.currentFecha = fechaMasAntigua;
  
        const periodoMasAntiguo = this.currentFechaDias[0];
        if (periodoMasAntiguo) {
          console.log('Periodo más antiguo encontrado:', periodoMasAntiguo); // Mostrar el periodo más antiguo encontrado
          this.periodStartDate = periodoMasAntiguo.period_start_date;
          this.periodEndDate = periodoMasAntiguo.period_end_date;
          this.currentSemana = periodoMasAntiguo.work_week;
          this.currentPeriodId = periodoMasAntiguo.period_id;
  
          // Generar los días del periodo
          this.generarDiasDelPeriodo(this.periodStartDate, this.periodEndDate);
        }
      } else {
        // Si no hay días pendientes, buscar el último día confirmado
        this.isLastConfirmedDay = true;
        const ultimoDiaConfirmado = this.diasPendientes
          .filter(dia => dia.project_status && dia.project_status.trim().toLowerCase() === 'confirmed')
          .sort((a, b) => moment(b.confirmation_date).diff(moment(a.confirmation_date)))[0];
  
        console.log('Último día confirmado encontrado:', ultimoDiaConfirmado); // Mostrar el último día confirmado encontrado
  
        if (ultimoDiaConfirmado) {
          // Filtrar todos los días confirmados para esa fecha
          this.currentFechaDias = this.diasPendientes.filter(dia => dia.day_of_week === ultimoDiaConfirmado.day_of_week);
          this.currentFecha = ultimoDiaConfirmado.day_of_week;
          this.periodStartDate = ultimoDiaConfirmado.period_start_date;
          this.periodEndDate = ultimoDiaConfirmado.period_end_date;
          this.currentSemana = ultimoDiaConfirmado.work_week;
          this.currentPeriodId = ultimoDiaConfirmado.period_id;
  
          // Generar los días del periodo
          this.generarDiasDelPeriodo(this.periodStartDate, this.periodEndDate);
        } else {
          // Si no hay días confirmados, mostrar que no hay días disponibles
          console.log('No hay días pendientes ni confirmados.'); // Mostrar si no hay días disponibles
          this.noDaysAvailable = true;
          this.limpiarVista();
        }
      }
    } else {
      // Si no hay días en absoluto, mostrar que no hay días disponibles
      console.log('No hay días disponibles en absoluto.'); // Mostrar si no hay días en absoluto
      this.noDaysAvailable = true;
      this.limpiarVista();
    }
  }
  
  
  
  
  
  
  limpiarVista() {
    this.currentFechaDias = [];
    this.currentFecha = '';
    this.periodStartDate = '';
    this.periodEndDate = '';
    this.diasDelPeriodo = [];
    this.currentSemana = '';
    this.currentPeriodId = '';
  }



  // Función para generar los días entre el rango del periodo
  generarDiasDelPeriodo(startDate: string, endDate: string) {
    const start = moment(startDate);
    const end = moment(endDate);
    const dias = [];

    while (start.isSameOrBefore(end)) {
      // Inicializa cada día como pendiente
      const date = start.format('YYYY-MM-DD');
      dias.push({
        date: date,
        status: this.obtenerStatusDelDia(date), // Asignar el estado (Confirmado o Pendiente)
      });
      start.add(1, 'days');
    }

    this.diasDelPeriodo = dias;
    console.log('Días del periodo:', this.diasDelPeriodo);
  }


  obtenerStatusDelDia(date: string): string {
    // Busca el día que coincida con la fecha del periodo y esté confirmado
    const diaEncontrado = this.diasPendientes.find(dia => {
      console.log('Comparando:', dia.day_of_week, 'con', date);
      return dia.day_of_week === date && dia.project_status.toLowerCase() === 'confirmed';
    });
    return diaEncontrado ? 'confirmed' : 'pending';
  }
  


  // Filtrar los días según el término de búsqueda
  filterRecords() {
    const searchTerm = this.searchTerm.toLowerCase();

    this.filteredDias = this.currentFechaDias.filter(dia => {
      const employeeCode = dia.employee_code ? dia.employee_code.toLowerCase() : '';
      const firstName = dia.first_name ? dia.first_name.toLowerCase() : '';
      const lastName = dia.last_name ? dia.last_name.toLowerCase() : '';
      const projectName = dia.project_name ? dia.project_name.toLowerCase() : '';
      const status = dia.project_status ? dia.project_status.toLowerCase() : '';

      return (
        employeeCode.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        projectName.includes(searchTerm) ||
        status.includes(searchTerm)
      );
    });
  }

  // Confirmar los días seleccionados
  confirmarDias() {
    const companyId = this.authService.selectedId;
    const periodId = this.currentPeriodId;

    // Obtener period_type_id desde AuthService
    const periodTypeId = this.authService.selectedPeriod.period_type_id; // Ajusta esto si el formato es diferente

    // Obtener el día de la semana y el número de semana
    const weekNumber = this.currentSemana;
    const dayOfWeek = this.currentFecha; // Día de la semana que se está confirmando

    // Construir el payload para confirmar el día completo
    const payload = {
      company_id: companyId,
      period_id: periodId,
      period_type_id: periodTypeId, // Agregar period_type_id al payload
      week_number: weekNumber,
      day_of_week: dayOfWeek,
      confirmation_date: new Date().toISOString(), // Fecha de confirmación
      status: 'confirmed', // Cambiado de `confirmed: true` a `status: 'confirmed'`
    };

    // Mostrar un loader mientras se confirma el día
    this.loadingController.create({
      message: 'Confirmando día...',
    }).then(loading => {
      loading.present();

      // Enviar el payload al backend para confirmar el día
      this.http.post('https://siinad.mx/php/confirm-day.php', payload).subscribe(
        (response: any) => {
          console.log('Día confirmado exitosamente', response);
          loading.dismiss();

          // Actualizar el estado de los días confirmados en el frontend
          if (response.success) {
            this.diasDelPeriodo.forEach(dia => {
              if (dia.date === payload.day_of_week) {
                dia.status = 'confirmed';
              }
            });
          }
          this.isButtonDisabled = true;
          this.loadDiasPendientes(); // Llamar a la función para cargar días pendientes
        },
        (error) => {
          console.error('Error al confirmar el día', error);
          loading.dismiss();
        }
      );
    });
  }


  // Eliminar un día de la lista
  async eliminarDia(dia: any, event: Event) {
    event.stopPropagation(); // Detener la propagación del evento

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el registro del empleado ${dia.first_name} ${dia.last_name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Aquí podrías hacer una solicitud HTTP para eliminar el registro en el backend
            const url = `https://tu-api.com/delete-day/${dia.assignment_id}`;

            this.http.delete(url).subscribe(
              (response) => {
                console.log('Registro eliminado exitosamente', response);
                // Eliminar el día de la lista en el frontend
                this.diasPendientes = this.diasPendientes.filter(d => d.assignment_id !== dia.assignment_id);
                this.filtrarPorFechaMasAntigua();  // Volver a filtrar por la fecha más antigua
                this.filterRecords();  // Actualizar la lista filtrada
              },
              (error) => {
                console.error('Error al eliminar el registro', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  // Alternar confirmación de un día
  toggleConfirm(dia: any) {
    dia.confirmed = !dia.confirmed;
  }

  // Mostrar información del día al hacer clic
  async mostrarInfoDia(dia: any) {
    const alert = await this.alertController.create({
      header: 'Información del Día',
      message: `Fecha: ${dia.date} Estado: ${dia.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Alternar selección de todos los días
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.filteredDias.forEach(dia => {
      dia.confirmed = this.selectAll;
    });
  }
}
