// Navigation
function goToScreen(screenNumber) {
    if (screenNumber === 1) {
        window.location.href = 'index.html';
    } else if (screenNumber === 2) {
        window.location.href = 'screen2.html';
    }
}

// Select chat from sidebar
function selectChat(element) {
    // Remove active class from all chats
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected chat
    element.classList.add('active');
    
    // In real app, this would load different chat data
    showToast('Чат загружен');
}

// Toggle voice play
function togglePlay(button) {
    const isPlaying = button.dataset.playing === 'true';
    
    if (isPlaying) {
        button.textContent = '▶';
        button.dataset.playing = 'false';
    } else {
        button.textContent = '⏸';
        button.dataset.playing = 'true';
        
        setTimeout(() => {
            if (button.dataset.playing === 'true') {
                togglePlay(button);
            }
        }, 5000);
    }
}

// Show transcription
function showTranscription(id) {
    const player = document.getElementById(`player-${id}`);
    const loader = document.getElementById(`loader-${id}`);
    const transcription = document.getElementById(`transcription-${id}`);
    const transcribeBtn = player.querySelector('.transcribe-btn');
    
    transcribeBtn.disabled = true;
    transcribeBtn.style.cursor = 'default';
    player.style.opacity = '0.5';
    
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        player.style.opacity = '1';
        loader.classList.add('hidden');
        transcription.classList.remove('hidden');
        
        switchTab('summary', id, transcription.querySelector('.toggle-btn:last-child'));
        
        transcribeBtn.innerHTML = '<span class="transcribe-icon">▲</span>';
        transcribeBtn.disabled = false;
        transcribeBtn.style.cursor = 'pointer';
        transcribeBtn.onclick = () => closeTranscription(id);
    }, 3000);
}

// Close transcription
function closeTranscription(id) {
    const player = document.getElementById(`player-${id}`);
    const transcription = document.getElementById(`transcription-${id}`);
    const transcribeBtn = player.querySelector('.transcribe-btn');
    
    transcription.classList.add('hidden');
    transcribeBtn.innerHTML = '<span class="transcribe-icon">A→</span>';
    transcribeBtn.onclick = () => showTranscription(id);
}

// Switch tabs
function switchTab(type, id, button) {
    const panel = button.closest('.transcription-panel');
    const buttons = panel.querySelectorAll('.toggle-btn');
    const fullContent = document.getElementById(`full-${id}`);
    const summaryContent = document.getElementById(`summary-${id}`);
    
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    if (type === 'full') {
        fullContent.classList.remove('hidden');
        summaryContent.classList.add('hidden');
    } else {
        fullContent.classList.add('hidden');
        summaryContent.classList.remove('hidden');
    }
}

// Start video call
function startVideoCall() {
    const modal = document.getElementById('videoCallModal');
    modal.classList.remove('hidden');
    
    // Simulate call status changes
    setTimeout(() => {
        document.querySelector('.status-text').textContent = 'Соединение установлено';
    }, 2000);
}

// Close video call modal
function closeVideoCallModal() {
    const modal = document.getElementById('videoCallModal');
    modal.classList.add('hidden');
    document.querySelector('.status-text').textContent = 'Вызов...';
}

// Show toast
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(120, 150, 120, 0.5);
        color: rgba(255, 255, 255, 0.9);
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1001;
        transition: transform 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(-50%) translateY(0)', 10);
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Scroll chat to bottom
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle message input
    const messageInput = document.querySelector('.message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim()) {
                addMessage(messageInput.value, 'outgoing');
                messageInput.value = '';
            }
        });
    }
});

// Add message to chat
function addMessage(text, type) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    message.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <span class="time">${time}</span>
            ${type === 'outgoing' ? '<span class="read-status">✓✓</span>' : ''}
        </div>
    `;
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

console.log('🖥️ Десктоп оператора загружен');
