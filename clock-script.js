// Store timezones in localStorage
let timezones = JSON.parse(localStorage.getItem('timezones')) || ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

// Initialize clocks on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

// Update all clock displays
function updateAllClocks() {
    const clockGrid = document.getElementById('clock-grid');
    clockGrid.innerHTML = '';

    if (timezones.length === 0) {
        clockGrid.innerHTML = '<div class="clock-card empty">No timezones selected. Add one to get started!</div>';
        return;
    }

    timezones.forEach((timezone, index) => {
        const timeData = getTimeInTimezone(timezone);
        clockGrid.innerHTML += createClockCard(timezone, timeData, index);
    });
}

// Get time in specific timezone
function getTimeInTimezone(timezone) {
    try {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', { 
            timeZone: timezone,
            hour12: false 
        });
        
        const date = new Date(timeString);
        
        // Get date string
        const dateString = new Date(timeString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        // Get time in 12-hour format
        const time12 = date.toLocaleString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Get time in 24-hour format for UTC offset calculation
        const time24 = date.toLocaleString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        // Calculate UTC offset
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const offsetMs = tzDate - utcDate;
        const offsetHours = Math.floor(offsetMs / (1000 * 60 * 60));
        const offsetMinutes = (Math.abs(offsetMs) % (1000 * 60 * 60)) / (1000 * 60);
        const offsetSign = offsetHours >= 0 ? '+' : '-';
        const utcOffset = `UTC ${offsetSign}${Math.abs(offsetHours)}:${String(offsetMinutes).padStart(2, '0')}`;

        return {
            time: time24,
            time12: time12,
            date: dateString,
            utcOffset: utcOffset,
            ampm: time12.split(' ')[1]
        };
    } catch (e) {
        return {
            time: '--:--:--',
            time12: '--:--:-- --',
            date: 'Invalid timezone',
            utcOffset: 'N/A',
            ampm: ''
        };
    }
}

// Create clock card HTML
function createClockCard(timezone, timeData, index) {
    // Format timezone name (convert America/New_York to New York)
    const formattedName = timezone
        .split('/')
        .pop()
        .replace(/_/g, ' ');

    return `
        <div class="clock-card">
            <button class="remove-btn" onclick="removeTimezone(${index})">
                <i class="fas fa-times"></i>
            </button>
            <div class="timezone-name">${formattedName}</div>
            <div class="ampm">${timeData.ampm}</div>
            <div class="digital-time">${timeData.time}</div>
            <div class="date-info">${timeData.date}</div>
            <div class="utc-offset">${timeData.utcOffset}</div>
        </div>
    `;
}

// Add timezone from input
function addTimezone() {
    const input = document.getElementById('timezone-input');
    const timezone = input.value.trim();

    if (!timezone) {
        alert('Please enter a timezone');
        return;
    }

    // Validate timezone
    const timeData = getTimeInTimezone(timezone);
    if (timeData.date === 'Invalid timezone') {
        alert('Invalid timezone. Example: America/New_York, Europe/London, Asia/Tokyo');
        return;
    }

    // Add if not already present
    if (!timezones.includes(timezone)) {
        timezones.push(timezone);
        localStorage.setItem('timezones', JSON.stringify(timezones));
        updateAllClocks();
        input.value = '';
    } else {
        alert('This timezone is already added');
    }
}

// Add preset timezone
function addPreset(timezone) {
    if (!timezones.includes(timezone)) {
        timezones.push(timezone);
        localStorage.setItem('timezones', JSON.stringify(timezones));
        updateAllClocks();
    }
}

// Remove timezone by index
function removeTimezone(index) {
    timezones.splice(index, 1);
    localStorage.setItem('timezones', JSON.stringify(timezones));
    updateAllClocks();
}

// Reset to default timezones
function resetClocks() {
    timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
    localStorage.setItem('timezones', JSON.stringify(timezones));
    updateAllClocks();
}