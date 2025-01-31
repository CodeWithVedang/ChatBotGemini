const API_KEY = "AIzaSyCIQ8ueVkFNRNYbC6zMSJIkTVne49FMbuw"; // Replace with your Gemini API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Load previous chat history from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadChatHistory);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("User", message, "user-message");
    saveMessage("User", message, false); // Save message to localStorage
    userInput.value = "";

    const loadingMessage = appendLoadingMessage(); // Show loader

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            }),
        });

        const data = await response.json();
        loadingMessage.remove(); // Remove loader

        if (data?.candidates?.length > 0) {
            let fullResponse = "";
            data.candidates[0].content.parts.forEach(part => {
                fullResponse += part.text + " ";
            });

            if (fullResponse.includes("```")) {
                appendCodeMessage(fullResponse.trim());
                saveMessage("Bot", fullResponse.trim(), true); // Save bot response
            } else {
                appendMessage("Bot", fullResponse.trim(), "bot-message");
                saveMessage("Bot", fullResponse.trim(), false); // Save bot response
            }
        } else {
            appendMessage("Bot", "Sorry, I couldn't understand that.", "bot-message");
            saveMessage("Bot", "Sorry, I couldn't understand that.", false);
        }
    } catch (error) {
        loadingMessage.remove();
        appendMessage("Bot", "Oops! Something went wrong.", "bot-message");
        saveMessage("Bot", "Oops! Something went wrong.", false);
        console.error("Error:", error);
    }
}

function appendMessage(sender, text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", className);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendLoadingMessage() {
    const loaderDiv = document.createElement("div");
    loaderDiv.classList.add("chat-message", "bot-message", "loading");

    // Loader dots animation
    loaderDiv.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;

    chatBox.appendChild(loaderDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return loaderDiv;
}

function appendCodeMessage(codeText) {
    const codeBlock = document.createElement("div");
    codeBlock.classList.add("code-message");

    // Extracting code between triple backticks ```
    const codeContent = codeText.match(/```([\s\S]*?)```/);
    const codeSnippet = codeContent ? codeContent[1].trim() : codeText;

    const preTag = document.createElement("pre");
    const codeTag = document.createElement("code");
    codeTag.textContent = codeSnippet;
    preTag.appendChild(codeTag);

    const copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy Code";
    copyButton.classList.add("copy-button");
    copyButton.onclick = () => {
        navigator.clipboard.writeText(codeSnippet);
        copyButton.innerHTML = "Copied!";
        setTimeout(() => {
            copyButton.innerHTML = "Copy Code";
        }, 2000);
    };

    codeBlock.appendChild(copyButton);
    codeBlock.appendChild(preTag);

    chatBox.appendChild(codeBlock);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Save messages to localStorage
function saveMessage(sender, text, isCode) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ sender, text, isCode });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Load chat history from localStorage when the page loads
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(msg => {
        if (msg.isCode) {
            appendCodeMessage(msg.text); // Load code messages
        } else {
            appendMessage(msg.sender, msg.text, msg.sender === "User" ? "user-message" : "bot-message");
        }
    });

    // Ensure chat box scrolls to the bottom after loading
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Clear chat history (removes messages from localStorage and UI)
function clearChatHistory() {
    localStorage.removeItem("chatHistory");
    chatBox.innerHTML = ""; // Clear chat box UI
}
