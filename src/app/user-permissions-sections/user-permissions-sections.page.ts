import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Asegúrate de tener el servicio de autenticación
import { NavController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-user-permissions-sections',
  templateUrl: './user-permissions-sections.page.html',
  styleUrls: ['./user-permissions-sections.page.scss'],
})
export class UserPermissionsSectionsPage implements OnInit {
  selectedUserType: string = 'all';
  selectedUserId: string;
  selectedSection: string;
  selectedSubSections: string[] = [];
  selectedSubSectionsProvider: string[] = []; // Nueva propiedad para proveedor
  selectedSubSectionsClient: string[] = []; // Nueva propiedad para cliente
  users: any[] = [];
  filteredUsers: any[] = [];
  userTypes: any[] = [];
  sections: string[] = [];
  subSections: string[] = [];
  subSectionsProvider: string[] = []; // Nueva propiedad para proveedor
  subSectionsClient: string[] = []; // Nueva propiedad para cliente
  permissions: any[] = [];

  groupedPermissions: { section: string, subSections: string[] }[] = []; // Nueva propiedad

  constructor(private toastController: ToastController, private http: HttpClient, public authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadUsers();
    this.loadUserTypes();
    this.loadSections();
  }

  async loadUsers() {
    const companyId = this.authService.selectedId;
    const data = { companyId: companyId };

    this.http.post('https://siinad.mx/php/searchUsers.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.users = response.employees;
          this.filteredUsers = this.users;
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al cargar empleados.', 'danger');
      }
    );
  }

  async loadUserTypes() {
    this.http.get('https://siinad.mx/php/get-level-users.php').subscribe(
      async (response: any) => {
        this.userTypes = response;
      },
      async (error) => {
        console.error('Error en la solicitud GET:', error);
        await this.mostrarToast('Error al cargar los tipos de usuario.', 'danger');
      }
    );
  }

  async loadSections() {
    const companyId = this.authService.selectedId;
    const data = { companyId: companyId };

    this.http.post('https://siinad.mx/php/loadCompanySections.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          const allSections = ['Sistema REPSE', 'Control de proyectos', 'Empleados', 'Incidencias', 'Costos', 'Ventas', 'Configuracion de mi empresa', 'Configuracion de perfiles', 'Configuracion de socios comerciales', 'Configuracion de sitio', 'Configuracion de usuarios'];
          const assignedSections = response.sections.map((section: { NameSection: string }) => section.NameSection);
          this.sections = allSections.filter(section => assignedSections.includes(section))
         
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al cargar secciones.', 'danger');
      }
    );
  }


  async onUserTypeChange(event: any) {
    const userType = event.target.value;

    if (userType === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => user.role === userType);
    }
  }

  async onUserChange(event: any) {
    this.selectedUserId = event.target.value;
    await this.loadPermissions();
  }

  async onSectionChange(event: any) {
    this.selectedSection = event.target.value;
    this.loadSubSections(this.selectedSection);
  }

  async loadSubSections(section: string) {
    const subSectionsMap: { [key: string]: string[] } = {
      'Sistema REPSE': [''],
      'Control de proyectos': [
        'Asignacion de proyectos',
        'Registro de proyectos',
        'Vizualizar proyectos', 
        'Seguimiento de proyectos'
      ],
      'Empleados': ['Registrar solicitudes de empleados', 'Editar solicitudes de empleados', 'Aceptar solicitudes de empleados', 'Procesar empleados', 'Ver empleados registrados'],
      'Incidencias': ['Control de incidencias', 'Confirmar dia', 'Confirmar semana', 'Semanas procesadas', 'Lista de asistencia'],
      'Costos': [''],
      'Ventas': [''],
     'Configuracion de mi empresa': [
        'Asignar logo de la empresa',
        'Código de la empresa',
        'Departamentos',
        'Configuración inicial de períodos',
        'Tipos de período',
        'Catálogo de períodos'
      ],
      'Configuracion de perfiles': [''],
      'Configuracion de socios comerciales': [
        'Autorizar socio comercial',
        'Editar roles de los socios comerciales',
        'Registrar socio comercial',
        'Secciones visibles de los socios comerciales'
      ],
      'Configuracion de sitio': [
        'Secciones visibles de empresas',
        'Empresas registradas en la página',
        'Registrar empresas',
        'Confirmar solicitudes premium'
      ],
      'Configuracion de usuarios': [
        'Registrar, eliminar, ver y editar usuarios',
        'Editar mi usuario'
      ],
    };

    const subSectionsProviderMap: { [key: string]: string[] } = {
      'Sistema REPSE': [''],
      'Control de proyectos': [
        'Asignacion de proyectos',
        'Registro de proyectos',
        'Vizualizar proyectos', 
        'Seguimiento de proyectos'
      ],
      'Empleados': ['Registrar solicitudes de empleados', 'editar solicitudes de empleados', 'Ver empleados registrados'],
      'Incidencias': ['Control de incidencias', 'Confirmar dia', 'Confirmar semana', 'Semanas procesadas', 'Lista de asistencia'],
      'Costos': [''],
      'Ventas': [''],
     'Configuracion de mi empresa': [
        'Asignar logo de la empresa',
        'Código de la empresa',
        'Departamentos',
        'Configuración inicial de períodos',
        'Tipos de período',
        'Catálogo de períodos'
      ],
      'Configuracion de perfiles': [''],
      'Configuracion de socios comerciales': [
        'Autorizar socio comercial',
        'Editar roles de los socios comerciales',
        'Registrar socio comercial',
        'Secciones visibles de los socios comerciales'
      ],
      'Configuracion de sitio': [
        'Secciones visibles de empresas',
        'Empresas registradas en la página',
        'Registrar empresas',
        'Confirmar solicitudes premium'
      ],
      'Configuracion de usuarios': [
        'Registrar, eliminar, ver y editar usuarios',
        'Editar mi usuario'
      ],
    };

    const subSectionsClientMap: { [key: string]: string[] } = {
      'Sistema REPSE': [''],
      'Control de proyectos': [
        'Asignacion de proyectos',
        'Registro de proyectos',
        'Vizualizar proyectos', 
        'Seguimiento de proyectos'
      ],
     'Empleados': ['Registrar solicitudes de empleados', 'editar solicitudes de empleados', 'Ver empleados registrados'],
      'Incidencias': ['Control de incidencias', 'Confirmar dia', 'Confirmar semana', 'Semanas procesadas', 'Lista de asistencia'],
      'Costos': [''],
      'Ventas': [''],
      'Configuracion de mi empresa': [
        'Asignar logo de la empresa',
        'Código de la empresa',
        'Departamentos',
        'Configuración inicial de períodos',
        'Tipos de período',
        'Catálogo de períodos'
      ],
      'Configuracion de perfiles': [''],
      'Configuracion de socios comerciales': [
        'Autorizar socio comercial',
        'Editar roles de los socios comerciales',
        'Registrar socio comercial',
        'Secciones visibles de los socios comerciales'
      ],
      'Configuracion de sitio': [
        'Secciones visibles de empresas',
        'Empresas registradas en la página',
        'Registrar empresas',
        'Confirmar solicitudes premium'
      ],
      'Configuracion de usuarios': [
        'Registrar, eliminar, ver y editar usuarios',
        'Editar mi usuario'
      ],
    };

    this.subSections = subSectionsMap[section] || [];

    if (this.authService.selectedRole === 'proveedor') {
      this.subSectionsProvider = subSectionsProviderMap[section] || [];
    } else if (this.authService.selectedRole === 'cliente') {
      this.subSectionsClient = subSectionsClientMap[section] || [];
    }
  }

  async loadPermissions() {
    const companyId = this.authService.selectedId;
    const data = { userId: this.selectedUserId, companyId: companyId };

    this.http.post('https://siinad.mx/php/loadPermissions.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.permissions = response.permissions;
          this.groupPermissions(); // Agrupa los permisos después de cargarlos
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al cargar permisos.', 'danger');
      }
    );
  }

  groupPermissions() {
    // Define el tipo de grouped para que sea un objeto donde las claves son strings y los valores son arrays de strings
    const grouped: { [key: string]: string[] } = {};
  
    this.permissions.forEach(permission => {
      if (!grouped[permission.section]) {
        grouped[permission.section] = [];
      }
      grouped[permission.section].push(permission.subSection || 'Sin subapartado');
    });
  
    this.groupedPermissions = Object.keys(grouped).map(section => ({
      section,
      subSections: grouped[section]
    }));
  }
  

  async addPermission() {
    const companyId = this.authService.selectedId;
    let selectedSubSections: string[] = [];
  
    if (this.authService.selectedRole === 'proveedor') {
      selectedSubSections = this.selectedSubSectionsProvider;
    } else if (this.authService.selectedRole === 'cliente') {
      selectedSubSections = this.selectedSubSectionsClient;
    } else {
      selectedSubSections = this.selectedSubSections;
    }
  
    const data = {
      userId: this.selectedUserId,
      section: this.selectedSection,
      subSections: selectedSubSections,
      companyId: companyId
    };
  
    this.http.post('https://siinad.mx/php/addPermission.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          selectedSubSections.forEach((subSection: string) => {
            this.permissions.push({ section: this.selectedSection, subSection: subSection });
          });
          this.groupPermissions(); // Actualiza la agrupación
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al añadir permiso.', 'danger');
      }
    );
  }
  


  async removePermission(section: string, subSection: string) {
    const companyId = this.authService.selectedId;
    const data = {
      userId: this.selectedUserId,
      section: section,
      subSection: subSection,
      companyId: companyId
    };

    this.http.post('https://siinad.mx/php/removePermission.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.permissions = this.permissions.filter(p => !(p.section === section && p.subSection === subSection));
          this.groupPermissions(); // Actualiza la agrupación
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al eliminar permiso.', 'danger');
      }
    );
  }


  // Método para mostrar el toast
  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}