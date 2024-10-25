import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { RegistroModalPage } from '../registro-modal/registro-modal.page';
import { AuthService } from '../auth.service';
import { DataStorageService } from '../data-storage-service';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { AccountService } from '../account.service';
import { NavController } from '@ionic/angular';
import { CompanyInfoModalComponent } from '../company-info-modal/company-info-modal.component';
@Component({
  selector: 'app-business-partner-register',
  templateUrl: './business-partner-register.page.html',
  styleUrls: ['./business-partner-register.page.scss'],
})
export class BusinessPartnerRegisterPage implements OnInit {
  usuario = {
    nombreUsuario: '',
    nombreCompleto: '',
    correo: '',
    numTelefonico: '',
    contrasena: '',
    confirmarContrasena: '',
    rfc: '',
    roleInCompany: '',
    nombreEmpresa: '',
    fechaInicio: '',
    fechaFin: '',
    empresaLigada: ''
  };

  showMessageFlag: boolean = false;
  tipoRFC: string = 'fisica'; // Valor por defecto: persona física
  rfcLengthError: string = '';
  prefijo: string;
  prefijos: { codigo: string, pais: string }[] = [];
  phoneNumberUtil: PhoneNumberUtil;
  telefonoError: string = ''; // Variable para el mensaje de error de teléfono
  codigoSocioComercial: string;
  registerMode: string = 'register'; // Controlador del modo de registro

  rolesDisponibles: any[] = []; // Roles obtenidos desde la base de datos

  // Etiquetas para los textos en la vista
  labelRegistrarSocioComercialRol: string;
  labelIngreseDatosParaContinuar: string;
  labelTipoRFC: string;
  labelPersonaFisica: string;
  labelPersonaMoral: string;
  labelRFC: string;
  labelComoApareceConstanciaFiscal: string;
  labelAliasUsuario: string;
  labelNombreCompletoUsuario: string;
  labelCorreo: string;
  labelValidacionCorreo: string;
  labelContrasena: string;
  labelConfirmarContrasena: string;
  labelTipoUsuario: string;
  labelCliente: string;
  labelProveedor: string;
  labelClienteProveedor: string;
  labelFechaInicioPeriodo: string;
  labelFechaFinPeriodo: string;
  ButtonRegistrar: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private modalController: ModalController,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private accountService: AccountService,
    private navCtrl: NavController
  ) {
    this.phoneNumberUtil = PhoneNumberUtil.getInstance();
    this.obtenerPrefijos();
    this.cargarEtiquetas();
  }

  ngOnInit() {
    this.registerMode = 'register'; // Establecer el modo de registro por defecto
    this.obtenerRoles(); // Cargar los roles desde la base de datos
  }

  cargarEtiquetas() {
    this.labelRegistrarSocioComercialRol = this.dataStorageService.labelRegistrarSocioComercialRol;
    this.labelIngreseDatosParaContinuar = this.dataStorageService.labelAdminEmpresas;
    this.labelTipoRFC = this.dataStorageService.labelTipoRFC;
    this.labelPersonaFisica = this.dataStorageService.labelPersonaFisica;
    this.labelPersonaMoral = this.dataStorageService.labelPersonaMoral;
    this.labelRFC = this.dataStorageService.labelRFC;
    this.labelComoApareceConstanciaFiscal = this.dataStorageService.labelComoApareceConstanciaFiscal;
    this.labelAliasUsuario = this.dataStorageService.labelAliasUsuario;
    this.labelNombreCompletoUsuario = this.dataStorageService.labelNombreCompletoUsuario;
    this.labelCorreo = this.dataStorageService.labelCorreo;
    this.labelValidacionCorreo = this.dataStorageService.labelValidacionCorreo;
    this.labelContrasena = this.dataStorageService.labelContrasena;
    this.labelConfirmarContrasena = this.dataStorageService.labelConfirmarContrasena;
    this.labelTipoUsuario = this.dataStorageService.labelTipoRol;
    this.labelCliente = this.dataStorageService.labelCliente;
    this.labelProveedor = this.dataStorageService.labelProveedor;
    this.labelClienteProveedor = this.dataStorageService.labelClienteProveedor;
    this.labelFechaInicioPeriodo = this.dataStorageService.labelFechaInicioPeriodo;
    this.labelFechaFinPeriodo = this.dataStorageService.labelFechaFinPeriodo;
    this.ButtonRegistrar = this.dataStorageService.ButtonRegistrar;
  }

  obtenerPrefijos() {
    const regionCodes = this.phoneNumberUtil.getSupportedRegions();
    this.prefijos = regionCodes.map(regionCode => {
      const countryCode = '+' + this.phoneNumberUtil.getCountryCodeForRegion(regionCode);
      const countryName = this.getCountryName(regionCode);
      return { codigo: countryCode, pais: countryName };
    });
    this.prefijos.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
  }

  getCountryName(regionCode: string): string {
    return regionCode; // Marcador de posición, reemplaza con la implementación real
  }

  async camposCompletos(): Promise<boolean> {
    const regexPuntoCom = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      typeof this.usuario.nombreUsuario === 'string' && this.usuario.nombreUsuario.trim() !== '' &&
      typeof this.usuario.nombreCompleto === 'string' && this.usuario.nombreCompleto.trim() !== '' &&
      typeof this.usuario.correo === 'string' && this.usuario.correo.trim() !== '' &&
      typeof this.usuario.numTelefonico === 'string' && this.usuario.numTelefonico.trim() !== '' &&
      typeof this.usuario.contrasena === 'string' && this.usuario.contrasena.trim() !== '' &&
      typeof this.usuario.nombreEmpresa === 'string' && this.usuario.nombreEmpresa.trim() !== '' &&
      typeof this.usuario.roleInCompany === 'string' && this.usuario.roleInCompany.trim() !== '' &&
      this.usuario.correo.includes('@') &&
      regexPuntoCom.test(this.usuario.correo) &&
      this.usuario.contrasena === this.usuario.confirmarContrasena &&
      this.validarTelefono()
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarTelefono(): boolean {
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(this.usuario.numTelefonico)) {
      this.telefonoError = 'El número de teléfono debe tener exactamente 10 dígitos numéricos.';
      return false;
    } else {
      this.telefonoError = '';
      return true;
    }
  }

  async registrarUsuario() {
    if (await this.camposCompletos()) {
      const data = {
        idUser: this.authService.userId,
        nombreUsuario: this.usuario.nombreUsuario,
        nombreCompleto: this.usuario.nombreCompleto,
        correo: this.usuario.correo,
        numTelefonico: this.usuario.numTelefonico,
        contrasena: this.usuario.contrasena,
        rfc: this.usuario.rfc,
        roleInCompany: this.usuario.roleInCompany,
        nombreEmpresa: this.tipoRFC === 'fisica' ? this.usuario.nombreEmpresa : (this.tipoRFC === 'moral' ? this.usuario.nombreEmpresa : null),
        fechaInicio: this.usuario.fechaInicio,
        fechaFin: this.usuario.fechaFin,
        empresaLigada: this.authService.selectedCompany,
      };

      this.http.post('https://siinad.mx/php/registrar.php', data).subscribe(
        async (response: any) => {
          if (response.success) {
            await this.mostrarToast(response.message, 'success');
            const modal = await this.modalController.create({
              component: RegistroModalPage,
              componentProps: { continuarRegistro: false }
            });

            await modal.present();

            const { data } = await modal.onDidDismiss();

            if (data.continuarRegistro) {
              this.limpiarCampos();
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            await this.mostrarToast(response.message, 'danger');
          }
        },
        async (error) => {
          console.error('Error en la solicitud POST:', error);
          await this.mostrarToast('Error en la solicitud de registro.', 'danger');
        }
      );
    } else {
      await this.mostrarToast('Por favor complete todos los campos obligatorios y verifique el correo electrónico y la contraseña.', 'warning');
    }
  }

  buscarEmpresaPorRFC() {
    this.http.post('https://siinad.mx/php/searchCompanies.php', { rfc: this.usuario.rfc }).subscribe(
      async (response: any) => {
        if (response.success) {
          this.usuario.nombreEmpresa = response.nombreEmpresa;
        } else {
          await this.mostrarToast(response.message, 'danger');
        }
      },
      error => {
        console.error('Error en la solicitud:', error);
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

  onChangeTipoRFC() {
    this.usuario.rfc = '';
    this.usuario.nombreEmpresa = '';
    this.rfcLengthError = '';
  }

  validateRFC(event: any) {
    if (this.tipoRFC === 'fisica') {
      if (this.usuario.rfc.length >= 13) {
        this.rfcLengthError = '';
      } else {
        this.rfcLengthError = 'El RFC para persona física debe tener 13 dígitos.';
      }
    } else if (this.tipoRFC === 'moral') {
      if (this.usuario.rfc.length >= 12) {
        this.rfcLengthError = '';
      } else {
        this.rfcLengthError = 'El RFC para persona moral debe tener 12 dígitos.';
      }
    }

    if (this.usuario.rfc.length > 13 && this.tipoRFC === 'fisica') {
      this.usuario.rfc = this.usuario.rfc.substring(0, 13);
    } else if (this.usuario.rfc.length > 12 && this.tipoRFC === 'moral') {
      this.usuario.rfc = this.usuario.rfc.substring(0, 12);
    }
  }

  onEnterPressed() {
    this.registrarUsuario();
  }

  showMessage() {
    this.showMessageFlag = true;
  }

  hideMessage() {
    this.showMessageFlag = false;
  }

  resetMessage() {
    this.showMessageFlag = false;
  }

  limpiarCampos() {
    this.usuario = {
      nombreUsuario: '',
      nombreCompleto: '',
      correo: '',
      numTelefonico: '',
      contrasena: '',
      confirmarContrasena: '',
      rfc: '',
      roleInCompany: '',
      nombreEmpresa: '',
      fechaInicio: '',
      fechaFin: '',
      empresaLigada: ''
    };
  }

  async openUserInfoModal() {
    if (!this.codigoSocioComercial || this.codigoSocioComercial.trim() === '') {
      await this.mostrarToast('Código de socio comercial no proporcionado.', 'warning');
      return;
    }

    const url = `https://siinad.mx/php/load_company_association.php?codigoEmpresa=${this.codigoSocioComercial}`;

    try {
      // Convertir la llamada HTTP en promesa para usar con async/await
      const response: any = await this.http.get(url).toPromise();

      // Verificar si hay un error en la respuesta
      if (response.error) {
        await this.mostrarToast(response.error, 'danger');
        return;
      }

      // Si no hay datos en la respuesta
      if (!response || response.length === 0) {
        await this.mostrarToast('No se encontraron datos de asociación.', 'warning');
        return;
      }

      // Crear el modal si todo está correcto
      const modal = await this.modalController.create({
        component: CompanyInfoModalComponent,
        componentProps: {
          companyData: response,
        },
      });
      await modal.present();

    } catch (error) {
      // Capturar errores en la solicitud
      console.error('Error al cargar la asociación:', error);
      await this.mostrarToast('Error al cargar la asociación. Inténtalo de nuevo más tarde.', 'danger');
    }
  }


  goBack() {
    this.navCtrl.back();
  }

  obtenerRoles() {
    // Solicita los roles desde el backend
    this.http.get('https://siinad.mx/php/getRoles.php').subscribe(
      (response: any) => {
        this.rolesDisponibles = response; // Asigna los roles obtenidos
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
        this.mostrarToast('Error al obtener los roles', 'danger');
      }
    );
  }
}
