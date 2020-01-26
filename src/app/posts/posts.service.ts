// Option 1: Put services in the providers array in app.module.ts
// Option 2: @Injectable and import from angular core
// If you print to the console here, it prints to the browser console

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // Inject http client to use it
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // Making the Post array immuttable by providing a deep copy of it
    // return [...this.posts];  Since posts is a ref type, we can put brackets around it to return its contents (next gen TS and JS feature)
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    // Pipe will help us keep the format of id and set it equal to _id in DB
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      }); // http uses observables. We need to subscribe. New data, errors, on completion
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); // Can't emit with asObservable
  }

  // Make sure there is no error when refreshing while editing a post
  getPost(id: string) {
    // Will subscribe in post-create.component.ts
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post) // path, data
      .subscribe((responseData) => {
        // Successful response from server side
        const id = responseData.postId;
        post.id = id; // Updates id from null
        this.posts.push(post); // Stores posts locally
        this.postsUpdated.next([...this.posts]); // Pushes whatever is in the argument
        this.router.navigate(['/']); // Go back to root route when done
      });
  }

  // Call backend and the payload is post
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post; // Find the post with the oldPostIndex
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]) // Let app know about change
        this.router.navigate(['/']); // Go back to root route when done
      });
  }

  // Make sure to call this service function in the ts file and call the ts file function in the html file
  deletePost(postId: string) {
    // Need to subscribe to the event to actually be sent
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // When you click delete, it will happen without having to reload the page
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }
}
