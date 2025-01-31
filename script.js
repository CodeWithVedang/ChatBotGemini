const API_KEY = "AIzaSyCIQ8ueVkFNRNYbC6zMSJIkTVne49FMbuw"; // Replace with your Gemini API key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("User", message, "user-message");
    userInput.value = "";

    const loadingMessage = appendLoadingMessage(); // Show animated loader

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            }),
        });

        const data = await response.json();
        loadingMessage.remove(); // Remove loader when response arrives

        if (data?.candidates?.length > 0) {
            let fullResponse = "";
            data.candidates[0].content.parts.forEach(part => {
                fullResponse += part.text + " ";
            });

            if (fullResponse.includes("```")) {
                appendCodeMessage(fullResponse.trim());
            } else {
                appendMessage("Bot", fullResponse.trim(), "bot-message");
            }
        } else {
            appendMessage("Bot", "Sorry, I couldn't understand that.", "bot-message");
        }
    } catch (error) {
        loadingMessage.remove();
        appendMessage("Bot", "Oops! Something went wrong.", "bot-message");
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

    return loaderDiv; // Return loader div for removal later
}

function appendCodeMessage(codeText) {
    const codeBlock = document.createElement("div");
    codeBlock.classList.add("code-message");

    // Extracting code between triple backticks ```
    const codeContent = codeText.match(/```([\s\S]*?)```/);
    const codeSnippet = codeContent ? codeContent[1].trim() : codeText;

    // Create a preformatted text block
    const preTag = document.createElement("pre");
    const codeTag = document.createElement("code");
    codeTag.textContent = codeSnippet;
    preTag.appendChild(codeTag);

    // Create a Copy button
    const copyButton = document.createElement("button");
    copyButton.innerHTML = "📋 Copy Code";
    copyButton.classList.add("copy-button");
    copyButton.onclick = () => {
        navigator.clipboard.writeText(codeSnippet);
        copyButton.innerHTML = "✅ Copied!";
        setTimeout(() => {
            copyButton.innerHTML = "📋 Copy Code";
        }, 2000);
    };

    // Append everything to the code block
    codeBlock.appendChild(copyButton);
    codeBlock.appendChild(preTag);

    chatBox.appendChild(codeBlock);
    chatBox.scrollTop = chatBox.scrollHeight;
}
