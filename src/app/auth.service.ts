import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  username: string;
  userId: string;
  avatar: string;
  principalCompanies: {id:string, name: string, role: string, rfc: string, levelUser: string }[] = [];
  nonPrincipalCompanies: {id:string, name: string, role: string, rfc: string, status: string, levelUser: string }[] = [];
  selectedId: string = '';
  selectedCompany: string = '';
  selectedRFC: string = '';
  selectedLevelUser: string = '';
  selectedRole: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { 
    // Verificar el estado de la sesión al cargar la aplicación
    this.isLoggedIn = this.checkAuthStatus();
    if (this.isLoggedIn) {
      this.username = this.cookieService.get('username');
      this.userId = this.cookieService.get('userId');
      this.loadMappedPrincipalCompanies();
    }
  } 

  login(username: string, userId:string, avatar:string, principalCompanies: any[]) {
    this.isLoggedIn = true;
    this.username = username;
    this.userId= userId;
    this.avatar = avatar;

    // Guarda el estado de la sesión en cookies
    this.cookieService.set('isLoggedIn', 'true');
    this.cookieService.set('username', username);
    this.cookieService.set('userId', userId);

    // Mapear las empresas principales
    this.principalCompanies = principalCompanies.map(company => ({
      id:  company.id,
      name: company.name,
      role: company.role,
      rfc: company.rfc,
      levelUser: company.levelUser
    }));

    console.log('Empresas principales almacenadas:', this.principalCompanies);
    console.log('Empresas no principales almacenadas:', this.nonPrincipalCompanies);
  }

  setNonPrincipalCompanies(companies: any[]) {
    this.nonPrincipalCompanies = companies.map(company => ({
      id:  company.id,
      name: company.name,
      role: company.role,
      rfc: company.rfc,
      status: company.status,
      levelUser: company.levelUser
    }));
    console.log('Empresas no principales almacenadas:', this.nonPrincipalCompanies);
  }

  checkAuthStatus(): boolean {
    const isLoggedIn = this.cookieService.get('isLoggedIn');
    return isLoggedIn === 'true';
  }

  logout() {
    this.isLoggedIn = false;
    this.username = '';
    this.userId= '';
    this.principalCompanies = [];
    this.nonPrincipalCompanies = [];
    this.selectedCompany = '';
    this.selectedRFC = '';
    this.selectedLevelUser = '';
    this.selectedRole = '';

    // Elimina las cookies al cerrar sesión
    this.cookieService.deleteAll();

    console.log('Empresas principales limpiadas:', this.principalCompanies);
    console.log('Empresas no principales limpiadas:', this.nonPrincipalCompanies);
    console.log('Empresa seleccionada limpia:', this.selectedCompany);
  }

  // Método para cargar las empresas principales mapeadas guardadas en la cookie
  loadMappedPrincipalCompanies() {
    const mappedPrincipalCompaniesString = this.cookieService.get('mappedPrincipalCompanies');
    if (mappedPrincipalCompaniesString) {
      const mappedPrincipalCompanies = JSON.parse(mappedPrincipalCompaniesString);
      this.principalCompanies = mappedPrincipalCompanies;
      console.log('Empresas principales cargadas desde la cookie:', this.principalCompanies);
    }
  }
}
