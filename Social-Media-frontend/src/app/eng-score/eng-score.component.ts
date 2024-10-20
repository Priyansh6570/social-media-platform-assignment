import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-eng-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eng-score.component.html',
  styleUrls: ['./eng-score.component.css']
})
export class EngScoreComponent implements OnInit {
  users: any[] = [];
  userScores: { userName: string, score: number }[] = [];
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.calculateEngagementScores();
    });
  }

  calculateEngagementScores(): void {
    const scoreRequests = this.users.map(user => {
      const postCount$ = this.postService.getPostCountByUser(user.userID);
      const likeCount$ = this.postService.getLikeCountByUser(user.userID);
      const commentCount$ = this.postService.getCommentCountByUser(user.userID);

      return forkJoin([postCount$, likeCount$, commentCount$]).pipe(
        map(([postCount, likeCount, commentCount]) => {
          const score = (postCount * 5) + (likeCount * 2) + (commentCount * 3);
          return { userName: user.userName, score };
        })
      );
    });

    forkJoin(scoreRequests).subscribe(userScores => {
      this.userScores = userScores;
      this.userScores.sort((a, b) => b.score - a.score);
      this.isLoading = false;
    });
  }
}
