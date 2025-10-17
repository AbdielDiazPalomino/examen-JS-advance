import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 agrega esto
  templateUrl: './login.html',
  styleUrls: ['./login.css']
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
