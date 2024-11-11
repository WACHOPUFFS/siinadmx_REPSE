import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';

interface Empleado {
  employee_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  employee_code: string;
  curp: string;
  social_security_number: string;
  rfc: string;
  email: string;
  phone_number: string;
  start_date: string;
}

interface Turno {
  shift_id: number;
  shift_name: string;
}

interface Puesto {
  position_id: number;
  position_name: string;
}

interface Departamento {
  department_id: number;
  department_name: string;
}

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.page.html',
  styleUrls: ['./employee-view.page.scss'],
})
export class EmployeeViewPage implements OnInit {
  departamentos: Departamento[] = [];
  puestos: Puesto[] = [];
  turnos: Turno[] = [];
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  searchQuery: string = '';

  // Variables para las selecciones
  departamentoSeleccionado: Departamento | null = null;
  puestoSeleccionado: Puesto | null = null;
  turnoSeleccionado: Turno | null = null;

  constructor(private modalController: ModalController, private http: HttpClient, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadDepartments();
    this.loadPositions();
    this.loadShifts();
  }

  // Cargar departamentos sin dependencia
  loadDepartments() {
    const companyId = this.authService.selectedId;
    this.http.get<Departamento[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al cargar los departamentos:', error);
      }
    );
  }

  // Cargar puestos sin dependencia del departamento
  loadPositions() {
    const companyId = this.authService.selectedId;
    this.http.get<Puesto[]>(`https://siinad.mx/php/get_positions.php?company_id=${companyId}`).subscribe(
      data => {
        this.puestos = data;
      },
      error => {
        console.error('Error al cargar los puestos:', error);
      }
    );
  }

  // Cargar turnos sin dependencia del puesto
  loadShifts() {
    const companyId = this.authService.selectedId;
    this.http.get<Turno[]>(`https://siinad.mx/php/get_shifts.php?company_id=${companyId}`).subscribe(
      data => {
        this.turnos = data;
      },
      error => {
        console.error('Error al cargar los turnos:', error);
      }
    );
  }

  // Seleccionar y mostrar empleados por departamento
  selectDepartamento(departamento: Departamento) {
    this.departamentoSeleccionado = departamento;
    this.puestoSeleccionado = null;  // Limpiar selección de puesto
    this.turnoSeleccionado = null;   // Limpiar selección de turno
    const companyId = this.authService.selectedId;

    this.http.get<{ success: boolean, employees: Empleado[] }>(
      `https://siinad.mx/php/get_employees_by_department.php?company_id=${companyId}&department_id=${departamento.department_id}`
    ).subscribe(
      response => {
        if (response.success) {
          this.empleados = response.employees;
          this.empleadosFiltrados = this.empleados;
        } else {
          console.error('Error al cargar los empleados del departamento');
        }
      },
      error => {
        console.error('Error al cargar los empleados del departamento:', error);
      }
    );
  }

  // Seleccionar y mostrar empleados por puesto
  selectPuesto(puesto: Puesto) {
    this.puestoSeleccionado = puesto;
    this.departamentoSeleccionado = null;  // Limpiar selección de departamento
    this.turnoSeleccionado = null;         // Limpiar selección de turno
    const companyId = this.authService.selectedId;

    this.http.get<{ success: boolean, employees: Empleado[] }>(
      `https://siinad.mx/php/get_employees_by_position.php?company_id=${companyId}&position_id=${puesto.position_id}`
    ).subscribe(
      response => {
        if (response.success) {
          this.empleados = response.employees;
          this.empleadosFiltrados = this.empleados;
        } else {
          console.error('Error al cargar los empleados del puesto');
        }
      },
      error => {
        console.error('Error al cargar los empleados del puesto:', error);
      }
    );
  }

  // Seleccionar y mostrar empleados por turno
  selectTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.departamentoSeleccionado = null;  // Limpiar selección de departamento
    this.puestoSeleccionado = null;        // Limpiar selección de puesto
    const companyId = this.authService.selectedId;

    this.http.get<{ success: boolean, employees: Empleado[] }>(
      `https://siinad.mx/php/get_employees_by_shifts.php?company_id=${companyId}&shift_id=${turno.shift_id}`
    ).subscribe(
      response => {
        if (response.success) {
          this.empleados = response.employees;
          this.empleadosFiltrados = this.empleados;
        } else {
          console.error('Error al cargar los empleados del turno');
        }
      },
      error => {
        console.error('Error al cargar los empleados del turno:', error);
      }
    );
  }


  // Función para filtrar empleados en la búsqueda
  buscarEmpleados() {
    const searchLower = this.searchQuery.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.first_name.toLowerCase().includes(searchLower) ||
      (empleado.middle_name && empleado.middle_name.toLowerCase().includes(searchLower)) ||
      empleado.last_name.toLowerCase().includes(searchLower) ||
      empleado.employee_code.toLowerCase().includes(searchLower)
    );
  }

  // Método para ver detalles del empleado
  async viewEmployeeDetails(employeeId: number) {
    const modal = await this.modalController.create({
      component: EmployeeDetailsComponent,
      componentProps: { employeeId: employeeId }
    });
    return await modal.present();
  }


}
