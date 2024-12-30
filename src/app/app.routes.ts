import { Routes } from '@angular/router';
import { MosquesComponent } from './mosques/mosques.component';
import { MosqueDetailsComponent } from './mosque-details/mosque-details.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: MosquesComponent },
  { path: 'mosque/:id', component: MosqueDetailsComponent },
  { path: 'login', component: LoginComponent },  // Ensure this path exists
  { path: '**', redirectTo: '' }
];