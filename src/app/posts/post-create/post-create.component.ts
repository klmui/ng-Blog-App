import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

// Use kebab case dash separated words when creating name

// Decorator (@) turns it into a component that Angular can understand
@Component({
  // selector allows us to use that component
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  // name can be anything, this is a property (variable)
  enteredTitle = '';
  enteredContent = '';
  postCreated = new EventEmitter<Post>(); // Decorator (@Output) makes it possible to listen to this from app.component.html (parent)
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup; // Form group groups all of the controls of a form

  // Connect to service
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {} // ActivatedRoute gives us info about the route we're on

  // Change routing while using same component
  ngOnInit() {
    this.form = new FormGroup({
      // Initial value is null
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // postId identifier is from the app-routing.module
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // Show spinner. Also add in template
        this.isLoading = true;
        // The subscribe happens at the same time as the spinner
        this.postsService.getPost(this.postId).subscribe(postData => {
          // Hide spinner
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        });
        // Initialize post incase we got a loaded post
        this.form.setValue({
          'title': this.post.title,
          'content': this.post.content
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    }); // On built-in observables, we don't need to unsub. Listen to changes and use same component, but change URL
  }

  // Method triggered upon event
  // Can take an argument such as form: NgForm
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost (
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    // this.postCreated.emit(post); not required because of service
    this.form.reset();
  }
}
