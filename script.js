let currentSession = null;
let sessionTimer = 0;
let timerInterval = null;
let fatigueLevel = 25;
let fatigueInterval = null;

// Mock Mastery Data (Mastery scores by category/skill area)
const masteryData = [
    { skill: 'React', score: 65, category: 'Frontend' },
    { skill: 'JavaScript', score: 82, category: 'Frontend' },
    { skill: 'HTML & CSS', score: 95, category: 'Web Design' },
    { skill: 'TypeScript', score: 25, category: 'Programming' },
    { skill: 'Node.js', score: 70, category: 'Backend' },
    { skill: 'Databases', score: 55, category: 'Backend' },
];

// Sample data
const topicRecommendations = [
    {
        id: '1',
        title: 'HTML FUNDAMENTALS',
        category: 'Frontend Development',
        difficulty: 'EASY',
        estimatedTime: '1 hour 17min',
        mastery: 65,
        priority: 'high',
        reason: 'Based on your current React progress',
        // MODIFIED: Added YouTube URL here
        url: 'https://www.youtube.com/watch?v=lGKGDxwvrEQ' 
    },
    {
        id: '2',
        title: 'CSS FUNDAMENTALS BEGINNER',
        category: 'Web Design',
        difficulty: 'medium',
        estimatedTime: '7 hour18 min',
        mastery: 40,
        priority: 'high',
        reason: 'Weak area identified - needs improvement',
        url: 'https://www.youtube.com/watch?v=ESnrn1kAD4E' // Placeholder URL
    },
    {
        id: '3',
        title: 'JAVA SCRIPT FUNDAMENTALS ADVANCED',
        category: 'Programming',
        difficulty: 'hard',
        estimatedTime: '5 hours 15min',
        mastery: 25,
        priority: 'medium',
        reason: 'Next logical step in your learning path',
        url: 'https://www.youtube.com/watch?v=PlbupGCBV6w&list=PLsyeobzWxl7rrvgG7MLNIMSTzVCDZZcT4' // Placeholder URL
    },
    {
        id: '4',
        title: 'API Integration Patterns',
        category: 'Backend',
        difficulty: 'medium',
        estimatedTime: '1 hour 16 min',
        mastery: 60,
        priority: 'low',
        reason: 'Quick review to maintain mastery',
        url: 'https://www.youtube.com/watch?v=BKeVeGzwj9A&list=PLaGX-30v1lh2Y-TZgeQWSnGQWgWHP9mPH' // Placeholder URL
    }
];

const learningFlow = [
    {
        id: '1',
        title: 'HTML Fundamentals',
        status: 'completed',
        duration: '1h 17m',
        mastery: 0// Updated based on masteryData
    },
    {
        id: '2',
        title: 'CSS Basics',
        status: 'completed',
        duration: '7h 18m',
        mastery: 0 // Updated based on mock data
    },
    {
        id: '3',
        title: 'JavaScript Essentials',
        status: 'completed',
        duration: '5h 15m',
        mastery: 0
    },
    {
        id: '4',
        title: 'API Integration Patterns',
        status: 'current',
        duration: '1h 16m',
        mastery: 0
    },
    {
        id: '5',
        title: 'React Hooks',
        status: 'upcoming',
        duration: '3h 30m'
        
    },
    {
        id: '6',
        title: 'State Management',
        status: 'upcoming',
        duration: '4h 15m'
        
    },
    {
        id: '7',
        title: 'TypeScript Basics',
        status: 'upcoming',
        duration: '3h 45m'
        
    },
    {
        id: '8',
        title: 'Advanced React',
        status: 'locked',
        duration: '6h 20m'
        
    }
];

let recentSessions = [
    {
        id: '1',
        topic: 'JavaScript Fundamentals',
        duration: 2340,
        startTime: new Date(Date.now() - 3600000),
        focusScore: 87
    },
    {
        id: '2',
        topic: 'React Components',
        duration: 1890,
        startTime: new Date(Date.now() - 7200000),
        focusScore: 92
    },
    {
        id: '3',
        topic: 'CSS Grid Layout',
        duration: 1560,
        startTime: new Date(Date.now() - 10800000),
        focusScore: 78
    }
];

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'high': return 'fas fa-bolt';
        case 'medium': return 'fas fa-star';
        case 'low': return 'fas fa-clock';
        default: return 'fas fa-brain';
    }
}

function getFlowIcon(status) {
    switch (status) {
        case 'completed': return 'fas fa-check-circle';
        case 'current': return 'fas fa-play-circle';
        case 'upcoming': return 'far fa-circle';
        case 'locked': return 'fas fa-lock';
        default: return 'far fa-circle';
    }
}

// Topic Recommendations
function renderRecommendations() {
    const container = document.getElementById('recommendations-list');
    container.innerHTML = '';

    topicRecommendations.forEach(topic => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        // Note: The click handler now uses topic.id which is passed to startLearningTopic
        item.innerHTML = `
            <div class="recommendation-header">
                <i class="${getPriorityIcon(topic.priority)} priority-icon ${topic.priority}"></i>
                <div class="recommendation-title">${topic.title}</div>
                <span class="difficulty-badge ${topic.difficulty}">${topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}</span>
            </div>
            <div class="recommendation-category">${topic.category}</div>
            <div class="recommendation-reason">${topic.reason}</div>
            <div class="recommendation-footer">
                <div class="recommendation-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${topic.estimatedTime}</span>
                    </div>
                    <div class="mastery-display">
                        <span>Mastery: ${topic.mastery}%</span>
                        <div class="mastery-bar">
                            <div class="mastery-progress" style="width: ${topic.mastery}%"></div>
                        </div>
                    </div>
                </div>
                <button class="start-learning-btn" onclick="startLearningTopic('${topic.id}')">
                    <span>Start Learning</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function startLearningTopic(topicId) {
    const topic = topicRecommendations.find(t => t.id === topicId);
    if (topic) {
        // Open the URL in a new tab/window if a URL exists
        if (topic.url) {
            window.open(topic.url, '_blank');
        }
        
        // Start the learning session on the dashboard
        startSession(topic.title);
    }
}

function refreshRecommendations() {
    // Simulate refreshing recommendations
    const button = document.querySelector('.refresh-btn');
    const originalText = button.textContent;
    button.innerHTML = '<i class="loading-spinner"></i> Refreshing...';
    
    setTimeout(() => {
        button.textContent = originalText;
        // Shuffle recommendations for demo
        topicRecommendations.sort(() => Math.random() - 0.5);
        renderRecommendations();
    }, 2000);
}

// Learning Flow Chart
function renderLearningFlow() {
    const container = document.getElementById('flow-chart');
    container.innerHTML = '';

    learningFlow.forEach((node, index) => {
        const item = document.createElement('div');
        item.className = `flow-node ${node.status}`;
        
        let masterySection = '';
        if (node.mastery !== undefined) {
            masterySection = `
                <div class="flow-mastery">
                    <div class="flow-mastery-header">
                        <span>Mastery</span>
                        <span>${node.mastery}%</span>
                    </div>
                    <div class="flow-mastery-bar">
                        <div class="flow-mastery-progress ${node.status}" style="width: ${node.mastery}%"></div>
                    </div>
                </div>
            `;
        }

        let actionButton = '';
        if (node.status === 'current') {
            actionButton = '<button class="continue-btn">Continue</button>';
        }

        item.innerHTML = `
            <i class="${getFlowIcon(node.status)} flow-icon ${node.status}"></i>
            <div class="flow-content">
                <div class="flow-title">${node.title}</div>
                <div class="flow-duration">
                    <i class="fas fa-clock"></i>
                    <span>${node.duration}</span>
                </div>
                ${masterySection}
            </div>
            ${actionButton}
        `;
        
        container.appendChild(item);
    });
}

// Fatigue Monitor
function updateFatigueMonitor() {
    const icon = document.getElementById('fatigue-icon');
    const state = document.getElementById('fatigue-state');
    const progress = document.getElementById('fatigue-progress');
    const message = document.getElementById('fatigue-message');
    const action = document.getElementById('fatigue-action');

    let status, config;
    
    if (fatigueLevel < 30) {
        status = 'optimal';
        config = {
            state: 'Optimal',
            message: 'Perfect focus level - continue learning',
            action: 'Keep going!'
        };
    } else if (fatigueLevel < 60) {
        status = 'moderate';
        config = {
            state: 'Moderate',
            message: 'Good focus - consider easier topics',
            action: 'Switch to review'
        };
    } else if (fatigueLevel < 80) {
        status = 'high';
        config = {
            state: 'High',
            message: 'Fatigue detected - take a short break',
            action: 'Break recommended'
        };
    } else {
        status = 'critical';
        config = {
            state: 'Critical',
            message: 'High fatigue - rest is needed',
            action: 'Take a break!'
        };
    }

    // Update icon
    icon.className = `fatigue-icon ${status}`;
    icon.innerHTML = status === 'optimal' ? '<i class="fas fa-check-circle"></i>' :
                     status === 'moderate' ? '<i class="fas fa-battery-half"></i>' :
                     status === 'high' ? '<i class="fas fa-exclamation-triangle"></i>' :
                     '<i class="fas fa-coffee"></i>';

    // Update state
    state.textContent = config.state;
    state.className = `state-${status}`;

    // Update progress bar
    progress.style.width = `${fatigueLevel}%`;
    progress.className = `fatigue-progress ${status}`;

    // Update message and action
    message.textContent = config.message;
    action.textContent = config.action;
    action.className = `action-btn ${status}`;
}

function simulateFatigueChanges() {
    fatigueInterval = setInterval(() => {
        fatigueLevel += (Math.random() * 4) - 2;
        fatigueLevel = Math.max(0, Math.min(100, fatigueLevel));
        updateFatigueMonitor();
    }, 3000);
}

// Session Logger
function startSession(topicName = 'New Learning Session') {
    if (currentSession) return;

    currentSession = {
        id: Date.now().toString(),
        topic: topicName,
        startTime: new Date(),
        status: 'recording'
    };

    sessionTimer = 0;
    updateSessionDisplay();
    
    document.getElementById('no-session').style.display = 'none';
    document.getElementById('active-session').style.display = 'flex';
    
    startTimer();
}

function pauseSession() {
    if (!currentSession) return;
    
    currentSession.status = 'paused';
    stopTimer();
    updateSessionDisplay();
}

function resumeSession() {
    if (!currentSession) return;
    
    currentSession.status = 'recording';
    startTimer();
    updateSessionDisplay();
}

function stopSession() {
    if (!currentSession) return;

    const completedSession = {
        id: currentSession.id,
        topic: currentSession.topic,
        duration: sessionTimer,
        startTime: currentSession.startTime,
        focusScore: Math.floor(Math.random() * 30) + 70
    };

    recentSessions.unshift(completedSession);
    recentSessions = recentSessions.slice(0, 5);

    currentSession = null;
    sessionTimer = 0;
    stopTimer();

    document.getElementById('active-session').style.display = 'none';
    document.getElementById('no-session').style.display = 'flex';
    
    renderRecentSessions();
}

function startTimer() {
    timerInterval = setInterval(() => {
        sessionTimer++;
        updateTimerDisplay();
        updateSessionDuration();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(sessionTimer);
}

function updateSessionDuration() {
    const hours = Math.floor(sessionTimer / 3600);
    const minutes = Math.floor((sessionTimer % 3600) / 60);
    let duration = '';
    
    if (hours > 0) {
        duration = `${hours}h ${minutes}m`;
    } else {
        duration = `${minutes}m`;
    }
    
    // Note: This ID isn't used in the provided HTML but keeping the logic in case it's added later.
    // document.getElementById('session-duration').textContent = duration;
}

function updateSessionDisplay() {
    if (!currentSession) return;

    document.getElementById('current-topic').textContent = currentSession.topic;
    document.getElementById('start-time').textContent = currentSession.startTime.toLocaleTimeString();
    
    const statusElement = document.getElementById('session-status');
    statusElement.textContent = currentSession.status === 'recording' ? 'Recording' : 'Paused';
    statusElement.className = `session-status ${currentSession.status}`;

    const pauseBtn = document.getElementById('pause-btn');
    if (currentSession.status === 'recording') {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        pauseBtn.className = 'control-btn pause';
        pauseBtn.onclick = pauseSession;
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
        pauseBtn.className = 'control-btn resume';
        pauseBtn.onclick = resumeSession;
    }
}

function renderRecentSessions() {
    const container = document.getElementById('recent-sessions-list');
    container.innerHTML = '';

    recentSessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'session-item';
        item.innerHTML = `
            <div class="session-item-content">
                <h5>${session.topic}</h5>
                <p>${session.startTime.toLocaleDateString()} at ${session.startTime.toLocaleTimeString()}</p>
            </div>
            <div class="session-item-stats">
                <div class="session-duration">${formatTime(session.duration)}</div>
                <div class="session-focus">
                    <i class="fas fa-trending-up"></i>
                    <span>${session.focusScore}%</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}


// --- Mastery Dashboard Functions (New) ---
function calculateAverageMastery() {
    if (masteryData.length === 0) return 0;
    const totalScore = masteryData.reduce((sum, item) => sum + item.score, 0);
    return Math.round(totalScore / masteryData.length);
}

function renderMasteryDashboard() {
    const avgMastery = calculateAverageMastery();
    const summaryContainer = document.getElementById('mastery-summary');
    const gapsContainer = document.getElementById('skill-gaps-list');

    // 1. Render Summary
    summaryContainer.innerHTML = `
        <div class="mastery-level-item">
            <i class="fas fa-graduation-cap"></i>
            <div>
                <div class="mastery-level-value">${avgMastery}%</div>
                <div class="mastery-level-label">Average Mastery Level</div>
            </div>
        </div>
        <div class="mastery-level-item">
            <i class="fas fa-list-check"></i>
            <div>
                <div class="mastery-level-value">${masteryData.length}</div>
                <div class="mastery-level-label">Skills Tracked</div>
            </div>
        </div>
    `;

    // 2. Render Skill Gaps (Topics with mastery < 60)
    gapsContainer.innerHTML = '<h4>Areas Needing Attention</h4>';
    const skillGaps = masteryData
        .filter(item => item.score < 60)
        .sort((a, b) => a.score - b.score); // Sort by lowest score

    if (skillGaps.length === 0) {
        gapsContainer.innerHTML += '<p style="color: #10b981;">🥳 Great job! No critical skill gaps identified.</p>';
        return;
    }

    skillGaps.forEach(item => {
        const gapItem = document.createElement('div');
        gapItem.className = 'skill-gap-item';
        gapItem.innerHTML = `
            <span class="gap-topic">${item.skill}</span>
            <div class="gap-mastery-bar">
                <div class="gap-mastery-progress" style="width: ${item.score}%"></div>
            </div>
            <span class="gap-score">${item.score}%</span>
        `;
        gapsContainer.appendChild(gapItem);
    });
}


// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    renderRecommendations();
    renderLearningFlow();
    renderRecentSessions();
    updateFatigueMonitor();
    simulateFatigueChanges();

    // Initialize Mastery Dashboard (New)
    renderMasteryDashboard();

    // Session logger event listeners
    document.getElementById('start-session-btn').addEventListener('click', () => {
        // This is the manual start session button, assign a default topic
        startSession('Deep Focus Session'); 
    });

    document.getElementById('stop-btn').addEventListener('click', stopSession);

    // Simulate real-time updates
    setInterval(() => {
        // Update study time
        const studyTimeElement = document.getElementById('study-time');
        const currentTime = studyTimeElement.textContent;
        // Parse time: handle '4h' or '4h 15m' format
        const match = currentTime.match(/(\d+)h\s*(\d*)m?/);
        let hours = match && match[1] ? parseInt(match[1]) : 0;
        let minutes = match && match[2] ? parseInt(match[2]) : 0;
        
        const totalMinutes = hours * 60 + minutes;
        const newTotalMinutes = totalMinutes + 1;
        const newHours = Math.floor(newTotalMinutes / 60);
        const newMinutes = newTotalMinutes % 60;
        
        studyTimeElement.textContent = `${newHours}h ${newMinutes}m`;
    }, 60000); // Update every minute

    // Simulate focus score changes
    setInterval(() => {
        const focusElement = document.getElementById('focus-score');
        const currentScore = parseInt(focusElement.textContent);
        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const newScore = Math.max(0, Math.min(100, currentScore + change));
        focusElement.textContent = `${newScore}%`;
    }, 30000); // Update every 30 seconds
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (fatigueInterval) {
        clearInterval(fatigueInterval);
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});