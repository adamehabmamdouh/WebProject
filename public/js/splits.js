// splits.js

// --- Translation Logic ---
let translations = {};

async function loadTranslations() {
    try {
        // Adjust path to en.json based on your project structure
        // Assuming en.json is in WebProject/json/en.json and splits.js is in WebProject/js/splits.js
        const response = await fetch('/locales/en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        applyTranslations(); // Apply text after loading
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

function t(key, args = {}) {
    let text = translations[key] || `MISSING_KEY: ${key}`; // Fallback for missing keys
    // Simple string replacement for placeholders like {name}
    for (const argKey in args) {
        text = text.replace(new RegExp(`{${argKey}}`, 'g'), args[argKey]);
    }
    return text;
}

function applyTranslations() {
    // Universal way to apply translations to data-i18n attributes
    // This will handle nav links, banner, calendar title/description, footer, dark mode button
    // and the static parts of the day cards (split type headers)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const args = {};

        // Special handling for dynamic arguments, like username in welcome message
        if (element.hasAttribute('data-i18n-arg-name')) {
            args.name = element.getAttribute('data-i18n-arg-name');
        }

        // Apply text content
        element.textContent = t(key, args);
    });


    // Define data for the days and their splits from translations
    const dailySplitsData = [
        {
            dayKey: 'day_monday',
            ppl: {
                sessionKey: 'ppl_monday_session',
                exercisesKey: 'ppl_monday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_monday_session',
                exercisesKey: 'arnold_monday_exercises'
            }
        },
        {
            dayKey: 'day_tuesday',
            ppl: {
                sessionKey: 'ppl_tuesday_session',
                exercisesKey: 'ppl_tuesday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_tuesday_session',
                exercisesKey: 'arnold_tuesday_exercises'
            }
        },
        {
            dayKey: 'day_wednesday',
            ppl: {
                sessionKey: 'ppl_wednesday_session',
                exercisesKey: 'ppl_wednesday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_wednesday_session',
                exercisesKey: 'arnold_wednesday_exercises'
            }
        },
        {
            dayKey: 'day_thursday',
            ppl: {
                sessionKey: 'ppl_thursday_session',
                exercisesKey: 'ppl_thursday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_thursday_session',
                exercisesKey: 'arnold_thursday_exercises'
            }
        },
        {
            dayKey: 'day_friday',
            ppl: {
                sessionKey: 'ppl_friday_session',
                exercisesKey: 'ppl_friday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_friday_session',
                exercisesKey: 'arnold_friday_exercises'
            }
        },
        {
            dayKey: 'day_saturday',
            ppl: {
                sessionKey: 'ppl_saturday_session',
                exercisesKey: 'ppl_saturday_exercises'
            },
            arnold: {
                sessionKey: 'arnold_saturday_session',
                exercisesKey: 'arnold_saturday_exercises'
            }
        },
        {
            dayKey: 'day_sunday',
            ppl: {
                sessionKey: 'ppl_sunday_session',
                notesKey: 'ppl_sunday_notes' // Sunday has notes, not exercises list
            },
            arnold: {
                sessionKey: 'arnold_sunday_session',
                notesKey: 'arnold_sunday_notes' // Sunday has notes, not exercises list
            }
        }
    ];

    const dayCards = document.querySelectorAll('.day-card');

    dayCards.forEach((card, index) => {
        const dayData = dailySplitsData[index];
        if (!dayData) return; // Should not happen if data matches HTML structure

        // Set day name
        card.querySelector('.day-name').textContent = t(dayData.dayKey);

        // --- Push/Pull/Legs Split ---
        const pplSplitInfo = card.querySelector('.split-info:nth-of-type(1)');
        if (pplSplitInfo) {
            // split-type text is now handled by the universal data-i18n selector
            // pplSplitInfo.querySelector('.split-type').textContent = t('split_ppl_type');

            pplSplitInfo.querySelector('.training-session').textContent = t(dayData.ppl.sessionKey);

            // Hide/show .notes or .exercise-list and populate
            const pplExerciseList = pplSplitInfo.querySelector('.exercise-list');
            const pplNotes = pplSplitInfo.querySelector('.notes');

            if (dayData.ppl.exercisesKey) { // Check if it's an exercise list day
                if (pplExerciseList) {
                    pplExerciseList.innerHTML = ''; // Clear existing
                    t(dayData.ppl.exercisesKey).forEach(exercise => {
                        const li = document.createElement('li');
                        li.textContent = exercise;
                        pplExerciseList.appendChild(li);
                    });
                    pplExerciseList.style.display = ''; // Make sure it's visible
                }
                if (pplNotes) pplNotes.style.display = 'none'; // Hide notes
            } else if (dayData.ppl.notesKey) { // Check if it's a notes day (e.g., Sunday)
                if (pplNotes) {
                    pplNotes.textContent = t(dayData.ppl.notesKey);
                    pplNotes.style.display = ''; // Make sure it's visible
                }
                if (pplExerciseList) pplExerciseList.style.display = 'none'; // Hide exercise list
            }
        }

        // --- Arnold Split ---
        const arnoldSplitInfo = card.querySelector('.split-info:nth-of-type(2)');
        if (arnoldSplitInfo) {
            // split-type text is now handled by the universal data-i18n selector
            // arnoldSplitInfo.querySelector('.split-type').textContent = t('split_arnold_type');

            arnoldSplitInfo.querySelector('.training-session').textContent = t(dayData.arnold.sessionKey);

            // Hide/show .notes or .exercise-list and populate
            const arnoldExerciseList = arnoldSplitInfo.querySelector('.exercise-list');
            const arnoldNotes = arnoldSplitInfo.querySelector('.notes');

            if (dayData.arnold.exercisesKey) { // Check if it's an exercise list day
                if (arnoldExerciseList) {
                    arnoldExerciseList.innerHTML = ''; // Clear existing
                    t(dayData.arnold.exercisesKey).forEach(exercise => {
                        const li = document.createElement('li');
                        li.textContent = exercise;
                        arnoldExerciseList.appendChild(li);
                    });
                    arnoldExerciseList.style.display = ''; // Make sure it's visible
                }
                if (arnoldNotes) arnoldNotes.style.display = 'none'; // Hide notes
            } else if (dayData.arnold.notesKey) { // Check if it's a notes day (e.g., Sunday)
                if (arnoldNotes) {
                    arnoldNotes.textContent = t(dayData.arnold.notesKey);
                    arnoldNotes.style.display = ''; // Make sure it's visible
                }
                if (arnoldExerciseList) arnoldExerciseList.style.display = 'none'; // Hide exercise list
            }
        }
    });
}


// --- Dark Mode Logic ---

// --- Dark Mode Toggle ---
const darkModeToggleBtn = document.querySelector('.dark-mode-toggle');
const popupContainer = document.getElementById('popupContainer'); // Get the popup container

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    if (popupContainer) { // Check if popupContainer exists before trying to style it
        if (document.body.classList.contains('dark-mode')) {
            popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            popupContainer.style.color = 'white';
        } else {
            popupContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            popupContainer.style.color = 'black';
        }
    }

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

if (darkModeToggleBtn) {
    darkModeToggleBtn.addEventListener('click', toggleDarkMode);
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (popupContainer) {
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popupContainer.style.color = 'white';
    }
}

// --- Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved dark mode preference FIRST, so the page renders with correct theme immediately
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Load translations after dark mode preference is applied
    loadTranslations();

    // Attach the dark mode toggle to the button
    // It's safer to attach it here after the button is potentially translated
    const darkModeButton = document.querySelector('.darkmode-button');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }
});