import { Routes } from '@angular/router';
import { MosquesComponent } from './mosques/mosques.component';

export const routes: Routes = [
  { path: '', redirectTo: 'mosques', pathMatch: 'full' },  // Redirect / to /mosques
  { path: 'mosques', component: MosquesComponent },        // Map /mosques to component
  { path: '**', redirectTo: 'mosques' }                    // Catch-all redirect
];