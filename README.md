# **Backend API Documentation**

---

## **Base URL**
The base URL for all API requests is:

- **Production**: `https://future-4rx.vercel.app/api`

---

## **Authentication Routes**

### **1. Sign Up**
- **Endpoint:** `POST /auth/signup`
- **Description:** Registers a new user.

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
  password: string;
  phone: string;
  country: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: Date;
  isClient: boolean;
}
```

### **2. Sign In**
- **Endpoint:** `POST /auth/signin`
- **Description:** Authenticates a user and generates a session token which is set to a cookie to keep user active.

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
  password: string;
}
```

### **3. Log Out**
- **Endpoint:** `POST /auth/logout`
- **Description:** Logs the user out by clearing the cookie.
- To log out successfully, include the JWT token in the **Authorization** header as follows:

```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

### **4. Forgot Password**
- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Sends a request to the email of the user with an OTP to validate his request. The OTP is then verified with the `/verification/verify-mail` endpoint. After which a new password is then generated with the `/auth/reset-password` endpoint.

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
}
```

### **5. Reset Password**
- **Endpoint:** `PATCH /auth/reset-password`
- **Description:** Updates a new password to the database after the forgot password request has been verified

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
  password: string;
  token: string; //returned along with a success message if email was sent successfully from the forgot-password endpoint
}
```

## **Verification Routes**

### **1. Send Verification SMS**
- **Endpoint:** `POST /verification/send-code`
- **Description:** Sends an OTP to the user’s phone number for verification.

#### **Request Body Types(JSON)**
```typescript
{
  phoneNumber: string;
}
```

### **2. Verify Code**
- **Endpoint:** `POST /verification/verify-code`
- **Description:** Verifies the code sent to the user's phone number.

#### **Request Body Types(JSON)**
```typescript
{
  phoneNumber: string;
  code: number;
}
```

### **3. Send Verification Email**
- **Endpoint:** `POST /verification/send-mail`
- **Description:** Sends an OTP to the user’s email for verification.

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
  firstName: string;
}
```

### **4. Verify Email**
- **Endpoint:** `POST /verification/verify-mail`
- **Description:** Verifies the code sent to the user's email.

#### **Request Body Types(JSON)**
```typescript
{
  email: string;
  code: string;
}
```

## **Users Routes**

### **1. Fetch All Users**
- **Endpoint:** `GET /users`
- **Description:** Returns data of all the registered users on the database.

### **2. Fetch A User**
- **Endpoint:** `GET /users/:userId`
- **Description:** Returns data of a particular user whose id was provided.

### **3. Delete A User**
- **Endpoint:** `DELETE /users/:userId`
- **Description:** Deletes user whose id was provided.

### **4. Change Password**
- **Endpoint:** `PATCH /users/:userId/update-password`
- **Description:** Changes and updates the user password

#### **Request Body Types(JSON)**
```typescript
{
  oldPassword: string;
  newPassword: string;
}
```

## **MiddleWare and Authentication**

### **Protected Routes**
- **Endpoint:** `GET /auth/session`
- **Description:** Returns a boolean ```true``` if user's session token hasn't expired and ```null``` if the token has expired.
- **Note:** All users must be validated through the session route before accessing other endpoints. Here are the endpoints:
1. Log Out
2. Send Verification SMS
3. Verify Code
4. Change Password
- To access protected routes, include the JWT token in the **Authorization** header as follows:
```json
{
  "Authorization": "Bearer <jwt-token>"
}
```

## **Chats and Messaging**

### **1. Create a room**
- **Endpoint:** `POST /chats/create-room`
- **Description:** This endpoint creates a room for two users to start exchanging messages

#### **Request Body Types(JSON)**
```typescript
{
  user1: string; //email of the first user
  user2: string; //email of the second user
}
```

### **2. Send Messages**
- **Endpoint:** `POST /chats/send-message`
- **Description:** Endpoit to send messages

#### **Request Body Types(JSON)**
```typescript
{
  sender: string; //email of the first user
  receiver: string; //email of the second user
  message: string;
}
```

### **3. Get messages**
- **Endpoint:** `GET /chat/get-messages/:roomId`
- **Description:** Gets all the messages sent in a particular room

#### **Request Body Types(JSON)**
```typescript
{
  roomId: string;
}
```