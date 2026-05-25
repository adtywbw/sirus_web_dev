import { gql } from '@apollo/client/core'

export const POSTS = gql`
  query Posts($keyword: String, $category_id: ID) {
    posts(keyword: $keyword, category_id: $category_id) {
      id
      title
      content
      image_url
      created_at
      author { id username }
    }
  }
`

export const POST = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
      image_url
      created_at
      author { id username }
    }
  }
`

export const CATEGORIES = gql`
  query {
    categories { id name }
  }
`

export const POSTS_ADMIN = gql`
  query PostsAdmin {
    posts { id title created_at author { id username } }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { id username }
    }
  }
`

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user { id username }
    }
  }
`

export const CREATE_POST = gql`
  mutation Create($input: PostInput!) {
    createPost(input: $input) { id }
  }
`

export const UPDATE_POST = gql`
  mutation ($id: ID!, $input: PostUpdateInput!) {
    updatePost(id: $id, input: $input) { id }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) { deletePost(id: $id) }
`
