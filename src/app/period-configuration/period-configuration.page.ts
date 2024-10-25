import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-period-configuration',
  templateUrl: './period-configuration.page.html',
  styleUrls: ['./period-configuration.page.scss'],
})
export class PeriodConfigurationPage implements OnInit {

  periods: any[] = [];  // Array para almacenar los periodos cargados desde la base de datos
  selectedPeriod: any = {};  // Objeto para almacenar el periodo seleccionado o nuevo

  minDate: string = ''; // Mínima fecha seleccionable
  maxDate: string = ''; // Máxima fecha seleccionable

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadPeriods();
    this.updateSelectableDates(); // Actualizar las fechas seleccionables al iniciar la página
  }

  loadPeriods() {
    const companyId = this.authService.selectedId;
    this.http.get(`https://siinad.mx/php/get-periods.php?company_id=${companyId}`)
      .subscribe((response: any) => {
        this.periods = response;
      }, error => {
        console.error('Error al cargar los periodos', error);
      });
  }

  selectPeriod(period: any) {
    this.selectedPeriod = { ...period }; // Copiar el periodo seleccionado para edición
    this.updateSelectableDates(); // Actualizar las fechas seleccionables cuando se selecciona un periodo
    this.calculateRestDays(); // Calcular los días de descanso automáticamente
  }
  

  createNewPeriod() {
    // Crear un nuevo objeto vacío para un nuevo periodo
    this.selectedPeriod = {
      period_type_name: '',
      period_days: null,
      payment_days: null,
      work_period: null,
      adjust_calendar_periods: null,
      rest_days_position: [],
      payroll_position: null,
      fiscal_year_start: '',
      payment_frequency: '',
      totalPeriods: null,
      custom_period_length: null,
      custom_period_type: '',
    };
  
    // Limitar la fecha seleccionable al mes de enero
    const currentYear = new Date().getFullYear();
    this.minDate = `${currentYear}-01-01`;
    this.maxDate = `${currentYear}-01-31`;
  
    this.updateSelectableDates(); // Actualizar las fechas seleccionables para el nuevo periodo
    this.calculateRestDays(); // Calcular los días de descanso automáticamente
  }
  

  async savePeriodConfig() {
    const periodConfig = { ...this.selectedPeriod, company_id: this.authService.selectedId };
    console.log('Period Config:', periodConfig); // Verificar qué datos se están enviando
    
    if (!periodConfig.period_type_name || !periodConfig.fiscal_year_start || !periodConfig.period_days || !periodConfig.payment_days) {
      console.error('Datos insuficientes para crear o actualizar el periodo');
      alert('Por favor, complete todos los campos necesarios antes de guardar.');
      return;
    }
    
    if (periodConfig.period_type_id) {
      // Si existe period_type_id, entonces es una actualización
      this.http.post('https://siinad.mx/php/update-period.php', periodConfig)
        .subscribe(response => {
          console.log('Cambios guardados correctamente', response);
        }, error => {
          console.error('Error al guardar los cambios', error);
        });
    } else {
      // Si no existe period_type_id, entonces es una creación de un nuevo periodo
      this.http.post('https://siinad.mx/php/create-period.php', periodConfig)
        .subscribe(async (response: any) => {
          console.log('Nuevo periodo creado correctamente', response);
          const periodTypeId = response.period_type_id; // Obtener el ID del tipo de periodo creado
          const periodTypeName = this.selectedPeriod.period_type_name; // Obtener el nombre del tipo de periodo
          const periodData = [{ period_type_name: periodTypeName, period_type_id: periodTypeId }];
          await this.createPayrollPeriods(periodData, this.selectedPeriod); // Crear los periodos de nómina de forma secuencial
        }, error => {
          console.error('Error al crear el nuevo periodo', error);
        });
    }
  }

  async createPayrollPeriods(periodTypes: { period_type_name: string, period_type_id: number }[], periodo: any) {
    if (!Array.isArray(periodTypes)) {
      console.error('periodTypes debe ser un array');
      return;
    }
  
    if (periodTypes.length === 0) {
      console.warn('No se seleccionaron tipos de periodos');
      return;
    }
  
    const companyId = this.authService.selectedId;
    const startDate = new Date(periodo.fiscal_year_start);
    startDate.setHours(0, 0, 0, 0); // Aseguramos que la fecha de inicio no cambie por la zona horaria
    const fiscalYear = startDate.getFullYear();
  
    let currentStartDate = new Date(startDate);
  
    for (const periodTypeData of periodTypes) {
      const periodType = periodTypeData.period_type_name;
      const periodTypeId = periodTypeData.period_type_id;
  
      // Usar totalPeriods definido por el usuario, o calcularlo automáticamente
      const totalPeriods = periodo.totalPeriods || Math.floor(365 / periodo.period_days);
  
      for (let i = 0; i < totalPeriods; i++) {
        let periodEndDate: Date = new Date(currentStartDate);
  
        if (periodo.payment_frequency === '02') { // Semanal
          periodEndDate.setDate(currentStartDate.getDate() + periodo.period_days - 1);
        } else if (periodo.payment_frequency === '04') { // Quincenal
          periodEndDate.setDate(currentStartDate.getDate() + 14 - 1);
        } else if (periodo.payment_frequency === '05') { // Mensual
          periodEndDate.setMonth(currentStartDate.getMonth() + 1);
          periodEndDate.setDate(0); // Establece el último día del mes
        } else if (periodo.payment_frequency === '99') { // Personalizado
          if (periodo.custom_period_type === 'días') {
            periodEndDate.setDate(currentStartDate.getDate() + periodo.custom_period_length - 1);
          } else if (periodo.custom_period_type === 'semanas') {
            periodEndDate.setDate(currentStartDate.getDate() + (7 * periodo.custom_period_length) - 1);
          } else if (periodo.custom_period_type === 'meses') {
            periodEndDate.setMonth(currentStartDate.getMonth() + periodo.custom_period_length);
            periodEndDate.setDate(0); // Establece el último día del mes resultante
          } else {
            console.warn('No se especificó una longitud válida para el periodo personalizado');
            return;
          }
        } else {
          console.warn('Tipo de periodo desconocido');
          return;
        }
  
        const month = currentStartDate.getMonth() + 1;
        const isMonthStart = currentStartDate.getDate() === 1;
        const isMonthEnd = periodEndDate.getDate() === new Date(periodEndDate.getFullYear(), periodEndDate.getMonth() + 1, 0).getDate();
        const isFiscalStart = i === 0;
        const isFiscalEnd = i === totalPeriods - 1;
  
        const payrollPeriod = {
          company_id: companyId,
          period_type_id: periodTypeId, // Usar el period_type_id recibido en la respuesta
          period_number: i + 1,
          fiscal_year: fiscalYear,
          month: month,
          payment_days: periodo.payment_days,
          rest_days: periodo.rest_days_position,
          interface_check: 0,
          net_modification: 0,
          calculated: 0,
          affected: 0,
          start_date: currentStartDate.toISOString().split('T')[0],
          end_date: periodEndDate.toISOString().split('T')[0],
          fiscal_start: isFiscalStart ? 1 : 0,
          month_start: isMonthStart ? 1 : 0,
          month_end: isMonthEnd ? 1 : 0,
          fiscal_end: isFiscalEnd ? 1 : 0,
          timestamp: new Date().toISOString().split('T')[0],
          imss_bimonthly_start: 0,
          imss_bimonthly_end: 0,
          payment_date: null // Establece la fecha de pago si es necesario
        };
  
        try {
          // Esperar a que se complete la solicitud HTTP antes de proceder
          await this.http.post('https://siinad.mx/php/create-payroll-period.php', payrollPeriod).toPromise();
          console.log(`Periodo de nómina ${i + 1} creado correctamente para ${periodType}`);
        } catch (error) {
          console.error(`Error al crear el periodo de nómina ${i + 1} para ${periodType}`, error);
          break; // Si hay un error, detener el proceso para este tipo de periodo
        }
  
        // Actualiza la fecha de inicio para el siguiente periodo
        currentStartDate = new Date(periodEndDate);
        currentStartDate.setDate(currentStartDate.getDate() + 1);
      }
    }
  }
  

  updatePayrollPosition() {
    // Rellena el valor si está vacío, pero permite que el usuario lo modifique manualmente.
    if (!this.selectedPeriod.payroll_position) {
      if (this.selectedPeriod.payment_frequency === '99') {
        this.selectedPeriod.payroll_position = this.selectedPeriod.custom_period_length;
      } else {
        this.selectedPeriod.payroll_position = this.selectedPeriod.period_days;
      }
    }
  }

  deletePeriod() {
    const periodTypeId = this.selectedPeriod.period_type_id;
    if (periodTypeId) {
      this.http.post('https://siinad.mx/php/delete-period.php', { period_type_id: periodTypeId })
        .subscribe(response => {
          console.log('Periodo eliminado correctamente', response);
          this.loadPeriods();  // Recargar los periodos después de eliminar uno
          this.selectedPeriod = {};  // Limpiar el periodo seleccionado
        }, error => {
          console.error('Error al eliminar el periodo', error);
        });
    }
  }

  updateSelectableDates() {
    if (!this.selectedPeriod.fiscal_year_start || !this.selectedPeriod.period_days) {
      console.warn('No se puede calcular sin los días del periodo o la fecha de inicio.');
      return;
    }
  
    const startDate = this.selectedPeriod.fiscal_year_start;
  
    // Mínima fecha seleccionable: la fecha de inicio del ejercicio
    this.minDate = startDate;
  
    if (!this.selectedPeriod.period_type_id) {
      const currentYear = new Date().getFullYear();
      this.minDate = `${currentYear}-01-01`;
      this.maxDate = `${currentYear}-01-31`;
    } else {
      const endDate = this.addDays(startDate, this.selectedPeriod.period_days - 1);
      this.maxDate = endDate;
    }
  
    this.calculateRestDays(); // Calcular los días de descanso automáticamente al actualizar las fechas
  }
  
  // Función para agregar días a una fecha en formato de cadena
  addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }


  updateRestDays() {
    this.updateSelectableDates(); // Asegurarse de que las fechas seleccionables estén actualizadas
  
    // Filtrar los días seleccionados para asegurarse de que están dentro del rango permitido
    const validDates = this.selectedPeriod.rest_days_position.filter((date: string) =>
      date >= this.minDate && date <= this.maxDate
    );
  
    // Convertir las fechas seleccionadas en el formato "01,02,03"
    const daysArray = validDates.map((date: string) => {
      const day = new Date(date).getDate();
      return day < 10 ? `0${day}` : `${day}`;
    });
  
    // Unir los días en una cadena separada por comas
    this.selectedPeriod.rest_days_position = daysArray.join(',');
  }
  

  goBack() {
    this.navCtrl.back();
  }

  calculateRestDays() {
    // Verifica que haya una fecha de inicio y un número de días definido
    if (!this.selectedPeriod.fiscal_year_start || !this.selectedPeriod.period_days) {
      console.warn('No se puede calcular los séptimos días sin la fecha de inicio o los días del periodo.');
      return;
    }
  
    const startDate = new Date(this.selectedPeriod.fiscal_year_start);
    const periodDays = this.selectedPeriod.period_days;
  
    let restDays = []; // Array para almacenar los días de descanso
  
    // Calcula el séptimo día para cada semana dentro del periodo
    for (let i = 6; i < periodDays; i += 7) { // Inicia en 6 para seleccionar el séptimo día
      const restDay = new Date(startDate);
      restDay.setDate(startDate.getDate() + i);
      restDays.push(restDay.toISOString().split('T')[0]); // Añade la fecha al array
    }
  
    // Establece la posición de los días de descanso en el formato "01,02,03"
    this.selectedPeriod.rest_days_position = restDays;
  }
  

}

