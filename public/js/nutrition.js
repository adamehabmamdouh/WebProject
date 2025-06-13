function calculateBMI() {
    const weightInput = document.getElementById('weight').value;
    const heightInput = document.getElementById('height').value;
    const resultDiv = document.getElementById('bmi-result');

    const weight = parseFloat(weightInput);
    const heightCm = parseFloat(heightInput);

    if (
        isNaN(weight) || isNaN(heightCm) ||
        weightInput.trim() === "" || heightInput.trim() === "" ||
        weight <= 0 || heightCm <= 0
    ) {
        resultDiv.innerText = "⚠️ Please enter valid numbers only (no letters or symbols).";
        resultDiv.style.color = "#d32f2f";
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi < 24.9) {
        category = "Normal weight";
    } else if (bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    resultDiv.innerText = `✅ Your BMI is ${bmi.toFixed(1)} (${category})`;
    resultDiv.style.color = "#e65100";
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