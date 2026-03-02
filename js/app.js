// Navigation between screens
function goToScreen(screenNumber) {
    if (screenNumber === 1) {
        window.location.href = 'index.html';
    } else if (screenNumber === 2) {
        window.location.href = 'screen2.html';
    }
}

// Toggle voice message play
function togglePlay(button) {
    const isPlaying = button.dataset.playing === 'true';
    
    if (isPlaying) {
        button.textContent = '▶';
        button.dataset.playing = 'false';
    } else {
        button.textContent = '⏸';
        button.dataset.playing = 'true';
        
        // Simulate playback end after duration
        setTimeout(() => {
            if (button.dataset.playing === 'true') {
                togglePlay(button);
            }
        }, 5000);
    }
}

// Show transcription with 3-second loader
function showTranscription(id) {
    const player = document.getElementById(`player-${id}`);
    const loader = document.getElementById(`loader-${id}`);
    const transcription = document.getElementById(`transcription-${id}`);
    const transcribeBtn = player.querySelector('.transcribe-btn');
    
    // Hide player content (but keep structure)
    player.style.opacity = '0.5';
    player.style.pointerEvents = 'none';
    
    // Disable transcribe button
    transcribeBtn.disabled = true;
    transcribeBtn.style.cursor = 'default';
    
    // Show loader
    loader.classList.remove('hidden');
    
    // After 3 seconds, hide loader and show transcription
    setTimeout(() => {
        // Restore player
        player.style.opacity = '1';
        player.style.pointerEvents = 'auto';
        
        // Hide loader
        loader.classList.add('hidden');
        
        // Show transcription panel
        transcription.classList.remove('hidden');
        
        // Ensure summary tab is active by default
        switchTab('summary', id, transcription.querySelector('.toggle-btn:last-child'));
        
        // Change transcribe button to "opened" state
        transcribeBtn.innerHTML = '<span class="transcribe-icon">📄</span>';
        transcribeBtn.onclick = null; // Remove click handler
        transcribeBtn.style.cursor = 'default';
    }, 3000);
}

// Switch between tabs (full text / summary)
function switchTab(type, id, button) {
    const panel = button.closest('.transcription-panel');
    const buttons = panel.querySelectorAll('.toggle-btn');
    const fullContent = document.getElementById(`full-${id}`);
    const summaryContent = document.getElementById(`summary-${id}`);
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Show/hide content
    if (type === 'full') {
        fullContent.classList.remove('hidden');
        summaryContent.classList.add('hidden');
    } else {
        fullContent.classList.add('hidden');
        summaryContent.classList.remove('hidden');
    }
}

// Toggle call history panel
function toggleCallHistory() {
    const panel = document.querySelector('.call-history-panel');
    panel.classList.toggle('expanded');
}

// Confirm booking
function confirmBooking() {
    showToast('✓ Запись подтверждена! Ждём вас завтра в 15:00');
    
    // Add visual feedback
    const btn = document.querySelector('.confirm-btn');
    if (btn) {
        btn.textContent = '✓ Подтверждено';
        btn.style.background = 'rgba(100, 140, 100, 0.5)';
        btn.disabled = true;
    }
}

// Simulate call
function simulateCall(type) {
    const modal = document.createElement('div');
    modal.className = 'call-modal active';
    modal.innerHTML = `
        <div class="call-modal-content">
            <div class="caller-avatar">🎧</div>
            <div class="caller-name">Audiophile Zal</div>
            <div class="call-status">${type === 'outgoing' ? 'Вызов...' : 'Входящий звонок'}</div>
            <div class="call-actions">
                <button class="end-call-btn" onclick="endCall(this)">📵</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-answer after 2 seconds for incoming calls
    if (type === 'incoming') {
        setTimeout(() => {
            const status = modal.querySelector('.call-status');
            if (status) {
                status.textContent = 'Соединение • 00:00';
                let seconds = 0;
                const interval = setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    status.textContent = `Соединение • ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }, 1000);
                modal.dataset.callInterval = interval;
            }
        }, 2000);
    }
}

// End call
function endCall(button) {
    const modal = button.closest('.call-modal');
    if (modal) {
        // Clear interval if exists
        if (modal.dataset.callInterval) {
            clearInterval(parseInt(modal.dataset.callInterval));
        }
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    showToast('Звонок завершён');
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Start voice recording (simulation)
function startVoiceRecord() {
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.style.color = 'rgba(200, 100, 100, 0.8)';
        
        showToast('🔴 Запись голосового сообщения...');
        
        // Simulate recording for 3 seconds
        setTimeout(() => {
            voiceBtn.style.color = '';
            showToast('✓ Голосовое сообщение записано');
        }, 3000);
    }
}

// Add smooth scroll for chat messages
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add input focus animation
    const messageInput = document.querySelector('.message-input');
    if (messageInput) {
        messageInput.addEventListener('focus', () => {
            messageInput.style.boxShadow = '0 0 0 1px rgba(150, 180, 150, 0.3)';
        });
        
        messageInput.addEventListener('blur', () => {
            messageInput.style.boxShadow = '';
        });
        
        // Send message on Enter
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim()) {
                addMessage(messageInput.value, 'outgoing');
                messageInput.value = '';
            }
        });
    }
});

// Add new message to chat
function addMessage(text, type = 'outgoing') {
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
    
    // Animate message appearance
    message.style.opacity = '0';
    message.style.transform = 'translateY(20px)';
    setTimeout(() => {
        message.style.transition = 'all 0.3s ease';
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
    }, 10);
}

console.log('🎧 Омниканальный мессенджер загружен!');
console.log('📱 Интерактивный прототип готов к использованию');
