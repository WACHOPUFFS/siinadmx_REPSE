import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { RegistroModalPage } from '../registro-modal/registro-modal.page';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService
import { DataStorageService } from '../data-storage-service';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ModalSuccessComponent } from '../modal-success/modal-success.component'

@Component({
  selector: 'app-registro-premium',
  templateUrl: './registro-premium.page.html',
  styleUrls: ['./registro-premium.page.scss'],
})
export class RegistroPremiumPage implements OnInit {

  empleados: any[] = []; // Arreglo para almacenar al empleado que se quiere confirmar
  
  usuario = {
    nombreUsuario: '',
    nombreCompleto: '',
    correo: '',
    numTelefonico: '',
    rfc: '',
    roleInCompany: '',
    nombreEmpresa: '',
  };

  showMessageFlag: boolean = false;
  tipoRFC: string = 'fisica'; // Valor por defecto: persona física
  rfcLengthError: string = '';
  prefijo: string;
  prefijos: { codigo: string, pais: string }[] = [];
  phoneNumberUtil: PhoneNumberUtil;

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

  fechaInicio: string;
  fechaFin: string;
  fechaInicioRequest: string;



  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController, // Inyecta ToastController
    private modalController: ModalController, // Inyecta ModalController
    private authService: AuthService, // Asegúrate de inyectar correctamente el servicio AuthService
    private dataStorageService: DataStorageService
  ) {
    this.phoneNumberUtil = PhoneNumberUtil.getInstance();
    this.obtenerPrefijos();
    this.labelRegistrarSocioComercialRol = dataStorageService.labelRegistrarSocioComercialRol;
    this.labelIngreseDatosParaContinuar = dataStorageService.labelAdminEmpresas;
    this.labelTipoRFC = dataStorageService.labelTipoRFC;
    this.labelPersonaFisica = dataStorageService.labelPersonaFisica;
    this.labelPersonaMoral = dataStorageService.labelPersonaMoral;
    this.labelRFC = dataStorageService.labelRFC;
    this.labelComoApareceConstanciaFiscal = dataStorageService.labelComoApareceConstanciaFiscal;
    this.labelAliasUsuario = dataStorageService.labelAliasUsuario;
    this.labelNombreCompletoUsuario = dataStorageService.labelNombreCompletoUsuario;
    this.labelCorreo = dataStorageService.labelCorreo;
    this.labelValidacionCorreo = dataStorageService.labelValidacionCorreo;
    this.labelContrasena = dataStorageService.labelContrasena;
    this.labelConfirmarContrasena = dataStorageService.labelConfirmarContrasena;
    this.labelTipoUsuario = dataStorageService.labelTipoUsuario;
    this.labelCliente = dataStorageService.labelCliente;
    this.labelProveedor = dataStorageService.labelProveedor;
    this.labelClienteProveedor = dataStorageService.labelClienteProveedor;
    this.labelFechaInicioPeriodo = dataStorageService.labelFechaInicioPeriodo;
    this.labelFechaFinPeriodo = dataStorageService.labelFechaFinPeriodo;
    this.ButtonRegistrar = dataStorageService.ButtonRegistrar;
  }

  ngOnInit() {
    this.fechaInicioRequest = new Date().toISOString().split('T')[0];
    this.obtenerSocioComercial();
  }

  obtenerSocioComercial() {
    // Obtener el RFC de la empresa seleccionada del servicio AuthService
    const socioComercialUserId = this.authService.userId;
  
    // Realizar la solicitud HTTP solo si hay un RFC de empresa seleccionado
    if (socioComercialUserId) {
      // Realizar la solicitud HTTP para obtener los empleados no confirmados
      this.http.get<any[]>(`https://siinad.mx/php/get_socioComercial.php?id=${socioComercialUserId}`)
        .subscribe((data: any[]) => {
          // Asignar los datos del primer empleado obtenido a la variable usuario
          if (data.length > 0) {
            const primerEmpleado = data[0];
            this.usuario = {
              nombreUsuario: primerEmpleado.username,
              nombreCompleto: primerEmpleado.name,
              correo: primerEmpleado.email,
              numTelefonico: primerEmpleado.phone, // No hay información de número telefónico en los datos recibidos
              rfc: primerEmpleado.companyRFC,
              roleInCompany: primerEmpleado.roleName,
              nombreEmpresa: primerEmpleado.nameCompany
            };
          }
        });
    }
  }


  obtenerPrefijos() {
    const regionCodes = this.phoneNumberUtil.getSupportedRegions();
    this.prefijos = regionCodes.map(regionCode => {
      const countryCode = '+' + this.phoneNumberUtil.getCountryCodeForRegion(regionCode);
      const countryName = this.getCountryName(regionCode);
      return { codigo: countryCode, pais: countryName };
    });

     // Ordenar los prefijos de menor a mayor
     this.prefijos.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
  }
  
  getCountryName(regionCode: string): string {
    // You can implement a method to map region codes to country names
    // For simplicity, I'll use a placeholder method
    // Replace this with your implementation to map region codes to country names
    return regionCode; // Placeholder, replace with actual implementation
  }
  
  

  async camposCompletos(): Promise<boolean> {
    // Expresión regular para verificar que después del punto (.) haya texto
    const regexPuntoCom = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Verificar si todos los campos son strings y no están vacíos
    return (
      typeof this.usuario.nombreUsuario === 'string' && this.usuario.nombreUsuario.trim() !== '' &&
      typeof this.usuario.nombreCompleto === 'string' && this.usuario.nombreCompleto.trim() !== '' &&
      typeof this.usuario.correo === 'string' && this.usuario.correo.trim() !== '' &&
      typeof this.usuario.numTelefonico === 'string' && this.usuario.numTelefonico.trim() !== '' &&
      typeof this.usuario.nombreEmpresa === 'string' && this.usuario.nombreEmpresa.trim() !== '' &&
      typeof this.usuario.roleInCompany === 'string' && this.usuario.roleInCompany.trim() !== '' &&
      this.usuario.correo.includes('@') && // Verificar si el campo de correo electrónico contiene '@'
      regexPuntoCom.test(this.usuario.correo)
    );
  }

  
  isValidEmail(email: string): boolean {
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  

  async registrarUsuario() {
    if (await this.camposCompletos()) {
      // Generar un folio de solicitud único
      const folioSolicitud = Math.random().toString(36).substr(2, 9).toUpperCase();
  
      const data = {
        idUser: this.authService.userId,
        nombreUsuario: this.usuario.nombreUsuario,
        nombreCompleto: this.usuario.nombreCompleto,
        correo: this.usuario.correo,
        numTelefonico: this.usuario.numTelefonico, // Utilizar el número de teléfono completo
        rfc: this.usuario.rfc, // Agrega el RFC al objeto de datos enviado
        roleInCompany: this.usuario.roleInCompany,
        nombreEmpresa: this.tipoRFC === 'fisica' ? this.usuario.nombreEmpresa : (this.tipoRFC === 'moral' ? this.usuario.nombreEmpresa : null),
        fechaInicioRequest: this.fechaInicioRequest,
        empresaLigada: this.authService.selectedCompany, // Obtén la empresa seleccionada del servicio AuthService
        folioSolicitud: folioSolicitud // Añadir el folio de solicitud
      };
  
      // Realizar la solicitud POST al archivo PHP con los datos de registro
      this.http.post('https://siinad.mx/php/registrarSolicitud.php', data).subscribe(
        async (response: any) => {
          if (response.success) {
            // Mostrar el folio en un modal
            await this.mostrarModal(`Registro exitoso. Su folio de solicitud es: ${folioSolicitud}`, 'Registro Exitoso');
          } else {
            // Error en el registro, mostrar un mensaje de error al usuario
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
    // Realizar la solicitud POST al archivo PHP con el RFC para buscar la empresa
    this.http.post('https://siinad.mx/php/searchCompanies.php', { rfc: this.usuario.rfc })
      .subscribe(async (response: any) => {
        // Manejar la respuesta del servidor
        if (response.success) {
          // Si se encontró la empresa, asigna el nombre de la empresa al campo correspondiente
          this.usuario.nombreEmpresa = response.nombreEmpresa;

        } else {
          await this.mostrarToast(response.message, 'danger');
        }
      }, error => {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud:', error);
      });
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
    // Reiniciar los valores de los campos de RFC y nombre de la empresa
    this.usuario.rfc = '';
    this.usuario.nombreEmpresa = '';
    // Reiniciar cualquier mensaje de error relacionado con el RFC
    this.rfcLengthError = '';
  }

  validateRFC(event: any) {
    // Verificar el tipo de RFC seleccionado
    if (this.tipoRFC === 'fisica') {
      // Si es tipo física, el RFC debe tener 13 caracteres
      if (this.usuario.rfc.length >= 13) {
        this.rfcLengthError = '';
      } else {
        this.rfcLengthError = 'El RFC para persona física debe tener 13 dígitos.';
      }
    } else if (this.tipoRFC === 'moral') {
      // Si es tipo moral, el RFC debe tener 12 caracteres
      if (this.usuario.rfc.length >= 12) {
        this.rfcLengthError = '';
      } else {
        this.rfcLengthError = 'El RFC para persona moral debe tener 12 dígitos.';
      }
    }

    // Limitar la longitud del RFC ingresado
    if (this.usuario.rfc.length > 13 && this.tipoRFC === 'fisica') {
      this.usuario.rfc = this.usuario.rfc.substring(0, 13); // Limitar a 13 caracteres
    } else if (this.usuario.rfc.length > 12 && this.tipoRFC === 'moral') {
      this.usuario.rfc = this.usuario.rfc.substring(0, 12); // Limitar a 12 caracteres
    }
  }

  onEnterPressed() {
    // Llama a la función de inicio de sesión cuando se presiona Enter
    this.registrarUsuario();
  }

  showMessage() {
    this.showMessageFlag = true;
  }

  hideMessage() {
    this.showMessageFlag = false;
  }

  resetMessage() {
    // Esta función se llama cuando el campo recibe el foco
    // La usaremos para restablecer el estado del mensaje
    this.showMessageFlag = false;
  }

  
  limpiarCampos() {
    this.usuario = {
      nombreUsuario: '',
      nombreCompleto: '',
      correo: '',
      numTelefonico: '',
      rfc: '',
      roleInCompany: '',
      nombreEmpresa: ''
    };
  }


  
async mostrarModal(mensaje: string, titulo: string = 'Información') {
  const modal = await this.modalController.create({
    component: ModalSuccessComponent,
    componentProps: {
      titulo: titulo,
      mensaje: mensaje
    },
    cssClass: 'small-modal' // Añadir esta clase para hacer el modal más pequeño
  });
  return await modal.present();
}



  
}
