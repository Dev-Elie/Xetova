# Xetova

## Installation & set up

### Clone repo
```bash
git clone https://github.com/Dev-Elie/Xetova.git Auth-Sys
```

### Install packages & start app

```bash
cd Auth-Sys
npm install
npm start
```
### Create User

Endpoint - `localhost:3000/api/auth/signup`

Method   - `POST`

Request body(JSON)
```JSON
{
	"userName":"Mike",
	"email":"kim@xetova.com",
	"password":"123Admin!@#"
}
```

Expected response body

```JSON
{
	"error": false,
	"message": "User created successfully"
}
```

### Login User

Endpoint - `localhost:3000/api/auth/signin`

Method   - `POST`

Request body(JSON)

```JSON
{
	"userName":"Dev Mike",
	"password":"123Admin!@#"
}
```

Expected response body

```JSON

{
	"error": false,
	"message": "User signed in successfully",
	"accessToken": "*****",
	"refreshToken": "********"
}
```
### Manage Users

#### 1. Read all users

Endpoint - `localhost:3000/api/manageUsers`

Method   - `GET`


#### 2. Update user

Endpoint - `localhost:3000/api/manageUsers/${userId}`

Method   - `PUT`

Request body(JSON)

```JSON
{
	"userName":"Mikey"
}
```

Expected response body

```JSON

{
	"error": false,
	"message": "User updated successfully"
}
```
#### 3. Deactivate User

Endpoint - `localhost:3000/api/manageUsers/${userId}`

Method   - `DELETE`

Expected response body

```JSON

{
	"error": false,
	"message": "User deleted successfully"
}

