// header.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  
  socialLinks = [
    { name: 'YouTube', label: 'Watch', url: 'https://www.youtube.com/c/erinmusicbox/', icon: 'assets/youtube.svg'},
    { name: 'Ko-Fi', label: 'Say Thanks', url: 'https://ko-fi.com/erinmusicbox', icon: 'assets/ko-fi.svg' },
    { name: 'Fiverr', label: 'Commission', url: 'https://www.fiverr.com/erinmusicbox/arrange-any-song-for-your-diy-music-box-8343', icon: 'assets/fiverr.svg' },
    { name: 'Music Box Maniacs', label: 'Listen', url: 'https://musicboxmaniacs.com/people/erinmusicbox/', icon: 'assets/mbm-logo.png' }
  ];
  
}
