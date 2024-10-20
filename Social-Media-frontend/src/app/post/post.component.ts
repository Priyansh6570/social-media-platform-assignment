import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../models/post';
import { User } from '../models/user';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

const bannedWords = ["monolith", "spaghettiCode", "goto", "hack", "architrixs", "quickAndDirty", "cowboy", "yo", "globalVariable", "recursiveHell", "backdoor", "hotfix", "leakyAbstraction", "mockup", "singleton", "silverBullet", "technicalDebt"];



@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})

export class PostComponent implements OnInit {
  posts: Post[] = [];
  newPost: Post = { postID: 0, userID: 0, content: '' };
  editPost: Post | null = null;
  selectedUser: User | null = null;
  
  constructor(private postService: PostService, private userService: UserService) {}
  
  ngOnInit(): void {
    this.userService.selectedUser$.subscribe(user => {
      this.selectedUser = user;
      this.loadPosts();
    });
  }
  
  containsBannedWords(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return bannedWords.some(word => lowerContent.includes(word.toLowerCase()));
  }
  loadPosts(): void {
    if (this.selectedUser) {
      this.postService.getPosts().subscribe(posts => {
        this.posts = posts.filter(post => post.userID === this.selectedUser?.userID);
      });
    }
  }

  addPost(): void {
    if (this.containsBannedWords(this.newPost.content)) {
      alert("Your post contains banned words. Please remove them to proceed.");
      return;
    }
    if (this.selectedUser) {
      this.newPost.userID = this.selectedUser.userID;
      this.postService.createPost(this.newPost).subscribe(post => {
        this.posts.push(post);
        this.newPost.content = '';
      });
    }
  }

  updatePost(): void {
    if (this.editPost && this.containsBannedWords(this.editPost.content)) {
      alert("Your updated post contains banned words. Please remove them to proceed.");
      return;
    }
    if (this.editPost) {
      this.postService.updatePost(this.editPost).subscribe(() => {
        this.loadPosts();
        this.editPost = null;
      });
    }
  }

  deletePost(id: number): void {
    this.postService.deletePost(id).subscribe(() => this.loadPosts());
  }

  setEditPost(post: Post): void {
    this.editPost = { ...post };
  }

  clearEditPost(): void {
    this.editPost = null;
  }

}
