import { Component } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  public bioText = `Hi, I'm Erin! 👋 
  I've been arranging custom music for DIY music boxes since 2018.
  I run erinmusicbox alongside my career as a software engineer.`;
  public listItems = [
    '📆 Years in the business: 6',
    '🎼 Songs arranged for music box: 1,600+',
    '🙋 YouTube subscribers: 13,300+',
    '💻 YouTube views: 2,191,360+',
    // '⭐️ 5-star ratings on Fiverr: 450',
    //new comment
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
}
