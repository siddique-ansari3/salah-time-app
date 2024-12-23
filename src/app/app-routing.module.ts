import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MosquesComponent } from './mosques/mosques.component';
import { MosqueDetailsComponent } from './mosque-details/mosque-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/mosques', pathMatch: 'full' },
  { path: 'mosques', component: MosquesComponent },
  { path: 'mosque/:id', component: MosqueDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }