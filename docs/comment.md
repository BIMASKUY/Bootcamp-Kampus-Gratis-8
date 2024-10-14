# Comment API Spec

## Create Comment API

Endpoint : POST /api/comments/:articleId

Headers : 
- Authorization : token

Request Body : 

```json
{
    "text" : "artikel KG keren"
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
    "message" : "Comment berhasil dibuat"
}
```
Response Body Error : 

```json
{
    "success" : false,
    "message" : "Panjang text maksimal 512 karakter",
    "data": {}
}
```

## Delete Comment API

Endpoint : DELETE /api/comments/:articleId/:commentId

Headers : 
- Authorization : token

Note :
- Users can delete only their own comment
- Author article cant delete users comment

Response Body Success : 

```json
{
    "success" : true,
    "data" : "OK",
    "message" : "User berhasil logout"
}
```

Response Body Error : 

```json
{
    "success": false,
    "message": "Tidak memiliki hak akses untuk menghapus komentar ini",
    "data": {}
}
```

## Like Comment API

Endpoint : POST /api/comments/likes/:commentId

Headers : 
- Authorization : token

Reponse Body Success : 

```json
{
    "success": true,
    "data": {
        "text": "tester 1",
        "author": "Bambang 123",
        "likedBy": [
            "Bambang 123"
        ]
    },
    "message": "Komentar berhasil disukai"
}
```
Response Body Error : 

```json
{
    "success": false,
    "message": "Komentar tidak ditemukan",
    "data": {}
}
```