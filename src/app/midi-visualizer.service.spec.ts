import { TestBed } from '@angular/core/testing';

import { MidiVisualizerService } from './components/midi-visualizer/midi-visualizer.service';

describe('MidiVisualizerService', () => {
  let service: MidiVisualizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidiVisualizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
