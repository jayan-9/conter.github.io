// Counter Application - Main JavaScript File
// Modular structure with separate logic and UI functions

// ============================================
// 1. INITIALIZATION AND STATE MANAGEMENT
// ============================================

class CounterApp {
    constructor() {
        this.state = {
            counters: [],
            currentCounterIndex: 0,
            history: [],
            historyIndex: -1,
            settings: {
                minValue: 0,
                maxValue: 1000,
                step: 1,
                soundEnabled: true,
                vibrationEnabled: true,
                darkMode: false,
                glassUI: false,
                fontSize: 80,
                fontFamily: 'Roboto Slab',
                bgColor: '#ffffff',
                target: 100
            },
            timers: {
                incrementTimer: null,
                decrementTimer: null
            }
        };
        
        this.audioElements = {
            click: null,
            success: null,
            error: null
        };
        
        this.init();
    }
    
    // Initialize the application
    init() {
        this.cacheDOM();
        this.loadFromStorage();
        this.initAudio();
        this.bindEvents();
        this.updateUI();
        this.showLoading(false);
        
        // Initialize first counter if none exists
        if (this.state.counters.length === 0) {
            this.addCounter('Main Counter');
        }
    }
    
    // Cache DOM elements
    cacheDOM() {
        // Counter elements
        this.counterValue = document.getElementById('counterValue');
        this.counterName = document.getElementById('counterName');
        
        // Control buttons
        this.incrementBtn = document.getElementById('incrementBtn');
        this.decrementBtn = document.getElementById('decrementBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Step controls
        this.stepButtons = document.querySelectorAll('.step-btn');
        this.customStepInput = document.getElementById('customStep');
        this.applyStepBtn = document.getElementById('applyStep');
        
        // Manual input
        this.manualInput = document.getElementById('manualInput');
        this.applyManualBtn = document.getElementById('applyManual');
        
        // Timer controls
        this.startTimerBtn = document.getElementById('startTimer');
        this.startDecrementTimerBtn = document.getElementById('startDecrementTimer');
        this.stopTimerBtn = document.getElementById('stopTimer');
        this.timerIntervalInput = document.getElementById('timerInterval');
        
        // Undo/Redo
        this.undoBtn = document.getElementById('undoBtn');
        this.redoBtn = document.getElementById('redoBtn');
        
        // Settings
        this.minValueInput = document.getElementById('minValue');
        this.maxValueInput = document.getElementById('maxValue');
        this.targetValueInput = document.getElementById('targetValue');
        this.setTargetBtn = document.getElementById('setTarget');
        
        // Visual settings
        this.fontSizeInput = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.fontStyleSelect = document.getElementById('fontStyle');
        this.bgColorInput = document.getElementById('bgColor');
        
        // Sound settings
        this.enableSoundCheckbox = document.getElementById('enableSound');
        this.enableVibrationCheckbox = document.getElementById('enableVibration');
        
        // Theme controls
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.lightModeToggle = document.getElementById('lightModeToggle');
        this.soundToggle = document.getElementById('soundToggle');
        this.uiToggle = document.getElementById('uiToggle');
        
        // Counter management
        this.addCounterBtn = document.getElementById('addCounterBtn');
        this.deleteCounterBtn = document.getElementById('deleteCounter');
        this.renameCounterBtn = document.getElementById('renameCounter');
        this.counterList = document.getElementById('counterList');
        this.addCategoryBtn = document.getElementById('addCategory');
        
        // Tag management
        this.newTagInput = document.getElementById('newTag');
        this.addTagBtn = document.getElementById('addTag');
        this.tagContainer = document.getElementById('tagContainer');
        
        // History
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        // Share & Export
        this.shareBtn = document.getElementById('shareBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        
        // Modals
        this.confirmationModal = document.getElementById('confirmationModal');
        this.importModal = document.getElementById('importModal');
        this.confirmActionBtn = document.getElementById('confirmAction');
        this.cancelActionBtn = document.getElementById('cancelAction');
        this.confirmImportBtn = document.getElementById('confirmImport');
        this.cancelImportBtn = document.getElementById('cancelImport');
        this.modalMessage = document.getElementById('modalMessage');
        this.importData = document.getElementById('importData');
        
        // Notification
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notificationText');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Keyboard help
        this.keyboardHelpBtn = document.getElementById('keyboardHelpBtn');
        this.keyboardHelpContent = document.getElementById('keyboardHelpContent');
        
        // Progress elements
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.goalValue = document.getElementById('goalValue');
        this.progressSection = document.getElementById('progressSection');
        
        // Install button
        this.installBtn = document.getElementById('installBtn');
        
        // Audio elements
        this.audioElements.click = document.getElementById('clickSound');
        this.audioElements.success = document.getElementById('successSound');
        this.audioElements.error = document.getElementById('errorSound');
    }
    
    // ============================================
    // 2. EVENT BINDING
    // ============================================
    
    bindEvents() {
        // Counter controls
        this.incrementBtn.addEventListener('click', () => this.changeCounterValue(this.state.settings.step));
        this.decrementBtn.addEventListener('click', () => this.changeCounterValue(-this.state.settings.step));
        this.resetBtn.addEventListener('click', () => this.showResetConfirmation());
        
        // Step controls
        this.stepButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const step = parseInt(e.target.dataset.step);
                this.changeCounterValue(step);
            });
        });
        
        this.applyStepBtn.addEventListener('click', () => {
            const step = parseInt(this.customStepInput.value) || 1;
            if (step > 0) {
                this.state.settings.step = step;
                this.showNotification(`Step set to ${step}`, 'success');
                this.saveToStorage();
            }
        });
        
        // Manual input
        this.applyManualBtn.addEventListener('click', () => {
            const value = parseInt(this.manualInput.value);
            if (!isNaN(value)) {
                this.setCounterValue(value);
            }
        });
        
        this.manualInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyManualBtn.click();
            }
        });
        
        // Timer controls
        this.startTimerBtn.addEventListener('click', () => this.startAutoIncrement());
        this.startDecrementTimerBtn.addEventListener('click', () => this.startAutoDecrement());
        this.stopTimerBtn.addEventListener('click', () => this.stopAllTimers());
        
        // Undo/Redo
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());
        
        // Settings changes
        this.minValueInput.addEventListener('change', () => {
            this.state.settings.minValue = parseInt(this.minValueInput.value) || 0;
            this.saveToStorage();
            this.updateUI();
        });
        
        this.maxValueInput.addEventListener('change', () => {
            this.state.settings.maxValue = parseInt(this.maxValueInput.value) || 1000;
            this.saveToStorage();
            this.updateUI();
        });
        
        this.setTargetBtn.addEventListener('click', () => {
            const target = parseInt(this.targetValueInput.value) || 100;
            this.state.settings.target = target;
            this.saveToStorage();
            this.updateProgressBar();
            this.showNotification(`Target set to ${target}`, 'success');
        });
        
        // Visual settings
        this.fontSizeInput.addEventListener('input', () => {
            const size = this.fontSizeInput.value;
            this.fontSizeValue.textContent = `${size}px`;
            this.state.settings.fontSize = parseInt(size);
            this.counterValue.style.fontSize = `${size}px`;
            this.saveToStorage();
        });
        
        this.fontStyleSelect.addEventListener('change', () => {
            this.state.settings.fontFamily = this.fontStyleSelect.value;
            this.counterValue.style.fontFamily = this.fontStyleSelect.value;
            this.saveToStorage();
        });
        
        this.bgColorInput.addEventListener('change', () => {
            this.state.settings.bgColor = this.bgColorInput.value;
            document.body.style.backgroundColor = this.bgColorInput.value;
            this.saveToStorage();
        });
        
        // Sound settings
        this.enableSoundCheckbox.addEventListener('change', () => {
            this.state.settings.soundEnabled = this.enableSoundCheckbox.checked;
            this.saveToStorage();
        });
        
        this.enableVibrationCheckbox.addEventListener('change', () => {
            this.state.settings.vibrationEnabled = this.enableVibrationCheckbox.checked;
            this.saveToStorage();
        });
        
        // Theme controls
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode(true));
        this.lightModeToggle.addEventListener('click', () => this.toggleDarkMode(false));
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        this.uiToggle.addEventListener('click', () => this.toggleUI());
        
        // Counter management
        this.addCounterBtn.addEventListener('click', () => this.addCounter());
        this.deleteCounterBtn.addEventListener('click', () => this.deleteCounter());
        this.renameCounterBtn.addEventListener('click', () => this.renameCounter());
        this.counterName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.renameCounter();
            }
        });
        
        // Tag management
        this.addTagBtn.addEventListener('click', () => this.addTag());
        this.newTagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTag();
            }
        });
        
        // History
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Share & Export
        this.shareBtn.addEventListener('click', () => this.shareCounter());
        this.copyBtn.addEventListener('click', () => this.copyCounterValue());
        this.exportBtn.addEventListener('click', () => this.exportCounterData());
        this.importBtn.addEventListener('click', () => this.showImportModal());
        
        // Modal controls
        this.confirmActionBtn.addEventListener('click', () => this.handleConfirmation());
        this.cancelActionBtn.addEventListener('click', () => this.hideModal());
        this.confirmImportBtn.addEventListener('click', () => this.handleImport());
        this.cancelImportBtn.addEventListener('click', () => this.hideModal());
        
        // Keyboard help
        this.keyboardHelpBtn.addEventListener('click', () => {
            this.keyboardHelpContent.classList.toggle('show');
        });
        
        // Close keyboard help when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.keyboardHelpBtn.contains(e.target) && !this.keyboardHelpContent.contains(e.target)) {
                this.keyboardHelpContent.classList.remove('show');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Install button
        this.installBtn.addEventListener('click', () => this.installPWA());
        
        // Prevent context menu on long press (for mobile)
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle app visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAllTimers();
            }
        });
    }
    
    // ============================================
    // 3. COUNTER LOGIC
    // ============================================
    
    getCurrentCounter() {
        return this.state.counters[this.state.currentCounterIndex];
    }
    
    changeCounterValue(delta) {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        const newValue = counter.value + delta;
        
        // Check limits
        if (newValue < this.state.settings.minValue) {
            this.showNotification(`Minimum value is ${this.state.settings.minValue}`, 'error');
            this.playSound('error');
            this.vibrate(200);
            return;
        }
        
        if (newValue > this.state.settings.maxValue) {
            this.showNotification(`Maximum value is ${this.state.settings.maxValue}`, 'error');
            this.playSound('error');
            this.vibrate(200);
            return;
        }
        
        // Save to history before changing
        this.saveToHistory(counter.value, newValue, delta > 0 ? 'increment' : 'decrement');
        
        // Update counter value
        counter.value = newValue;
        
        // Play sound and vibrate
        this.playSound('click');
        this.vibrate(50);
        
        // Update UI
        this.updateUI();
        this.saveToStorage();
        
        // Check if target reached
        if (this.state.settings.target && newValue >= this.state.settings.target) {
            this.showTargetReachedAnimation();
        }
    }
    
    setCounterValue(value) {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        // Check limits
        if (value < this.state.settings.minValue) {
            value = this.state.settings.minValue;
            this.showNotification(`Value set to minimum: ${value}`, 'warning');
        }
        
        if (value > this.state.settings.maxValue) {
            value = this.state.settings.maxValue;
            this.showNotification(`Value set to maximum: ${value}`, 'warning');
        }
        
        // Save to history before changing
        this.saveToHistory(counter.value, value, 'manual');
        
        // Update counter value
        counter.value = value;
        
        // Play sound
        this.playSound('click');
        
        // Update UI
        this.updateUI();
        this.saveToStorage();
    }
    
    resetCounter() {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        // Save to history before resetting
        this.saveToHistory(counter.value, 0, 'reset');
        
        // Reset counter
        counter.value = 0;
        
        // Play sound
        this.playSound('click');
        
        // Update UI
        this.updateUI();
        this.saveToStorage();
    }
    
    addCounter(name = `Counter ${this.state.counters.length + 1}`) {
        const newCounter = {
            id: Date.now(),
            name: name,
            value: 0,
            tags: [],
            createdAt: new Date().toISOString()
        };
        
        this.state.counters.push(newCounter);
        this.state.currentCounterIndex = this.state.counters.length - 1;
        
        this.updateCounterList();
        this.updateUI();
        this.saveToStorage();
        
        this.showNotification(`Added counter: ${name}`, 'success');
    }
    
    deleteCounter() {
        if (this.state.counters.length <= 1) {
            this.showNotification('Cannot delete the last counter', 'error');
            return;
        }
        
        this.state.counters.splice(this.state.currentCounterIndex, 1);
        this.state.currentCounterIndex = Math.max(0, this.state.currentCounterIndex - 1);
        
        this.updateCounterList();
        this.updateUI();
        this.saveToStorage();
        
        this.showNotification('Counter deleted', 'success');
    }
    
    renameCounter() {
        const name = this.counterName.value.trim();
        if (name && name.length > 0) {
            const counter = this.getCurrentCounter();
            if (counter) {
                counter.name = name;
                this.updateCounterList();
                this.saveToStorage();
                this.showNotification(`Counter renamed to ${name}`, 'success');
            }
        }
    }
    
    switchCounter(index) {
        if (index >= 0 && index < this.state.counters.length) {
            this.state.currentCounterIndex = index;
            this.updateUI();
            this.showNotification(`Switched to ${this.getCurrentCounter().name}`, 'success');
        }
    }
    
    // ============================================
    // 4. TIMER FUNCTIONS
    // ============================================
    
    startAutoIncrement() {
        this.stopAllTimers();
        
        const interval = parseInt(this.timerIntervalInput.value) || 1000;
        this.state.timers.incrementTimer = setInterval(() => {
            this.changeCounterValue(this.state.settings.step);
        }, interval);
        
        this.showNotification('Auto-increment started', 'success');
        this.startTimerBtn.disabled = true;
        this.startDecrementTimerBtn.disabled = true;
    }
    
    startAutoDecrement() {
        this.stopAllTimers();
        
        const interval = parseInt(this.timerIntervalInput.value) || 1000;
        this.state.timers.decrementTimer = setInterval(() => {
            this.changeCounterValue(-this.state.settings.step);
        }, interval);
        
        this.showNotification('Auto-decrement started', 'success');
        this.startTimerBtn.disabled = true;
        this.startDecrementTimerBtn.disabled = true;
    }
    
    stopAllTimers() {
        if (this.state.timers.incrementTimer) {
            clearInterval(this.state.timers.incrementTimer);
            this.state.timers.incrementTimer = null;
        }
        
        if (this.state.timers.decrementTimer) {
            clearInterval(this.state.timers.decrementTimer);
            this.state.timers.decrementTimer = null;
        }
        
        this.startTimerBtn.disabled = false;
        this.startDecrementTimerBtn.disabled = false;
        
        this.showNotification('Timer stopped', 'warning');
    }
    
    // ============================================
    // 5. HISTORY MANAGEMENT
    // ============================================
    
    saveToHistory(oldValue, newValue, action) {
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            counterId: this.getCurrentCounter()?.id,
            action: action,
            oldValue: oldValue,
            newValue: newValue,
            delta: newValue - oldValue
        };
        
        // Remove any redo history if we're adding a new entry
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        }
        
        this.state.history.push(historyEntry);
        this.state.historyIndex = this.state.history.length - 1;
        
        // Keep only last 100 entries
        if (this.state.history.length > 100) {
            this.state.history.shift();
            this.state.historyIndex = Math.max(0, this.state.historyIndex - 1);
        }
        
        this.updateHistoryUI();
        this.updateUndoRedoButtons();
    }
    
    undo() {
        if (this.state.historyIndex >= 0) {
            const entry = this.state.history[this.state.historyIndex];
            const counter = this.getCurrentCounter();
            
            if (counter && counter.id === entry.counterId) {
                counter.value = entry.oldValue;
                this.state.historyIndex--;
                
                this.updateUI();
                this.updateHistoryUI();
                this.updateUndoRedoButtons();
                this.playSound('click');
                
                this.showNotification('Undo performed', 'success');
            }
        }
    }
    
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            const entry = this.state.history[this.state.historyIndex];
            const counter = this.getCurrentCounter();
            
            if (counter && counter.id === entry.counterId) {
                counter.value = entry.newValue;
                
                this.updateUI();
                this.updateHistoryUI();
                this.updateUndoRedoButtons();
                this.playSound('click');
                
                this.showNotification('Redo performed', 'success');
            }
        }
    }
    
    clearHistory() {
        this.state.history = [];
        this.state.historyIndex = -1;
        this.updateHistoryUI();
        this.updateUndoRedoButtons();
        this.showNotification('History cleared', 'success');
    }
    
    // ============================================
    // 6. UI UPDATES
    // ============================================
    
    updateUI() {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        // Update counter value with animation
        const oldValue = parseInt(this.counterValue.textContent) || 0;
        const newValue = counter.value;
        
        // Add animation class
        this.counterValue.classList.add('pulse');
        
        // Update value with transition
        setTimeout(() => {
            this.counterValue.textContent = newValue;
            
            // Update color based on value
            if (newValue > 0) {
                this.counterValue.className = 'counter-value counter-value-positive';
            } else if (newValue < 0) {
                this.counterValue.className = 'counter-value counter-value-negative';
            } else {
                this.counterValue.className = 'counter-value counter-value-zero';
            }
            
            // Remove animation class
            setTimeout(() => {
                this.counterValue.classList.remove('pulse');
            }, 300);
        }, 150);
        
        // Update counter name
        this.counterName.value = counter.name;
        
        // Update button states
        this.updateButtonStates();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Update counter list
        this.updateCounterList();
        
        // Update tags
        this.updateTagsUI();
    }
    
    updateButtonStates() {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        // Disable decrement button if at minimum
        this.decrementBtn.disabled = counter.value <= this.state.settings.minValue;
        
        // Disable increment button if at maximum
        this.incrementBtn.disabled = counter.value >= this.state.settings.maxValue;
        
        // Update undo/redo buttons
        this.updateUndoRedoButtons();
    }
    
    updateUndoRedoButtons() {
        this.undoBtn.disabled = this.state.historyIndex < 0;
        this.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
    }
    
    updateProgressBar() {
        const counter = this.getCurrentCounter();
        if (!counter || !this.state.settings.target) return;
        
        const progress = Math.min(Math.max(counter.value / this.state.settings.target, 0), 1) * 100;
        
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `Progress to Goal: ${Math.round(progress)}%`;
        this.goalValue.textContent = `Goal: ${this.state.settings.target}`;
        
        // Show/hide progress bar based on target
        if (this.state.settings.target > 0) {
            this.progressSection.style.display = 'block';
        } else {
            this.progressSection.style.display = 'none';
        }
    }
    
    updateCounterList() {
        this.counterList.innerHTML = '';
        
        this.state.counters.forEach((counter, index) => {
            const item = document.createElement('div');
            item.className = `counter-item ${index === this.state.currentCounterIndex ? 'active' : ''}`;
            item.innerHTML = `
                <span class="counter-item-name">${counter.name}</span>
                <span class="counter-item-value ${counter.value >= 0 ? 'positive' : 'negative'}">${counter.value}</span>
            `;
            
            item.addEventListener('click', () => this.switchCounter(index));
            
            this.counterList.appendChild(item);
        });
    }
    
    updateHistoryUI() {
        this.historyList.innerHTML = '';
        
        // Show only last 20 entries for performance
        const recentHistory = this.state.history.slice(-20).reverse();
        
        recentHistory.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const time = new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const actionText = entry.action === 'increment' ? 'Increased by' : 
                             entry.action === 'decrement' ? 'Decreased by' : 
                             entry.action === 'reset' ? 'Reset to' : 'Set to';
            
            item.innerHTML = `
                <span class="history-time">${time}</span>
                <span class="history-action">${actionText}</span>
                <span class="history-value ${entry.newValue >= 0 ? 'positive' : 'negative'}">${entry.newValue}</span>
            `;
            
            this.historyList.appendChild(item);
        });
    }
    
    updateTagsUI() {
        this.tagContainer.innerHTML = '';
        
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        counter.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="tag-remove" data-tag="${tag}">&times;</span>
            `;
            
            tagElement.querySelector('.tag-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTag(tag);
            });
            
            this.tagContainer.appendChild(tagElement);
        });
    }
    
    // ============================================
    // 7. THEME AND VISUAL SETTINGS
    // ============================================
    
    toggleDarkMode(enable) {
        this.state.settings.darkMode = enable;
        
        if (enable) {
            document.body.classList.add('dark-mode');
            this.darkModeToggle.style.display = 'none';
            this.lightModeToggle.style.display = 'flex';
        } else {
            document.body.classList.remove('dark-mode');
            this.darkModeToggle.style.display = 'flex';
            this.lightModeToggle.style.display = 'none';
        }
        
        this.saveToStorage();
    }
    
    toggleSound() {
        this.state.settings.soundEnabled = !this.state.settings.soundEnabled;
        
        if (this.state.settings.soundEnabled) {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.showNotification('Sound enabled', 'success');
        } else {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.showNotification('Sound disabled', 'warning');
        }
        
        this.saveToStorage();
    }
    
    toggleUI() {
        this.state.settings.glassUI = !this.state.settings.glassUI;
        
        if (this.state.settings.glassUI) {
            document.body.classList.add('glass-ui');
            this.uiToggle.innerHTML = '<i class="fas fa-gem"></i> Glass UI';
            this.showNotification('Glass UI enabled', 'success');
        } else {
            document.body.classList.remove('glass-ui');
            this.uiToggle.innerHTML = '<i class="fas fa-gem"></i> Regular UI';
            this.showNotification('Regular UI enabled', 'success');
        }
        
        this.saveToStorage();
    }
    
    // ============================================
    // 8. TAG MANAGEMENT
    // ============================================
    
    addTag() {
        const tag = this.newTagInput.value.trim();
        if (tag && tag.length > 0) {
            const counter = this.getCurrentCounter();
            if (counter && !counter.tags.includes(tag)) {
                counter.tags.push(tag);
                this.updateTagsUI();
                this.saveToStorage();
                this.newTagInput.value = '';
                this.showNotification(`Tag "${tag}" added`, 'success');
            }
        }
    }
    
    removeTag(tag) {
        const counter = this.getCurrentCounter();
        if (counter) {
            counter.tags = counter.tags.filter(t => t !== tag);
            this.updateTagsUI();
            this.saveToStorage();
            this.showNotification(`Tag "${tag}" removed`, 'success');
        }
    }
    
    // ============================================
    // 9. SHARE AND EXPORT
    // ============================================
    
    shareCounter() {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        const shareData = {
            title: `${counter.name} Counter`,
            text: `Check out my counter "${counter.name}" with value ${counter.value}`,
            url: window.location.href
        };
        
        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData)
                .then(() => this.showNotification('Counter shared successfully', 'success'))
                .catch(() => this.copyCounterValue());
        } else {
            this.copyCounterValue();
        }
    }
    
    copyCounterValue() {
        const counter = this.getCurrentCounter();
        if (!counter) return;
        
        const text = `${counter.name}: ${counter.value}`;
        
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('Counter value copied to clipboard', 'success'))
            .catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('Counter value copied to clipboard', 'success');
            });
    }
    
    exportCounterData() {
        const exportData = {
            counters: this.state.counters,
            settings: this.state.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `counter-export-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Counter data exported', 'success');
    }
    
    importCounterData(data) {
        try {
            const importData = JSON.parse(data);
            
            // Validate import data
            if (!importData.counters || !Array.isArray(importData.counters)) {
                throw new Error('Invalid import data format');
            }
            
            // Merge settings if provided
            if (importData.settings) {
                this.state.settings = {...this.state.settings, ...importData.settings};
            }
            
            // Replace counters
            this.state.counters = importData.counters;
            this.state.currentCounterIndex = 0;
            
            // Reset history
            this.state.history = [];
            this.state.historyIndex = -1;
            
            // Update UI and storage
            this.updateUI();
            this.saveToStorage();
            
            this.showNotification('Counter data imported successfully', 'success');
            this.hideModal();
            
        } catch (error) {
            this.showNotification('Failed to import data: Invalid format', 'error');
            console.error('Import error:', error);
        }
    }
    
    // ============================================
    // 10. MODAL MANAGEMENT
    // ============================================
    
    showResetConfirmation() {
        this.modalMessage.textContent = 'Are you sure you want to reset the counter to zero?';
        this.confirmationModal.dataset.action = 'reset';
        this.confirmationModal.classList.add('active');
    }
    
    showImportModal() {
        this.importModal.classList.add('active');
        this.importData.focus();
    }
    
    hideModal() {
        this.confirmationModal.classList.remove('active');
        this.importModal.classList.remove('active');
        this.importData.value = '';
    }
    
    handleConfirmation() {
        const action = this.confirmationModal.dataset.action;
        
        if (action === 'reset') {
            this.resetCounter();
        }
        
        this.hideModal();
    }
    
    handleImport() {
        const data = this.importData.value.trim();
        if (data) {
            this.importCounterData(data);
        } else {
            this.showNotification('Please paste valid counter data', 'error');
        }
    }
    
    // ============================================
    // 11. NOTIFICATION SYSTEM
    // ============================================
    
    showNotification(message, type = 'info') {
        this.notificationText.textContent = message;
        this.notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
    
    // ============================================
    // 12. AUDIO AND HAPTIC FEEDBACK
    // ============================================
    
    initAudio() {
        // Preload audio files
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.load();
                audio.volume = 0.5;
            }
        });
    }
    
    playSound(type) {
        if (!this.state.settings.soundEnabled) return;
        
        const audio = this.audioElements[type];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    vibrate(duration) {
        if (!this.state.settings.vibrationEnabled) return;
        
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    // ============================================
    // 13. KEYBOARD SHORTCUTS
    // ============================================
    
    handleKeyboardShortcuts(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case '+':
            case 'ArrowUp':
                e.preventDefault();
                this.changeCounterValue(this.state.settings.step);
                break;
                
            case '-':
            case 'ArrowDown':
                e.preventDefault();
                this.changeCounterValue(-this.state.settings.step);
                break;
                
            case 'r':
            case 'R':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.showResetConfirmation();
                }
                break;
                
            case 'z':
            case 'Z':
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                }
                break;
                
            case 'y':
            case 'Y':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.redo();
                }
                break;
                
            case 'd':
            case 'D':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleDarkMode(!this.state.settings.darkMode);
                }
                break;
                
            case 's':
            case 'S':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleSound();
                }
                break;
                
            case 'h':
            case 'H':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.historyList.scrollIntoView({behavior: 'smooth'});
                }
                break;
                
            case 'Escape':
                this.hideModal();
                this.keyboardHelpContent.classList.remove('show');
                break;
        }
    }
    
    // ============================================
    // 14. STORAGE MANAGEMENT
    // ============================================
    
    saveToStorage() {
        try {
            const saveData = {
                counters: this.state.counters,
                currentCounterIndex: this.state.currentCounterIndex,
                settings: this.state.settings
            };
            
            localStorage.setItem('ultimateCounterApp', JSON.stringify(saveData));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('ultimateCounterApp');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Load counters
                if (parsedData.counters && Array.isArray(parsedData.counters)) {
                    this.state.counters = parsedData.counters;
                }
                
                // Load current counter index
                if (typeof parsedData.currentCounterIndex === 'number') {
                    this.state.currentCounterIndex = parsedData.currentCounterIndex;
                }
                
                // Load settings
                if (parsedData.settings) {
                    this.state.settings = {...this.state.settings, ...parsedData.settings};
                }
                
                // Apply loaded settings
                this.applyLoadedSettings();
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }
    
    applyLoadedSettings() {
        // Apply theme
        this.toggleDarkMode(this.state.settings.darkMode);
        
        // Apply UI style
        if (this.state.settings.glassUI) {
            document.body.classList.add('glass-ui');
            this.uiToggle.innerHTML = '<i class="fas fa-gem"></i> Glass UI';
        }
        
        // Apply sound settings
        this.enableSoundCheckbox.checked = this.state.settings.soundEnabled;
        this.enableVibrationCheckbox.checked = this.state.settings.vibrationEnabled;
        
        // Apply visual settings
        this.fontSizeInput.value = this.state.settings.fontSize;
        this.fontSizeValue.textContent = `${this.state.settings.fontSize}px`;
        this.counterValue.style.fontSize = `${this.state.settings.fontSize}px`;
        
        this.fontStyleSelect.value = this.state.settings.fontFamily;
        this.counterValue.style.fontFamily = this.state.settings.fontFamily;
        
        this.bgColorInput.value = this.state.settings.bgColor;
        document.body.style.backgroundColor = this.state.settings.bgColor;
        
        // Apply limits
        this.minValueInput.value = this.state.settings.minValue;
        this.maxValueInput.value = this.state.settings.maxValue;
        this.targetValueInput.value = this.state.settings.target;
        
        // Apply custom step
        this.customStepInput.value = this.state.settings.step;
        
        // Update sound toggle icon
        if (this.state.settings.soundEnabled) {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            this.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }
    
    // ============================================
    // 15. ANIMATIONS AND EFFECTS
    // ============================================
    
    showTargetReachedAnimation() {
        this.playSound('success');
        this.vibrate([100, 50, 100, 50, 100]);
        
        // Add celebration animation to counter value
        this.counterValue.classList.add('bounce');
        
        // Show notification
        this.showNotification('🎉 Target reached! Congratulations!', 'success');
        
        // Remove animation class after completion
        setTimeout(() => {
            this.counterValue.classList.remove('bounce');
        }, 1000);
    }
    
    showLoading(show = true) {
        if (show) {
            this.loadingOverlay.style.display = 'flex';
        } else {
            this.loadingOverlay.style.display = 'none';
        }
    }
    
    // ============================================
    // 16. PWA INSTALLATION
    // ============================================
    
    installPWA() {
        // Check if the browser supports PWA installation
        if ('BeforeInstallPromptEvent' in window) {
            // Show install prompt
            window.dispatchEvent(new Event('beforeinstallprompt'));
        } else {
            this.showNotification('PWA installation not supported in this browser', 'error');
        }
    }
    
    // ============================================
    // 17. ERROR HANDLING
    // ============================================
    
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        this.showNotification(`Error: ${error.message}`, 'error');
        
        // Try to recover from error
        if (context === 'storage') {
            localStorage.removeItem('ultimateCounterApp');
            this.showNotification('Storage reset due to error', 'warning');
        }
    }
}

// ============================================
// 18. APP INITIALIZATION
// ============================================

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    // Initialize app after a short delay to show loading animation
    setTimeout(() => {
        window.counterApp = new CounterApp();
        
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
        
        // Handle PWA install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            const installBtn = document.getElementById('installBtn');
            installBtn.style.display = 'block';
            
            installBtn.addEventListener('click', () => {
                installBtn.style.display = 'none';
                deferredPrompt.prompt();
                
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        });
    }, 1000);
});

// ============================================
// 19. SERVICE WORKER (PWA)
// ============================================

// Create a simple service worker for offline support
const serviceWorkerCode = `
// Service Worker for Counter App
const CACHE_NAME = 'counter-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
`;

// You would save this to a separate sw.js file in a real implementation
// For this example, we'll create it dynamically
if ('serviceWorker' in navigator) {
    const blob = new Blob([serviceWorkerCode], {type: 'application/javascript'});
    const swUrl = URL.createObjectURL(blob);
    navigator.serviceWorker.register(swUrl);
}

// ============================================
// 20. MANIFEST.JSON FOR PWA
// ============================================

const manifest = {
    "name": "Ultimate Counter App",
    "short_name": "Counter",
    "description": "A feature-rich counter application with 60+ features",
    "start_url": "./",
    "display": "standalone",
    "background_color": "#4361ee",
    "theme_color": "#4361ee",
    "icons": [
        {
            "src": "icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
};

// Note: In a real implementation, you would create a separate manifest.json file
// and link it in the HTML head
