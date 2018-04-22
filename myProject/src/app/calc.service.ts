import { Injectable } from '@angular/core';

@Injectable()
export class CalcService {

  constructor() { }

  add(a: number, b: number): number {
    return a + b;
  }

}

@Injectable()
export class MockCalcService {

  constructor() { }

  add(a: number, b: number): number {
    return 100;
  }

}

@Injectable()
export class MockCalcServiceForChild {

  constructor() { }

  add(a: number, b: number): number {
    return 9999;
  }

}
