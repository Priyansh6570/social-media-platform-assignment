import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';

const bannedWords = ["monolith", "spaghettiCode", "goto", "hack", "architrixs", "quickAndDirty", "cowboy", "yo", "globalVariable", "recursiveHell", "backdoor", "hotfix", "leakyAbstraction", "mockup", "singleton", "silverBullet", "technicalDebt"];

@Component({
  selector: 'app-feed',
  standalone: true,
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  imports: [CommonModule, FormsModule]
})

export class FeedComponent implements OnInit {
  posts: any[] = [];
  selectedUser: User | null = null;
  newCommentContent: string = '';

  constructor(private postService: PostService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.selectedUser$.subscribe(user => {
      this.selectedUser = user;
      this.loadAllPosts();
    });
  }

  containsBannedWords(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return bannedWords.some(word => lowerContent.includes(word.toLowerCase()));
  }

  loadAllPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts.map(post => ({
        ...post,
        showComments: false,
        likeCount: 0,
        commentCount: 0,
        comments: []
      }));
      
      this.userService.getUsers().subscribe(users => {
        this.posts.forEach(post => {
          const author = users.find(user => user.userID === post.userID);
          post.userName = author ? author.userName : 'Unknown User';
        });
        this.posts.forEach(post => {
          this.postService.getComments(post.postID).subscribe(comments => {
            post.commentCount = comments.length;
            post.comments = comments.map(comment => {
              const commenter = users.find(user => user.userID === comment.userID);
              return {
                ...comment,
                userName: commenter ? commenter.userName : 'Unknown User'
              };
            });
          });
        });
      });
      
      this.posts.forEach(post => {
        this.postService.getLikeCount(post.postID).subscribe(count => post.likeCount = count);
      });
    });
  }
  

  likePost(postID: number): void {
    if (this.selectedUser) {
      this.postService.GetLikesByPostAndUser(postID, this.selectedUser.userID).subscribe({
        next: (like) => {
          if (like) {
            this.postService.unlikePost(like.likeID).subscribe(() => {
              const post = this.posts.find(p => p.postID === postID);
              if (post) {
                post.likeCount--;
              }
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.postService.likePost(postID, this.selectedUser!.userID).subscribe(() => {
              const post = this.posts.find(p => p.postID === postID);
              if (post) post.likeCount++;
            });
          } else console.error("An unexpected error occurred:", err);
        }
      });
    }
  }

  toggleComments(post: any): void {
    this.posts.forEach(p => {
      if (p !== post) {
        p.showComments = false;
      }
    });
    post.showComments = !post.showComments;
    if (post.showComments && post.comments.length === 0) {
      this.postService.getComments(post.postID).subscribe(comments => {
        post.comments = comments;
      });
    }
  }

  addComment(postID: number): void {
    if (this.containsBannedWords(this.newCommentContent)) {
      alert("Your comment contains banned words. Please remove them to proceed.");
      return;
    }
    if (this.selectedUser && this.newCommentContent.trim()) {
      this.postService.addComment(postID, this.selectedUser.userID, this.newCommentContent).subscribe(comment => {
        const post = this.posts.find(p => p.postID === postID);
        if (post) {
          post.comments.push(comment);
          post.commentCount++;
        }
        this.newCommentContent = '';
      });
    }
  }

  editComment(comment: any): void {
    const updatedContent = prompt('Edit Comment', comment.content);
    if (updatedContent !== null && this.containsBannedWords(updatedContent)) {
      alert("Your updated comment contains banned words. Please remove them to proceed.");
      return;
    }
    if (updatedContent !== null) {
      this.postService.updateComment(comment.commentID, updatedContent).subscribe(() => {
        comment.content = updatedContent;
      });
    }
  }

  deleteComment(comment: any, post: any): void {
      this.postService.deleteComment(comment.commentID).subscribe(() => {
        const commentIndex = post.comments.indexOf(comment);
        if (commentIndex > -1) {
          post.comments.splice(commentIndex, 1);
          post.commentCount--;
        }
      });
  }
}