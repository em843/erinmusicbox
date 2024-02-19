import { Component } from '@angular/core';
import { Melody } from 'src/app/interfaces/melody.interface';
import { melodies } from './melody-catalog.const';

@Component({
  selector: 'app-melody-catalog',
  templateUrl: './melody-catalog.component.html',
})
export class MelodyCatalogComponent {
  filteredMelodies: Melody[] = [...melodies];
  searchTerm = '';
  selectedType = '';

  onSearch(event: any) {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.applyFilters();
  }

  applyFilters() {
    let tempMelodies = melodies;

    if (this.searchTerm) {
      tempMelodies = tempMelodies.filter(
        (melody) =>
          melody.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        // ||
        // melody.artist
        //   .toLowerCase()
        //   .includes(this.searchTerm.toLowerCase())
        // TODO search by artist also
      );
    }
    if (this.selectedType) {
      tempMelodies = tempMelodies.filter(
        (melody) => melody.type === this.selectedType
      );
    }
    this.filteredMelodies = tempMelodies;
  }
}
