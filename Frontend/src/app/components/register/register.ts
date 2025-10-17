import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 agrega esto
  templateUrl: './register.html',
  styleUrls: ['./register.css']
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
