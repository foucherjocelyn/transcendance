# ft_transcendence

## Table of Contents
- [ft\_transcendence](#ft_transcendence)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
  - [Development](#development)
  - [API Documentation](#api-documentation)
  - [Game Mechanics](#game-mechanics)
  - [User Authentication](#user-authentication)
  - [Chat System](#chat-system)
  - [Tournament Mode](#tournament-mode)
  - [Security Features](#security-features)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Project Overview

ft_transcendence is the culminating project in the 42 School's common core curriculum. It challenges students to create a sophisticated, full-stack web application centered around the classic game of Pong. This project goes beyond simple gameplay, incorporating modern web technologies, real-time multiplayer functionality, and a robust set of features to create a comprehensive gaming platform.

The goal of ft_transcendence is to demonstrate proficiency in full-stack development, real-time communication, user authentication, and database management. It serves as a capstone project, allowing students to showcase their skills in creating a complex, interactive web application.

## Key Features

- **Pong Game**: 
  - Real-time multiplayer Pong game using WebSocket technology
  - Multiple game modes: Classic, Ranked, and Tournament
  - Customizable game settings (e.g., paddle size, ball speed)

- **User Authentication**: 
  - Secure login system with support for 42 OAuth
  - Two-Factor Authentication (2FA) for enhanced security
  - JWT-based authentication for API requests

- **User Profiles**: 
  - Customizable user profiles with avatars
  - User statistics tracking (wins, losses, ranking)
  - Friend system with ability to add, remove, and block users

- **Chat System**: 
  - Real-time chat functionality with public and private channels
  - Direct messaging between users
  - Moderation tools for channel administrators

- **Matchmaking**: 
  - Intelligent system for pairing players of similar skill levels
  - Quick play and custom game creation options

- **Tournament Mode**: 
  - Create and participate in Pong tournaments
  - Bracket visualization and management
  - Real-time tournament updates and notifications

## Tech Stack

Our project leverages a modern and robust tech stack to deliver a seamless gaming experience:

- **Frontend**:
  - Vanilla JavaScript for core functionality
  - HTML5 & CSS3 for structure and styling
  - Three.js for advanced 3D graphics and game rendering

- **Backend**:
  - Django (Python) for the main application server
  - Django REST Framework for API development
  - WebSocket for real-time communication

- **Database**: 
  - PostgreSQL for reliable and scalable data storage

- **Authentication**: 
  - JWT (JSON Web Tokens) for secure, stateless authentication
  - OAuth2 for integration with 42 School's authentication system

- **Containerization**: 
  - Docker and Docker Compose for consistent development and deployment environments

- **Additional Libraries**:
  - Axios for streamlined HTTP requests
  - PyOTP for generating and validating Two-Factor Authentication codes
  - QRCode for generating 2FA QR codes

## Project Structure

The project is organized into several key components:

- `frontend/`: Contains all frontend-related code
  - `webServer/`: Hosts the main web application
  - `webSocket/`: Manages real-time communication
- `backend/`: Houses the Django backend application
- `nginx/`: Contains Nginx configuration for reverse proxy (if used)
- `ssl/`: Stores SSL certificates for HTTPS
- `avatars/`: Directory for user avatar storage
- `docker-compose.yml`: Defines and configures all services
- `Makefile`: Provides shortcuts for common development tasks

## Getting Started

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/foucherjocelyn/transcendance.git ft_transcendence
   cd ft_transcendence
   ```

2. Create a `.env` file in the root directory and add necessary environment variables. Refer to the `ft_transcendence/.env.example` file for required variables.

3. Generate SSL certificates (or use provided ones):
   ```
   make ssl
   ```

4. Build and start the project using Docker Compose:
   ```
   make
   ```

5. Access the application at https://localhost:5500. 

   Note: Accept security warnings on ports 5555 (WebSocket), 5500 (frontend), and 8000 (backend) due to self-signed certificates.

## Development

Our development workflow is streamlined using Docker and Make commands:

- Start the development environment: `make up`
- Stop all services: `make down`
- View application logs: `make logs`
- Clean up and rebuild all containers: `make re`

For a complete list of available commands, refer to the Makefile in the project root.

## API Documentation

The project utilizes a RESTful API for communication between the frontend and backend. Key endpoints include:

- Authentication: `/api/v1/auth/`
- User management: `/api/v1/users/`
- Game operations: `/api/v1/game/`
- Tournament management: `/api/v1/tournament/`

For comprehensive API documentation, including request/response formats and authentication requirements, please refer to the `design_api.md` file in the project root.

## Game Mechanics

The Pong game implementation includes several advanced features:

- Real-time multiplayer using WebSocket for low-latency gameplay
- Multiple game modes
- Power-ups and special abilities to add variety to matches

## User Authentication

Our robust authentication system includes:

- Integration with 42 School's OAuth for seamless login
- Two-Factor Authentication (2FA) using Time-based One-Time Passwords (TOTP)
- JWT-based authentication for API requests with token refresh mechanism
- Password strength requirements and secure storage using bcrypt

## Chat System

The real-time chat system offers:

- Direct messaging between users
- Mute and unmute users
- Invite user to play a game inside the chat
- Watch live the status of other users: online or offline

## Tournament Mode

The tournament feature allows users to:

- Create custom tournament and specify the alias
- Join existing tournaments and track progress
- Spectator mode for watching ongoing tournaments
- Receive notifications for upcoming matches and tournament events

## Security Features

We prioritize the security of our users and their data:

- HTTPS enabled for all connections using SSL/TLS
- JWT for secure, stateless authentication
- Password hashing using bcrypt
- Protection against common web vulnerabilities (SQL injection, XSS, CSRF)
- Regular security audits and dependency updates

## Contributing

We welcome contributions from the community! Please read our CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for full details.

## Acknowledgments

- 42 School for providing the challenging project brief and educational support
- All contributors and team members who have dedicated their time and skills to this project
