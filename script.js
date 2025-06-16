document.addEventListener('DOMContentLoaded', async () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearChatBtn = document.getElementById('clear-chat');
    const viewCountContainer = document.getElementById('view-count-container');

    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach(msg => appendMessage(msg.role, msg.content));

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    clearChatBtn.addEventListener('click', () => {
        localStorage.removeItem('chatMessages');
        chatBox.innerHTML = '';
        messages = [];
    });

    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBcaSNQuZizwEo39oz5zpCirHyuSK78Htk",
        authDomain: "basic-curve-447915-i9.firebaseapp.com",
        projectId: "basic-curve-447915-i9",
        storageBucket: "basic-curve-447915-i9.firebasestorage.app",
        messagingSenderId: "824954986365",
        appId: "1:824954986365:web:fc974280d4da46ae1f3614",
        measurementId: "G-50LPQ2GDHK"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const pageViewsCollection = db.collection('page_views');
    const pageViewDoc = pageViewsCollection.doc('home');

    // Increment and display page views
    await incrementPageViews();
    displayPageViews();

    function formatText(text) {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index)
                });
            }

            parts.push({
                type: 'bold',
                content: match[1]
            });

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex)
            });
        }

        return parts;
    }

    function formatCodeBlocks(text) {
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map(part => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const firstLineEnd = part.indexOf('\n');
                const firstLine = part.slice(3, firstLineEnd).trim();
                const code = part.slice(firstLineEnd + 1, -3).trim();

                const codeBlock = document.createElement('div');
                codeBlock.className = 'code-block';

                if (firstLine) {
                    const languageLabel = document.createElement('div');
                    languageLabel.className = 'code-language';
                    languageLabel.textContent = firstLine;
                    codeBlock.appendChild(languageLabel);
                }

                const codeContent = document.createElement('pre');
                const codeElement = document.createElement('code');
                codeElement.textContent = code;
                codeContent.appendChild(codeElement);
                codeBlock.appendChild(codeContent);

                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Copy';
                copyBtn.onclick = () => copyToClipboard(code);
                codeBlock.appendChild(copyBtn);

                return codeBlock;
            }

            const formattedParts = formatText(part);
            const container = document.createElement('div');
            container.className = 'text-content';

            formattedParts.forEach(textPart => {
                if (textPart.type === 'bold') {
                    const boldSpan = document.createElement('strong');
                    boldSpan.textContent = textPart.content;
                    container.appendChild(boldSpan);
                } else {
                    const textNode = document.createTextNode(textPart.content);
                    container.appendChild(textNode);
                }
            });

            return container;
        });
    }

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage('user', userMessage);
        messages.push({ role: 'user', content: userMessage });
        localStorage.setItem('chatMessages', JSON.stringify(messages));

        userInput.value = '';

        const typingIndicator = appendTypingIndicator();

        fetchGeminiResponse(userMessage).then(response => {
            chatBox.removeChild(typingIndicator);
            appendMessageWithTypingEffect('bot', response);
            messages.push({ role: 'bot', content: response });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }).catch(error => {
            chatBox.removeChild(typingIndicator);
            appendMessage('bot', `Sorry, I encountered an error: ${error.message}. Please check the API key, model name, or endpoint.`);
        });
    }

    function appendTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot');
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
        return typingIndicator;
    }

    function appendMessageWithTypingEffect(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        let i = 0;
        const typingSpeed = 10;

        function typeWriter() {
            if (i < content.length) {
                const formattedContent = formatCodeBlocks(content.substring(0, i + 1));
                messageContent.innerHTML = '';
                formattedContent.forEach(part => {
                    messageContent.appendChild(part);
                });
                i++;
                setTimeout(typeWriter, typingSpeed);
                chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll during typing
            }
        }

        typeWriter();
    }

    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const formattedContent = formatCodeBlocks(content);

        if (Array.isArray(formattedContent)) {
            formattedContent.forEach(part => {
                messageContent.appendChild(part);
            });
        } else {
            messageContent.textContent = content;
        }

        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        });
    }

    async function incrementPageViews() {
        try {
            const docSnapshot = await pageViewDoc.get();
            if (docSnapshot.exists) {
                await pageViewDoc.update({
                    count: firebase.firestore.FieldValue.increment(1)
                });
            } else {
                await pageViewDoc.set({ count: 1 });
            }
        } catch (error) {
            console.error("Error incrementing page views:", error);
            if (viewCountContainer) {
                viewCountContainer.innerText = "Error loading views";
            }
        }
    }

    function displayPageViews() {
        pageViewDoc.onSnapshot((docSnapshot) => {
            if (docSnapshot.exists) {
                const viewCount = docSnapshot.data().count;
                console.log(`Total Page Views: ${viewCount}`); // Debugging
                if (viewCountContainer) {
                    viewCountContainer.innerHTML = `<i class="fas fa-eye"></i> Total Page Views: ${viewCount}`;
                }
            } else {
                console.log("Document doesn't exist yet.");
                if (viewCountContainer) {
                    viewCountContainer.innerText = "No views yet";
                }
            }
        }, (error) => {
            console.error("Error fetching real-time updates:", error);
            if (viewCountContainer) {
                viewCountContainer.innerText = "Error loading views";
            }
        });
    }

    async function fetchGeminiResponse(userMessage) {
        const apiKey = 'AIzaSyCk4f8ifiVPbww5cCrpqtTv-ZnKClv6tj8'; // Replace with your actual API key or use a secure method
        const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

        try {
            const response = await fetch(`${apiUrl}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: userMessage
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("Invalid Gemini API response:", data); // Log the full response for debugging
                throw new Error('Invalid response structure from Gemini API');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
});