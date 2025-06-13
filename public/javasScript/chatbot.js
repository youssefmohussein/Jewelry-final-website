// --- Open & close chat ---
document.getElementById('openChatBtn').addEventListener('click', () => {
    document.getElementById('chatContainer').style.display = 'flex';
});

document.getElementById('closeChatBtn').addEventListener('click', () => {
    document.getElementById('chatContainer').style.display = 'none';
});

// --- Handle chat submission ---
document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    userInput.value = '';

    const reply = getBotReply(userMessage);
    addMessage('bot', reply);
});

// --- Add message to chat window ---
function addMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
    msgDiv.textContent = message;
    document.getElementById('chatWindow').appendChild(msgDiv);
    document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;
}
function addMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');

    // Detect URLs in bot message and convert them to links
    if (sender === 'bot') {
        msgDiv.innerHTML = message.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
    } else {
        msgDiv.textContent = message;
    }

    document.getElementById('chatWindow').appendChild(msgDiv);
    document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;
}
const faqs = new Map([
  [['hello','hi','hey'], 'Hello! How can I help you today?'],
  [['how are you'], 'I am good, thank you!'],
  [['price','cost'], 'Check our pricing page for more info.'],
  [['contact','support'], 'Email us at support@website.com.'],
  [['login','signin','log in','sign in'], 'You can log in here: http://localhost:8000/login']
  [['refund policy','policy','refund'], 'You can find it here:http://localhost:8000/refundPolicy']
  [['contact','contact-us'], 'You can find it here:http://localhost:8000/contact-us']
  [['FAQ','questions'], 'You can find it here:http://localhost:8000/faq']


]);

function getBotReply(msg) {
  const text = msg.toLowerCase();
  for (let [keys, response] of faqs) {
    if (keys.some(k => text.includes(k))) return response;
  }
  return "I am trying to help youI cannot answer this";
}
