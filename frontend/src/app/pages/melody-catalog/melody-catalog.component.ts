import { Component } from '@angular/core';
import { Melody } from 'src/app/interfaces/melody.interface';

@Component({
  selector: 'app-melody-catalog',
  templateUrl: './melody-catalog.component.html',
})
export class MelodyCatalogComponent {
  melodies: Melody[] = [
    {
      title: 'Melody 1',
      url: 'url_to_melody_1.mp3',
      description: 'Description 1',
      type: '15',
      created: new Date(),
      length: 100,
      bpm: 80,
    },
    {
      title: 'Melody 2',
      url: 'url_to_melody_2.mp3',
      description: 'Description 2',
      type: '30',
      created: new Date(),
      length: 100,
      bpm: 90,
    },
  ];
  filteredMelodies: Melody[] = [...this.melodies];
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
    console.log('applying filters');

    let tempMelodies = this.melodies;

    if (this.searchTerm) {
      tempMelodies = tempMelodies.filter(
        (melody) =>
          melody.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          melody.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
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
