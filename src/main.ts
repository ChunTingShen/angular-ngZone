import 'zone.js/dist/zone';
import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
    <br>
    <br>
    <p>
      <label> Name: </label>
      <input type="text" [(ngModel)]="name" >
    </p>
    <p>
      <label> Count: </label> {{ count }}
    </p>
    
    <button (click)='withinZone()'>Within Angular Zone</button>
    <button (click)='outsideZone()'>Outside Angular Zone</button>
    <br>
    <button (click)='clear()'>Clear Logs</button>
    <button (click)='c()'>This is an Empty Event</button>



  `,
})
export class App {
  name = 'NgZone';
  count = 0;

  lastLoginTime = '';

  constructor(private zone: NgZone) {
    // 1. onUnstable: new event is triggered
    this.zone.onUnstable.subscribe(() => {
      console.log('onUnstable: Adding some code to queue...');
    });

    // 2. run the code and show the result

    // 3. onMicrotaskEmpty: current task queue is empty
    this.zone.onMicrotaskEmpty.subscribe(() => {
      console.log('onMicrotaskEmpty: Queue is empty now');
    });

    // 4. onStable: finished
    this.zone.onStable.subscribe(() => {
      console.log('onStable: Finished!');
    });

    // (not shown here) onError: will notifies that an error has been delivered.
  }

  withinZone() {
    this.count = 0;
    let i = 1;
    const token = setInterval(() => {
      i++;
      this.count += 1;

      console.log(this.count);
      if (i >= 10) {
        clearInterval(token);
      }
    }, 1000);
  }

  outsideZone() {
    this.count = 100;
    // Count is update to 100 since it is "inside" Angular zone.
    // But the following code will not update the UI, since it is "runOutsideAngular":

    this.zone.runOutsideAngular(() => {
      let i = 1;
      const token = setInterval(() => {
        i++;
        this.count += 1;
        console.log(this.count);
        if (i >= 10) {
          clearInterval(token);
        }
      }, 1000);
    });
  }

  clear() {
    console.clear();
    console.log('cleared!');

    this.name = 'hihihi';
    // Name will be updated as "hihihi" as soon as we click it.

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.name = 'Hello';
        this.count = 9999;

        // Name and count will NOT be updated because no Change Detection is triggered.
        // If we click something else (eg Empty event), then name will be updated.

        console.log('I said: Hello!');
      }, 2000);
    });
  }

  c() {}
}

bootstrapApplication(App);
