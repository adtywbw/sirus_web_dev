export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Category {
  id: string
  name: string
}

export interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
  author: Pick<User, 'id' | 'username'>
  category: Category | null
}

export interface AuthPayload {
  token: string
  user: Pick<User, 'id' | 'username'>
}
