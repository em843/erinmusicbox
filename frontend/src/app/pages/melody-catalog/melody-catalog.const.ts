import { Melody } from 'src/app/interfaces/melody.interface';

export const melodies: Melody[] = [
  {
    title: 'Merry-Go-Round of Life',
    artist: "Howl's Moving Castle",
    url: 'merry-go-round-of-life.mp3',
    description:
      "I'm absolutely in love with this tune. Wonder why I haven't done it sooner?",
    type: '30',
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
