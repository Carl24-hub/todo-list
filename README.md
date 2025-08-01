# ✨ Beautiful To-Do List Application

A modern, aesthetic todo list application with smooth animations and SweetAlert notifications.

## 🚀 Features

- **Beautiful UI**: Modern glass-morphism design with gradient backgrounds
- **Smooth Animations**: Fade-in effects and hover animations
- **SweetAlert Notifications**: Beautiful toast notifications for all actions
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Instant feedback for all user actions
- **Confirmation Dialogs**: Safe deletion with confirmation prompts
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.7+ 
- Flask
- Flask-CORS

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install flask flask-cors
   ```

2. **Start the backend server:**
   ```bash
   cd backend
   python app.py
   ```
   The server will start at `http://127.0.0.1:5000`

3. **Open the frontend:**
   - Navigate to the `frontend` folder
   - Open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     cd frontend
     python -m http.server 8000
     ```
     Then visit `http://localhost:8000`

## 🎨 UI Enhancements

- **Glass-morphism Effect**: Semi-transparent background with blur
- **Gradient Backgrounds**: Beautiful color gradients throughout
- **Font Awesome Icons**: Modern icons for better visual appeal
- **Hover Effects**: Smooth transitions on interactive elements
- **Loading States**: Visual feedback during operations
- **Empty State**: Helpful message when no tasks exist

## 🔔 SweetAlert Notifications

- **Success Messages**: Toast notifications for successful actions
- **Error Messages**: Modal dialogs for errors
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Loading Indicators**: Visual feedback during API calls

## 🎯 How to Use

1. **Add a Task**: Type in the input field and press Enter or click "Add"
2. **Mark as Done**: Click the green checkmark button
3. **Delete Task**: Click the red trash button (with confirmation)
4. **View Tasks**: All tasks are displayed with beautiful animations

## 🎨 Customization

The application uses:
- **Tailwind CSS** for styling
- **SweetAlert2** for notifications
- **Font Awesome** for icons
- **Custom CSS animations** for smooth effects

You can easily customize colors, animations, and styling by modifying the CSS in `index.html`.

## 🔧 API Endpoints

- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Add a new task
- `PUT /tasks/<id>` - Mark task as done
- `DELETE /tasks/<id>` - Delete a task
- `GET /health` - Health check endpoint

## 🌟 Enjoy Your Beautiful Todo List!

The application now features a modern, aesthetic design with smooth animations and delightful user interactions. Every action provides immediate visual feedback through beautiful notifications and animations. 