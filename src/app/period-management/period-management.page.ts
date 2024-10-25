import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

interface Period {
  period_number: number;
  start_date: string;
  end_date: string;
  payment_date: string;
  year: number;
  month: number;
  imss_bimonthly_start: boolean;
  imss_bimonthly_end: boolean;
  month_start: boolean;
  month_end: boolean;
  fiscal_year: string;
  fiscal_start: boolean;
  fiscal_end: boolean;
  payment_days: number;
}

@Component({
  selector: 'app-period-management',
  templateUrl: './period-management.page.html',
  styleUrls: ['./period-management.page.scss'],
})
export class PeriodManagementPage implements OnInit {

  periodTypes: any[] = [];
  selectedYearPeriods: Period[] = [];
  selectedYear: number | null = null;
  selectedPeriod: Period | null = null;
  form: any = {
    numeroPeriodo: '',
    fechaInicio: '',
    fechaFin: '',
    ejercicio: '',
    mes: '',
    diasPago: '',
    inicioMes: true,
    finMes: false,
    inicioBimestreIMSS: true,
    finBimestreIMSS: false,
    inicioEjercicio: true,
    finEjercicio: false
  };

  constructor(private http: HttpClient, private authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadPeriodTypes();
  }

  loadPeriodTypes() {
    const companyId = this.authService.selectedId;
    this.http.post('https://siinad.mx/php/get-period-types.php', { companyId })
      .subscribe((response: any) => {
        this.periodTypes = response.periodTypes;
      }, error => {
        console.error('Error al cargar los tipos de periodos', error);
      });
  }

  selectPeriodType(tipo: any) {
    if (tipo.years && tipo.years.length > 0) {
      this.selectedYear = tipo.years[0];
      this.selectedYearPeriods = tipo.periods.filter((period: Period) => period.year === this.selectedYear);
    }
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.selectedYearPeriods = this.periodTypes.find(tipo => tipo.years.includes(year))
      .periods.filter((period: Period) => period.year === year);
  }

  selectPeriod(period: Period) {
    this.selectedPeriod = period;
    // Actualiza el formulario con los datos del periodo seleccionado
    this.form = {
      numeroPeriodo: period.period_number,
      fechaInicio: period.start_date,
      fechaFin: period.end_date,
      ejercicio: period.year,
      mes: period.month,
      diasPago: period.payment_days,
      inicioMes: period.month_start,
      finMes: period.month_end,
      inicioBimestreIMSS: period.imss_bimonthly_start,
      finBimestreIMSS: period.imss_bimonthly_end,
      inicioEjercicio: period.fiscal_start,
      finEjercicio: period.fiscal_end
    };
  }

  guardarPeriodo() {
    // Aquí puedes realizar una petición HTTP para guardar los cambios realizados en el periodo
    const updatedPeriod: Period = {
      period_number: this.form.numeroPeriodo,
      start_date: this.form.fechaInicio,
      end_date: this.form.fechaFin,
      payment_date: this.form.diasPago,
      year: this.form.ejercicio,
      month: this.form.mes,
      imss_bimonthly_start: this.form.inicioBimestreIMSS,
      imss_bimonthly_end: this.form.finBimestreIMSS,
      month_start: this.form.inicioMes,
      month_end: this.form.finMes,
      fiscal_year: this.selectedPeriod?.fiscal_year || '',
      fiscal_start: this.form.inicioEjercicio,
      fiscal_end: this.form.finEjercicio,
      payment_days: this.form.diasPago
    };

    this.http.post('https://siinad.mx/php/update-period.php', updatedPeriod)
      .subscribe(response => {
        console.log('Periodo actualizado exitosamente', response);
        // Actualiza la lista de periodos
        this.loadPeriodTypes();
      }, error => {
        console.error('Error al actualizar el periodo', error);
      });
  }

  goBack() {
    this.navCtrl.back();
  }
}
