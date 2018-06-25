import gql from 'graphql-tag'

const basicUserQuery = `
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      username
      userId
      tweets {
        items {
          author {
            username
          }
          tweetId
          createdAt
          tweetInfo {
            text
          }
        }
      }
    }
  }
`

const listFollowingQuery = gql`
  query listFollowing {
    listFollowing {
      id
      followingId
      followerId
    }
  }
`

const listUsers = gql`
  query listUsers {
    listUsers {
      items {
        userId
        username
      }
    }
  }
`

const getUserQuery = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      username
      userId
      tweets {
        items {
          author {
            username
          }
          tweetId
          createdAt
          tweetInfo {
            text
          }
        }
      }
      following {
        items {
          
          userId
          username
          tweets {
            items {
              author {
                username
              }
              tweetId
              createdAt
              tweetInfo {
                text
              }
            }
          }
        }
      }
    }
  }
`

export {
  basicUserQuery,
  getUserQuery,
  listUsers,
  listFollowingQuery
}