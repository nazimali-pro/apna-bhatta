# Apna Bhatta - Digital Brick Marketplace

Apna Bhatta is a comprehensive digital platform connecting Brick Kiln Owners (Bhattas), Customers, and Drivers. The platform streamlines the process of buying, selling, and delivering bricks with live tracking and secure payments.

---

## 🛠 Setup & Installation Guide

This guide will help you get the project running on your local machine. Follow the steps carefully.

### 1. Prerequisites
Before you begin, make sure you have the following installed:
- **Node.js**: [Download here](https://nodejs.org/) (Version 18 or higher is recommended).
- **Cloud Database (Neon/Supabase)**: A PostgreSQL database instance (Recommended for production/deployment).
- **Git**: [Download here](https://git-scm.com/) (Optional, but recommended for cloning).

---

### 2. Get the Code (Two Ways)

#### **Option A: Download ZIP (Simplest for beginners)**
1. Visit the project link on GitHub: [https://github.com/rana-muhammad-awais/apna-bhatta](https://github.com/rana-muhammad-awais/apna-bhatta)
2. Click the green **"<> Code"** button.
3. Click **"Download ZIP"**.
4. Once downloaded, **Extract/Unzip** the folder to a place like your Desktop or Documents.
5. Open your terminal (Command Prompt or PowerShell) and go into that folder:
   ```bash
   cd Desktop/apna-bhatta-main
   ```

#### **Option B: Clone with Git**
```bash
git clone https://github.com/rana-muhammad-awais/apna-bhatta.git
cd apna-bhatta
```

---

### 3. Install the Project
Run this command in your terminal to install all the necessary libraries:
```bash
npm install
```

---

### 4. Setup Environment Variables
The project needs to know how to connect to your database.
1. In the main folder, create a new file named `.env`.
2. Copy and paste the following into that file:

```env
# Your Cloud PostgreSQL connection string (Neon, Supabase, etc.)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Admin panel credentials
ADMIN_ID="admin"
ADMIN_PASSWORD="your_secure_password"
ADMIN_SECRET="your_jwt_secret"
```

---

### 5. Setup the Database
Now, tell the project to sync the schema to your database:
```bash
npx prisma migrate deploy
npx prisma generate
```

---

### 6. Run the App
Finally, start the application:
```bash
npm run dev
```
Open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Key Features
- **🚚 Live Tracking**: Customers can see driver details and track their delivery. Drivers get precise GPS navigation.
- **🧱 Inventory Management**: Advanced inventory system for managing brick types, strength, and dimensions.
- **🛡️ Admin Dashboard**: Full control over products, orders, and financial reports.
- **👤 User Roles**: Specialized interfaces for Customers, Drivers, and Admin.

## 🚀 Deployment
To put this online, we recommend using [Vercel](https://vercel.com/). You will need to provide the same `.env` variables in the Vercel dashboard.
