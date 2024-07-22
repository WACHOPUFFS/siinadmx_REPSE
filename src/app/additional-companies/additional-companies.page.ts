import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-additional-companies',
  templateUrl: './additional-companies.page.html',
  styleUrls: ['./additional-companies.page.scss'],
})
export class AdditionalCompaniesPage implements OnInit {
  selectedCompanyId: string;
  selectedUserId: string;
  selectedLevelUser: string;
  companies: any[] = [];
  users: any[] = [];
  secondaryCompanies: any[] = [];
  isModalOpen = false;
  selectedUser: any = null;
  levelUsers: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadCompanies();
    this.loadLevelUsers();
  }

  async loadCompanies() {
    this.http.get('https://siinad.mx/php/get-companies.php').subscribe(
      async (response: any) => {
        if (response) {
          this.companies = response;
        } else {
          console.error('Error al cargar empresas');
          await this.mostrarToast('Error al cargar empresas.', 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud GET:', error);
        await this.mostrarToast('Error al cargar empresas.', 'danger');
      }
    );
  }

  async loadLevelUsers() {
    this.http.get('https://siinad.mx/php/get-level-users.php').subscribe(
      async (response: any) => {
        if (response) {
          this.levelUsers = response;
        } else {
          console.error('Error al cargar niveles de usuario');
          await this.mostrarToast('Error al cargar niveles de usuario.', 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud GET:', error);
        await this.mostrarToast('Error al cargar niveles de usuario.', 'danger');
      }
    );
  }

  async onCompanyChange(event: any) {
    this.selectedCompanyId = event.detail.value;
    await this.loadUsers(this.selectedCompanyId);
  }

  async loadUsers(companyId: string) {
    const data = { companyId: companyId };

    this.http.post('https://siinad.mx/php/get-users-by-company.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.users = response.users;
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al cargar usuarios.', 'danger');
      }
    );
  }

  async onUserChange(event: any) {
    this.selectedUserId = event.detail.value;
    this.selectedUser = this.users.find(user => user.id === this.selectedUserId);
  }

  async assignSecondaryCompany() {
    await this.loadSecondaryCompanies();
    this.isModalOpen = true;
  }

  async loadSecondaryCompanies() {
    this.http.get('https://siinad.mx/php/get-companies.php').subscribe(
      async (response: any) => {
        if (response) {
          this.secondaryCompanies = response;
        } else {
          console.error('Error al cargar empresas secundarias');
          await this.mostrarToast('Error al cargar empresas secundarias.', 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud GET:', error);
        await this.mostrarToast('Error al cargar empresas secundarias.', 'danger');
      }
    );
  }

  async assignCompanyToUser(company: any) {
    const data = {
      user_id: this.selectedUser.id,
      company_id: company.idCompany,
      principal: 0,
      levelUser_id: this.selectedLevelUser,
      status: 2
    };

    this.http.post('https://siinad.mx/php/assign-company.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          console.log('Company assigned', response);
          await this.mostrarToast('Empresa asignada con éxito.', 'success');
          this.closeModal();
        } else {
          console.error(response.error);
          await this.mostrarToast(response.error, 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al asignar empresa.', 'danger');
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async mostrarToast(message: string, color: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.color = color;
    toast.duration = 2000;
    document.body.appendChild(toast);
    return toast.present();
  }
}
