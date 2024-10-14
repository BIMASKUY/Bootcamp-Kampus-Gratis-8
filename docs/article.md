# Article API Spec

## Create Article API

Endpoint : POST /api/articles

Headers : 
- Authorization : token

Request Body : 

```json
{
    "title" : "Tutorial Backend KG",
    "content" : "Langkah awal..."
}
```

Reponse Body Success : 

```json
{
    "success" : true,
    "data" : {
        "title" : "Tutorial Backend KG",
        "content" : "Langkah awal...",
        "author" : "Aryo",
        "likedBy" : [],
        "comments" : []
    },
    "message" : "Artikel berhasil dibuat"
}
```
Response Body Error : 

```json
{
    "success" : false,
    "message" : "Panjang title maksimal 100 karakter",
    "data": {}
}
```

## Get Articles API

Endpoint : GET /api/articles

Response Body Success : 

```json
{
    "data" : [
    {
        "title" : "Tutorial Backend KG",
        "author" : "Aryo",
        "likes" : ["mulyono", "fufufafa"],
        "comments" : ["artikelnya keren", "artikelnya membantu"]
    },
    {
        "title" : "Tutorial Daftar KG",
        "author" : "John",
        "likes" : ["budi", "hermansyah"],
        "comments" : ["artikel bermanfaat, kampusnya keren"]
    }
    ],
    "message" : "Artikel berhasil didapatkan"
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
    "data" : {
        "token" : "jwt-token"
    },
    "message" : "Login berhasil"
}
```

Request Body Error : 

```json
{
    "errors" : "Username atau password salah"
}
```

## Update User API

Endpoint : FETCH /api/users/update

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
    "errors" : "Panjang nama maksimal 100 karakter"
}
```

## Get User API

Endpoint : GET /api/users

Headers :
- Authorization : token

Response Body Success : 

```json
{
    "data" : {
        "email" : "bambang@gmail.com",
        "name" : "Bambang Baru"
    },
    "message" : "Data anda berhasil didapatkan"
}
```

Response Body Error : 

```json
{
    "errors" : "Unauthorized"
}
```

Response Body Error : 

```json
{
    "errors" : "User tidak ditemukan"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers : 
- Authorization : token

Response Body Success : 

```json
{
    "data" : "OK",
    "message" : "User berhasil logout"
}
```

Response Body Error : 

```json
{
    "errros" : "Unauthorized"
}
```

## Forgot Password User API

Endpoint : POST /api/users/forgotpassword

Request Body : 

```json
{
    "email" : "bambang@gmail.com"
}
```

Response Body Success : 

```json
{
    "data" : {
        "email" : "bambang@gmail.com"
    },
    "message" : "Reset akun telah dikirim ke email anda"
}
```

Response Body Error : 

```json
{
    "errros" : "Email tidak ditemukan"
}
```