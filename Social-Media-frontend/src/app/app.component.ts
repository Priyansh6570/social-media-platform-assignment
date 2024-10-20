import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { PostComponent } from './post/post.component';
import { FeedComponent } from './feed/feed.component';
import { EngScoreComponent } from './eng-score/eng-score.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, PostComponent, NavbarComponent, FeedComponent, EngScoreComponent]
})
export class AppComponent {
  title = 'Social Media Platform';
}
