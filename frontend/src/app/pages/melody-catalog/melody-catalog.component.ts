import { Component } from '@angular/core';
import { Melody } from 'src/app/interfaces/melody.interface';
import { melodies } from './melody-catalog.const';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'app-melody-catalog',
  templateUrl: './melody-catalog.component.html',
})
export class MelodyCatalogComponent {
  filteredMelodies: Melody[] = [...melodies];
  searchTerm = '';
  selectedType = '';

  constructor(private gtag: Gtag) {
    this.gtag.event('screen_view', {
      app_name: 'erinmusicbox',
      screen_name: 'Melody Catalog',
    });
  }

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
      tempMelodies = tempMelodies.filter((melody) =>
        melody.artist
          ? melody.title
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            melody.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
          : melody.title.toLowerCase().includes(this.searchTerm.toLowerCase())
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
