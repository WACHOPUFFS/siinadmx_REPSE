import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importa el servicio AuthService
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { ModalEditarEmpleadoPage } from '../modal-editar-empleado/modal-editar-empleado.page';


@Component({
  selector: 'app-user-setting-select',
  templateUrl: './user-setting-select.page.html',
  styleUrls: ['./user-setting-select.page.scss'],
})
export class UserSettingSelectPage implements OnInit {
  employees: any[] = []; // Array para almacenar los usuarios obtenidos

  constructor(
    private http: HttpClient,
    private authService: AuthService, // Asegúrate de inyectar correctamente el servicio AuthService
    private toastController: ToastController, // Inyecta ToastController
    private modalController: ModalController, // Inyecta ModalController
  ) { }

  ngOnInit() {
    // Cargar los usuarios al inicializar el componente
    this.loadUsuarios();
  }

  loadUsuarios() {
    const data = {
      companyId: this.authService.selectedId
    };

    // Realizar la solicitud POST al archivo PHP con los datos de registro
    this.http.post('https://siinad.mx/php/searchUsers.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          // Éxito en la solicitud, asignar los datos de empleados al array this.employees
          this.employees = response.employees;
          console.log('Datos de empleados obtenidos:', this.employees);
        } else {
          // Error en la solicitud, mostrar un mensaje de error al usuario
          await this.mostrarToast('Error en la solicitud', 'danger');
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



  async abrirModalEmpleado(empleado: any) {
    const modal = await this.modalController.create({
      component:  ModalEditarEmpleadoPage,
      componentProps: {
        empleado: empleado
      }
    });
    return await modal.present();
  }
  
}
