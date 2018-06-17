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

export {
  createUserMutation,
  createTweet
}