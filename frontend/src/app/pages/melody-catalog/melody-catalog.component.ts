import { Component } from '@angular/core';
import { Melody } from "../../interfaces/melody.interface"

@Component({
  selector: 'app-melody-catalog',
  templateUrl: './melody-catalog.component.html',
})
export class MelodyCatalogComponent {
  melodies = [
    {
      title: 'Melody 1',
      description: 'Description 1',
      url: 'url_to_melody_1.mp3',
    },
    {
      title: 'Melody 2',
      description: 'Description 2',
      url: 'url_to_melody_2.mp3',
    },
    // Add more melodies as needed
  ];
  filteredMelodies = [...this.melodies];

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredMelodies = this.melodies.filter(
      (melody) =>
        melody.title.toLowerCase().includes(searchTerm) ||
        melody.description.toLowerCase().includes(searchTerm)
    );
  }

  onFilterChange(event: any, filterType: string) {
    const filterValue = event.target.value;
    if (!this.isKeyOfMelody(filterType)) {
      console.error(`${filterType} is not a key of Melody`);
      return;
    }
    this.filteredMelodies = this.melodies.filter(
      (melody) => melody[filterType] === filterValue || filterValue === ''
    );
  }

  isKeyOfMelody(key: any): key is keyof Melody {
    return ['title', 'description', 'url', 'genre', 'mood'].includes(key);
  }
}
