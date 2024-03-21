import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
})
// @Injectable()
export class BlogComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: WindowEventMap['resize']) {
    const windowWidth = (event.target as Window).innerWidth;
    this.setIframeStyle(windowWidth);
  }

  iframeStyle = {
    height: `calc(100vh - ' + 170 + 'px - ' + 24 + 'px)`,
  };

  setIframeStyle(windowWidth: number) {
    if (windowWidth >= 640) {
      // Tailwind's 'sm' breakpoint
      this.iframeStyle = {
        height: 'calc(100vh - ' + 170 + 'px - ' + 24 + 'px)', // For larger screens
      };
    } else {
      this.iframeStyle = {
        height: 'calc(100vh - ' + 140 + 'px - ' + 24 + 'px)', // For smaller screens
      };
    }
  }
}
