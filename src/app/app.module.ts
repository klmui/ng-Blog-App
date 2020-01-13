// Features for app
// Don't forget to run "ng add @angular/material"
// Angular imports here
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; // Added
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule } from '@angular/forms'; // Added
import { ReactiveFormsModule } from '@angular/forms'; // Reactive-driven rather than template-driven
import { HttpClientModule } from "@angular/common/http";
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule
} from '@angular/material'; // Unlocks all of the input related components

import { AppRoutingModule } from './app-routing.module';

// Components - 3 steps to adding a component. Import it, declare it, and put it in the app.component.html file
import { AppComponent } from './app.component';
// Doesn't need .ts. Put the class inside the object
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent, // Added
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // Added,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
