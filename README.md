# ErdonTask (Pro Dashboard)

## 📖 The Story
What started two years ago as a simple, basic project for a university course has now been completely redesigned and upgraded into a **Professional Task Management Dashboard**. 

Initially built as a basic prototype, **ErdonTask** has evolved into a fully functional Single Page Application (SPA). The old, clunky multi-step processes have been replaced with a sleek, interactive, and beautifully animated dark-mode interface that doesn't even require a browser refresh. Underneath the hood, the backend has been fortified with professional-grade technologies ensuring speed, structure, and reliable data persistence.

## 🚀 Features

- **Blazing Fast SPA Routing:** Navigate through Dashboard, My Tasks, Analytics, and Settings without reloading the page.
- **Dynamic Task Management:** Create, view, complete, and delete tasks instantly.
- **Smart Filtering:** Quickly sort your tasks by 'Pending', 'Completed', or 'All'.
- **Live Analytics:** A gorgeous circular chart and progress bar that calculate your completion rates in real-time.
- **Danger Zone / Settings:** Wipe all user data in a single click when a fresh start is needed.
- **Premium Aesthetics:** Glassmorphism UI, smooth hover animations, and a soothing dark theme.
- **Toast Notifications:** Gentle alerts keep you informed of actions without intrusive pop-ups.

## 🛠 Tech Stack

### Frontend
- Pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (No heavy frontend frameworks needed for this level of performance).
- **FontAwesome** for scalable iconography.
- Dynamic DOM manipulation for the SPA logic.

### Backend
- **FastAPI** as the lightning-fast web framework.
- **SQLite** + **SQLAlchemy** for powerful, local data persistence (ORMs).
- **Pydantic** for strict API data validation.

## ⚙️ How to Run

1. **Install dependencies:**
   Make sure you have Python installed, then run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   Launch the FastAPI and Uvicorn server by running this command in the project root:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

3. **Enjoy!**
   Open your browser and navigate to exactly: [http://localhost:8000/](http://localhost:8000/) 

---
*Developed & Upgraded by Erdona Kadriolli*
