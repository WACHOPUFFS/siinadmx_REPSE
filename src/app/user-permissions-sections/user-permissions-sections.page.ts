import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Asegúrate de tener el servicio de autenticación
import { NavController } from '@ionic/angular';

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
  users: any[] = [];
  filteredUsers: any[] = [];
  userTypes: any[] = [];
  sections: string[] = [];
  subSections: string[] = [];
  permissions: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService,  private navCtrl: NavController) { }

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
          const allSections = ['repse', 'obras', 'asistencias', 'costos', 'ventas', 'configEmpresa'];
          const assignedSections = response.sections.map((section: { NameSection: string }) => section.NameSection);
          this.sections = allSections.filter(section => assignedSections.includes(section));
          // Asegúrate de que 'configEmpresa' siempre esté en la lista de secciones
          if (!this.sections.includes('configEmpresa')) {
            this.sections.push('configEmpresa');
          }
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
      'repse': ['Nominas', 'SUA', 'Informes IMSS','Informes INFONAVIT'],
      'obras': ['Asignacion diaria de empleados a obras', 'Visor de incidencias', 'Control diario de empleados', 'Visualizar obras'],
      'asistencias': ['sub7', 'sub8'],
      'costos': ['sub9', 'sub10'],
      'ventas': ['sub11', 'sub12'],
     'configEmpresa': ['Adicional Empresa', 'Agregar socio comercial', 'Autorizar socio comercial', 'Codigo Empresa', 'Editar Roles de socios comerciales', 'Registrar usuarios Empresa', 'logo Empresa'],
    };

    this.subSections = subSectionsMap[section] || [];
  }

  async loadPermissions() {
    const companyId = this.authService.selectedId;
    const data = { userId: this.selectedUserId, companyId: companyId };

    this.http.post('https://siinad.mx/php/loadPermissions.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.permissions = response.permissions;
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

  async addPermission() {
    const companyId = this.authService.selectedId;
    const data = {
      userId: this.selectedUserId,
      section: this.selectedSection,
      subSections: this.selectedSubSections,
      companyId: companyId
    };

    this.http.post('https://siinad.mx/php/addPermission.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.selectedSubSections.forEach(subSection => {
            this.permissions.push({ section: this.selectedSection, subSection: subSection });
          });
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

  async mostrarToast(message: string, color: string) {
    // Implementar lógica para mostrar toast
  }

  goBack() {
    this.navCtrl.back();
  }
}
