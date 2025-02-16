# Startify

Startify is an AI-powered startup assistant designed to guide solo founders like Alex through their entrepreneurial journey. By leveraging artificial intelligence, Startify provides personalized support in business idea validation, strategic company building, growth advice, fundraising preparation, and industry connections. Our goal is to empower entrepreneurs to transform their dreams into reality without the need for large teams.

## Features

- **Dashboard**: Monitor your startup's progress and key metrics in one centralized location.
- **Chatbot**: Engage with your AI business companion for real-time advice and support.
- **Pitch Generator**: Create compelling elevator pitches to captivate potential investors.
- **Presentation Creator**: Develop professional presentations to effectively communicate your business vision.
- **Market Insights**: Access up-to-date market trends and data to stay competitive.
- **Scheduler**: Organize meetings and manage your calendar efficiently.
- **Message Generator**: Craft personalized messages and cold emails for investor outreach.
- **Stress-Relief Chats**: Enjoy light-hearted conversations to maintain a healthy work-life balance.

## Getting Started

Follow these instructions to set up and run Startify on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [Python](https://www.python.org/) (v3.8 or later)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/patel-mahek/Startify.git
   cd Startify
   ```

2. **Backend Setup**:

   Navigate to the `backend` directory and set up the Python environment.

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

   Ensure you have a `.env` file in the `backend` directory with the necessary environment variables.

3. **Frontend Setup**:

   Navigate to the `frontend/stratify` directory and install dependencies.

   ```bash
   cd ../frontend/stratify
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:

   In the `backend` directory, activate the virtual environment if it's not already active.

   ```bash
   cd backend
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

   Then, start the server.

   ```bash
   python app.py
   ```

   The backend server should now be running.

2. **Start the Frontend Server**:

   Open a new terminal window, navigate to the `frontend/stratify` directory, and start the development server.

   ```bash
   cd frontend/stratify
   npm start
   ```

   The frontend application should now be running.

### Usage

- Access the application via your web browser at `http://localhost:3000`.
- Sign up or log in to your account.
- Explore the dashboard and utilize the various features to assist in your startup journey.

## Contributing

We welcome contributions to enhance Startify. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Note: This README is based on the provided project description and may need adjustments to align with the actual project structure and setup.*
