import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mosque } from '../mosques/mosque.model';

@Component({
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  selector: 'app-mosque-details',
  templateUrl: './mosque-details.component.html',
})
export class MosqueDetailsComponent {
  @Input() mosque!: Mosque;
}