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

// Play video (open modal)
function playVideo(id) {
    const modal = document.getElementById(`video-modal-${id}`);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Close video modal
function closeVideo(id) {
    const modal = document.getElementById(`video-modal-${id}`);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Toggle video play/pause
function toggleVideoPlay(id) {
    const btn = event.target;
    const isPlaying = btn.dataset.playing === 'true';
    
    if (isPlaying) {
        btn.textContent = '▶';
        btn.dataset.playing = 'false';
    } else {
        btn.textContent = '⏸';
        btn.dataset.playing = 'true';
        
        const progressFill = document.querySelector(`#video-modal-${id} .video-progress-fill`);
        const progressTime = document.querySelector(`#video-modal-${id} .video-progress-time`);
        let progress = parseFloat(progressFill.style.width) || 0;
        
        const interval = setInterval(() => {
            if (btn.dataset.playing !== 'true' || progress >= 100) {
                clearInterval(interval);
                if (progress >= 100) {
                    btn.textContent = '▶';
                    btn.dataset.playing = 'false';
                }
                return;
            }
            progress += 0.3;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            
            const totalSeconds = 332;
            const currentSeconds = Math.floor((progress / 100) * totalSeconds);
            const mins = Math.floor(currentSeconds / 60);
            const secs = currentSeconds % 60;
            progressTime.textContent = `${mins}:${secs.toString().padStart(2, '0')} / 5:32`;
        }, 100);
    }
}

// Show video transcription
function showVideoTranscription(id) {
    const container = document.getElementById(`video-player-${id}`);
    const loader = document.getElementById(`video-loader-${id}`);
    const transcription = document.getElementById(`video-transcription-${id}`);
    const transcribeBtn = container.querySelector('.transcribe-btn');
    
    transcribeBtn.disabled = true;
    transcribeBtn.style.cursor = 'default';
    container.style.opacity = '0.5';
    
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        container.style.opacity = '1';
        loader.classList.add('hidden');
        transcription.classList.remove('hidden');
        
        switchVideoTab('summary', id, transcription.querySelector('.toggle-btn:last-child'));
        
        transcribeBtn.innerHTML = '<span class="transcribe-icon">▲</span>';
        transcribeBtn.disabled = false;
        transcribeBtn.style.cursor = 'pointer';
        transcribeBtn.onclick = () => closeVideoTranscription(id);
    }, 3000);
}

// Close video transcription
function closeVideoTranscription(id) {
    const container = document.getElementById(`video-player-${id}`);
    const transcription = document.getElementById(`video-transcription-${id}`);
    const transcribeBtn = container.querySelector('.transcribe-btn');
    
    transcription.classList.add('hidden');
    transcribeBtn.innerHTML = '<span class="transcribe-icon">A→</span>';
    transcribeBtn.onclick = () => showVideoTranscription(id);
}

// Switch video tabs
function switchVideoTab(type, id, button) {
    const panel = button.closest('.transcription-panel');
    const buttons = panel.querySelectorAll('.toggle-btn');
    const fullContent = document.getElementById(`video-full-${id}`);
    const summaryContent = document.getElementById(`video-summary-${id}`);
    
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

// Confirm booking
function confirmBooking() {
    showToast('✓ Запись подтверждена!');
    const btn = document.querySelector('.confirm-btn');
    if (btn) {
        btn.textContent = '✓ Подтверждено';
        btn.style.background = 'rgba(100, 140, 100, 0.5)';
        btn.disabled = true;
    }
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
