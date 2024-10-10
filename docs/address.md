# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:contactId/addresses
Headers: Authorization (Token)
Request Body:

```json
{
  "street": "jalan contoh", // optional
  "city": "kota", // optional
  "province": "provinsi", // optional
  "country": "negara",
  "postal_code": "080808"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "street": "jalan contoh",
    "city": "kota",
    "province": "provinsi",
    "country": "negara",
    "postal_code": "080808"
  }
}
```

## Get Address

Endpoint: GET /api/contacts/:contactId/addresses/:addressId
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "street": "jalan contoh",
    "city": "kota",
    "province": "provinsi",
    "country": "negara",
    "postal_code": "080808"
  }
}
```

## Update Address

Endpoint: PUT /api/contacts/:contactId/addresses/:addressId
Headers: Authorization (Token)
Request Body:

```json
{
  "street": "jalan contoh", // optional
  "city": "kota", // optional
  "province": "provinsi", // optional
  "country": "negara",
  "postal_code": "080808"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": "cuid",
    "street": "jalan contoh",
    "city": "kota",
    "province": "provinsi",
    "country": "negara",
    "postal_code": "080808"
  }
}
```

## Remove Address

Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": true
}
```

## List Address

Endpoint: GET /api/contacts/:contactId/addresses
Headers: Authorization (Token)
Response Body (Success):

```json
{
  "data": [
    {
      "id": "cuid",
      "street": "jalan contoh",
      "city": "kota",
      "province": "provinsi",
      "country": "negara",
      "postal_code": "080808"
    },
    {
      "id": "cuid",
      "street": "jalan contoh",
      "city": "kota",
      "province": "provinsi",
      "country": "negara",
      "postal_code": "080808"
    }
  ]
}
```
