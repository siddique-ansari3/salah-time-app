import { Component } from '@angular/core';
import { MosquesComponent } from './mosques/mosques.component';

@Component({
  selector: 'app-root',
  template: '<app-mosques></app-mosques>', // Use the MosquesComponent selector here
  standalone: true,
  imports: [MosquesComponent],
})
export class AppComponent {}