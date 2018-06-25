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

2. In index.js on line 11, change `<YOURAPPSYNCENDPOINT>` to the endpoint given to you when you created the AppSync API.

3. Create the following Schema:

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

4. Create the following DynamoDB Tables

- TweetTable
- TwitterFollowingTable
- TwitterUserTable

5. Add the following indexes:

- In TweetTable, create an `authorId-index` with the `authorId` as the primary / partition key.
- In TwitterFollowingTable, create a `followingId-index` with the `followingId` as the primary / partition key.
- In TwitterFollowingTable, create a `followerId-index` with the `followerId` as the primary / partition key.

__To create an index, click on the table you would like to create an index on, click on the `indexes` tab, then click _Create Index_ __

6. Create the following resolvers:

#### Query getUser(...): User: TwitterUserTable

```js
// request mapping template
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
    "userId": $util.dynamodb.toDynamoDBJson($ctx.args.userId),
  },
}

// response mapping template
$util.toJson($context.result)
```

#### Query listUsers(...): ListUserConnection: TwitterUserTable

```js
// request mapping template
{
    "version" : "2017-02-28",
    "operation" : "Scan",
    "limit": $util.defaultIfNull(${ctx.args.limit}, 20),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.nextToken, null))
}

// response mapping template
$util.toJson($ctx.result.items)
```

#### Query listFollowing: [Following]: TwitterFollowingTable

```js
// request mapping template
{
    "version" : "2017-02-28",
    "operation" : "Scan",
}

// response mapping template
$util.toJson($ctx.result.items)
```

#### Mutation createFollowing(...): Following: TwitterFollowingTable

```js
// request mapping template
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
     ## If object "id" should come from GraphQL arguments, change to $util.dynamodb.toDynamoDBJson($ctx.args.id)
    "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(#id)",
    "expressionNames": {
      "#id": "id",
    },
  },
}

// response mapping template
$util.toJson($context.result)
```

#### Mutation deleteFollowing(...): Following: TwitterFollowingTable

```js
// request mapping template
{
  "version": "2017-02-28",
  "operation": "DeleteItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
  },
}

// response mapping template
$util.toJson($context.result)
```

#### Mutation createUser(...): User: TwitterUserTable

```js
// request mapping template
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "userId": $util.dynamodb.toDynamoDBJson($ctx.args.input.userId),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(#userId)",
    "expressionNames": {
      "#userId": "userId",
    },
  },
}

// response mapping template
$util.toJson($context.result)
```

#### Mutation createTweet(...): Tweet: TweetTable

```js
// request mapping template
#set($time = $util.time.nowISO8601())

#set($attribs = $util.dynamodb.toMapValues($ctx.args.input))
#set($attribs.createdAt = $util.dynamodb.toDynamoDB($time))
#set($attribs.tweetId = $util.dynamodb.toDynamoDB($util.autoId()))

{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "authorId": $util.dynamodb.toDynamoDBJson($ctx.args.input.authorId),
    "createdAt": $util.dynamodb.toDynamoDBJson($time),
  },
  "attributeValues": $util.toJson($attribs),
  "condition": {
    "expression": "attribute_not_exists(#authorId) AND attribute_not_exists(#createdAt)",
    "expressionNames": {
      "#authorId": "authorId",
      "#createdAt": "createdAt",
    },
  },
}

// response mapping template
$util.toJson($context.result)
```

#### User following(...): UserFollowingConnection: TwitterFollowingTable

```js
// request mapping template
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

// response mapping template
## Pass back the result from DynamoDB. **
## $util.qr($util.error($ctx.result))
$util.toJson($ctx.result)
```

#### UserFollowingConnection items: [User]: TwitterUserTable

```js
// request mapping template
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

// response mapping template
## Pass back the result from DynamoDB. **
$util.toJson($ctx.result.data.TwitterUserTable)
#if( ! ${ctx.result.data} )
  $util.toJson($ctx.result.items)
#else
  $util.toJson($ctx.result.data.TwitterUserTable)
#end

## $util.toJson($ctx.result.data.TwitterUserTable)
```