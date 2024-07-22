import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular';
import { ModalInfoUserPremiumPage } from '../modal-info-user-premium/modal-info-user-premium.page';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  username: string;
  principalCompanies: { id: string, name: string, role: string, rfc: string, levelUser: string }[] = [];
  nonPrincipalCompanies: { id: string, name: string, role: string, rfc: string, status: string, levelUser: string }[] = [];
  selectedCompany: string;
  currentLogo: string;
  currentAvatar: string;

  labelNivelUsuarioAdministradorGeneral: string;
  labelNivelUsuarioAdministradorEmpresaGeneral: string;
  labelNivelUsuarioAdministradorEmpresa: string;
  labelNivelUsuarioAdministrativoEmpresa: string;
  labelNivelUsuarioSupervisorEmpresa: string;

  constructor(private toastController: ToastController, private modalController: ModalController, private http: HttpClient, public authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.username;
    this.principalCompanies = this.authService.principalCompanies;
    this.nonPrincipalCompanies = this.authService.nonPrincipalCompanies;
    this.selectedCompany = this.authService.selectedCompany;
    this.loadCurrentAvatar(this.authService.userId);
    this.selectCompany();
  }

  selectCompany() {
    // Verifica si se ha seleccionado una empresa
    if (this.selectedCompany) {
      // Busca la empresa seleccionada en la lista de empresas principales
      const selectedPrincipalCompany = this.principalCompanies.find(company => company.name === this.selectedCompany);
      // Si se encuentra la empresa, asigna su RFC a selectedRFC
      if (selectedPrincipalCompany) {
        this.authService.selectedId = selectedPrincipalCompany.id;
        this.authService.selectedRFC = selectedPrincipalCompany.rfc;
        this.authService.selectedLevelUser = selectedPrincipalCompany.levelUser;
        this.authService.selectedRole = selectedPrincipalCompany.role;

        // Filtrar las empresas no principales que tengan el mismo ID que la empresa principal seleccionada
        this.authService.nonPrincipalCompanies = this.nonPrincipalCompanies.filter(company => company.id === selectedPrincipalCompany.id);
      }
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  noEmpresasAceptadas(): boolean {
    return this.authService.nonPrincipalCompanies.length === 0 || !this.authService.nonPrincipalCompanies.some(company => company.status === '1');
  }

  noEmpresasPendientes(): boolean {
    return this.authService.nonPrincipalCompanies.length === 0 || !this.authService.nonPrincipalCompanies.some(company => company.status === '0');
  }

  logout() {
    this.authService.logout();
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalInfoUserPremiumPage,
    });
    return await modal.present();
  }

  loadCurrentAvatar(userId: string) {
    this.http.get(`https://siinad.mx/php/getUserAvatar.php?userId=${userId}`).subscribe(
      (response: any) => {
        if (response && response.avatarUrl) {
          this.currentAvatar = response.avatarUrl;
        } else {
          console.error('Invalid response structure or missing avatarUrl:', response);
        }
      },
      (error) => {
        console.error('Error fetching avatar:', error);
      }
    );
  }
}
