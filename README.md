# Mini Loan App Documentation

## 1. Technical Choices

### Frontend

- **Framework**: React

  - Chosen for its robust ecosystem and component-based architecture
  - Easy state management with hooks
  - Great developer tools and community support

- **CSS Framework**: Tailwind CSS
  - Utility-first approach for rapid UI development
  - Highly customizable
  - Built-in responsive design classes

### Backend

- **Framework**: Express.js

  - Lightweight and flexible
  - Easy to set up middleware
  - Great for RESTful APIs

- **Database**: MongoDB
  - Flexible schema for loan and repayment data
  - Easy to scale
  - Great with Node.js/Express

## 2. Project

```bash
mini-loan-app/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # All UI components
│ │ ├── context/ # context Api for state management
│ │ ├── hooks/ # Custom hooks
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services : axios instance and endpoints
│ │ └── utils/ # Helper functions
│ └── tests/
├── server/
│ ├── controllers/
│ ├── middleware/
│ ├── models/ # Mongoose models
│ ├── routes/
│ └── tests/ # Backend tests
└── docs/ # Documentation
```

## 3.Environment Variables

- Create a .env file in the server directory and add the following variables:

  - PORT
  - MONGO_URI
  - JWT_SECRET
  - MAX_LOAN_AMOUNT
  - MIN_LOAN_AMOUNT
  - FRONTEND_URL

- Create a .env file in the client directory and add the following variables:
  - VITE_API_URL (should be same as server url for example http://localhost:5000)

## 4. Installation Process

```bash
  cd ./client
  npm install
  cd ../server
  npm install
```

## 5. Running the application

```bash
  cd ./server
  npm run dev
  cd ../client
  npm run dev
```

## 6. API Documentation (Postman Collection)

[Postman Collection](https://www.postman.com/xyz)

## 7. CI/CD Pipeline

```./server/.github/workflows/server.yml
name: CICD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v4
      - name: Create .env file
        run: |
          echo "PORT=${{ vars.PORT }}" >> .env
          echo "MONGO_URI=${{ vars.MONGO_URI }}" >> .env
          echo "JWT_SECRET=${{ vars.JWT_SECRET }}" >> .env
          echo "MAX_LOAN_AMOUNT=${{ vars.MAX_LOAN_AMOUNT }}" >> .env
          echo "MIN_LOAN_AMOUNT=${{ vars.MIN_LOAN_AMOUNT }}" >> .env
      - name: Build Docker image
        run: |
          docker build \
            --build-arg PORT=${{ vars.PORT }} \
            --build-arg MONGO_URI=${{ vars.MONGO_URI }} \
            --build-arg JWT_SECRET=${{ vars.JWT_SECRET }} \
            -t imabhishek476/loan-app-server:latest .
      - name: Login to Docker Hub
        run: docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
      - name: Publish image to docker hub
        run: docker push imabhishek476/loan-app-server:latest

  deploy:
    needs: build
    runs-on: self-hosted
    steps:
      - name: Pull image from docker hub
        run: docker pull imabhishek476/loan-app-server:latest
      - name: Delete existing container
        run: docker rm -f loan-app-server || true
      - name: Run new container
        run: docker run -d -p 5000:5000 --name loan-app-server imabhishek476/loan-app-server:latest

```

## 8. Future Improvements

1.  **Add more tests**

- Implement caching for API responses
- Add pagination for loan lists
- Lazy loading for components

2. **Security**

- Add rate limiting
- Implement 2FA
- Add API key authentication for admin routes

3. **Features**

- Email notifications for loan status changes
- Payment gateway integration
- Loan history analytics
