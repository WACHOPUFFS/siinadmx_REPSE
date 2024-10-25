import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.page.html',
  styleUrls: ['./department-management.page.scss'],
})
export class DepartmentManagementPage implements OnInit {
  departments: any[] = [];
  positions: any[] = [];
  shifts: any[] = [];
  newPosition: any = { position_name: '', description: '' };
  newShift: any = { shift_name: '', description: '', start_time: '', end_time: '' };
  selectedDepartment: any = null;
  selectedPosition: any = null;
  selectedShift: any = null;
  isAddingPosition: boolean = false;
  isAddingShift: boolean = false;

  constructor(private navCtrl: NavController, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.fetchDepartments();
  }

  // Fetch Departments from API
  fetchDepartments() {
    const companyId = this.authService.selectedId;
    this.http.get<any[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => this.departments = Array.isArray(data) ? data : [],
      error => console.error('Error al cargar departamentos', error)
    );
  }

  // Create new department and reset the form
  createNewDepartment() {
    this.selectedDepartment = { department_name: '', description: '' };
    this.positions = [];
    this.shifts = [];
    this.isAddingPosition = false;
    this.isAddingShift = false;
  }

  // Save department configuration (create or update)
  saveDepartmentConfig() {
    if (this.selectedDepartment.department_name) {
      this.selectedDepartment.company_id = this.authService.selectedId;

      if (this.selectedDepartment.department_id) {
        // Update existing department
        this.http.post('https://siinad.mx/php/edit_department.php', this.selectedDepartment).subscribe(
          response => {
            this.fetchDepartments();
            this.createNewDepartment(); // Reset form
          },
          error => console.error('Error al actualizar el departamento', error)
        );
      } else {
        // Create new department
        this.http.post('https://siinad.mx/php/add_department.php', this.selectedDepartment).subscribe(
          response => {
            this.fetchDepartments();
            this.createNewDepartment();
          },
          error => console.error('Error al crear el departamento', error)
        );
      }
    }
  }

  // Select department and fetch related positions
  selectDepartment(department: any) {
    this.selectedDepartment = department;
    this.fetchPositions(department.department_id);
    this.selectedPosition = null;
    this.selectedShift = null;
    this.positions = [];
    this.shifts = [];
    this.isAddingPosition = false;
    this.isAddingShift = false;
  }

  // Fetch positions for the selected department
  fetchPositions(departmentId: number) {
    this.http.get<any[]>(`https://siinad.mx/php/get_positions.php?department_id=${departmentId}`).subscribe(
      data => this.positions = data,
      error => console.error('Error al cargar puestos', error)
    );
  }

  // Start adding a new position
  startAddPosition() {
    this.isAddingPosition = true;
    this.isAddingShift = false;
    this.selectedPosition = null;
    this.newPosition = { position_name: '', description: '' };
  }

  // Save position configuration (create or update)
  savePositionConfig() {
    if (this.getCurrentPosition().position_name) {
      if (this.selectedPosition && this.selectedPosition.position_id) {
        // Update existing position
        this.http.post('https://siinad.mx/php/update_position.php', this.selectedPosition).subscribe(
          response => {
            this.fetchPositions(this.selectedDepartment.department_id);
            this.selectedPosition = null; // Reset form
          },
          error => console.error('Error al actualizar el puesto', error)
        );
      } else {
        // Create new position
        const data = { ...this.newPosition, department_id: this.selectedDepartment.department_id };
        this.http.post('https://siinad.mx/php/add_position.php', data).subscribe(
          response => {
            this.fetchPositions(this.selectedDepartment.department_id);
            this.newPosition = { position_name: '', description: '' }; // Reset form
            this.isAddingPosition = false;
          },
          error => console.error('Error al crear el puesto', error)
        );
      }
    }
  }

  // Select a position and fetch related shifts
  selectPosition(position: any) {
    this.isAddingPosition = false;
    this.isAddingShift = false;
    this.selectedPosition = position;
    this.fetchShifts(position.position_id);
    this.selectedShift = null;
    this.shifts = [];
  }

  // Fetch shifts for the selected position
  fetchShifts(positionId: number) {
    this.http.get<any[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`).subscribe(
      data => this.shifts = data,
      error => console.error('Error al cargar turnos', error)
    );
  }

  // Start adding a new shift
  startAddShift() {
    this.isAddingShift = true;
    this.isAddingPosition = false;
    this.selectedShift = null;
    this.newShift = { shift_name: '', description: '', start_time: '', end_time: '' };
  }

  // Save shift configuration (create or update)
  saveShiftConfig() {
    if (this.getCurrentShift().shift_name) {
      if (this.selectedShift && this.selectedShift.shift_id) {
        // Update existing shift
        this.http.post('https://siinad.mx/php/update_shift.php', this.selectedShift).subscribe(
          response => {
            this.fetchShifts(this.selectedPosition.position_id);
            this.selectedShift = null; // Reset form
          },
          error => console.error('Error al actualizar el turno', error)
        );
      } else {
        // Create new shift
        const data = { ...this.newShift, position_id: this.selectedPosition.position_id };
        this.http.post('https://siinad.mx/php/add_shift.php', data).subscribe(
          response => {
            this.fetchShifts(this.selectedPosition.position_id);
            this.newShift = { shift_name: '', description: '', start_time: '', end_time: '' }; // Reset form
            this.isAddingShift = false;
          },
          error => console.error('Error al crear el turno', error)
        );
      }
    }
  }

  // Método para seleccionar un turno y configurar la interfaz en consecuencia
selectShift(shift: any) {
  this.isAddingShift = false;
  this.selectedShift = shift;
}


  // Helper function to determine whether to return new or existing position
  getCurrentPosition() {
    return this.selectedPosition || this.newPosition;
  }

  // Helper function to determine whether to return new or existing shift
  getCurrentShift() {
    return this.selectedShift || this.newShift;
  }

  // Delete selected department
  deleteDepartment() {
    if (this.selectedDepartment.department_id) {
      this.http.post('https://siinad.mx/php/delete_department.php', { department_id: this.selectedDepartment.department_id }).subscribe(
        response => {
          this.fetchDepartments();
          this.createNewDepartment();
        },
        error => console.error('Error al borrar departamento', error)
      );
    }
  }

  // Delete selected position
  deletePosition() {
    if (this.selectedPosition?.position_id) {
      this.http.post('https://siinad.mx/php/delete_position.php', { position_id: this.selectedPosition.position_id }).subscribe(
        response => {
          this.fetchPositions(this.selectedDepartment.department_id);
          this.selectedPosition = null;
        },
        error => console.error('Error al borrar puesto', error)
      );
    }
  }

  // Delete selected shift
  deleteShift() {
    if (this.selectedShift?.shift_id) {
      this.http.post('https://siinad.mx/php/delete_shift.php', { shift_id: this.selectedShift.shift_id }).subscribe(
        response => {
          this.fetchShifts(this.selectedPosition.position_id);
          this.selectedShift = null;
        },
        error => console.error('Error al borrar turno', error)
      );
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
