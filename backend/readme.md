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
