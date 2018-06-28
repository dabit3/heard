import gql from 'graphql-tag'

const createUserMutation = `
  mutation createUser($userId: ID!, $username: String!) {
    createUser(input: {
      userId: $userId
      username: $username
    }) {
      userId
    }
  }
`

const createMessage = gql`
  mutation createMessage($text: String!, $authorId: ID!) {
    createMessage(input:{
      messageInfo: {
        text:  $text
      }
      authorId: $authorId
    }) {
      authorId
      messageInfo {
        text
      }
    }
  }
`

const deleteFollowing = gql`
  mutation deleteFollowing($id: ID!) {
    deleteFollowing(input: {
      id: $id
    }) {
      id
      followingId
    }
  }
`

const createFollowing = gql`
  mutation createFollowing($followerId: ID!, $followingId: ID!) {
    createFollowing(input: {
      followerId: $followerId
      followingId: $followingId
    }) {
      id
    }
  }
`

export {
  createUserMutation,
  createMessage,
  deleteFollowing,
  createFollowing
}