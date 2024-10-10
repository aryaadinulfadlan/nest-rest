# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts
Headers: Authorization (Token)
Request Body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@doe.com",
  "phone": "080808"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@doe.com",
    "phone": "080808"
  }
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@doe.com",
    "phone": "080808"
  }
}
```

## Update Contact

Endpoint: PUT /api/contacts/:contactId
Headers: Authorization (Token)
Request Body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@doe.com",
  "phone": "080808"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@doe.com",
    "phone": "080808"
  }
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:contactId
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": true
}
```

## Search Contact

Endpoint: GET /api/contacts
Headers: Authorization (Token)
Query Params:

- name: string, first_name / last_name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10
  Response Body (Success):

```json
{
  "data": [
    {
      "id": "cuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@doe.com",
      "phone": "080808"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```
