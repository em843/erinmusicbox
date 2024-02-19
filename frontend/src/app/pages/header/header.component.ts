// header.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  hasScrolled = false;
  isMenuOpen = false;
  socialLinks = [
    {
      name: 'YouTube',
      label: 'Watch',
      url: 'https://www.youtube.com/c/erinmusicbox/',
      icon: 'assets/youtube.svg',
    },
    {
      name: 'Ko-Fi',
      label: 'Say Thanks',
      url: 'https://ko-fi.com/erinmusicbox',
      icon: 'assets/ko-fi.svg',
    },
    {
      name: 'Fiverr',
      label: 'Commission',
      url: 'https://www.fiverr.com/erinmusicbox/arrange-any-song-for-your-diy-music-box-8343',
      icon: 'assets/fiverr.svg',
    },
    {
      name: 'Music Box Maniacs',
      label: 'Listen',
      url: 'https://musicboxmaniacs.com/people/erinmusicbox/',
      icon: 'assets/mbm-logo.png',
    },
  ];

  ngOnInit(): void {
    window.addEventListener('scroll', this.onWindowScroll.bind(this), true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll.bind(this), true);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onWindowScroll() {
    const scrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log(scrollPosition);
    this.hasScrolled = scrollPosition > 0;
  }
}
