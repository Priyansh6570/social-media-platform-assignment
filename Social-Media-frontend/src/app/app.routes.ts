import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { FeedComponent } from './feed/feed.component';
import { EngScoreComponent } from './eng-score/eng-score.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: "Post", component: PostComponent},
    { path: "Feed", component: FeedComponent},
    { path: "ues", component: EngScoreComponent}
];
