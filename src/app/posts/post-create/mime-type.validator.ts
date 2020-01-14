// Validate an img (JPG or PNG)

import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

// The square brackets just indicate that it will return a string, doesn't mean an array
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  // Needs to return an observable or promise
  const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    // loadend has more info than 'load'
    fileReader.addEventListener('loadend', () => {
      // Do the mime-type validation

      // Parse mime-type with 8 bit unsigned array
      // Look into jpg file and make sure that it's actually jpg
      // Infer filetype
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);

      let header = "";
      let isValid = false;
      // Look into pattern
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16); // Convert to hex string
      }
      // Check for certain patterns (filetype)
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        // obserser.next emits a new value (null)
        // return is emit in oberservables
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete(); // Let any subscribers know we're done
    });
    fileReader.readAsArrayBuffer(file); // Access the mime-type
  });
  return frObs; // File-reader observable
};
