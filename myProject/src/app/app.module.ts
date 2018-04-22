import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { SimpleComponent } from './simple/simple.component';
import { UnderlineDirective } from './underline.directive';
import { CalcService } from './calc.service';
import { ChildComponent } from './child/child.component';


// const router: Routes = [
//   { path: '', component: AppComponent },
//   { path: 'simple', component: SimpleComponent }
// ];

@NgModule({
  declarations: [
    AppComponent,
    SimpleComponent,
    UnderlineDirective,
    ChildComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    // RouterModule.forRoot(router)
  ],
  providers: [CalcService],
  bootstrap: [AppComponent, SimpleComponent]
})
export class AppModule { }
