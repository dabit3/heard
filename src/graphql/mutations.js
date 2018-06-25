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

const createTweet = gql`
  mutation createTweet($text: String!, $authorId: ID!) {
    createTweet(input:{
      tweetInfo: {
        text:  $text
      }
      authorId: $authorId
    }) {
      authorId
      tweetInfo {
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
  createTweet,
  deleteFollowing,
  createFollowing
}