export interface Melody {
  title: string;
  url: string;
  description: string;
  type: '15' | '20' | '30';
  created: Date;
  length: number;
  bpm: number;
}
