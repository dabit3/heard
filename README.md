# Enterprise React Native Twitter Clone

### Built with AWS AppSync & AWS Amplify

![](https://imgur.com/Kqmdwdy.jpg)

# Getting Started

## Cloning the project & creating the services

1. Clone the project

```bash
git clone 
```

2. Install dependencies

```bash
yarn
# or
npm install
```

3. Create new AWS Mobile Project

```bash
awsmobile init
```

4. Add Authentication service

```bash
awsmobile user-signin enable
```

5. Push configuration to AWS Mobile Hub

```
awsmobile push
```

## Configuring the AWS AppSync API

1. Create & configure a new AppSync API

- Visit the [AWS AppSync](https://console.aws.amazon.com/appsync/home) console and create a new API.
- In Settings, set the Auth mode to Amazon Cognito User Pool and choose the user pool created in the initial service creation.

2. Create the following Schema:

```graphql
input CreateFollowingInput {
	id: ID
	followerId: ID!
	followingId: ID!
}

input CreateTweetInput {
	tweetId: ID
	authorId: ID!
	createdAt: String
	tweetInfo: TweetInfoInput!
	author: UserInput
}

input CreateUserInput {
	userId: ID!
	username: String!
}

input DeleteFollowingInput {
	id: ID!
}

input DeleteTweetInput {
	authorId: ID!
	createdAt: String!
}

input DeleteUserInput {
	userId: ID!
}

type Following {
	id: ID
	followerId: ID!
	followingId: ID!
}

type FollowingConnection {
	items: [Following]
	nextToken: String
}

type ListUserConnection {
	items: [User]
	nextToken: String
}

type Mutation {
	createTweet(input: CreateTweetInput!): Tweet
	updateTweet(input: UpdateTweetInput!): Tweet
	deleteTweet(input: DeleteTweetInput!): Tweet
	createUser(input: CreateUserInput!): User
	updateUser(input: UpdateUserInput!): User
	deleteUser(input: DeleteUserInput!): User
	createFollowing(input: CreateFollowingInput!): Following
	updateFollowing(input: UpdateFollowingInput!): Following
	deleteFollowing(input: DeleteFollowingInput!): Following
}

type Query {
	getTweet(authorId: ID!, createdAt: String!): Tweet
	listTweets(first: Int, after: String): TweetConnection
	listFollowing: [Following]
	getUser(userId: ID!): User
	listUsers(first: Int, after: String): ListUserConnection
	queryTweetsByAuthorIdIndex(authorId: ID!, first: Int, after: String): TweetConnection
}

type Subscription {
	onCreateTweet(tweetId: ID, authorId: ID, createdAt: String): Tweet
		@aws_subscribe(mutations: ["createTweet"])
	onUpdateTweet(tweetId: ID, authorId: ID, createdAt: String): Tweet
		@aws_subscribe(mutations: ["updateTweet"])
	onDeleteTweet(tweetId: ID, authorId: ID, createdAt: String): Tweet
		@aws_subscribe(mutations: ["deleteTweet"])
	onCreateUser(userId: ID, username: String): User
		@aws_subscribe(mutations: ["createUser"])
	onUpdateUser(userId: ID, username: String): User
		@aws_subscribe(mutations: ["updateUser"])
	onDeleteUser(userId: ID, username: String): User
		@aws_subscribe(mutations: ["deleteUser"])
	onCreateFollowing(id: ID, followerId: ID, followingId: ID): Following
		@aws_subscribe(mutations: ["createFollowing"])
	onUpdateFollowing(id: ID, followerId: ID, followingId: ID): Following
		@aws_subscribe(mutations: ["updateFollowing"])
	onDeleteFollowing(id: ID, followerId: ID, followingId: ID): Following
		@aws_subscribe(mutations: ["deleteFollowing"])
}

type Tweet {
	tweetId: ID!
	authorId: ID!
	tweetInfo: TweetInfo!
	author: User
	createdAt: String
}

type TweetConnection {
	items: [Tweet]
	nextToken: String
}

type TweetInfo {
	text: String!
}

input TweetInfoInput {
	text: String!
}

input UpdateFollowingInput {
	id: ID!
	followerId: ID
	followingId: ID
}

input UpdateTweetInput {
	tweetId: ID
	authorId: ID!
	createdAt: String!
}

input UpdateUserInput {
	userId: ID!
	username: String
}

type User {
	userId: ID!
	username: String
	tweets(limit: Int, nextToken: String): TweetConnection
	# following(limit: Int, nextToken: String): UserFollowingConnection
	####### following(limit: Int, nextToken: String): UserFollowingConnection
	following(limit: Int, nextToken: String): UserFollowingConnection
	followers(limit: Int, nextToken: String): UserFollowersConnection
}

type UserConnection {
	items: [User]
	nextToken: String
}

type UserFollowersConnection {
	items: [User]
	nextToken: String
}

type UserFollowingConnection {
	items: [User]
	nextToken: String
}

input UserInput {
	userId: ID!
	username: String!
}
```

3. Create the following DynamoDB Tables

- TweetTable
- TwitterFollowingTable
- TwitterUserTable

3. Configure the following special resolvers:

User following(...): UserFollowingConnection: TwitterFollowingTable

```js
{
    "version" : "2017-02-28",
    "operation" : "Query",
    "index" : "followerId-index",
    "query" : {
        "expression": "followerId = :id",
        "expressionValues" : {
            ":id" : {
                "S" : "${ctx.source.userId}"
            }
        }
    }
    ## ,
    ## "limit": $util.defaultIfNull(${ctx.args.first}, 20),
    ## "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.after, null))
}
```

UserFollowingConnection items: [User]: TwitterUserTable

```js
## UserFollowingConnection.items.request.vtl **
 
#set($ids = [])
#foreach($following in ${ctx.source.items})
    #set($map = {})
    $util.qr($map.put("userId", $util.dynamodb.toString($following.get("followerId"))))
    $util.qr($ids.add($map))
#end
 
{
    "version" : "2018-05-29",
    "operation" : "BatchGetItem",
    "tables" : {
        "TwitterUserTable": {
           "keys": $util.toJson($ids),
           "consistentRead": true
       }
    }
}
```