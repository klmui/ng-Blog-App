import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

// The square brackets just indicate that it will return a string, doesn't mean an array
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  // Needs to return an observable or promise
  const frObs = Observable.create((observer: Observer) => {
    // loadend has more info than 'load'
    fileReader.addEventListener("loadend", () => {
      // Do the mime-type validation
      
    });
    fileReader.readAsArrayBuffer(file); // Access the mime-type
  });
};
