import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular'; // Importa ModalController y ToastController
import { AuthService } from '../auth.service';
import { CambiarRolModalPage } from '../cambiar-rol-modal/cambiar-rol-modal.page';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.page.html',
  styleUrls: ['./edit-roles.page.scss'],
})
export class EditRolesPage implements OnInit {
  sociosComerciales: any[] = [];


  constructor( private navCtrl: NavController, private http: HttpClient, private toastController: ToastController, private modalController: ModalController, public authService: AuthService) { }

  ngOnInit() {
    // Llama a la función obtenerSociosComerciales() cuando la página se inicialice
    this.obtenerSociosComerciales();
  }


  goBack() {
    this.navCtrl.back();
  }


  async obtenerSociosComerciales() {
    const data = {
      companyId: this.authService.selectedId // Corrige el nombre del parámetro a companyId
    };

    // Realiza la solicitud POST al archivo PHP con los datos proporcionados
    this.http.post('https://siinad.mx/php/searchUserRoles.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          // Maneja la respuesta exitosa aquí si es necesario
          this.sociosComerciales = response.businessPartners;
          console.log('Socios comerciales obtenidos:', response.businessPartners);
        } else {
          // Error en la solicitud, muestra un mensaje de error al usuario
          await this.mostrarToast(response.error, 'danger');
        }
      },
      (error) => {
        // Maneja errores de red u otros errores
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

  async openModal() {
    const usuarioSeleccionado = (document.getElementById('usuario_a_editar') as HTMLSelectElement).value;
    
    // Verifica si hay un usuario seleccionado y si hay socios comerciales cargados
    if (usuarioSeleccionado && this.sociosComerciales.length > 0) {
      const socioComercialSeleccionado = this.sociosComerciales.find(socio => socio.id === usuarioSeleccionado);
    
      const modal = await this.modalController.create({
        component: CambiarRolModalPage,
        componentProps: {
          socioComercial: socioComercialSeleccionado
        }
      });
    
      return await modal.present();
    } else {
      // Muestra un mensaje o realiza alguna acción cuando no haya nada para mostrar en el modal
      await this.mostrarToast('No hay elementos seleccionables para mostrar en el modal.', 'warning');
    }
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
