// Send Message Function
function sendMessage() {
    let message = document.getElementById("userInput").value.trim();
    if (!message) return;

    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

    fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        let formattedResponse = formatResponse(data.response);
        let responseHTML = `<div class='response-container'>${formattedResponse}</div>`;
        chatbox.innerHTML += responseHTML;
        chatbox.scrollTop = chatbox.scrollHeight;
    });

    document.getElementById("userInput").value = "";
}

// Format Response: Detects and highlights code
function formatResponse(response) {
    let codeRegex = /```([\s\S]*?)```/g;
    let formatted = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");

    return formatted.replace(codeRegex, (match, code) => {
        return `<div class='code-container'>
                    <pre><code>${code}</code></pre>
                    <button class='copy-btn' onclick='copyCode(this)'>Copy</button>
                </div>`;
    });
}

// Copy Button for Code Only
function copyCode(button) {
    let codeText = button.previousElementSibling.innerText;
    navigator.clipboard.writeText(codeText);
    button.innerText = "Copied!";
    setTimeout(() => button.innerText = "Copy", 1500);
}

// 🎤 Voice Input (Fixed)
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById("userInput").value = event.results[0][0].transcript;
    };

    recognition.onerror = function(event) {
        alert("Microphone error: " + event.error);
    };
}
