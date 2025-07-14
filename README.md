# 🎴 Kolct

A modern full-stack dashboard application built with Django REST Framework and React.

## 🚀 Features

### 🎯 **Dashboard Analytics**

- **Real-time Statistics** - Order values, card counts, collection metrics, user analytics
- **Interactive Charts** - Revenue and order tracking with Chart.js
- **Order Management** - Complete order lifecycle with status tracking
- **Responsive Design** - Beautiful purple gradient theme optimized for all devices

### 🔐 **Authentication & Security**

- **JWT Authentication** - Secure access and refresh token system
- **Role-based Permissions** - Admin and user access controls
- **Protected Routes** - Frontend route guards with authentication checks

### 📊 **Data Management**

- **Collections** - Organize cards into themed collections
- **Cards** - Detailed card information with rarity and pricing
- **Orders** - Complete order processing and tracking
- **Users** - User account management and profiles

### 🎨 **Modern UI/UX**

- **Glassmorphism Design** - Beautiful backdrop blur effects
- **Loading States** - Skeleton loaders for optimal UX
- **Dark Theme** - Purple/blue gradient matching design specifications
- **Responsive Layout** - Mobile-first design approach

## 🛠️ Tech Stack

### **Backend**

- **Django 5.2** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **JWT Authentication** - djangorestframework-simplejwt
- **Redis** - Caching (configurable)
- **Swagger/OpenAPI** - API documentation

### **Frontend**

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### **DevOps & Tools**

- **Nx Workspace** - Monorepo management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12+
- **PostgreSQL** 14+
- **Git**

## 🚀 Quick Start

### 1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd test-fullstack
```

### 2. **Backend Setup**

```bash
# Navigate to backend directory
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure PostgreSQL database
# Update apps/backend/backend_api/settings.py with your database credentials

# Run migrations (choose one option)
# Option 1: Using Nx (recommended - handles virtual environment automatically)
cd ../.. && npx nx migrate backend

# Option 2: Traditional Django command (if Nx doesn't work)
# cd apps/backend && source venv/bin/activate && python manage.py migrate

# Populate database with sample data (required for initial setup)
# This creates users, collections, cards, and orders for testing the dashboard
# Note: Use traditional Django command as this is not configured in Nx
cd apps/backend && python manage.py seed_data

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server (choose one option)
# Option 1: Using Nx (recommended - handles virtual environment automatically)
cd ../.. && npx nx serve backend

# Option 2: Traditional Django command (if Nx doesn't work)
# cd apps/backend && source venv/bin/activate && python manage.py runserver 127.0.0.1:8001
```

### 3. **Frontend Setup**

```bash
# Navigate to workspace root
cd ../..

# Install dependencies
npm install

# Start frontend development server
npx nx serve frontend
```

### 4. **Access the Application**

- **Frontend**: http://localhost:4200
- **Backend API**: http://127.0.0.1:8001
- **API Documentation**: http://127.0.0.1:8001/api/docs/

## 🔧 Configuration

### **Environment Variables**

Create `.env` files for environment-specific configuration:

**Backend** (`apps/backend/.env`):

```env
# Database Configuration
DB_NAME=sales_analytics_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
SECRET_KEY=3fg8wgdux(c#gud$5#tq_^n62dlj2746!h7tk)v0f4(jjw_c%!
DEBUG=True

# Redis Configuration
REDIS_URL=redis://localhost:6379/1

# JWT Configuration
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

```

**Frontend** (`.env`):

```env
VITE_API_BASE_URL=http://127.0.0.1:8001/api
```

### **Database Setup**

```sql
-- PostgreSQL setup
CREATE DATABASE cards_db;
CREATE USER cards_user WITH PASSWORD 'cards_password';
GRANT ALL PRIVILEGES ON DATABASE cards_db TO cards_user;
```

## 📚 API Documentation

The API is fully documented with Swagger/OpenAPI:

- **Swagger UI**: http://127.0.0.1:8001/api/docs/
- **ReDoc**: http://127.0.0.1:8001/api/redoc/
- **Schema**: http://127.0.0.1:8001/api/schema/

### **Key Endpoints**

```
Authentication:
POST /api/auth/login/          # User login
POST /api/auth/refresh/        # Token refresh

Dashboard:
GET  /api/dashboard/kpis/      # Dashboard statistics

Resources:
GET  /api/users/               # Users list (admin only)
GET  /api/collections/         # Collections
GET  /api/cards/               # Cards
GET  /api/orders/              # Orders

User Management:
GET  /api/users/me/            # Current user profile
PUT  /api/auth/profile/        # Update profile
```

## 🧪 Testing

### **Backend Tests**

```bash
# Option 1: Using Nx
npx nx test backend

# Option 2: Traditional Django command
cd apps/backend
python manage.py test
```

### **Frontend Tests**

```bash
npx nx test frontend
```

## 🏗️ Project Structure

```
test-fullstack/
├── apps/
│   ├── backend/                 # Django application
│   │   ├── api/                 # Main API app
│   │   │   ├── models.py        # Database models
│   │   │   ├── views.py         # API views
│   │   │   ├── serializers.py   # DRF serializers
│   │   │   ├── permissions.py   # Custom permissions
│   │   │   └── tests/           # Test files
│   │   ├── backend_api/         # Django project settings
│   │   ├── requirements.txt     # Python dependencies
│   │   └── manage.py           # Django management
│   │
│   └── frontend/               # React application
│       ├── src/
│       │   ├── components/     # React components
│       │   │   └── dashboard/  # Dashboard components
│       │   ├── services/       # API services
│       │   ├── store/          # Redux store
│       │   ├── types/          # TypeScript types
│       │   └── styles.css      # Global styles
│       ├── public/             # Static assets
│       └── vite.config.ts      # Vite configuration
│
├── package.json                # Root dependencies
├── nx.json                     # Nx workspace config
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🎨 Design System

### **Colors**

- **Primary Background**: `#120036`
- **Secondary Background**: `#0F0036`
- **Accent Color**: `#F81DFB` (Pink)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#B794F6` (Purple-300)

### **Typography**

- **Headings**: Oxanium font family
- **Body Text**: Poppins font family

### **Components**

- **Glass Cards**: Backdrop blur with gradient borders
- **Interactive Charts**: Chart.js with custom purple theme
- **Status Indicators**: Color-coded order statuses
- **Loading States**: Skeleton loaders for better UX

## 🚀 Deployment

### **Backend Deployment**

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `python manage.py migrate`
4. **Development only**: Seed with sample data: `python manage.py seed_data`
5. Collect static files: `python manage.py collectstatic`
6. Start with Gunicorn: `gunicorn backend_api.wsgi:application`

### **Frontend Deployment**

1. Build the application: `npx nx build frontend`
2. Serve static files from `dist/` directory
3. Configure API URL for production

---
