import { Component } from '@angular/core';
import { UnderlineDirective } from './underline.directive';
import { CalcService } from './calc.service';
import { ChildComponent } from './child/child.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  a = 2;
  b = 3;
  c = 'Hello';
  d = 'Angular';
  e = true;
  isDisabled = true;
  imagePath = 'assets/icon.png';
  isBold = true;

  model = 'two way';

  profile = {
    id: 9, name: 'Hoge foo'
  };

  constructor(private calcService: CalcService) { }

  clickButton($event) {
    const val = this.calcService.add(1, 2);
    console.log(val);
    console.log($event);
  }

  showAlert(person: any) {
    alert(person.name);
  }
}
