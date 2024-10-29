import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.page.html',
  styleUrls: ['./department-management.page.scss'],
})
export class DepartmentManagementPage implements OnInit {
  departments: any[] = [];
  positions: any[] = [];
  shifts: any[] = [];
  newDepartment: any = { department_name: '', description: '', company_id: '' };
  newPosition: any = { position_name: '', description: '', company_id: '' };
  newShift: any = { shift_name: '', description: '', start_time: '', end_time: '', company_id: '' };
  selectedDepartment: any = null;
  selectedPosition: any = null;
  selectedShift: any = null;
  isAddingPosition: boolean = false;
  isAddingShift: boolean = false;

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.fetchDepartments();
    this.fetchPositions();
    this.fetchShifts();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  async fetchDepartments() {
    const loading = await this.presentLoading('Cargando departamentos...');
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departments = Array.isArray(data) ? data : [];
        loading.dismiss();
      },
      error => {
        console.error('Error al cargar departamentos', error);
        loading.dismiss();
        this.presentToast('Error al cargar departamentos', 'danger');
      }
    );
  }

  async fetchPositions() {
    const loading = await this.presentLoading('Cargando puestos...');
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_positions.php?company_id=${companyId}`).subscribe(
      data => {
        this.positions = Array.isArray(data) ? data : [];
        loading.dismiss();
      },
      error => {
        console.error('Error al cargar puestos', error);
        loading.dismiss();
        this.presentToast('Error al cargar puestos', 'danger');
      }
    );
  }

  async fetchShifts() {
    const loading = await this.presentLoading('Cargando turnos...');
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?company_id=${companyId}`).subscribe(
      data => {
        this.shifts = Array.isArray(data) ? data : [];
        loading.dismiss();
      },
      error => {
        console.error('Error al cargar turnos', error);
        loading.dismiss();
        this.presentToast('Error al cargar turnos', 'danger');
      }
    );
  }

  // Select a department
  selectDepartment(department: any) {
    this.selectedDepartment = department;
  }

  // Select a position
  selectPosition(position: any) {
    this.selectedPosition = position;
  }

  // Start adding a new position
  startAddPosition() {
    this.isAddingPosition = true;
    this.selectedPosition = null;
    this.newPosition = { position_name: '', description: '', company_id: this.authService.selectedId };
  }

  // Select a shift
  selectShift(shift: any) {
    this.selectedShift = shift;
  }

  // Start adding a new shift
  startAddShift() {
    this.isAddingShift = true;
    this.selectedShift = null;
    this.newShift = { shift_name: '', description: '', start_time: '', end_time: '', company_id: this.authService.selectedId };
  }

  // Create new department and reset the form
  createNewDepartment() {
    this.selectedDepartment = { department_name: '', description: '', company_id: this.authService.selectedId };
  }

  // Save department configuration (create or update)
  async saveDepartmentConfig() {
    if (this.selectedDepartment.department_name) {
      const loading = await this.presentLoading('Guardando departamento...');
      this.selectedDepartment.company_id = this.authService.selectedId;
      const url = this.selectedDepartment.department_id
        ? 'https://siinad.mx/php/edit_department.php'
        : 'https://siinad.mx/php/add_department.php';

      this.http.post(url, this.selectedDepartment).subscribe(
        () => {
          loading.dismiss();
          this.fetchDepartments();
          this.createNewDepartment();
          this.presentToast('Departamento guardado exitosamente');
        },
        error => {
          console.error('Error al guardar el departamento', error);
          loading.dismiss();
          this.presentToast('Error al guardar el departamento', 'danger');
        }
      );
    }
  }

  // Save position configuration (create or update)
  async savePositionConfig() {
    if (this.getCurrentPosition().position_name) {
      const loading = await this.presentLoading('Guardando puesto...');
      const positionData = { ...this.getCurrentPosition(), company_id: this.authService.selectedId };
      const url = this.selectedPosition && this.selectedPosition.position_id
        ? 'https://siinad.mx/php/update_position.php'
        : 'https://siinad.mx/php/add_position.php';

      this.http.post(url, positionData).subscribe(
        () => {
          loading.dismiss();
          this.fetchPositions();
          this.isAddingPosition = false;
          this.selectedPosition = null;
          this.presentToast('Puesto guardado exitosamente');
        },
        error => {
          console.error('Error al guardar el puesto', error);
          loading.dismiss();
          this.presentToast('Error al guardar el puesto', 'danger');
        }
      );
    }
  }

  // Save shift configuration (create or update)
  async saveShiftConfig() {
    if (this.getCurrentShift().shift_name) {
      const loading = await this.presentLoading('Guardando turno...');
      const shiftData = { ...this.getCurrentShift(), company_id: this.authService.selectedId };
      const url = this.selectedShift && this.selectedShift.shift_id
        ? 'https://siinad.mx/php/update_shift.php'
        : 'https://siinad.mx/php/add_shift.php';

      this.http.post(url, shiftData).subscribe(
        () => {
          loading.dismiss();
          this.fetchShifts();
          this.isAddingShift = false;
          this.selectedShift = null;
          this.presentToast('Turno guardado exitosamente');
        },
        error => {
          console.error('Error al guardar el turno', error);
          loading.dismiss();
          this.presentToast('Error al guardar el turno', 'danger');
        }
      );
    }
  }

  // Helper functions to determine whether to return new or existing position and shift
  getCurrentPosition() {
    return this.selectedPosition || this.newPosition;
  }

  getCurrentShift() {
    return this.selectedShift || this.newShift;
  }

  // Delete selected department
  async deleteDepartment() {
    if (this.selectedDepartment?.department_id) {
      const loading = await this.presentLoading('Eliminando departamento...');
      const companyId = this.authService.selectedId;
      this.http.post('https://siinad.mx/php/delete_department.php', { department_id: this.selectedDepartment.department_id, company_id: companyId }).subscribe(
        () => {
          loading.dismiss();
          this.fetchDepartments();
          this.presentToast('Departamento eliminado exitosamente');
        },
        error => {
          console.error('Error al borrar departamento', error);
          loading.dismiss();
          this.presentToast('Error al borrar departamento', 'danger');
        }
      );
    }
  }

  // Delete selected position
  async deletePosition() {
    if (this.selectedPosition?.position_id) {
      const loading = await this.presentLoading('Eliminando puesto...');
      const companyId = this.authService.selectedId;
      this.http.post('https://siinad.mx/php/delete_position.php', { position_id: this.selectedPosition.position_id, company_id: companyId }).subscribe(
        () => {
          loading.dismiss();
          this.fetchPositions();
          this.presentToast('Puesto eliminado exitosamente');
        },
        error => {
          console.error('Error al borrar puesto', error);
          loading.dismiss();
          this.presentToast('Error al borrar puesto', 'danger');
        }
      );
    }
  }

  // Delete selected shift
  async deleteShift() {
    if (this.selectedShift?.shift_id) {
      const loading = await this.presentLoading('Eliminando turno...');
      const companyId = this.authService.selectedId;
      this.http.post('https://siinad.mx/php/delete_shift.php', { shift_id: this.selectedShift.shift_id, company_id: companyId }).subscribe(
        () => {
          loading.dismiss();
          this.fetchShifts();
          this.presentToast('Turno eliminado exitosamente');
        },
        error => {
          console.error('Error al borrar turno', error);
          loading.dismiss();
          this.presentToast('Error al borrar turno', 'danger');
        }
      );
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
