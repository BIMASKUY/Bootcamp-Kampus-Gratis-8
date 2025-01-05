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

Query Params:
- title: string using like, optional 
- content: string using like, optional 
- author: string using like, optional

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

## Delete Article API

Endpoint : DELETE /api/articles/:articleId

Headers : 
- Authorization : token

Response Body Success : 

```json
{
    "success" : true,
    "message" : "Artikel berhasil dihapus",
    "data" : {},
}
```

Response Body Error : 

```json
{
    "success": false,
    "message": "Tidak memiliki hak akses untuk menghapus artikel ini",
    "data": {}
}
```