// header.component.ts
import { Component } from '@angular/core';
import { socialLinks } from 'src/app/const/links.const';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'false',
        style({
          transform: 'translateY(-10%)',
          opacity: 0,
          display: 'none',
        })
      ),
      state(
        'true',
        style({
          transform: 'translateY(0%)',
          opacity: 1,
          display: 'block',
        })
      ),
      transition('false <=> true', animate('300ms ease-in-out')),
    ]),
  ],
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
