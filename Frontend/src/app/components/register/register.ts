import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Reniec } from '../../services/reniec';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  dni = '';
  fullName = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private reniecService: Reniec
  ) {}

  consultarDNI() {
    if (this.dni.length !== 8) {
      this.errorMessage = 'El DNI debe tener 8 dígitos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.reniecService.consultarDNI(this.dni).subscribe({
      next: (response) => {
        this.fullName = response.full_name;
        this.username = (response.first_name.toLowerCase().replace(/\s+/g, '') + 
                        response.first_last_name.toLowerCase()).replace(/\s+/g, '');
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al consultar el DNI';
        this.isLoading = false;
      }
    });
  }

  register() {
    if (!this.fullName) {
      this.errorMessage = 'Por favor, consulta un DNI válido primero';
      return;
    }

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
