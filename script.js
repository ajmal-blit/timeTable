document.addEventListener("DOMContentLoaded", () => {
    const dateDisplay = document.querySelector(".current-date");
    const timeDisplay = document.querySelector(".current-time");

    const currentPeriodName = document.getElementById("current-period-name");
    const currentTeacher = document.getElementById("current-teacher");
    const currentTimeRange = document.getElementById("current-time-range");
    const currentCountdown = document.getElementById("current-countdown");
    const periodProgressBar = document.getElementById("period-progress-bar");

    const nextDayLabel = document.getElementById("next-day-label");
    const nextPeriodName = document.getElementById("next-period-name");
    const nextTeacher = document.getElementById("next-teacher");
    const nextTimeRange = document.getElementById("next-time-range");
    const nextCountdown = document.getElementById("next-countdown");

    const todayScheduleList = document.getElementById("today-schedule-list");

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const timetable = {
        1: [
            { start: "09:30", end: "10:30", name: "English", teacher: "Miss Sahla Mk" },
            { start: "10:30", end: "11:20", name: "Language", teacher: "" },
            { start: "11:20", end: "11:35", name: "Interval", teacher: "" },
            { start: "11:35", end: "12:30", name: "DSA", teacher: "Miss Suhani Vs" },
            { start: "12:30", end: "13:20", name: "Lunch Break", teacher: "" },
            { start: "13:20", end: "14:10", name: "BASE", teacher: "Miss Ramya" },
            { start: "14:10", end: "15:10", name: "SWM", teacher: "Miss Suhani Vs" }
        ],

        2: [
            { start: "09:30", end: "10:30", name: "MDC", teacher: "" },
            { start: "10:30", end: "11:20", name: "DSA", teacher: "" },
            { start: "11:20", end: "11:35", name: "Interval", teacher: "" },
            { start: "11:35", end: "12:30", name: "RVC", teacher: "Miss Ramshi" },
            { start: "12:30", end: "13:20", name: "Lunch Break", teacher: "" },
            { start: "13:20", end: "14:10", name: "SWM", teacher: "" },
            { start: "14:10", end: "15:10", name: "RVC", teacher: "" }
        ],

        3: [
            { start: "09:30", end: "10:30", name: "RVC", teacher: "" },
            { start: "10:30", end: "11:20", name: "English", teacher: "" },
            { start: "11:20", end: "11:35", name: "Interval", teacher: "" },
            { start: "11:35", end: "12:30", name: "BASE", teacher: "" },
            { start: "12:30", end: "13:20", name: "Lunch Break", teacher: "" },
            { start: "13:20", end: "14:10", name: "SWM", teacher: "" },
            { start: "14:10", end: "15:10", name: "RVC", teacher: "" }
        ],

        4: [
            { start: "09:30", end: "10:30", name: "DSA", teacher: "" },
            { start: "10:30", end: "11:20", name: "English", teacher: "" },
            { start: "11:20", end: "11:35", name: "Interval", teacher: "" },
            { start: "11:35", end: "12:30", name: "RVC", teacher: "" },
            { start: "12:30", end: "13:20", name: "Lunch Break", teacher: "" },
            { start: "13:20", end: "14:10", name: "MDC", teacher: "" },
            { start: "14:10", end: "15:10", name: "BASE", teacher: "" }
        ],

        5: [
            { start: "09:30", end: "10:30", name: "BASE", teacher: "" },
            { start: "10:30", end: "11:20", name: "SWM", teacher: "" },
            { start: "11:20", end: "11:35", name: "Interval", teacher: "" },
            { start: "11:35", end: "12:30", name: "SWM", teacher: "" },
            { start: "12:30", end: "13:40", name: "Lunch Break", teacher: "" },
            { start: "13:40", end: "14:10", name: "DSA Lab", teacher: "" },
            { start: "14:10", end: "15:10", name: "DSA Lab", teacher: "" }
        ]
    };

    function parseTime(timeStr, baseDate) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date(baseDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function formatCountdown(ms) {
        const safeMs = Math.max(0, ms);
        const totalSeconds = Math.floor(safeMs / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }

        return `${minutes}m ${seconds}s`;
    }

    function isBreakPeriod(period) {
        const name = period.name.toLowerCase();
        return name.includes("break") || name.includes("interval") || name.includes("lunch");
    }

    function getTeacherName(period) {
        if (isBreakPeriod(period)) {
            return "No teacher";
        }

        return period.teacher || "Not added";
    }

    function getCurrentPeriod(now) {
        const todayTimetable = timetable[now.getDay()] || [];

        for (let i = 0; i < todayTimetable.length; i++) {
            const period = todayTimetable[i];
            const startTime = parseTime(period.start, now);
            const endTime = parseTime(period.end, now);

            if (now >= startTime && now < endTime) {
                return {
                    period,
                    index: i,
                    startTime,
                    endTime
                };
            }
        }

        return null;
    }

    function getNextPeriod(now) {
        for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
            const checkDate = new Date(now);
            checkDate.setDate(now.getDate() + dayOffset);

            const schedule = timetable[checkDate.getDay()];

            if (!schedule) {
                continue;
            }

            for (let i = 0; i < schedule.length; i++) {
                const period = schedule[i];
                const startTime = parseTime(period.start, checkDate);

                if (startTime > now) {
                    return {
                        period,
                        index: i,
                        startTime,
                        dayIndex: checkDate.getDay(),
                        dayOffset
                    };
                }
            }
        }

        return null;
    }

    function updateDateTime(now) {
        dateDisplay.textContent = now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        timeDisplay.textContent = now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    }

    function updateCurrentCard(now, currentData) {
        if (currentData) {
            const { period, startTime, endTime } = currentData;

            const totalDuration = endTime - startTime;
            const elapsed = now - startTime;
            const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

            currentPeriodName.textContent = isBreakPeriod(period)
                ? `Currently: ${period.name}`
                : `Currently: ${period.name}`;

            currentTeacher.textContent = getTeacherName(period);
            currentTimeRange.textContent = `${formatTime(period.start)} - ${formatTime(period.end)}`;
            currentCountdown.textContent = `Ends in ${formatCountdown(endTime - now)}`;
            periodProgressBar.style.width = `${progress}%`;

            return;
        }

        const todaySchedule = timetable[now.getDay()];

        if (!todaySchedule) {
            currentPeriodName.textContent = "No Classes Today";
            currentTeacher.textContent = "Enjoy your day";
            currentTimeRange.textContent = "--";
            currentCountdown.textContent = "Holiday mode activated ✨";
            periodProgressBar.style.width = "0%";
            return;
        }

        const firstPeriodStart = parseTime(todaySchedule[0].start, now);
        const lastPeriodEnd = parseTime(todaySchedule[todaySchedule.length - 1].end, now);

        if (now < firstPeriodStart) {
            currentPeriodName.textContent = "Classes Not Started";
            currentTeacher.textContent = "Get ready";
            currentTimeRange.textContent = `Starts at ${formatTime(todaySchedule[0].start)}`;
            currentCountdown.textContent = `First period starts in ${formatCountdown(firstPeriodStart - now)}`;
            periodProgressBar.style.width = "0%";
            return;
        }

        if (now >= lastPeriodEnd) {
            currentPeriodName.textContent = "Classes Ended";
            currentTeacher.textContent = "See you next class";
            currentTimeRange.textContent = "--";
            currentCountdown.textContent = "Day completed successfully 🌙";
            periodProgressBar.style.width = "0%";
        }
    }

    function updateNextCard(now, nextData) {
        if (!nextData) {
            nextDayLabel.textContent = "--";
            nextPeriodName.textContent = "No upcoming period";
            nextTeacher.textContent = "N/A";
            nextTimeRange.textContent = "--";
            nextCountdown.textContent = "--";
            return;
        }

        const { period, startTime, dayIndex, dayOffset } = nextData;

        if (dayOffset === 0) {
            nextDayLabel.textContent = "Today";
        } else if (dayOffset === 1) {
            nextDayLabel.textContent = "Tomorrow";
        } else {
            nextDayLabel.textContent = dayNames[dayIndex];
        }

        nextPeriodName.textContent = period.name;
        nextTeacher.textContent = getTeacherName(period);
        nextTimeRange.textContent = `${formatTime(period.start)} - ${formatTime(period.end)}`;
        nextCountdown.textContent = `Starts in ${formatCountdown(startTime - now)}`;
    }

    function renderTodaySchedule(now) {
        const todaySchedule = timetable[now.getDay()];

        if (!todaySchedule) {
            todayScheduleList.innerHTML = `
                <div class="empty-message">
                    No timetable for today. Enjoy your free day 🌸
                </div>
            `;
            return;
        }

        const html = todaySchedule.map(period => {
            const startTime = parseTime(period.start, now);
            const endTime = parseTime(period.end, now);

            let status = "Upcoming";
            let statusClass = "upcoming";

            if (now >= startTime && now < endTime) {
                status = "Now";
                statusClass = "current";
            } else if (now >= endTime) {
                status = "Done";
                statusClass = "done";
            }

            return `
                <div class="schedule-item ${statusClass}">
                    <div class="schedule-time">
                        ${formatTime(period.start)}<br>
                        ${formatTime(period.end)}
                    </div>

                    <div>
                        <div class="schedule-name">${period.name}</div>
                        <div class="schedule-teacher">${getTeacherName(period)}</div>
                    </div>

                    <div class="schedule-status">${status}</div>
                </div>
            `;
        }).join("");

        todayScheduleList.innerHTML = html;
    }

    function updateDashboard() {
        const now = new Date();

        const currentData = getCurrentPeriod(now);
        const nextData = getNextPeriod(now);

        updateDateTime(now);
        updateCurrentCard(now, currentData);
        updateNextCard(now, nextData);
        renderTodaySchedule(now);
    }

    updateDashboard();
    setInterval(updateDashboard, 1000);
});