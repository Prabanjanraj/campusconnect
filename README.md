# 📚 CampusConnect – College Club & Event Hub

CampusConnect is a dynamic full-stack web application designed to connect students with their campus clubs, events, and vibrant community. Students can follow clubs, view personalized event feeds, share event photos ("Watups"), and engage with campus culture seamlessly.

## 🔗 Live Demo
- **Frontend** (React.js): [campusconnect.vercel.app](https://campusconnect.vercel.app)
- **Backend** (Node.js + Express): Hosted on Render (contact for link)

## 🧩 Features

### 🎯 User Features
- 🔐 Secure login with token-based authentication
- 🏫 Explore clubs and their details
- ➕ Follow/unfollow clubs to personalize your feed
- 🗓️ Discover all campus events and club-specific activities
- 🖼️ Upload and browse "Watups" – event photos and announcements
- 📜 Personalized timeline based on followed clubs

### 🛠️ Admin Features
Club admins can:
- Create new events
- Upload event history (photos + descriptions)
- Delete their club's events or snaps

## ⚙️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary for image hosting
- JWT for authentication
- Multer for image uploads

## 🗄️ Folder Structure
```
campusconnect/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main React app
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── app.js             # Main server file
│   └── .env               # Environment variables
├── README.md
└── package.json
```

## 🛠️ Environment Variables

### Frontend (Vercel)
Set variables in `.env` or via Vercel Dashboard if required.

### Backend (Render)
Create a `.env` file in the `server/` directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/clubDB?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

## 🚀 Running Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Prabanjanraj/campusconnect.git
   cd campusconnect
   ```

2. **Set Up Backend**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Set Up Frontend**
   ```bash
   cd ../client
   npm install
   npm start
   ```

## 🧪 Testing
Tested on:
- Browsers: Chrome, Firefox
- Mobile responsiveness: Basic support
- Database: MongoDB Atlas
- Image hosting: Cloudinary upload limits

## 🧑‍💻 Author
Built with 💙 by [Prabanjan Raj](https://github.com/Prabanjanraj)

## 📌 License
This project is licensed under the [MIT License](LICENSE).
