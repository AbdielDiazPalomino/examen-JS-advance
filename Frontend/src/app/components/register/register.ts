import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso ✅';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al registrarse';
        this.successMessage = '';
      },
    });
  }
}
