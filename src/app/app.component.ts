// File for logic
import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // TS syntax for saying that Post is an array
  // storedPosts: Post[] = [];
  // onPostAdded(post) {
  //   this.storedPosts.push(post);
  // }
}
