import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cambiar-rol-modal',
  templateUrl: './cambiar-rol-modal.page.html',
  styleUrls: ['./cambiar-rol-modal.page.scss'],
})
export class CambiarRolModalPage {

  @Input() socioComercial: any;
  nuevoRol: string; // Nueva propiedad para almacenar el nuevo rol seleccionado


  constructor(private modalController: ModalController, private toastController: ToastController, private http: HttpClient, public authService: AuthService) { }

  closeModal() {
    this.modalController.dismiss();
  }

  guardarCambios() {
    const data = {
      companyId: this.authService.selectedId, // Corrige el nombre del parámetro a companyId
      socioComercialId: this.socioComercial.company_id,
      nuevoRol: this.nuevoRol
    };

    // Realizar la solicitud POST al archivo PHP con los datos de registro
    this.http.post('https://siinad.mx/php/saveUserRoles.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          // Manejar la respuesta exitosa aquí si es necesario

          // Aquí puedes implementar la lógica para guardar los cambios
          this.mostrarToast(response.message, 'success');
          this.closeModal();
          // Asignar las empresas no principales mapeadas al servsicio AuthService

        } else {
          // Error en la solicitud, mostrar un mensaje de error al usuario

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

  ngOnInit() {
    console.log('Socio comercial recibido:', this.socioComercial); // Verifica si el socio comercial se recibió correctamente
  }

  getRoleDisplayName(roleName: string): string {
    if (roleName === 'proveedor') {
      return 'Cliente';
    } else if (roleName === 'cliente') {
      return 'Proveedor';
    } else if (roleName === 'clienteProveedor') {
      return 'Cliente - Proveedor';
    } else {
      return roleName; // Por si hay algún otro rol que no hayas considerado
    }
  }

}
