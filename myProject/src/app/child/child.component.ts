import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy  } from '@angular/core';
import { CalcService } from '../calc.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class.red]': 'isRed',
    '(click)': 'click($event)',
    '(window:resize)': 'click($event)'  // こういうことも出来る。
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('onOff', [
      state('on', style({opacity: 1})),
      state('off', style({opacity: 0})),
      transition('on <=> off', [ animate('.5s') ])
    ])
  ]
})
export class ChildComponent implements OnInit {

  @Input() person: any;
  @Output() selected = new EventEmitter();

  onOff: string;

  isRed = false;

  constructor(private calcService: CalcService) { }

  ngOnInit() {
    console.log(this.calcService.add(1, 2));
  }

  click(person): any {
    this.isRed = !this.isRed;
    console.log(person);
    this.selected.emit(person);
  }

  click2() {
    this.person.name = 'unko';  // OnPushにしても、同一コンポーネント内で変更するとUI再描画する
  }

  clickOnOff() {
    if (this.onOff === 'on') {
      this.onOff = 'off';
    } else {
      this.onOff = 'on';
    }
  }

}
