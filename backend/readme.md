# API_REFERENCE
this api is designed for book store website 
and it's following the RESTFUL API principles   

## API ROUTERS
### user router 
the user router is available in the `/user` endponit 
and it has multi subendpoint 
#### signup endpoint 
this is the first endpoint in the user router and it accessed like ```/user/signup   POST```
the body of the request have to be json and it is like this 

```JSON
{
"firstname": "john",
"lastname": "doe",
"username":"johndoe123"
"email":"example@prov.co"
"password":"some password"
"repassword":"repate the password"
"phonenumber":"+9639900000082"
}
```
##### signup request body constraints 
1. first/last names have to be 2 chars at least and never be empty 
2. email and username have to be unique for every user
3. passwords must be 6 chars at least and must contain one character(a-z)
4. phone number must be a valid syrian republic phone number 

#### login endpoint 
as the signup and every user endpoint it can be accessed like `/user/login  POST` 
the body of the request have to be json 
and it accept the following parameters 
```JSON 
{
"username":"username/email",
"password":"user password"
}
```

#### logout endpoint 
this endpoint is accessaable via `/user/logout  POST`
**NO PARAMETERS REQUIRED**

#### Add Items To Cart endpoint
this endpoint is used to add items to the user cart `/user/cart POST`

and it accepts the following paramerters 
```JSON
{
  "postid": 10,
  "quantity": 1
}
```
> NOTES: 
> this end point accepts the postid which is sent to the client with get posts or get post which will disscussed later

#### Remove Items From Cart endpoint
this endpoint is used to remove single item from the cart `/user/cart DELETE`
it requires only one parameter 
```JSON
{
  "postid": 10
}
```


#### Get cart Items endpoint
this end point is used to get the items in the user cart `/user/cart GET`

**NO PARAMETERS REQUIRED**

#### Get user profile endpoint
this endpoint is used to get the user profile information `/user/ GET`

**NO PARAMETERS REQUIRED**

#### Edit user profile endpoint
this end point is used to edit user details `/user/ PUT`
and its paramters is as follow: 
```JSON
{
  "username": "new user name",
  "email": "new email",
  "password": "new password",
  "phonenumber": "new phone number"
}
```
**Each existed feild will be updated and the rest will stay as before**

#### Remove user endpoint
this end point is used to delete a user profile `/user/ DELETE`
end it requires username to submit the deletion
```JSON
{
  "username": "user username"
}
```
#### Add profile photo endpoint
this endpoint is used to add photo to the user account `/user/photo POST'

the request body have to be [multipart/formdata](https://refine.dev/blog/how-to-multipart-upload/) type
```JSON 
{
  "photo": "a file uploaded using html input type file element"
}
```
**the file have to be an image with image extention**