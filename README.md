# Heard - An enterprise React Native Social Messaging App

### Built with AWS AppSync & AWS Amplify

![](https://imgur.com/Kqmdwdy.jpg)

### Todo

- [ ] Add subscriptions for real time updates / messages in feed
- [ ] Update resolvers to also pull in follower data to reduce the amount of client side code + logic needed to identify follower / following information
- [ ] Add user profile section
- [ ] Add "follower" tab

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

3. Attach the following Schema:

```graphql
input CreateFollowingInput {
	id: ID
	followerId: ID!
	followingId: ID!
}

input CreateMessageInput {
	messageId: ID
	authorId: ID!
	createdAt: String
	messageInfo: MessageInfoInput!
	author: UserInput
}

input CreateUserInput {
	userId: ID!
	username: String!
}

input DeleteFollowingInput {
	id: ID!
}

input DeleteMessageInput {
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
	createMessage(input: CreateMessageInput!): Message
	updateMessage(input: UpdateMessageInput!): Message
	deleteMessage(input: DeleteMessageInput!): Message
	createUser(input: CreateUserInput!): User
	updateUser(input: UpdateUserInput!): User
	deleteUser(input: DeleteUserInput!): User
	createFollowing(input: CreateFollowingInput!): Following
	updateFollowing(input: UpdateFollowingInput!): Following
	deleteFollowing(input: DeleteFollowingInput!): Following
}

type Query {
	getMessage(authorId: ID!, createdAt: String!): Message
	listMessages(first: Int, after: String): MessageConnection
	listFollowing: [Following]
	getUser(userId: ID!): User
	listUsers(first: Int, after: String): ListUserConnection
	queryMessagesByAuthorIdIndex(authorId: ID!, first: Int, after: String): MessageConnection
}

type Subscription {
	onCreateMessage(messageId: ID, authorId: ID, createdAt: String): Message
		@aws_subscribe(mutations: ["createMessage"])
	onUpdateMessage(messageId: ID, authorId: ID, createdAt: String): Message
		@aws_subscribe(mutations: ["updateMessage"])
	onDeleteMessage(messageId: ID, authorId: ID, createdAt: String): Message
		@aws_subscribe(mutations: ["deleteMessage"])
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

type Message {
	messageId: ID!
	authorId: ID!
	messageInfo: MessageInfo!
	author: User
	createdAt: String
}

type MessageConnection {
	items: [Message]
	nextToken: String
}

type MessageInfo {
	text: String!
}

input MessageInfoInput {
	text: String!
}

input UpdateFollowingInput {
	id: ID!
	followerId: ID
	followingId: ID
}

input UpdateMessageInput {
	messageId: ID
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
	messages(limit: Int, nextToken: String): MessageConnection
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

- HeardMessageTable
- HeardFollowingTable
- HeardUserTable

5. Add the following indexes:

- In HeardMessageTable, create an `authorId-index` with the `authorId` as the primary / partition key.
- In HeardFollowingTable, create a `followingId-index` with the `followingId` as the primary / partition key.
- In HeardFollowingTable, create a `followerId-index` with the `followerId` as the primary / partition key.

__To create an index, click on the table you would like to create an index on, click on the `indexes` tab, then click _Create Index_ .__

6. Create the following resolvers:

#### Message author: User: HeardUserTable

```js
// request mapping template
{
    "version": "2017-02-28",
    "operation": "GetItem",
    "key": {
        "userId": $util.dynamodb.toDynamoDBJson($ctx.source.authorId),
    }
}

// response mapping template
$util.toJson($ctx.result)
```

#### ListUserConnection items: [User]: HeardUserTable

```js
// request mapping template
{
    "version" : "2017-02-28",
    "operation" : "Scan",
}

// response mapping template
$util.toJson($ctx.result.items)
```

#### Query getUser(...): User: HeardUserTable

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

#### Query listUsers(...): ListUserConnection: HeardUserTable

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

#### Query listFollowing: [Following]: HeardFollowingTable

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
                "S" : "${ctx.identity.sub}"
            }
        }
    }
}

// response mapping template
$util.toJson($ctx.result.items)
```

#### Query queryMessagesByAuthorIdIndex(...): MessageConnection: HeardMessageTable

```js
// request mapping template
{
  "version": "2017-02-28",
  "operation": "Query",
  "query": {
    "expression": "#authorId = :authorId",
    "expressionNames": {
      "#authorId": "authorId",
    },
    "expressionValues": {
      ":authorId": $util.dynamodb.toDynamoDBJson($ctx.args.authorId),
    },
  },
  "index": "authorId-index",
  "limit": $util.defaultIfNull($ctx.args.first, 20),
  "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.after, null)),
  "scanIndexForward": true,
  "select": "ALL_ATTRIBUTES",
}

// response mapping template
$util.toJson($context.result)
```

#### Mutation createFollowing(...): Following: HeardFollowingTable

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

#### Mutation deleteFollowing(...): Following: HeardFollowingTable

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

#### Mutation createUser(...): User: HeardUserTable

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

#### Mutation createMessage(...): Message: HeardMessageTable

```js
// request mapping template
#set($time = $util.time.nowISO8601())

#set($attribs = $util.dynamodb.toMapValues($ctx.args.input))
#set($attribs.createdAt = $util.dynamodb.toDynamoDB($time))
#set($attribs.messageId = $util.dynamodb.toDynamoDB($util.autoId()))

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

#### User messages(...): MessageConnection: HeardMessageTable

```js
// request mapping template
{
    "version" : "2017-02-28",
    "operation" : "Query",
    "index" : "authorId-index",
    "query" : {
        "expression": "authorId = :id",
        "expressionValues" : {
            ":id" : {
                "S" : "${ctx.source.userId}"
            }
        }
    },
    "limit": $util.defaultIfNull(${ctx.args.first}, 20),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.after, null))
}

// response mapping template
$util.toJson($ctx.result)
```

#### User following(...): UserFollowingConnection: HeardFollowingTable

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

#### UserFollowingConnection items: [User]: HeardUserTable

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
        "HeardUserTable": {
           "keys": $util.toJson($ids),
           "consistentRead": true
       }
    }
}

// response mapping template
## Pass back the result from DynamoDB. **
#if( ! ${ctx.result.data} )
  $util.toJson([])
#else
  $util.toJson($ctx.result.data.HeardUserTable)
#end

## $util.toJson($ctx.result.data.HeardUserTable)
```