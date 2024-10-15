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
    "success": true,
    "data": {
        "title": "Tutorial Backend KG",
        "content": "Langkah awal...",
        "author": "Bambang 123",
        "likedBy": [],
        "comments": []
    },
    "message": "Artikel berhasil dibuat"
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
    "success": true,
    "data": [
        {
            "title": "Tutorial Update Backend KG",
            "content": "Awal awal siapkan...",
            "author": "Bambang 123",
            "likedBy": [
                "Bims Kuy"
            ],
            "comments": [
                {
                    "text": "tester 1",
                    "author": "Bambang 123",
                    "likedBy": [
                        "Bambang 123",
                        "Bims Kuy"
                    ]
                }
            ]
        }
    ],
    "message": "Berhasil mendapatkan artikel"
}
```

## Update Article API

Endpoint : FETCH /api/articles/:articleId

Request Body : 

```json
{
    "title" : "Tutorial Update Backend KG", //optional
    "content" : "Awal awal siapkan..." //optional
}
```

Response Body Success : 

```json
{
    "success": true,
    "data": {
        "title": "Tutorial Update Backend KG",
        "content": "Awal awal siapkan...",
        "author": "Bambang 123",
        "likedBy": [
            "Bims Kuy"
        ],
        "comments": [
            {
                "text": "tester 1",
                "author": "Bambang 123",
                "likedBy": [
                    "Bambang 123",
                    "Bims Kuy"
                ]
            }
        ]
    },
    "message": "Artikel berhasil diupdate"
}
```

Response Body Error : 

```json
{
    "success": false,
    "message": "Tidak memiliki hak akses untuk mengupdate artikel ini",
    "data": {}
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