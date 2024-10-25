import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular'; 
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.page.html',
  styleUrls: ['./edit-roles.page.scss'],
})
export class EditRolesPage implements OnInit {
  sociosComerciales: any[] = [];
  rolesDisponibles: any[] = []; // Ahora se cargan desde el backend
  usuarioSeleccionado: string = '';
  socioComercialSeleccionado: any = null;
  nuevoRol: string = ''; // Capturará el id del rol

  constructor(
    private navCtrl: NavController, 
    private http: HttpClient, 
    private toastController: ToastController, 
    public authService: AuthService
  ) { }

  ngOnInit() {
    // Llama a la función obtenerSociosComerciales y obtenerRoles() cuando la página se inicialice
    this.obtenerSociosComerciales();
    this.obtenerRoles(); // Nueva función para obtener roles desde el backend
  }

  goBack() {
    this.navCtrl.back();
  }

  async obtenerSociosComerciales() {
    const data = {
      association_id: this.authService.selectedId // Cambia el parámetro por association_id
    };

    // Realiza la solicitud GET al archivo PHP con el parámetro association_id
    this.http.get('https://siinad.mx/php/getBusinessPartner.php', { params: data }).subscribe(
      async (response: any) => {
        if (response.length > 0) {
          this.sociosComerciales = response;
        } else {
          await this.mostrarToast('No se encontraron socios comerciales', 'warning');
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud:', error);
        this.mostrarToast('Error al realizar la solicitud', 'danger');
      }
    );
  }

  async obtenerRoles() {
    // Realiza la solicitud GET para obtener los roles desde el backend
    this.http.get('https://siinad.mx/php/getRoles.php').subscribe(
      (response: any) => {
        this.rolesDisponibles = response; // Asigna los roles obtenidos desde el backend
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
        this.mostrarToast('Error al obtener los roles', 'danger');
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

  mostrarDatosSocioComercial() {
    this.socioComercialSeleccionado = this.sociosComerciales.find(socio => socio.businessPartnerId === this.usuarioSeleccionado);
  }

  async actualizarRol() {
    const data = {
      companyId: this.authService.selectedId, 
      socioComercialId: this.socioComercialSeleccionado.businessPartnerId,
      nuevoRol: this.nuevoRol // Se pasa el id del rol seleccionado
    };

    // Realiza la solicitud POST al archivo PHP para actualizar el rol
    this.http.post('https://siinad.mx/php/saveUserRoles.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          this.mostrarToast(response.message, 'success');
        } else {
          this.mostrarToast(response.error || 'Error al actualizar el rol', 'danger');
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud:', error);
        this.mostrarToast('Error al realizar la solicitud', 'danger');
      }
    );
  }
}
