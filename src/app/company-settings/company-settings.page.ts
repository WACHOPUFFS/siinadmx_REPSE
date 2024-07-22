import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.page.html',
  styleUrls: ['./company-settings.page.scss'],
})
export class CompanySettingsPage implements OnInit {

  showSubsections = false;
  permissions: { section: string, subSection: string | null }[] = [];

  constructor(private navCtrl: NavController, public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.loadPermissions();
  }

  goBack() {
    this.navCtrl.back();
  }

  toggleSubsections() {
    this.showSubsections = !this.showSubsections;
  }

  closeOptions() {
    this.showSubsections = false;
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
      return this.permissions.some(perm => perm.section === section && perm.subSection === subSection);
    } else {
      return this.permissions.some(perm => perm.section === section);
    }
  }

  handleOption1() {
    console.log('Opción 1 seleccionada');
    // Aquí puedes agregar la lógica para la opción 1.
  }

  handleOption2() {
    console.log('Opción 2 seleccionada');
    // Aquí puedes agregar la lógica para la opción 2.
  }

}
