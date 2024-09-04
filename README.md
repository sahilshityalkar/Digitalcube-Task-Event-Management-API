# Digitalcube-Task-Event-Management-API

## Overview

This project is an Event Management API built in Node.js that allows users to create, view, update, and delete events. Additionally, users can register for events, and the API sends a confirmation email upon successful registration.

## Task: Event Management API

**Goal**: Build a simple event management API with the following features:
- **Event Creation**: Users can create new events.
- **Event Retrieval**: Users can view a list of events or details of a specific event.
- **Event Update**: Users can update existing events.
- **Event Deletion**: Users can delete events.
- **User Registration**: Users can register for an event and receive a confirmation email.

## Requirements

### API Endpoints

- **POST /events**: Create a new event.
  - **Fields**: `name`, `description`, `date`, `location`.
  
- **GET /events**: Retrieve a list of events with pagination support.
  
- **GET /events/:id**: Retrieve event details by ID.
  
- **PUT /events/:id**: Update event details by ID.
  
- **DELETE /events/:id**: Delete an event by ID.
  
- **POST /events/:id/register**: Register a user for the event.
  - **Fields**: `name`, `email`.

### Database

- Use **MongoDB** to store event data and user registrations.

### Validation

- Validate incoming data using **Joi**.
- Ensure the event's date is not in the past during creation or updating.

### Error Handling

- Implement proper error handling for:
  - Invalid data.
  - Non-existent event IDs.
  - Failed email delivery.

### Additional Features

- **Pagination**: Add pagination for listing events.
- **File Upload**: Implement file upload functionality for event banners or images.

## Project Setup

### Prerequisites

- **Node.js** (v22.1.0 or higher)
- **MongoDB** (Local or Atlas)
- **Nodemailer** (for email functionality)
- **Ethereal test account**

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Digitalcube-Task-Event-Management-API.git
   cd Digitalcube-Task-Event-Management-API

2. **Install Dependencies**

    ```bash
    npm install
3. **Set Up Environment Variables**
- Create a .env file in the root directory and add the following:

  ```bash
  MONGO_URI=your_mongodb_connection_string
  PORT=5000
  ETHEREAL_USER=your_ethereal_user
  ETHEREAL_PASS=your_ethereal_password
4. **Running the Server**

   ```bash
   npm run start

The server will run on http://localhost:5000.

