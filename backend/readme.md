# API_REFERENCE
This API is designed for a book store website and follows RESTful API principles. 

## API ROUTERS
### User Router 
The user router is available at the `/user` endpoint and has multiple subendpoints. 
#### Signup Endpoint 
This endpoint is used to create a new user account and is accessed via `POST /user/signup`. The request body should be a JSON object with the following parameters: 

```JSON
{
"firstname": "john",
"lastname": "doe",
"username":"johndoe123",
"email":"example@prov.co",
"password":"some password",
"repassword":"repeate the password",
"phonenumber":"+9639900000082"
}
```
##### The following constraints apply to the request body:
- first/last names have to be 2 chars at least and never be empty 
-  email and username have to be unique for every user
- passwords must be 6 chars at least and must contain one character(a-z)
- phone number must be a valid syrian republic phone number 

#### Login Endpoint 
This endpoint is used to authenticate a user and is accessed via `POST /user/login`. The request body should be a JSON object with the following parameters: 

```JSON 
{
"username":"username/email",
"password":"user password"
}
```

#### Logout Endpoint 
This endpoint is used to log out a user and is accessed via `POST /user/logout`. **No parameters are required**.

#### Cart Endpoints
There are several endpoints related to the user's shopping cart:

- `POST /user/cart`: Add an item to the user's cart. The request body should be a JSON object with the following parameters:

```JSON
{
  "postid": 10,
  "quantity": 1
}
```
> Note that the postId parameter should be obtained from the server > > via the /posts endpoint.

- `DELETE /user/cart`: Remove a single item from the user's cart. The request body should be a JSON object with the following parameter:
```JSON
{
  "postid": 10
}
```
- `GET /user/cart`: Get the items in the user's cart.**No parameters are required**.


#### Profile Endpoints
There are several endpoints related to the user's profile:

- `GET /user`: Get the user's profile information.** **No parameters are required**.**

- `PUT /user`: Edit the user's profile information. The request body should be a JSON object with the following parameters:

```JSON
{
  "username": "new user name",
  "email": "new email",
  "phonenumber": "new phone number"
}
```
> Note that each existing field will be updated, and the rest will remain the same.

- `PUT /user/password`: Change the user's password (if the user is logged in). The request body should be a JSON object with the following parameters:

```JSON
{
  "password": "new user password",
  "repassword": "repeat the new password"
}
```
> Note that the new password must be at least 6 characters long and must contain at least one lowercase letter (a-z).

- `DELETE /user`: Delete the user's account. The request body should be a JSON object with the following parameter:

```JSON
{
  "username": "user username"
}
```
- `POST /user/photo`: Add a profile photo to the user's account. The request body should be of type multipart/form-data and include a file input with the name "photo". The file should be an image with a file extension of .jpg, .jpeg, or .png.
```JSON 
{
  "photo": "a file uploaded using html input type file element"
}
```


### Posts Router
The post router is available at the /posts endpoin

#### Create a Post
This endpoint is used to create a new post and is accessed via` POST /posts/post`. The request body should be of type[multipart/formdata](https://refine.dev/blog/how-to-multipart-upload/) and include the following parameters:

```JSON
{
  "title": "post title",
  "content": "post content",
  "price": "book price (must be a number)",
  "categories": "book categories (a comma-separated string of predefined words)",
  "image": "file of type image"
}
```
#### Edit a Post
This endpoint is used to edit an existing post and is accessed via` PUT /posts/post`. The request body should include each existing field that needs to be edited:
```JSON
{
  "title": "post title",
  "content": "postcontent",
  "price": "book price (must be a number)",
  "categories": "book categories (a comma-separated string of predefined words)",
  "image": "file of type image"
}
```

#### Delete a Post
This endpoint is used to delete an existing post and is accessed via `DELETE /posts/post`. The request body should be a JSON object with the following parameter:
```JSON 
{
  "postid":"ID of the post to be deleted",
}
```

#### Get Posts
This endpoint is used to get a list of all posts and is accessed via `GET /posts.` **No parameters are required**. The response will be in JSON format.

#### Get a Post 
This endpoint is used to get a specific post by ID and is accessed via `GET /posts/post`. The request body should be a JSON object with the following parameter:`
```JSON
{
  "postid": "ID of the post to be retrieved",
}
```
#### Add Like to a Post
This endpoint is used to add or remove a like to a post and is accessed via` POST /posts/post/like`. The request body should be a JSON object with the following parameter:

```JSON 
{
  "Postid": "ID of the post to be liked",
}
```

#### Get Categories
This endpoint is used to get a list of all available categories and is accessed via` GET /posts/categories`. **No parameters are required**