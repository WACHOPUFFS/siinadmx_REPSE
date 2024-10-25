import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular'; // Importa ToastController y LoadingController
import { AuthService } from '../auth.service'; // Importa tu servicio de autenticación
import { DataStorageService } from '../data-storage-service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-code-company',
  templateUrl: './code-company.page.html',
  styleUrls: ['./code-company.page.scss'],
})
export class CodeCompanyPage {
  codigoEmpresa: string; // Variable para almacenar el código de la empresa
  labelCodigoDeEmpresa: string;
  labelTitleCodeCompany: string;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private navCtrl: NavController,
    private loadingController: LoadingController // Añadido el LoadingController
  ) {
    this.labelTitleCodeCompany = dataStorageService.buttonMiCodigoSocioComercial;
    this.labelCodigoDeEmpresa = dataStorageService.labelCodigoDeUsuario;
  }

  ngOnInit() {
    // Cargar el código de la empresa al inicializar el componente
    this.loadCompanyCode();
  }

  async loadCompanyCode() {
    // Mostrar el loading antes de la solicitud
    const loading = await this.loadingController.create({
      message: 'Cargando código...', // Mensaje de carga
    });
    await loading.present();

    // Obtener el ID de la empresa desde el servicio de autenticaci
    const companyId = this.authService.selectedId;
    // Preparar los datos para enviar al servidor
    const data = {
      companyId: companyId,
    };

    this.http.post('https://siinad.mx/php/loadCompanyCode.php', data).subscribe(
      async (response: any) => {
        await loading.dismiss(); // Oculta el loading después de la respuesta
        if (response.success) {
          // Si la solicitud fue exitosa, asigna el código de la empresa obtenido
          this.codigoEmpresa = response.codigoEmpresa;
        } else {
          // Error en la solicitud, mostrar un mensaje de error al usuario
          await this.mostrarToast(response.message, 'danger');
        }
      },
      async (error) => {
        await loading.dismiss(); // Oculta el loading en caso de error
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error en la solicitud de carga.', 'danger');
      }
    );
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
  
  async copiarCodigo() {
    if (this.codigoEmpresa) {
      try {
        await navigator.clipboard.writeText(this.codigoEmpresa);
        await this.mostrarToast('Código copiado al portapapeles.', 'success');
      } catch (error) {
        console.error('Error al copiar:', error);
        await this.mostrarToast('Error al copiar el código.', 'danger');
      }
    } else {
      await this.mostrarToast('No hay código para copiar.', 'warning');
    }
  }
  
}
