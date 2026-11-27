# Streamly — Cloud-Native Video Sharing Platform

A cloud-native video-sharing platform built with React, Node.js, Express, and AWS. Streamly demonstrates a scalable, multi-tier cloud architecture with automated deployments, distributed caching, managed database services, and CDN-based video delivery.

**Live Demo:** [Streamly](https://streamly-six-black.vercel.app/)  
**GitHub Repository:** [zemike47/streamly](https://github.com/zemike47/streamly)

---

## 1. Project Overview

Streamly is a video-sharing platform where users can create accounts, authenticate, upload videos, browse available videos, watch content, and manage their own uploads.

The primary engineering focus is its cloud infrastructure: deploying a containerized backend across multiple Availability Zones, integrating managed AWS services, automating deployments, and monitoring application performance.

## 2. Architecture

```text
                         Users
                           |
                           v
                    Vercel (Frontend)
                      React + Vite
                           |
                           v
                  Application Load Balancer
                           |
                 +---------+---------+
                 |                   |
                 v                   v
             EC2 Instance        EC2 Instance
              AZ-1                  AZ-2
                 |                   |
                 +---------+---------+
                           |
                 +---------+---------+
                 |                   |
                 v                   v
           Amazon RDS             Amazon Valkey
           PostgreSQL             (Redis-compatible)
                 |
                 |
          Video Metadata

       Backend Video Upload
                 |
                 v
              Amazon S3
                 |
                 v
             CloudFront
                 |
                 v
             Video Users
```

### AWS Network Architecture

The application runs inside a custom Amazon VPC with separated network layers:

```text
VPC
|
+-- Public Subnets
|   |
|   +-- Application Load Balancer
|
+-- Private Application Subnets
|   |
|   +-- EC2 Auto Scaling Group
|       |
|       +-- Backend Instance (AZ-1)
|       +-- Backend Instance (AZ-2)
|
+-- Private Database Subnets
    |
    +-- Amazon RDS PostgreSQL
    +-- Amazon ElastiCache Valkey
```

The backend communicates with private database and caching services through controlled security-group rules.

## 3. Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JSON Web Tokens (JWT) |
| Caching | Amazon ElastiCache Valkey, ioredis |
| Object Storage | Amazon S3 |
| CDN | Amazon CloudFront |
| Compute | Amazon EC2 |
| Load Balancing | Application Load Balancer |
| Scaling | EC2 Auto Scaling |
| Networking | Amazon VPC, Subnets, Security Groups |
| Containers | Docker |
| Container Registry | Amazon ECR |
| CI/CD | GitHub Actions, GitHub OIDC |
| Secrets Management | AWS Systems Manager Parameter Store |
| Monitoring | Amazon CloudWatch |
| Frontend Hosting | Vercel |

## 4. Features

- User registration and authentication.
- JWT-based protected API endpoints.
- Video upload and storage in Amazon S3.
- Video browsing and retrieval.
- Video delivery through Amazon CloudFront.
- Video deletion with server-side ownership verification.
- PostgreSQL persistence for user and video metadata.
- Redis-compatible caching for video listing responses.
- React-based frontend connected to the deployed backend.

## 5. AWS Infrastructure

### Compute and Scalability

- Containerized the Express backend using Docker.
- Deployed backend containers on Amazon EC2.
- Configured an Application Load Balancer to distribute incoming traffic.
- Configured an EC2 Auto Scaling Group across two Availability Zones.
- Used health checks to monitor backend instance availability.

### Database

- Used Amazon RDS PostgreSQL for managed relational database storage.
- Configured private database networking.
- Used Prisma ORM for database access and schema management.

### Caching

- Integrated Amazon ElastiCache Valkey using ioredis.
- Implemented caching for the video listing endpoint.
- Used a 60-second expiration time for cached video listings.
- Verified cache hits and misses through application logs.

### Video Storage and Delivery

- Stored uploaded video objects in a private Amazon S3 bucket.
- Configured CloudFront with Origin Access Control (OAC) to access the private S3 origin.
- Returned CloudFront URLs for video delivery.
- Kept S3 Block Public Access enabled.

### Security and Configuration

- Used IAM roles for AWS service access from EC2.
- Used GitHub OIDC for GitHub Actions authentication to AWS.
- Stored production configuration and secrets in AWS Systems Manager Parameter Store.
- Separated public application entry points from private application and database resources.
- Restricted database and caching access through security groups.

## 6. CI/CD Pipeline

Streamly uses GitHub Actions to automate backend container builds and deployments.

```text
Developer Pushes to GitHub
          |
          v
     GitHub Actions
          |
          v
   Authenticate with AWS
       (GitHub OIDC)
          |
          v
   Build Docker Image
          |
          v
   Push Image to Amazon ECR
          |
          v
  Identify In-Service EC2 Instances
          |
          v
  Deploy Through AWS Systems Manager
          |
          v
    Pull and Run New Container
          |
          v
      Deployment Status
```

The pipeline:

1. Builds the backend Docker image.
2. Tags the image using the Git commit SHA.
3. Pushes the image to Amazon ECR.
4. Identifies active backend EC2 instances.
5. Uses AWS Systems Manager Run Command to execute the deployment script.
6. Checks the deployment command status.

Production environment variables are retrieved from Parameter Store during deployment rather than committed to GitHub.

## 7. Performance Testing

Used k6 to load-test the backend video listing endpoint through the Application Load Balancer.

### Recorded Load-Test Results

| Metric | Result |
|---|---:|
| Total HTTP requests | 4,752 |
| Maximum virtual users | 99 |
| Requests per second | 31.48 |
| Average response time | 169.38 ms |
| Median response time | 157.25 ms |
| 90th percentile | 240.33 ms |
| 95th percentile | 249.39 ms |
| Maximum response time | 819.82 ms |
| HTTP request failure rate | 0% |
| Checks passed | 4,752 / 4,752 |

### Test Thresholds

- 95th percentile response time below 500 ms.
- HTTP request failure rate below 1%.

Both thresholds passed during the recorded test.

These results represent a specific load-test run, not a guarantee of production capacity.

## 8. Monitoring and Observability

Configured an Amazon CloudWatch dashboard with six monitoring widgets covering:

1. Application Load Balancer target response time.
2. Application Load Balancer request count.
3. Healthy backend targets across Availability Zones.
4. EC2 CPU utilization.
5. RDS CPU utilization, database connections, and free storage.
6. Valkey connections, cache hit rate, and read latency.

Also configured CloudWatch alarms for database CPU utilization, backend CPU utilization, and unhealthy backend targets.

## 9. Repository Structure

```text
streamly/
|
+-- frontend/
|   +-- src/
|   |   +-- services/
|   |   +-- components/
|   |   +-- pages/
|   +-- package.json
|
+-- backend/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- middleware/
|   |   +-- routes/
|   |   +-- services/
|   |   +-- app.js
|   |   +-- server.js
|   +-- prisma/
|   +-- Dockerfile
|   +-- package.json
|
+-- .gitignore
+-- README.md
```

## 10. Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Git

### Clone the Repository

```bash
git clone https://github.com/zemike47/streamly.git
cd streamly
```

### Backend Setup

```bash
cd backend
npm install
```

Create a local `.env` file with the required configuration:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
AWS_REGION=eu-north-1
AWS_S3_BUCKET=your_s3_bucket_name
REDIS_URL=your_valkey_or_redis_connection_string
PORT=3000
```

Generate the Prisma client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

In another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

**Note:** The production backend uses AWS services and IAM-based access. Local development requires valid database, cache, and AWS credentials/configuration appropriate to your environment. Never commit `.env` files or production secrets.

## 11. Deployment

| Component | Hosting / AWS Service |
|---|---|
| Frontend | Vercel |
| Backend | Amazon EC2 |
| Container Registry | Amazon ECR |
| Traffic Distribution | Application Load Balancer |
| Scaling | EC2 Auto Scaling |
| Database | Amazon RDS PostgreSQL |
| Cache | Amazon ElastiCache Valkey |
| Video Storage | Amazon S3 |
| Video Delivery | Amazon CloudFront |
| Monitoring | Amazon CloudWatch |
| Deployment Automation | GitHub Actions + AWS Systems Manager |

## 12. Engineering Highlights

This project demonstrates practical experience with:

- Designing multi-tier cloud architectures.
- Deploying containerized applications on AWS.
- Configuring VPC networking and private resources.
- Implementing load balancing and horizontal scaling.
- Integrating managed relational databases and distributed caching.
- Building object-storage and CDN-based delivery workflows.
- Automating deployments using GitHub Actions and OIDC.
- Managing production secrets with Parameter Store.
- Monitoring infrastructure and application performance.
- Load-testing APIs with k6.

---

## 13. Future Improvements

Potential future enhancements include:

- CloudFront signed URLs for private video access.
- Improved cache invalidation after video uploads and deletions.
- More comprehensive automated integration and end-to-end tests.
- HTTPS enforcement and security-header hardening.
- Distributed tracing and structured application logging.
- Automated instance-recovery and deployment-rollback testing.
- Video transcoding and adaptive bitrate streaming.

---

## Author

**Mikiyas Alemayehu Gebrewold**

Software Engineer | Cloud & Backend Development

- GitHub: [@zemike47](https://github.com/zemike47)
- LinkedIn: [mikiyalemayehu](https://www.linkedin.com/in/mikiyalemayehu/)

---

*Built to explore practical AWS architecture, cloud-native application deployment, scalability, and performance engineering.*
