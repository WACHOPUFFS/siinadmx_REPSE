import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Share } from '@capacitor/share';
import { AuthService } from '../auth.service'; // Ajusta la ruta según tu estructura de proyecto

@Component({
  selector: 'app-generate-share-code',
  templateUrl: './generate-share-code.page.html',
  styleUrls: ['./generate-share-code.page.scss'],
})
export class GenerateShareCodePage implements OnInit, OnDestroy {
  employeeName: string;
  employeeId: string;
  generatedCode: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.employeeName = this.authService.username;
    this.employeeId = this.authService.userId;
    this.generatedCode = this.createUniqueCode();
    this.saveCode();
  }

  createUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async saveCode() {
    const data = { employeeId: this.employeeId, code: this.generatedCode };

    this.http.post('https://siinad.mx/php/save-employee-code.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          await this.mostrarToast('Código guardado con éxito.', 'success');
        } else {
          console.error(response.error);
          await this.mostrarToast('Error al guardar el código.', 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al guardar el código.', 'danger');
      }
    );
  }

  async shareCode() {
    await Share.share({
      title: 'Código del Empleado',
      text: `Código del Empleado: ${this.generatedCode}`,
      dialogTitle: 'Compartir Código'
    });
  }

  async mostrarToast(message: string, color: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.color = color;
    toast.duration = 2000;
    document.body.appendChild(toast);
    return toast.present();
  }

  ionViewWillLeave() {
    this.deleteEmployeeCode();
  }

  async deleteEmployeeCode() {
    const data = { employeeId: this.employeeId };

    this.http.post('https://siinad.mx/php/delete-employee-code.php', data).subscribe(
      async (response: any) => {
        if (response.success) {
          console.log('Código eliminado con éxito.');
        } else {
          console.error(response.error);
          await this.mostrarToast('Error al eliminar el código.', 'danger');
        }
      },
      async (error) => {
        console.error('Error en la solicitud POST:', error);
        await this.mostrarToast('Error al eliminar el código.', 'danger');
      }
    );
  }

  ngOnDestroy() {
    this.deleteEmployeeCode();
  }
}
