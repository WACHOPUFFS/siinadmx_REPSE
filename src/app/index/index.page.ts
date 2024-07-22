import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    // Verificar si hay un token de sesión guardado en la cookie
    const token = this.cookieService.get('token');

    // Si hay un token, redirigir al usuario a la página de inicio
    if (token) {
      this.router.navigate(['/home']);
    } else {
      // Si no hay token, redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['/login']);
    }
  }
}
