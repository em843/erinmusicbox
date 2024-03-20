// header.component.ts
import { Component } from '@angular/core';
import { socialLinks } from 'src/app/const/links.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  hasScrolled = false;
  isMenuOpen = false;
  socialLinks = socialLinks;

  navLinks = [
    { name: 'Home', url: '/', active: 'active' },
    { name: 'About', url: '/about', active: '' },
    { name: 'Melody Catalog', url: '/melody-catalog', active: '' },
    { name: 'Blog', url: '/blog', active: '' },
    {
      name: 'Midi Visualizer',
      url: '/midi-visualizer',
      active: '',
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
    this.hasScrolled = scrollPosition > 0;
  }
}
