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
    length: 108,
    bpm: 60,
  },
  {
    title: 'Here Comes the Sun',
    artist: 'The Beatles',
    url: 'here-comes-the-sun.mp3',
    type: '15',
    created: new Date(),
    length: 64,
    bpm: 60,
  },
];
