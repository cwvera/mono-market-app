import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { LoadingService } from './core/services/loading.service';

/**
 * Shell raíz de la aplicación: toolbar, barra de progreso global y el router.
 * @summary Único componente que vive fuera de `features/`; no contiene
 * lógica de negocio.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loading = inject(LoadingService);
}
