const getUserQuery = `
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
  getUserQuery
}