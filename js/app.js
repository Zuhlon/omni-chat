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
        button.textContent = '▶️';
        button.dataset.playing = 'false';
        // Stop animation
        const bars = button.parentElement.querySelectorAll('.waveform-bars span');
        bars.forEach(bar => bar.style.animationPlayState = 'paused');
    } else {
        button.textContent = '⏸️';
        button.dataset.playing = 'true';
        // Start animation
        const bars = button.parentElement.querySelectorAll('.waveform-bars span');
        bars.forEach(bar => bar.style.animationPlayState = 'running');
        
        // Simulate playback end after duration
        setTimeout(() => {
            if (button.dataset.playing === 'true') {
                togglePlay(button);
            }
        }, 5000);
    }
}

// Show transcription (full text or summary)
function showTranscription(type, button) {
    const panel = button.closest('.transcription-panel');
    const buttons = panel.querySelectorAll('.toggle-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Find the correct transcription content
    let fullId = 'transcription-full';
    let summaryId = 'transcription-summary';
    
    // Check if we're on screen 2
    if (panel.closest('.outgoing')) {
        fullId = 'transcription-full-2';
        summaryId = 'transcription-summary-2';
    }
    
    const fullContent = document.getElementById(fullId);
    const summaryContent = document.getElementById(summaryId);
    
    if (type === 'full') {
        if (fullContent) {
            fullContent.classList.remove('hidden');
        }
        if (summaryContent) {
            summaryContent.classList.add('hidden');
        }
    } else {
        if (fullContent) {
            fullContent.classList.add('hidden');
        }
        if (summaryContent) {
            summaryContent.classList.remove('hidden');
        }
    }
}

// Toggle call history panel
function toggleCallHistory() {
    const panel = document.querySelector('.call-history-panel');
    panel.classList.toggle('expanded');
}

// Confirm booking
function confirmBooking() {
    showToast('✅ Запись подтверждена! Ждём вас завтра в 15:00');
    
    // Add visual feedback
    const btn = document.querySelector('.confirm-btn');
    if (btn) {
        btn.textContent = '✓ Подтверждено';
        btn.style.background = 'linear-gradient(135deg, #8cc152 0%, #7ab042 100%)';
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
                status.textContent = 'Соединение установлено • 00:00';
                let seconds = 0;
                setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    status.textContent = `Соединение установлено • ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }, 1000);
            }
        }, 2000);
    }
}

// End call
function endCall(button) {
    const modal = button.closest('.call-modal');
    if (modal) {
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
        voiceBtn.style.background = '#e74c3c';
        voiceBtn.style.color = 'white';
        voiceBtn.style.borderRadius = '50%';
        
        showToast('🔴 Запись голосового сообщения...');
        
        // Simulate recording for 3 seconds
        setTimeout(() => {
            voiceBtn.style.background = '';
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
            messageInput.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.3)';
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

// Interactive waveform animation on hover
document.querySelectorAll('.waveform-bars').forEach(waveform => {
    waveform.addEventListener('mouseenter', () => {
        waveform.querySelectorAll('span').forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    });
    
    waveform.addEventListener('mouseleave', () => {
        const playBtn = waveform.closest('.voice-header').querySelector('.play-btn');
        if (playBtn && playBtn.dataset.playing !== 'true') {
            waveform.querySelectorAll('span').forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    });
});

console.log('🎵 Омниканальный мессенджер загружен!');
console.log('📱 Интерактивный прототип готов к использованию');
