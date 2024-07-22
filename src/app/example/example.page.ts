import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.page.html',
  styleUrls: ['./example.page.scss'],
})
export class ExamplePage implements OnInit {
  userCode: string;
  selectedLevelUser: string;
  companies: any[] = [];
  secondaryCompanies: any[] = [];
  isModalOpen = false;
  selectedUser: any = null;
  levelUsers: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadLevelUsers();
    this.loadSecondaryCompanies();
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

  async onUserCodeChange() {
    if (this.userCode) {
      const data = { userCode: this.userCode };

      this.http.post('https://siinad.mx/php/get-user-by-code.php', data).subscribe(
        async (response: any) => {
          if (response.success) {
            this.selectedUser = response.user;
          } else {
            console.error(response.error);
            await this.mostrarToast(response.error, 'danger');
            this.selectedUser = null;
          }
        },
        async (error) => {
          console.error('Error en la solicitud POST:', error);
          await this.mostrarToast('Error al cargar usuario.', 'danger');
          this.selectedUser = null;
        }
      );
    } else {
      this.selectedUser = null;
    }
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


  async assignCompanyToUser() {
    const data = {
      user_id: this.selectedUser.id,
      company_id: this.authService.selectedId,
      principal: 0,
      levelUser_id: this.selectedLevelUser,
      status: 2
    };

    this.http.post('https://siinad.mx/php/assign-company.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          console.log('Empresa asignada', response);
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

  goBack() {
    this.navCtrl.back();
  }
}
