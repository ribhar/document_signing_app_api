Below is the updated README.md file with instructions for adding the .env file with the required variables:

# Document Signing Application API

This repository contains the source code for the Document Signing Application API, which includes routes for user authentication and document management.

## Getting Started

To get started with the API, follow the steps below.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Clone the Repository

Clone this repository to your local machine:

```
git clone https://github.com/ribhar/document_signing_app_api.git
```

### Installation

1. Open a terminal window.

2. Navigate to the project's root directory:

```
cd document_signing_app_api
```

3. Install the required dependencies:

```
npm install
```

### Configuration

Before running the application, ensure you configure the necessary environment variables. Create a `.env` file in the project's root directory and add the following variables:

```
# Server Port
PORT=8080

# Database URI
DB_URI=mongodb://localhost:27017/document_signing_app

# JWT
JWT_SECRET=yourjwtsecret
JWT_SECRET_EXPIRY=1h

# Misc
SESSION_SECRET=yoursecret
```

### Usage

To start the API server, use the following command:

```
npm start
```

The API server will be running on http://localhost:3000.

### API Routes

#### User Routes

- **POST /user/register**
  - Register a new user.
  - Sample Request Body:
    ```json
    {
      "username": "user1", // Should be alphanumeric, example: "user1", "user2"
      "email": "user@example.com",
      "password": "examplepassword" //  The password must consist of 8 to 15 characters and include at least one number, one uppercase letter, and one lowercase letter.
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": 200,
      "message": "User registered successfully.",
      "credentials": {}
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "message": "Registration failed",
    }
    ```

- **POST /user/login**
  - Authenticate a user.
  - Sample Request Body:
    ```json
    {
      "email": "exampleuser",
      "password": "examplepassword"
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": 200,
      "message": "Login Success",
      "credentials": {},
      "token": "Token_string"
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "message": "User not found",
    }
    ```

#### Document Routes

- **POST /doc/upload**
  - Upload a new document.
  - Sample Request Body:
    ```json
    {
      "file": "Example Document", // formdata
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": 200,
      "message": "Document uploaded successfully",
      "pdfUrl": "pdf_url_string"
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": 500,
      "error": "Error saving document details",
      "message": "err.message (error_trace)",
    }
    ```

- **POST /doc/sign**
  - Sign a document.
  - Sample Request Body:
    ```json
    {
      "name": "Sample signatary name",
      "email": "Sample signatary email",
      "signature": "base64_string",
      "pdfUrl": "pdf_url_string"
    }
    ```
  - Sample Response (Success):
    ```application/pdf
    pdf binary representation data
    ```
  - Sample Response (Error):
    ```json
    {
      "status": 500,
      "error": "Error signing document",
      "message": "err.message (error_trace)",
    }
    ```

- **GET /doc/:id**
  - Get a document by ID.
  - Sample Response (Success):
    ```json
    {
      "name": "Sample signatary name",
      "email": "Sample signatary email",
      "ownerId": "",
      "isSigned": true,
      "docUrl": "pdf_url_string",
      "signedDocUrl": "pdf_url_string",
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": 404,
      "message": "Document not found or not signed by the user"
    }
    ```

- **GET /doc/**
  - Get all documents.
  - Sample Response (Success):
    ```json
    [
        {
            "name": "success",
            "email": "Document fetched successfully.",
            "ownerId": "",
            "isSigned": true,
            "docUrl": "pdf_url_string",
            "signedDocUrl": "pdf_url_string",
        },
        {}
    ]
    ```
  - Sample Response (Error):
    ```json
    {
      "status": 500,
      "error": "Error saving document details",
      "message": "err.message (error_trace)",
    }
    ```

### Support

For any issues or questions related to the API, please open an issue in the GitHub repository or contact the maintainers directly.

## Contributing

Contributions are welcome! If you have any improvements or new features you would like to add to the API, please feel free to open a pull request.

## License

This API is licensed under the MIT License. See the `LICENSE` file for more details.
