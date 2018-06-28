import gql from 'graphql-tag'

const basicUserQuery = `
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      username
      userId
      messages {
        items {
          author {
            username
          }
          messageId
          createdAt
          messageInfo {
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
      messages {
        items {
          author {
            username
          }
          messageId
          createdAt
          messageInfo {
            text
          }
        }
      }
      following {
        items {
          
          userId
          username
          messages {
            items {
              author {
                username
              }
              messageId
              createdAt
              messageInfo {
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