import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-manage-weeks',
  templateUrl: './manage-weeks.page.html',
  styleUrls: ['./manage-weeks.page.scss'],
})
export class ManageWeeksPage implements OnInit {
  period = { start_date: '', end_date: '' };
  weeks: any[] = [];
  selectedWeek: any = null;
  selectedDates: string[] = [];
  dayType: string = 'workday';
  dayDescription: string = '';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Inicialización necesaria
  }

  generateWeeks() {
    const startDate = new Date(this.period.start_date);
    const endDate = new Date(this.period.end_date);
    const weeks = [];
    const oneDay = 24 * 60 * 60 * 1000;

    while (startDate <= endDate) {
      const weekNumber = this.getWeekNumber(startDate);
      const yearWeek = `${startDate.getFullYear()}${weekNumber.toString().padStart(2, '0')}`;

      const weekEnd = new Date(startDate);
      weekEnd.setDate(startDate.getDate() + 6);

      weeks.push({
        year_week: yearWeek,
        start_date: startDate.toISOString().split('T')[0],
        end_date: weekEnd.toISOString().split('T')[0],
        company_id: 1 // ID de la empresa; ajustar según sea necesario
      });

      startDate.setDate(startDate.getDate() + 7); // Avanzar a la siguiente semana
    }

    this.weeks = weeks;
    this.cdr.detectChanges();
  }

  getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.ceil(((diff / oneDay) + start.getDay() + 1) / 7);
  }

  selectWeek(week: any) {
    this.selectedWeek = week;
    this.selectedDates = [];
  }

  onDaySelect(event: any) {
    const date = event.detail.value;
    if (!this.selectedDates.includes(date)) {
      this.selectedDates.push(date);
    } else {
      this.selectedDates = this.selectedDates.filter(d => d !== date);
    }
  }

  assignDayType() {
    if (this.selectedWeek && this.selectedDates.length > 0) {
      const daysToCreate = this.selectedDates.map(date => ({
        week_id: this.selectedWeek.id,
        date,
        type: this.dayType,
        description: this.dayDescription
      }));

      this.http.post('https://your-api-url.com/api/days/bulk', { days: daysToCreate }).subscribe(
        async () => {
          const toast = await this.toastController.create({
            message: 'Tipo de día asignado exitosamente.',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          this.selectedDates = [];
          this.dayType = 'workday';
          this.dayDescription = '';
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Error al asignar el tipo de día.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        }
      );
    }
  }
}
