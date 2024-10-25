import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Importar el enrutador para navegación
import { ModalController } from '@ionic/angular';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';

interface Empleado {
  employee_id: number;
  first_name: string;
  middle_name?: string; // Campo opcional para el nombre intermedio
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
  empleados: Empleado[];
}

interface Puesto {
  position_id: number;
  position_name: string;
  turnos: Turno[];
}

interface Departamento {
  department_id: number;
  department_name: string;
  puestos: Puesto[];
}

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.page.html',
  styleUrls: ['./employee-view.page.scss'],
})
export class EmployeeViewPage implements OnInit {
  departamentos: Departamento[] = [];
  selectedEmployee: Empleado | null = null;
  puestos: Puesto[] = [];
  turnos: Turno[] = [];
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = []; // Lista para empleados filtrados
  searchQuery: string = ''; // Campo para la búsqueda

  // Variables para las selecciones
  departamentoSeleccionado: Departamento | null = null;
  puestoSeleccionado: Puesto | null = null;
  turnoSeleccionado: Turno | null = null;

  constructor(private modalController: ModalController, private http: HttpClient, public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadDepartments();
  }

  // Cargar los departamentos desde la API
  loadDepartments() {
    const companyId = this.authService.selectedId; // Obtener el ID de la empresa
    this.http.get<Departamento[]>(`https://siinad.mx/php/get_departments.php?company_id=${companyId}`).subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al cargar los departamentos:', error);
      }
    );
  }

  // Cargar los puestos cuando se selecciona un departamento
  loadPuestos(departmentId: number) {
    this.http.get<Puesto[]>(`https://siinad.mx/php/get_positions.php?department_id=${departmentId}`).subscribe(
      data => {
        this.puestos = data;
        this.turnos = []; // Limpiar los turnos al cambiar el puesto
        this.empleados = []; // Limpiar los empleados al cambiar de puesto
        this.departamentoSeleccionado = this.departamentos.find(dep => dep.department_id === departmentId) || null;

        // Mostrar empleados del departamento seleccionado
        this.mostrarEmpleadosPorDepartamento();
      },
      error => {
        console.error('Error al cargar los puestos:', error);
      }
    );
  }

  // Cargar los turnos cuando se selecciona un puesto
  loadTurnos(positionId: number) {
    this.http.get<Turno[]>(`https://siinad.mx/php/get_shifts.php?position_id=${positionId}`).subscribe(
      data => {
        this.turnos = data;
        this.empleados = []; // Limpiar empleados al cambiar el turno
        this.puestoSeleccionado = this.puestos.find(puesto => puesto.position_id === positionId) || null;

        // Mostrar empleados del puesto seleccionado
        this.mostrarEmpleadosPorPuesto();
      },
      error => {
        console.error('Error al cargar los turnos:', error);
      }
    );
  }

  // Cargar empleados cuando se selecciona un turno
  loadEmpleadosPorTurno(shiftId: number) {
    const companyId = this.authService.selectedId; // Obtener el ID de la empresa

    this.http.get<{ success: boolean, employees: Empleado[] }>(`https://siinad.mx/php/get_employees_by_shifts.php?company_id=${companyId}&shift_id=${shiftId}`).subscribe(
      response => {
        if (response.success) {
          this.empleados = response.employees;
          this.empleadosFiltrados = this.empleados; // Inicializar los empleados filtrados
        } else {
          console.error('Error al cargar los empleados del turno');
        }
      },
      error => {
        console.error('Error al cargar los empleados del turno:', error);
      }
    );
  }

  // Mostrar empleados por departamento
  mostrarEmpleadosPorDepartamento() {
    if (this.departamentoSeleccionado) {
      const companyId = this.authService.selectedId;
      const departmentId = this.departamentoSeleccionado.department_id;

      this.http.get<{ success: boolean, employees: Empleado[] }>(`https://siinad.mx/php/get_employees_by_department.php?company_id=${companyId}&department_id=${departmentId}`).subscribe(
        response => {
          if (response.success) {
            this.empleados = response.employees;
            this.empleadosFiltrados = this.empleados; // Inicializar los empleados filtrados
          } else {
            console.error('Error al cargar los empleados');
          }
        },
        error => {
          console.error('Error al cargar los empleados del departamento:', error);
        }
      );
    }
  }

  // Mostrar empleados por puesto
  mostrarEmpleadosPorPuesto() {
    if (this.puestoSeleccionado) {
      const companyId = this.authService.selectedId;
      const positionId = this.puestoSeleccionado.position_id;

      this.http.get<{ success: boolean, employees: Empleado[] }>(`https://siinad.mx/php/get_employees_by_position.php?company_id=${companyId}&position_id=${positionId}`).subscribe(
        response => {
          if (response.success) {
            this.empleados = response.employees;
            this.empleadosFiltrados = this.empleados; // Inicializar los empleados filtrados
          } else {
            console.error('Error al cargar los empleados del puesto');
          }
        },
        error => {
          console.error('Error al cargar los empleados del puesto:', error);
        }
      );
    }
  }

  // Función para filtrar los empleados
  buscarEmpleados() {
    const searchLower = this.searchQuery.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(empleado =>
      empleado.first_name.toLowerCase().includes(searchLower) ||
      (empleado.middle_name && empleado.middle_name.toLowerCase().includes(searchLower)) ||
      empleado.last_name.toLowerCase().includes(searchLower) ||
      empleado.employee_id.toString().includes(searchLower)
    );
  }

  // Seleccionar empleado y mostrar su información
  selectEmployee(empleado: Empleado) {
    this.selectedEmployee = empleado;
  }

  // Método para ver detalles del empleado
  async viewEmployeeDetails(employeeId: number) {
    const modal = await this.modalController.create({
      component: EmployeeDetailsComponent,
      componentProps: { employeeId: employeeId } // Pasar el ID del empleado
    });
    return await modal.present();
  }

  // Navegar de vuelta
  goBack() {
    this.router.navigate(['/home']);
  }

  
}
