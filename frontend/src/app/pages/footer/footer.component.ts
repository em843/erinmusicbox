import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  //NOTE: We don't do this anymore for reasons
  //@see: https://stackoverflow.com/questions/2390230/do-copyright-dates-need-to-be-updated
  // currentYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {}
}
