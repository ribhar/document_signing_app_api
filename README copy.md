Below is the README.md template for the document signing application API:

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

Before running the application, ensure you configure the necessary environment variables. Create a `.env` file in the project's root directory and provide the required configuration details. An example of the environment variables can be found in the `.env.example` file.

### Usage

To start the API server, use the following command:

```
npm start
```

The API server will be running on http://localhost:8080.

### API Routes

#### User Routes

- **POST /user/register**
  - Register a new user.
  - Sample Request Body:
    ```json
    {
      "username": "exampleuser",
      "password": "examplepassword"
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "User registered successfully.",
      "data": {
        "id": 1,
        "username": "exampleuser"
      }
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "Username already exists.",
      "data": []
    }
    ```

- **POST /user/login**
  - Authenticate a user.
  - Sample Request Body:
    ```json
    {
      "username": "exampleuser",
      "password": "examplepassword"
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "Authentication successful.",
      "token": "exampletoken"
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "Invalid username or password.",
      "data": []
    }
    ```

#### Document Routes

- **POST /doc/upload**
  - Upload a new document.
  - Sample Request Body:
    ```json
    {
      "title": "Example Document",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "Document uploaded successfully.",
      "data": {
        "id": 1,
        "title": "Example Document",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      }
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "Error uploading document.",
      "data": []
    }
    ```

- **POST /doc/sign**
  - Sign a document.
  - Sample Request Body:
    ```json
    {
      "documentId": 1
    }
    ```
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "Document signed successfully.",
      "data": {
        "id": 1,
        "title": "Example Document",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "isSigned": true
      }
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "Error signing document.",
      "data": []
    }
    ```

- **GET /doc/:id**
  - Get a document by ID.
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "Document fetched successfully.",
      "data": {
        "id": 1,
        "title": "Example Document",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "isSigned": true
      }
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "Document not found.",
      "data": []
    }
    ```

- **GET /doc/**
  - Get all documents.
  - Sample Response (Success):
    ```json
    {
      "status": "success",
      "message": "All documents fetched successfully.",
      "data": [
        {
          "id": 1,
          "title": "Example Document 1",
          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "isSigned": true
        },
        // ... more documents
      ]
    }
    ```
  - Sample Response (Error):
    ```json
    {
      "status": "error",
      "message": "No documents found.",
     

 "data": []
    }
    ```

## Support

For any issues or questions related to the API, please open an issue in the GitHub repository or contact the maintainers directly.

## Contributing

Contributions are welcome! If you have any improvements or new features you would like to add to the API, please feel free to open a pull request.

## License

This API is licensed under the MIT License. See the `LICENSE` file for more details.