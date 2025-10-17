import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes'; // aquí importas tus rutas

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Frontend');
}

// 🔥 Bootstrap de la aplicación (reemplaza al app.module.ts)
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule, HttpClientModule),
  ],
}).catch((err) => console.error(err));
