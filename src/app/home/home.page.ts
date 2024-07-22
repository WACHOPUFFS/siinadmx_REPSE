import { Component, OnInit, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataStorageService } from '../data-storage-service';
import { HttpClient } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { CookieService } from 'ngx-cookie-service';
import { ModalInfoUserPremiumPage } from '../modal-info-user-premium/modal-info-user-premium.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string;
  principalCompanies: { id: string, name: string, role: string, rfc: string, levelUser: string }[] = [];
  nonPrincipalCompanies: { id: string, name: string, role: string, rfc: string, status: string, levelUser: string }[] = [];
  selectedCompany: string;
  selectedRFC: string;
  selectedLevelUser: string;
  isFullScreen: boolean = false;
  permissions: { section: string, subSection: string | null }[] = [];
  currentLogo: string;
  currentAvatar: string;
  currentDateTime: string;

  //variables de label y buttons
  labelTitleApp: string;
  labelAdminEmpresas: string;
  labelRegistrarCuentaUsuarioEmpresa: string;
  labelRegistrarSocioComercialRol: string;
  labelSolicitarContactoEmpresa: string;
  labelMensajesPendientes: string;
  labelAutorizarSocioComercial: string;
  labelCerrarSesion: string;
  labelNivelUsuarioAdministradorGeneral: string;
  labelNivelUsuarioAdministradorEmpresaGeneral: string;
  labelNivelUsuarioAdministradorEmpresa: string;
  labelNivelUsuarioAdministrativoEmpresa: string;
  labelNivelUsuarioSupervisorEmpresa: string;
  labelEmpresasPrincipalUsuario: string;
  labelEmpresasLigadasUsuario: string;
  labelSeleccioneEmpresaPrincipal: string;

  buttonAgregarSocioComercial: string;
  buttonMiCodigoSocioComercial: string;

  constructor(private cookieService: CookieService, private toastController: ToastController, private modalController: ModalController, private http: HttpClient, private router: Router, public authService: AuthService, private dataStorageService: DataStorageService) {
    this.labelTitleApp = dataStorageService.labelTitleApp;
    this.labelAdminEmpresas = dataStorageService.labelAdminEmpresas;
    this.labelRegistrarCuentaUsuarioEmpresa = dataStorageService.labelRegistrarCuentaUsuarioEmpresa;
    this.labelRegistrarSocioComercialRol = dataStorageService.labelRegistrarSocioComercialRol;
    this.labelSolicitarContactoEmpresa = dataStorageService.labelSolicitarContactoEmpresa;
    this.labelMensajesPendientes = dataStorageService.labelMensajesPendientes;
    this.labelAutorizarSocioComercial = dataStorageService.labelAutorizarSocioComercial;
    this.labelCerrarSesion = dataStorageService.labelCerrarSesion;
    this.labelNivelUsuarioAdministradorGeneral = dataStorageService.labelNivelUsuarioAdministradorGeneral;
    this.labelNivelUsuarioAdministradorEmpresaGeneral = dataStorageService.labelNivelUsuarioAdministradorEmpresaGeneral;
    this.labelNivelUsuarioAdministradorEmpresa = dataStorageService.labelNivelUsuarioAdministradorEmpresa;
    this.labelNivelUsuarioAdministrativoEmpresa = dataStorageService.labelNivelUsuarioAdministrativoEmpresa;
    this.labelNivelUsuarioSupervisorEmpresa = dataStorageService.labelNivelUsuarioSupervisorEmpresa;
    this.labelEmpresasPrincipalUsuario = dataStorageService.labelEmpresasPrincipalUsuario;
    this.labelEmpresasLigadasUsuario = dataStorageService.labelEmpresasLigadasUsuario;
    this.labelSeleccioneEmpresaPrincipal = dataStorageService.labelSeleccioneEmpresaPrincipal;
    this.buttonAgregarSocioComercial = dataStorageService.buttonAgregarSocioComercial;
    this.buttonMiCodigoSocioComercial = dataStorageService.buttonMiCodigoSocioComercial;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();

    this.loadCurrentAvatar(this.authService.userId);
    // Verificar si hay un token de sesión guardado en la cookie
    const token = this.cookieService.get('token');

    // Si no hay un token, redirigir al usuario a la página de inicio de sesión
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      // Si hay un token, verificar si el usuario está autenticado en el servicio AuthService
      if (!this.authService.isLoggedIn) {
        // Si el usuario no está autenticado, redirigirlo a la página de inicio de sesión
        this.router.navigate(['/login']);
      } else {
        this.username = this.authService.username;
        this.selectedCompany = this.authService.selectedCompany;
        this.principalCompanies = this.authService.principalCompanies;
        this.nonPrincipalCompanies = this.authService.nonPrincipalCompanies;

        console.log('Username:', this.username);
        console.log('Principal Companies:', this.principalCompanies);
        console.log('Non-Principal Companies:', this.nonPrincipalCompanies);


        this.selectCompany();
        this.loadPermissions();
      }
    }

    this.updateDateTime();
  }

  checkScreenSize() {
    this.isFullScreen = window.innerWidth >= 1024; // Ajusta el tamaño según sea necesario
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

        // Agrega un console.log para verificar el valor de selectedPrincipalCompany.id
        console.log("ID de la empresa principal seleccionada:", selectedPrincipalCompany.id);

        this.companyNonPrincipals(selectedPrincipalCompany.id);

        // Filtrar las empresas no principales que tengan el mismo ID que la empresa principal seleccionada
        this.authService.nonPrincipalCompanies = this.nonPrincipalCompanies.filter(company => company.id === selectedPrincipalCompany.id);

        // Imprimir las empresas no principales ligadas a la empresa seleccionada
        console.log('Empresas no principales ligadas:', this.authService.nonPrincipalCompanies);
      }
    } else {
      // Si no se ha seleccionado ninguna empresa, selecciona automáticamente la primera empresa
      if (this.principalCompanies.length > 0) {
        const firstCompany = this.principalCompanies[0];
        this.selectedCompany = firstCompany.name;
        this.authService.selectedId = firstCompany.id;
        this.authService.selectedRFC = firstCompany.rfc;
        this.authService.selectedLevelUser = firstCompany.levelUser;
        this.authService.selectedRole = firstCompany.role;

        // Agrega un console.log para verificar el valor de firstCompany.id
        console.log("ID de la primera empresa principal:", firstCompany.id);

        this.companyNonPrincipals(firstCompany.id);

        // Filtrar las empresas no principales que tengan el mismo ID que la empresa principal seleccionada
        this.authService.nonPrincipalCompanies = this.nonPrincipalCompanies.filter(company => company.id === firstCompany.id);

        // Imprimir las empresas no principales ligadas a la empresa seleccionada
        console.log('Empresas no principales ligadas:', this.authService.nonPrincipalCompanies);
      } else {
        // Si no hay empresas disponibles, limpia los valores
        this.authService.selectedRFC = '';
        this.authService.selectedRole = '';
        this.authService.selectedLevelUser = '';
        this.authService.nonPrincipalCompanies = [];


        // Imprimir las empresas no principales ligadas (vacías en este caso)
        console.log('Empresas no principales ligadas:', this.authService.nonPrincipalCompanies);
      }
    }

    // Asigna la empresa seleccionada al servicio AuthService
    this.authService.selectedCompany = this.selectedCompany;

    this.loadPermissions();
    this.onCompanyChange();

    console.log("Empresa seleccionada:", this.selectedCompany);
    console.log("RFC de la empresa seleccionada:", this.authService.selectedRFC);
    console.log("Nivel de usuario en la empresa seleccionada:", this.authService.selectedLevelUser);
    console.log("Nivel de rol en la empresa seleccionada:", this.authService.selectedRole);
  }




  async companyNonPrincipals(selectedCompanyId: string) {
    const data = {
      company_id: selectedCompanyId // Establece el nombre del parámetro como company_id para que coincida con el esperado por el script PHP
    }

    // Realizar la solicitud POST al archivo PHP con los datos de registro
    this.http.post('https://siinad.mx/php/loadCompanies.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          // Manejar la respuesta exitosa aquí si es necesario
          const mappedCompanies = response.nonPrincipalCompanies.map((company: any) => ({
            id: company.idAssociation,
            name: company.nameCompany,
            role: company.roleInCompany,
            rfc: company.rfcIncompany,
            status: company.statusCompany,
            levelUser: company.levelUser
          }));

          // Asignar las empresas no principales mapeadas al servicio AuthService
          this.authService.setNonPrincipalCompanies(mappedCompanies);
          console.log('Empresas no principales obtenidas:', response.nonPrincipalCompanies);
        } else {
          // Error en la solicitud, mostrar un mensaje de error al usuario
          await this.mostrarToast(response.message, 'danger');
        }
      },
      (error) => {
        // Manejar errores de red u otros errores
        console.error('Error al realizar la solicitud:', error);
        this.mostrarToast('Error al realizar la solicitud', 'danger');
      }
    );
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  tieneRolProveedor(): boolean {
    // Implementa la lógica para verificar si el usuario tiene el rol de proveedor en alguna de sus empresas
    return false;
  }

  // Agrega este método a tu componente
  noEmpresasAceptadas(): boolean {
    return this.authService.nonPrincipalCompanies.length === 0 || !this.authService.nonPrincipalCompanies.some(company => company.status === '1');
  }

  noEmpresasPendientes(): boolean {
    return this.authService.nonPrincipalCompanies.length === 0 || !this.authService.nonPrincipalCompanies.some(company => company.status === '0');
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalInfoUserPremiumPage,
      // Puedes agregar opciones adicionales aquí, como 'componentProps', 'cssClass', etc.
    });
    return await modal.present();
  }


  loadPermissions() {
    const userId = this.authService.userId;
    const companyId = this.authService.selectedId;
    const data = { userId: userId, companyId: companyId };

    this.http.post('https://siinad.mx/php/loadPermissions.php', data).subscribe(
      (response: any) => {
        if (response.success) {
          this.permissions = response.permissions.map((perm: any) => ({ section: perm.section, subSection: perm.subSection }));
        } else {
          console.error(response.error);
        }
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );
  }

  hasPermission(section: string, subSection: string | null = null): boolean {
    if (subSection) {
      // Verifica si existe el permiso para la sección y la subsección específicas.
      return this.permissions.some(perm => perm.section === section && perm.subSection === subSection);
    } else {
      // Verifica si existe el permiso para la sección sin importar la subsección.
      return this.permissions.some(perm => perm.section === section);
    }
  }
  


  onCompanyChange() {
    this.loadCurrentLogo(this.authService.selectedId);
  }

  loadCurrentLogo(companyId: string) {
    this.http.get(`https://siinad.mx/php/getCompanyLogo.php?companyId=${companyId}`).subscribe((response: any) => {
      this.currentLogo = response.logoUrl; // Ajusta según la estructura de tu respuesta
    });
  }
  loadCurrentAvatar(userId: string) {
    this.http.get(`https://siinad.mx/php/getUserAvatar.php?userId=${userId}`).subscribe(
      (response: any) => {
        if (response && response.avatarUrl) {
          this.currentAvatar = response.avatarUrl;
          console.log('Avatar URL:', this.currentAvatar);
        } else {
          console.error('Invalid response structure or missing avatarUrl:', response);
        }
      },
      (error) => {
        console.error('Error fetching avatar:', error);
      }
    );
  }

  updateDateTime(): void {
    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    
    this.currentDateTime = `${dayName} ${day}, de ${monthName} ${year}`;
  }
  
}
