## What operations does this Todo app need?
- Create a todo
- Get all todos
- update/edit a todo
- delete a todo
- mark todo as done

## For each operation, what should the API return?
- Create a todo
    - Status code: 200
    - Data: title of todo, its description, and the date it was created

- Get all todos
    - Status code: 200
    - Data: list of all todos created

- update edit a todo
    - Status code: 200
    - Data sent: the updated data of a certain body

- delete a todo
    - Status code: 200

- mark todo as done
    - Status code: 200

- If a todo doesnt exist
    - Status code: 404

- Status code for errors (im not sure about this): 400

## What data does a Todo actually contain?

- Title: required field, text datatype
- Description: optional field, text datatype
- Created on: required field (server generated when todo is created), timestamp/date datatype

## updated API endpoints

### createTodo/
    ID - server generated
    title - required field, text datatype
    description - optional field, text datatype
    isCompleted - optional field, boolean, default {false}
    createdAt - server generated, timestamp datatype
    updatedAt - server generated, timestamp datatype
    Success: 201 Created
    Error: 400 bad request, 500 server error

### deleteTodo/
    Returns
        ID
        Title
        Status code: 204 No Content
        Error: 404 not found, 500 server error

### editTodo/
    updates:
        title
        description
        isCompleted
    Status code: 200 OK
    Error: 400 bad request, 404 not found, 500 server error

### getTodos/
    Returns
        all todos created
    Status code: 200 OK
    Error: 500 server error

    GET /todos/
    200 OK
    Body : []

    frontend:
    `if (todos.length === 0) {
        display("No Todos Currently")
    }

    GET /todos/:id
    Returns
        todo object (ID)
        Status code: 200 OK
        Error: 404 not found, 500 server error

findAll(): Todo[]
- returns: array of all todos (empty array if none exists)

findById(id: string): Todo | null
- returns that specific todo
- returns a null if not found

create(data: CreateTodoData): Todo
- returns created todo


update(id: string, data: UpdateTodoData): Todo | null
- returns data if found and updated
- returns null if not found

delete(id: string): Todo 
- returns true if found and deleted
- returns false if not found




