import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MosqueService } from '../mosque.service';
import { Mosque } from './mosque.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MosqueDetailsComponent } from '../mosque-details/mosque-details.component';

@Component({
  selector: 'app-mosques',
  standalone: true,
  imports: [CommonModule, FormsModule, MosqueDetailsComponent],
  templateUrl: './mosques.component.html',
})
export class MosquesComponent {
  mosques: Mosque[] = [];
  filteredMosques: Mosque[] = [];
  searchQuery: string = '';
  filters = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    juma: false,
  };
  selectedMosque: Mosque | null = null;

  newMosque: Mosque = {
    name: '',
    location: '',
    timings: {
      fajr: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: '',
      juma: '',
    },
  };
  isEditing = false;

  sortBy: string = 'name';  // Sort by name, location, or other criteria
  sortOrder: 'asc' | 'desc' = 'asc'; // Default to ascending order

  constructor(
    private mosqueService: MosqueService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMosques();
  }

  loadMosques() {
    this.mosqueService.getMosques().subscribe((mosques: Mosque[]) => {
      this.mosques = mosques;
      this.filteredMosques = mosques; 
      this.applySorting(); // Apply sorting after fetching the mosques
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin(); // This will call the isAdmin method from AuthService
  }

  applySorting() {
    this.filteredMosques.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (this.sortBy === 'location') {
        comparison = a.location.localeCompare(b.location);
      } else {
        // Sorting by timings
        comparison = this.compareTimings(a, b);
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  compareTimings(a: Mosque, b: Mosque): number {
    const timeA = a.timings[this.sortBy as keyof typeof a.timings];
    const timeB = b.timings[this.sortBy as keyof typeof b.timings];
    
    // If the timings are empty, treat them as the lowest value (earliest time)
    const timeAInMinutes = this.convertTimeToMinutes(timeA);
    const timeBInMinutes = this.convertTimeToMinutes(timeB);
    
    return timeAInMinutes - timeBInMinutes;
  }
  
  convertTimeToMinutes(time: string): number {
    if (!time) return -1; // If time is empty, consider it as the lowest
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  searchMosques() {
    if (!this.selectedMosque) { 
      this.filteredMosques = this.mosques.filter((mosque) =>
        (mosque.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          mosque.location.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
        this.filterByTimings(mosque) // Filter by timings
      );
      this.applySorting(); // Apply sorting after search
    }
  }
  
  filterByTimings(mosque: Mosque): boolean {
    const timings = mosque.timings;
    return (
      (this.filters.fajr ? timings.fajr !== '' : true) &&
      (this.filters.dhuhr ? timings.dhuhr !== '' : true) &&
      (this.filters.asr ? timings.asr !== '' : true) &&
      (this.filters.maghrib ? timings.maghrib !== '' : true) &&
      (this.filters.isha ? timings.isha !== '' : true) &&
      (this.filters.juma ? timings.juma !== '' : true)
    );
  }

  filterTimings() {
    if (!this.selectedMosque) {
      this.filteredMosques = this.mosques.filter((mosque) =>
        (this.filters.fajr ? mosque.timings.fajr !== '' : true) &&
        (this.filters.dhuhr ? mosque.timings.dhuhr !== '' : true) &&
        (this.filters.asr ? mosque.timings.asr !== '' : true) &&
        (this.filters.maghrib ? mosque.timings.maghrib !== '' : true) &&
        (this.filters.isha ? mosque.timings.isha !== '' : true) &&
        (this.filters.juma ? mosque.timings.juma !== '' : true)
      );
    }
  }

  editMosque(mosque: Mosque): void {
    if (this.authService.isAdmin()) {
      this.newMosque = { ...mosque };
      this.isEditing = true;
    }
  }

  addOrUpdateMosque(): void {
    if (this.isEditing && this.newMosque._id) {
      this.mosqueService.updateMosque(this.newMosque._id, this.newMosque).subscribe(
        (updatedMosque) => {
          const index = this.mosques.findIndex(m => m._id === updatedMosque._id);
          if (index > -1) {
            this.mosques[index] = updatedMosque;
            this.searchMosques();
          }
          this.resetForm();
        },
        (error) => console.error('Error updating mosque:', error)
      );
    } else {
      this.mosqueService.addMosque(this.newMosque).subscribe(
        (addedMosque) => {
          this.mosques.push(addedMosque);
          this.searchMosques();
          this.resetForm();
        },
        (error) => console.error('Error adding mosque:', error)
      );
    }
  }

  resetForm(): void {
    this.newMosque = {
      name: '',
      location: '',
      timings: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', juma: '' },
    };
    this.isEditing = false;
  }

  deleteMosque(id: string) {
    if (this.authService.isAdmin()) {
      this.mosqueService.deleteMosque(id).subscribe(() => {
        this.mosques = this.mosques.filter((mosque) => mosque._id !== id);
        this.searchMosques();
      });
    }
  }

  viewMosqueDetails(mosque: Mosque): void {
    this.selectedMosque = mosque;
    this.router.navigate(['/mosque-details', mosque._id]);
  }

  goBack(): void {
    this.selectedMosque = null;
    this.router.navigate(['/mosques']);
  }

  // Sorting handler
  changeSortOrder(event: Event) {
    const target = event.target as HTMLSelectElement; // Type-cast the event target
    const value = target.value;
    
    if (this.sortBy === value) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = value;
      this.sortOrder = 'asc';
    }
    
    this.applySorting();
  }
}