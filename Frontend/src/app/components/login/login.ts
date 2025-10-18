import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
  this.authService.login(this.username, this.password).subscribe({
    next: (res: any) => {
      this.successMessage = 'Inicio de sesión exitoso ✅';

      // Guarda el token correcto (el access)
      this.authService.saveToken(res.access);

      // Redirige después de un pequeño delay
      setTimeout(() => this.router.navigate(['/administracion']), 800);
    },
    error: () => {
      this.errorMessage = 'Credenciales inválidas ❌';
    },
  });
}

}
