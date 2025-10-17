import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        alert('Inicio de sesión exitoso ✅');
        localStorage.setItem('token', res.token);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas';
      },
    });
  }
}
