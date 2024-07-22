import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EditarEmpresaModalPage } from '../editar-empresa-modal/editar-empresa-modal.page'; // Asegúrate de tener la ruta correcta
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-companies-info',
  templateUrl: './companies-info.page.html',
  styleUrls: ['./companies-info.page.scss'],
})
export class CompaniesInfoPage implements OnInit {
  companies: any[] = [];
  filteredCompanies: any[] = [];
  searchTerm: string = '';
  searchField: string = 'nameCompany'; // Default search field
  searchPlaceholder: string = 'Buscar...'; // Placeholder por defecto

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private modalController: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.obtenerEmpresas();
  }

  obtenerEmpresas() {
    this.http.get<any[]>('https://siinad.mx/php/companies-info.php')
      .subscribe(
        (data: any[]) => {
          this.companies = data.filter(company => 
            ['adminE', 'adminEE', 'adminPE'].includes(company.levelUserName)
          );
          this.filteredCompanies = [...this.companies];
        },
        (error) => {
          console.error('Error al obtener los datos de las empresas:', error);
          this.mostrarToast('Error al obtener los datos de las empresas.', 'danger');
        }
      );
  }

  filterCompanies() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCompanies = this.companies.filter(company => 
      company[this.searchField].toLowerCase().includes(searchTermLower)
    );
  }

  formatDateInput(event: any) {
    if (this.searchField === 'fecha_inicio' || this.searchField === 'fecha_fin') {
      let input = event.target.value.replace(/-/g, '');
      if (input.length > 4) {
        input = input.slice(0, 4) + '-' + input.slice(4);
      }
      if (input.length > 7) {
        input = input.slice(0, 7) + '-' + input.slice(7);
      }
      this.searchTerm = input;
    } else {
      this.searchTerm = event.target.value;
    }
    this.filterCompanies();
  }

  updatePlaceholder() {
    if (this.searchField === 'fecha_inicio' || this.searchField === 'fecha_fin') {
      this.searchPlaceholder = 'yyyy-mm-dd';
    } else {
      this.searchPlaceholder = 'Buscar...';
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  async editarEmpresa(company: any) {
    const modal = await this.modalController.create({
      component: EditarEmpresaModalPage,
      componentProps: { company: company }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.updatedCompany) {
        // Actualiza la lista de empresas con los datos modificados
        const index = this.companies.findIndex(c => c.id === result.data.updatedCompany.id);
        if (index > -1) {
          this.companies[index] = result.data.updatedCompany;
          this.filterCompanies(); // Filtrar después de la edición
        }
      }
    });

    return await modal.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
