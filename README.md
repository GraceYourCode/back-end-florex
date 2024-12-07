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

## **MiddleWare and Authentication**

### **Protected Routes**
- **Endpoint:** `GET /auth/session`
- **Description:** Returns a boolean ```true``` if user's session token hasn't expired and ```null``` if the token has expired.