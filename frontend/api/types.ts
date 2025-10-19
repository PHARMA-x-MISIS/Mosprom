export interface UserCreate {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  patronymic?: string | null;
  description?: string | null;
  contact?: string | null;
  place_of_job?: string | null;
  place_of_study?: string | null;
  skills?: string[];
}

export interface UserRead {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  patronymic?: string | null;
  description?: string | null;
  contact?: string | null;
  place_of_job?: string | null;
  place_of_study?: string | null;
  profile_photo?: string | null;
  vk_avatar?: string | null;
  skills: string[];
  communities: any[]; // Swagger указывает `items: { type: 'string' }`, но это может быть неточно
}

export interface UserUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string | null;
  description?: string | null;
  contact?: string | null;
  place_of_job?: string | null;
  place_of_study?: string | null;
  skills?: string[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
}

// --- Типы для секции Communities ---
export interface CommunityCreate {
  title: string;
  description?: string | null;
  is_official?: boolean;
  skills?: string[];
}

export interface CommunityRead {
  id: number;
  title: string;
  owner_id: number;
  created_at: string;
  description?: string | null;
  is_official: boolean;
  avatar_url?: string | null;
  cover_url?: string | null;
  updated_at?: string | null;
  member_count: number;
  moderator_count: number;
  skills: string[];
}

export interface CommunityUpdate {
  title?: string | null;
  description?: string | null;
  is_official?: boolean | null;
  skills?: string[] | null;
}

export interface CommunityModeratorAdd {
  user_id: number;
}

// --- Типы для секции Posts ---
export interface PostCreate {
  text: string;
  community_id?: number | null;
  skills?: string[];
  photo_urls?: string[];
}

export interface PostRead {
  id: number;
  text: string;
  author_id: number;
  created_at: string;
  community_id?: number | null;
  updated_at?: string | null;
  skills: string[];
  photo_urls: string[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
}

export interface PostUpdate {
  text?: string | null;
  skills?: string[] | null;
}

export interface LikeResponse {
  liked: boolean;
  like_count: number;
}

// --- Типы для секции Comments ---
export interface CommentCreate {
  text: string;
  post_id: number;
  parent_comment_id?: number | null;
}

export interface CommentRead {
  id: number;
  text: string;
  author_id: number;
  post_id: number;
  created_at: string;
  parent_comment_id?: number | null;
  updated_at?: string | null;
  replies: CommentRead[];
}

export interface CommentUpdate {
  text?: string | null;
}

// --- Типы для VK Auth ---
export interface VKAuthRequest {
  code: string;
}

export interface VKAuthResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
}