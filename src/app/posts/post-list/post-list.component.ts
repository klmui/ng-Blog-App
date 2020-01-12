import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is the first post\'s content'},
  //   {title: 'Second post', content: 'This is the second post\'s content'},
  //   {title: 'Third post', content: 'This is the third post\'s content'},
  // ];
  posts: Post[] = []; // With the decorator (@input), we can bind to posts from the parent component
  // postsService: PostsService; Just use public in front of postsService for this component
  isLoading = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  // Angular will automatically run it
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(); // Trigger http request
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      }); // subscribe takes 3 args. Firsts get excecuted whenever data is added, second is when an error is emitted, third is when observable is completed
  }

  // Make sure to use make a function in the service page
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  // Called whenever this component is about to get destroyed
  ngOnDestroy() {
    this.postsSub.unsubscribe(); // Prevents memory leaks
  }
}
