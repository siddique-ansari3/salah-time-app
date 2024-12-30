import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MosquesComponent } from './mosques/mosques.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterOutlet]
})
export class AppComponent {}