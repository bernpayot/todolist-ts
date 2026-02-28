# POST /todos
    *Request Body:*
    {
        "title": "sample title",
        "description": "sample description" //optional
    }

    *Success Response (201 Created)*
    {
        "id": "(randomized encrypted ID)",
        "title": "sample title",
        "description": "sample description",
        "isCompleted": false,
        "createdAt: "timestamp",
        "updatedAt: "timestamp"
    }

    *Error Response*

    400 Bad Request (missing title)
    {
        "error": "Title is required"
    }

    400 Bad Request (invalid data):
    {
    "error": "Invalid request body"
    }

    500 Internal Server Error:
    {
    "error": "An unexpected error occurred"
    }

# GET /todos (all)
    *Success Response (200 OK)*
    []

    *Error Response*

    500 Internal Server Error:
    {
        "error": "An unexpected error occurred"
    }

# GET /todos/:id
    *Success Response (200 OK)*
    {
        "id": "(id)",
        "title": "(title)",
        "description": "(description)",
        "isCompleted": false,
        "createdAt": "(timestamp)",
        "updatedAt": "(timestamp)"
    }

    *Error Response*

    404 Not Found
    {
        "error": "Todo not found."
    }

    500 Internal Server Error
    {
        "error": "An unexpected error occurred"
    }

# PATCH /todos/:id
    *Request Body*
    {
        "title": "new title"
    }

    *Success Response (200 OK)*
    {
        "id": "(ID)",
        "title": "new title",
        "description": "old description"
        "isCompleted": false,
        "createdAt": "(old timestamp)",
        "updatedAt": "(new timestamp)"
    }

    *Error Response*

    400 Bad Request
    {
        "error": "Invalid request body"
    }

    404 Not Found
    {
        "error": "Todo not found"
    }

    500 Server Error
    {
        "error": "An unexpected error occurred."
    }

# DELETE /todos/:id
    *Success Response (204 No Content)*

    *Error Response*

    404 Not Found
    {
        "error": "Todo not found."
    }    

    500 Server Error
    {
        "error": "An unexpected error occurred."
    }

