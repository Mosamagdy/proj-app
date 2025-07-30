export interface Data {
    message: string;
    paginationInfo: PaginationInfo;
    posts: Post[];
  }
  
  export interface PaginationInfo {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    total: number;
  }
  
  export interface Post {
    id: string;
    body?: string;
    image?: string;
    user: User;
    createdAt: Date;
    comments: Comment[];
  }
  
  export interface User {
    id: string;
    name: string;
  }
  
  export interface Comment {
    id: string;
    body: string;
    user: User;
    createdAt: Date;
  }
  export interface PostDetails {
    id: string;
    user: {
        name: string;
        image?: string;
    };
    image?: string;
    body: string;
    createdAt: string;
}