import { Component } from '@angular/core';
import { UnderlineDirective } from './underline.directive';
import { CalcService, MockCalcService, MockCalcServiceForChild } from './calc.service';
import { ChildComponent } from './child/child.component';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: CalcService, useClass: MockCalcService }],
  viewProviders: [{ provide: CalcService, useClass: MockCalcServiceForChild }],

  animations: [
    trigger('staggerAnim', [
      transition('0 => *', [
        query(':enter', [
          style({
            transform: 'translateX(-100%)',
          }),
          stagger(100, animate(500, style({
            transform: 'translateX(0)',
          })))
        ])
      ])
    ]),
  ]
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

  list = [];

  foo = new FormControl();
  group: FormGroup;

  constructor(private calcService: CalcService, private fb: FormBuilder) {
    this.group = this.fb.group({
      hoge: ['aa', Validators.required]
    });
  }

  onSubmit() {
    console.warn({a: this.foo, b: this.group.value});
  }

  clickButton($event) {
    const val = this.calcService.add(1, 2);
    console.log(val);
    console.log($event);
  }

  showAlert(person: any) {
    alert(person.name);
  }

  changeDetectionTest() {
    this.profile.name = 'unko';  // OnPushになっているので子コンポーネントは再描画されない
    // this.profile = {id: 9, name: 'unko'};  // OnPushになっていても子コンポーネントは再描画される
  }

  showList() {
    if (this.list.length) {
      this.list = [];
    } else {
      this.list = [1, 2, 3, 4, 5];
    }
  }
}
