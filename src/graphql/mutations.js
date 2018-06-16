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

export {
  createUserMutation
}