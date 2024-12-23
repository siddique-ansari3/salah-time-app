import { Component } from '@angular/core';
import { MosquesComponent } from './mosques/mosques.component';

@Component({
  selector: 'app-root',
  template: '<app-mosques></app-mosques>',
  imports: [MosquesComponent],
})
export class AppComponent {}