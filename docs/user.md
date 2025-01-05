# User API Spec

## Create User API

Endpoint : POST /api/users

Request Body : 

```json
{
    "email" : "bambang@gmail.com",
    "password" : "rahasia123",
    "name" : "Bambang Pamungkas"
}
```

Reponse Body Success : 
    
```json
{
    "success" : true,
    "data" : {
        "email" : "bambang@gmail.com",
        "name" : "Bambang Pamungkas"
    },
    "message" : "User berhasil terdaftar"
}
```
Response Body Error : 

```json
{
    "success" : false,
    "message" : "Email sudah digunakan",
    "data" : {}
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body : 

```json
{
    "email" : "bambang@gmail.com",
    "password" : "rahasia123"
}
```

Response Body Success : 

```json
{
    "success" : true,
    "data" : {
        "token" : "jwt-token"
    },
    "message" : "Login berhasil"
}
```

Request Body Error : 

```json
{
    "success" : false,
    "message" : "Password salah",
    "data" : {}
}
```

## Update User API

Endpoint : FETCH /api/users

Headers : 
- Authorization : token

Request Body : 

```json
{
    "name" : "Bambang Baru", //optional
    "password" : "password baru" //optional
}
```

Response Body Success : 

```json
{
    "success" : true,
    "data" : {
        "username" : "bambang@gmail.com",
        "name" : "Bambang Baru",
    },
    "message": "User berhasil diperbarui"
}
```

Response Body Error : 

```json
{
    "success" : false,
    "message" : "Panjang nama maksimal 100 karakter",
    "data" : {}
}
```

## Get User API

Endpoint : GET /api/users/:id

Response Body Success : 

```json
{
    "success" : true,
    "data" : {
        "email" : "bambang@gmail.com",
        "name" : "Bambang Baru"
    },
    "message" : "User berhasil didapatkan"
}
```

Response Body Error : 

```json
{
    "success" : false,
    "message" : "User tidak ditemukan",
    "data" : {}
}
```

## Logout User API

Endpoint : POST /api/users/logout

Headers : 
- Authorization : token

Response Body Success : 

```json
{
    "success" : true,
    "data" : {},
    "message" : "Logout berhasil"
}
```

Response Body Error : 

```json
{
    "success" : false,
    "message" : "Unauthorized",
    "data" : {}
}
```

## Forgot Password User API

Endpoint : POST /api/users/forget-password

Request Body : 

```json
{
    "email" : "bambang@gmail.com"
}
```

Response Body Success : 

```json
{
    "success" : true,
    "data" : {
        "email" : "bambang@gmail.com"
    },
    "message" : "Reset password telah dikirim ke email anda"
}
```

Response Body Error : 

```json
{
    "success" : false,
    "message" : "Email tidak ditemukan",
    "data" : {}
}
```

## Reset Password User API

Endpoint : POST /api/users/reset-password

Query Params
- token: string, required

Request Body : 

```json
{
    "password" : "password_baru"
}
```

Response Body Success : 

```json
{
    "success" : true,
    "data" : {
        "email" : "bambang@gmail.com"
    },
    "message" : "Reset password berhasil"
}
```

Response Body Error : 

```json
{
    "success" : false,
    "message" : "invalid signature",
    "data" : {}
}
```