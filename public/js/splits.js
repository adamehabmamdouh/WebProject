let translations = {};

async function loadTranslations() {
    try {
        const response = await fetch('/locales/en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

function t(key, args = {}) {
    let text = translations[key] || `MISSING_KEY: ${key}`;
    for (const argKey in args) {
        text = text.replace(new RegExp(`{${argKey}}`, 'g'), args[argKey]);
    }
    return text;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const args = {};

        if (element.hasAttribute('data-i18n-arg-name')) {
            args.name = element.getAttribute('data-i18n-arg-name');
        }

        element.textContent = t(key, args);
    });

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
                notesKey: 'ppl_sunday_notes'
            },
            arnold: {
                sessionKey: 'arnold_sunday_session',
                notesKey: 'arnold_sunday_notes'
            }
        }
    ];

    const dayCards = document.querySelectorAll('.day-card');

    dayCards.forEach((card, index) => {
        const dayData = dailySplitsData[index];
        if (!dayData) return;

        card.querySelector('.day-name').textContent = t(dayData.dayKey);

        const pplSplitInfo = card.querySelector('.split-info:nth-of-type(1)');
        if (pplSplitInfo) {
            pplSplitInfo.querySelector('.training-session').textContent = t(dayData.ppl.sessionKey);

            const pplExerciseList = pplSplitInfo.querySelector('.exercise-list');
            const pplNotes = pplSplitInfo.querySelector('.notes');

            if (dayData.ppl.exercisesKey) {
                if (pplExerciseList) {
                    pplExerciseList.innerHTML = '';
                    t(dayData.ppl.exercisesKey).forEach(exercise => {
                        const li = document.createElement('li');
                        li.textContent = exercise;
                        pplExerciseList.appendChild(li);
                    });
                    pplExerciseList.style.display = '';
                }
                if (pplNotes) pplNotes.style.display = 'none';
            } else if (dayData.ppl.notesKey) {
                if (pplNotes) {
                    pplNotes.textContent = t(dayData.ppl.notesKey);
                    pplNotes.style.display = '';
                }
                if (pplExerciseList) pplExerciseList.style.display = 'none';
            }
        }

        const arnoldSplitInfo = card.querySelector('.split-info:nth-of-type(2)');
        if (arnoldSplitInfo) {
            arnoldSplitInfo.querySelector('.training-session').textContent = t(dayData.arnold.sessionKey);

            const arnoldExerciseList = arnoldSplitInfo.querySelector('.exercise-list');
            const arnoldNotes = arnoldSplitInfo.querySelector('.notes');

            if (dayData.arnold.exercisesKey) {
                if (arnoldExerciseList) {
                    arnoldExerciseList.innerHTML = '';
                    t(dayData.arnold.exercisesKey).forEach(exercise => {
                        const li = document.createElement('li');
                        li.textContent = exercise;
                        arnoldExerciseList.appendChild(li);
                    });
                    arnoldExerciseList.style.display = '';
                }
                if (arnoldNotes) arnoldNotes.style.display = 'none';
            } else if (dayData.arnold.notesKey) {
                if (arnoldNotes) {
                    arnoldNotes.textContent = t(dayData.arnold.notesKey);
                    arnoldNotes.style.display = '';
                }
                if (arnoldExerciseList) arnoldExerciseList.style.display = 'none';
            }
        }
    });
}

const darkModeToggleBtn = document.querySelector('.dark-mode-toggle');
const popupContainer = document.getElementById('popupContainer');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    if (popupContainer) {
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

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    loadTranslations();

    const darkModeButton = document.querySelector('.darkmode-button');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }
});