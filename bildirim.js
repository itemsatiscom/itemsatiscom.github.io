document.addEventListener('DOMContentLoaded', function() {
    const notificationHeaders = document.querySelectorAll('.notification-clickable');
    
    notificationHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const allContents = document.querySelectorAll('.social-links-container, .delivery-details-container');
            const allHeaders = document.querySelectorAll('.notification-clickable');
            
            // Close all other expanded contents
            allContents.forEach(content => {
                if (content.id !== targetId) {
                    content.style.display = 'none';
                    content.classList.remove('visible');
                }
            });
            
            // Remove expanded class from all other headers
            allHeaders.forEach(h => {
                if (h !== this) {
                    h.classList.remove('expanded');
                    h.closest('.notification-header-container').classList.remove('expanded');
                }
            });
            
            // Toggle current content with animation
            if (targetContent) {
                const isExpanding = !targetContent.classList.contains('visible');
                
                // Toggle header states
                this.classList.toggle('expanded');
                this.closest('.notification-header-container').classList.toggle('expanded');
                
                if (isExpanding) {
                    // Show content first without animation
                    targetContent.style.display = 'block';
                    // Force reflow
                    void targetContent.offsetWidth;
                    // Add visible class for animation
                    targetContent.classList.add('visible');
                    
                    // Start timer if it's the delivery details
                    if (targetId === 'delivery-details') {
                        startTimer();
                    }
                } else {
                    targetContent.classList.remove('visible');
                    // Wait for animation to complete before hiding
                    setTimeout(() => {
                        if (!targetContent.classList.contains('visible')) {
                            targetContent.style.display = 'none';
                        }
                    }, 300); // Match animation duration
                }
            }
        });
    });

    // Warning Modal Functionality
    const warningModal = document.querySelector('.warning-modal');
    const cancelButton = document.querySelector('.action-button.cancel');
    const confirmWarningButton = document.querySelector('.warning-button.confirm');
    const cancelWarningButton = document.querySelector('.warning-button.cancel');

    function showWarningModal() {
        warningModal.style.display = 'flex';
        // Force reflow
        void warningModal.offsetWidth;
        warningModal.classList.add('visible');
    }

    function hideWarningModal() {
        warningModal.classList.remove('visible');
        setTimeout(() => {
            warningModal.style.display = 'none';
        }, 300); // Match animation duration
    }

    // Show warning modal when cancel button is clicked
    cancelButton.addEventListener('click', showWarningModal);

    // Hide warning modal when either button is clicked
    confirmWarningButton.addEventListener('click', hideWarningModal);
    cancelWarningButton.addEventListener('click', hideWarningModal);

    // Hide warning modal when clicking outside the dialog
    warningModal.addEventListener('click', function(e) {
        if (e.target === warningModal) {
            hideWarningModal();
        }
    });
});

function startTimer() {
    const timerElement = document.querySelector('.timer');
    if (!timerElement) return;
    
    let timeLeft = parseInt(timerElement.dataset.duration);
    
    if (window.countdownTimer) {
        clearInterval(window.countdownTimer);
    }

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        let timeString = '';
        
        if (hours > 0) {
            timeString += `${hours} saat `;
        }
        
        timeString += `${minutes.toString().padStart(2, '0')} dakika `;
        timeString += `${seconds.toString().padStart(2, '0')} saniye`;
        
        return timeString;
    }

    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(window.countdownTimer);
            timerElement.textContent = '0 dakika 00 saniye';
            return;
        }

        timerElement.textContent = formatTime(timeLeft);
        timeLeft--;
    }

    updateTimer();
    window.countdownTimer = setInterval(updateTimer, 1000);
} 
