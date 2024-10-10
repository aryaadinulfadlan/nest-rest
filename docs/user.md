# User API Spec

## Register

Endpoint: POST /api/users/register
Request Body:

```json
{
  "username": "username",
  "password": "password",
  "name": "Name"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "username",
    "name": "Name"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Username already registered"
}
```

## Login

Endpoint: POST /api/users/login
Request Body:

```json
{
  "username": "username",
  "password": "password"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "username",
    "name": "Name",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Username or password is wrong"
}
```

## Get

Endpoint: GET /api/users/current
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": {
    "username": "username",
    "name": "Name"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Unauthorized"
}
```

## Update

Endpoint: PATCH /api/users/current
Headers: Authorization (Token)
Request Body:

```json
{
  "password": "password", // optional
  "name": "Name" // optional
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "username",
    "name": "Name"
  }
}
```

Response Body (Failed):

```json
{
  "errors": "Update Failed"
}
```

## Logout

Endpoint: DELETE /api/users/current
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": true
}
```

Response Body (Failed):

```json
{
  "errors": true
}
```
