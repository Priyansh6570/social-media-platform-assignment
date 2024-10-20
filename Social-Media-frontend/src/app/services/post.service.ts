import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { Like } from '../models/like';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5182';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/Post`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/Post/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/Post`, post);
  }

  updatePost(post: Post): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Post/${post.postID}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Post/${id}`);
  }

likePost(postId: number, userId: number): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/Like`, { postId, userId });
}

unlikePost(likeId : number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Like/${likeId}`);
}

GetLikesByPostAndUser(postID: number, userID: number): Observable<Like | null> {
  return this.http.get<Like | null>(`${this.apiUrl}/Like/Post/${postID}/User/${userID}`);
}


getLikeCount(postId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/Like/post/${postId}/count`);
}

getComments(postId: number): Observable<Comment[]> {
  return this.http.get<Comment[]>(`${this.apiUrl}/Comment/post/${postId}`);
}

addComment(postId: number, userId: number, content: string): Observable<Comment> {
  return this.http.post<Comment>(`${this.apiUrl}/Comment`, { postId, userId, content });
}

updateComment(commentId: number, content: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/Comment/${commentId}`, { commentId, content });
}

deleteComment(commentId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Comment/${commentId}`);
}

getPostCountByUser(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/Post/user/${userId}`);
}

getLikeCountByUser(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/Like/user/${userId}/count`);
}

getCommentCountByUser(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/Comment/user/${userId}`);
}
}
