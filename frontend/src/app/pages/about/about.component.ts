import { Component } from '@angular/core';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  public listItems = [
    '📆 Years in the business: 6',
    '🎼 Songs arranged for music box: 1,600+',
    '🙋 YouTube subscribers: 13,300+',
    '💻 YouTube views: 2,191,400+',
    // '⭐️ 5-star ratings on Fiverr: 450',
    // making a new change here for deployment reasons
  ];

  public socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/erinmurphy843/',
      icon: 'assets/linkedin.svg',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/em843/',
      icon: 'assets/github.svg',
    },
  ];

  constructor(private gtag: Gtag) {
    this.gtag.event('screen_view', {
      app_name: 'erinmusicbox',
      screen_name: 'About',
    });
  }
}
