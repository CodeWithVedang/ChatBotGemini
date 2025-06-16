# GeminiSense

**GeminiSense** is a modern, responsive chat application that allows users to interact with a conversational AI powered by the Gemini API. The app features a sleek dark-themed UI, real-time page view tracking with Firebase, and local storage for chat history. It supports rich text formatting (e.g., bold text, code blocks) and is optimized for both desktop and mobile devices.

## Features

- **Conversational AI**: Powered by the Gemini API for intelligent responses.
- **Real-Time Page Views**: Tracks page views using Firebase Firestore with real-time updates.
- **Responsive Design**: Works seamlessly on desktop and mobile devices with a modern, dark-themed UI.
- **Rich Text Formatting**: Supports bold text and code blocks with syntax highlighting and a copy-to-clipboard feature.
- **Local Storage**: Persists chat history in the browser using `localStorage`.
- **Typing Animation**: Displays a typing indicator and animates bot responses for a better user experience.
- **Clear Chat**: Allows users to clear the chat history with a single button.
- **Error Handling**: Gracefully handles API errors and Firebase issues with user-friendly messages.

## Demo

You can test the live application https://chat-bot-gemini-beta.vercel.app/ 

## Installation

Follow these steps to set up and run the project locally:

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- An internet connection to load external libraries (Font Awesome, Firebase SDK).
- A Firebase project for page view tracking (optional, if you want to enable this feature).
- A Gemini API key for the conversational AI (replace the placeholder in `script.js`).

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/CodeWithVedang/GeminiSense.git
   cd GeminiSense
   ```

2. **Set Up Firebase (Optional)**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and copy your Firebase configuration.
   - In `script.js`, replace the `firebaseConfig` object with your Firebase project credentials:

     ```javascript
     const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID",
         measurementId: "YOUR_MEASUREMENT_ID"
     };
     ```

   - Update Firestore security rules to allow read/write access to the `page_views` collection (or adjust as needed for security).

3. **Set Up Gemini API**

   - Obtain a Gemini API key from [Google AI](https://ai.google.dev/) (or your API provider).
   - In `script.js`, replace the `apiKey` in the `fetchGeminiResponse` function with your actual API key:

     ```javascript
     const apiKey = 'YOUR_GEMINI_API_KEY';
     ```

   **Note**: For production, consider securing your API keys using environment variables or a backend proxy.

4. **Run the Application**

   - Since this is a static website, you can open `index.html` directly in a browser:
     ```bash
     open index.html
     ```
   - Alternatively, use a local development server (e.g., with VS Code Live Server or Python):
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your browser.

## Usage

1. Open the application in your browser.
2. Type a message in the input field and press **Enter** or click the send button (paper plane icon).
3. The bot will respond with a typing animation, and the conversation will be saved in `localStorage`.
4. Use the **Clear** button in the header to reset the chat history.
5. The page views counter at the bottom updates in real-time using Firebase Firestore.
6. Format your messages with:
   - **Bold**: Surround text with double asterisks, e.g., `**bold text**`.
   - **Code Blocks**: Use triple backticks with an optional language identifier, e.g.:
     
     ```javascript
     console.log("Hello, world!");
     ```
     

## Project Structure

```
GeminiSense/
│
├── index.html       # Main HTML file with the chat UI structure
├── script.js        # JavaScript logic for chat functionality, API calls, and Firebase integration
├── styles.css       # CSS styles for the UI, including responsive design
└── README.md        # Project documentation (this file)
```

## Technologies Used

- **HTML5/CSS3**: For the structure and styling of the UI.
- **JavaScript (ES6+)**: For the chat logic, API calls, and Firebase integration.
- **Firebase Firestore**: For real-time page view tracking.
- **Gemini API**: For conversational AI responses.
- **Font Awesome**: For icons (e.g., robot, send, clear, GitHub).
- **Local Storage**: For persisting chat history in the browser.

## Contributing

Contributions are welcome! If you'd like to contribute to GeminiSense, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request with a detailed description of your changes.

## Contact

For questions, feedback, or support, feel free to reach out:

- **GitHub**: [CodeWithVedang](https://github.com/CodeWithVedang)

---

*Built with 💻 by [CodeWithVedang](https://github.com/CodeWithVedang) on June 16, 2025.*

