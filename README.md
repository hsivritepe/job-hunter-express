# Job Hunter Express

A full-stack job hunting platform built with Express.js backend and Next.js frontend, designed to help job seekers find opportunities and employers post job listings.

## 🚀 Features

### Backend (Express.js + TypeScript)

-   **User Authentication**: Register, login, and password reset functionality
-   **JWT Authentication**: Secure token-based authentication
-   **MongoDB Integration**: MongoDB database with Mongoose ODM
-   **Input Validation**: Zod schema validation for all API endpoints
-   **Password Security**: Bcrypt password hashing
-   **CORS Support**: Cross-origin resource sharing enabled
-   **TypeScript**: Full TypeScript support with type safety

### Frontend (Next.js + React)

-   **Modern UI**: Built with Tailwind CSS and Headless UI
-   **Responsive Design**: Mobile-friendly interface
-   **React Query**: Efficient data fetching and caching
-   **TypeScript**: Type-safe frontend development
-   **Component Library**: Reusable UI components

## 🛠️ Tech Stack

### Backend

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JWT + bcryptjs
-   **Validation**: Zod
-   **Testing**: Jest + Supertest
-   **Development**: Nodemon, ESLint

### Frontend

-   **Framework**: Next.js 14
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: React Query (@tanstack/react-query)
-   **UI Components**: Headless UI, Heroicons
-   **HTTP Client**: Axios
-   **Development**: ESLint

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-hunter-express
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/job-hunter
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

#### Database Setup

Make sure MongoDB is running locally, or update the `MONGODB_URI` to point to your MongoDB Atlas cluster.

#### Run Backend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test
```

The backend API will be available at `http://localhost:5001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

#### Run Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The frontend application will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

-   `POST /api/users/register` - Register a new user
-   `POST /api/users/login` - Login user
-   `POST /api/users/change-password` - Change password (authenticated)
-   `POST /api/users/forgot-password` - Request password reset
-   `POST /api/users/reset-password` - Reset password with token
-   `PUT /api/users/update` - Update user profile (authenticated)

### Example API Usage

```bash
# Register a new user
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run basic tests
npm run test:basic

# Run tests in watch mode
npm test -- --watch
```

### Frontend Tests

```bash
cd frontend

# Run linting
npm run lint
```

## 📁 Project Structure

```
job-hunter-express/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript type definitions
│   │   ├── validations/     # Zod validation schemas
│   │   └── index.ts         # Server entry point
│   ├── __tests__/           # Test files
│   └── package.json
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── lib/             # Utility functions
│   │   ├── styles/          # CSS styles
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```

## 🔧 Development Scripts

### Backend Scripts

-   `npm run dev` - Start development server with hot reload
-   `npm run build` - Build TypeScript to JavaScript
-   `npm start` - Start production server
-   `npm test` - Run Jest tests
-   `npm run lint` - Run ESLint

### Frontend Scripts

-   `npm run dev` - Start Next.js development server
-   `npm run build` - Build for production
-   `npm start` - Start production server
-   `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce the issue and any error messages

## 🔮 Future Enhancements

-   Job posting and management features
-   Advanced search and filtering
-   Email notifications
-   File upload for resumes
-   Admin dashboard
-   Real-time chat functionality
-   Job application tracking
-   Analytics and reporting

---

Happy coding! 🎉
