# Talak Kinash Backend

Welcome to the backend of **Talak Kinash**, a real-time price comparison platform helping users discover the best deals across a wide range of categories including groceries, electronics, clothing, and more.

---

## Project Structure

This repo contains **both the currently deployed monolithic app** and an **ongoing migration to a microservices architecture**.

### 🏗 Root Directory (Monolithic App)
- This is the current working version in production.
- Connected to our CI/CD pipeline (AWS EC2, GitHub Actions).
- Fully functional and actively deployed.

### 🧱 Microservices (In Progress)
Located in the folder /microservices:

- `/auth-service`: Handles authentication and JWT.
- `/product-service`: Manages product listings and categories.
- `/payment-service`: Handles payment related logics such as Chapa.
- `/user-service`: User profiles, preferences, and dashboards.

### ⚠️ Why both?
We're in the process of refactoring. Due to ongoing competition deadlines, the monolithic version is maintained live, while microservices are being developed for future deployment.

---

## Features

- **Product Management** – Add, update, and fetch product data
- **Wishlist** – Users can add or remove products from their wishlist
- **Search & Filter** – Filter by category, price, and more
- **Featured Products** – Time-bound product promotions
- **Image Similarity Search** – Find similar products using image embeddings and CLIP AI
- **User Feed** – Personalized recommendations based on user preferences
- **Category Preferences** – Users can store category preferences for a tailored experience

---

## Tech Stack

- **Node.js** (v20.18.0)
- **Express.js** for building REST APIs
- **MongoDB + Mongoose** for data modeling
- **PM2** for process management
- **Nginx** for reverse proxy and SSL termination
- **GitHub Actions** for CI/CD
- **AWS EC2** for hosting
- **Cloudinary + CLIP AI** for AI-based image similarity
- **Swagger** for API documentation

---

## Installation

```bash
git clone https://github.com/Kingestif/Talak-kinash-backend.git
cd Talak-kinash-backend
npm install
```

## Setup Environment Variables
Create a `.env` file and add the following:

### Server Configuration
PORT=5000

### Database Configuration
DATABASE=your_mongo_db_connection_string
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password

### Authentication & JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=your_jwt_expiration_time

### AI Services
CLIPAI_BASE_URL=https://your-clip-api-url

### Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### Payment Integration (Chapa)
CHAPA_SECRET_KEY=your_chapa_secret_key

### Environment-specific Config
NODE_ENV=development # or production


---

## API Documentation

API is documented using Swagger.

- Visit: [API Documentation](https://talakkinash.duckdns.org/api-docs)

---

## Testing Locally

```bash
npm run 
```

You can test APIs using tools like [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/).

---

## **Deployment**

Our backend is continuously deployed to an AWS EC2 instance using GitHub Actions and Docker for a smooth and scalable CI/CD pipeline.

### How It Works
- **Trigger:** On every push to the `main` branch
- **CI/CD Tool:** GitHub Actions
- **Deployment Strategy:** Docker-based


### 🛠 Deployment Steps
1. GitHub Actions triggers on push to main
2. Code is pulled from GitHub onto the EC2 instance
3. Docker image is built and tagged with the short commit SHA (e.g. talak-backend:abc1234)
4. Old Docker containers are stopped and removed
5. A new container is started using the latest image

### Secrets & Security
- **SSH access** is securely handled using GitHub Actions secrets (`EC2_SSH_KEY` & `EC2_PUBLIC_IP`)
- **Environment variables** are managed on the EC2 instance via a `.env` file

### Manual Restart
If needed, SSH into the EC2 instance and restart the app manually:

```bash
docker restart talak-container
```

---

## **Monitoring**

Our backend container is monitored using Prometheus and Grafana, giving us real-time visibility into system performance and container-level metrics.

- **Prometheus:** scrapes Docker metrics on port 9323
- **Grafana:** provides a dashboard for real-time visualization 

---

## Project Structure

```
talak-kinash-backend/
├── controllers/
├── models/
├── routes/
├── utils/
├── middleware/
├── config/
├── .env
├── app.js
├── server.js
└── README.md
```

---

## Contributors

- **You!** Want to contribute? Feel free to open an issue or submit a PR.

---

## Contact

For any questions or suggestions:
- Email: estifanoszinabuabebe@gmail.com
- GitHub: [@Kingestif]

---

## ⭐️ Show Your Support
If you liked this project, leave a star ⭐️ on the repo!

---

## License

MIT License

