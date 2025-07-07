class GradientStudio {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.updateGradient();
    }

    initializeElements() {
        this.gradientDisplay = document.getElementById('gradient-display');
        this.gradientTypeInputs = document.querySelectorAll('input[name="gradient-type"]');
        this.angleSlider = document.getElementById('angle-slider');
        this.angleValue = document.getElementById('angle-value');
        this.randomizeBtn = document.getElementById('randomize');
        this.copyGradientBtn = document.getElementById('copy-gradient');
        this.themeSwitch = document.getElementById('theme-switch');
    }

    setupEventListeners() {
        this.angleSlider.addEventListener('input', () => this.updateAngleDisplay());
        this.gradientTypeInputs.forEach(input => 
            input.addEventListener('change', () => this.updateGradient())
        );
        this.randomizeBtn.addEventListener('click', () => this.randomizeGradient());
        this.copyGradientBtn.addEventListener('click', () => this.copyGradientCode());
        this.themeSwitch.addEventListener('change', () => this.toggleTheme());
    }

    updateAngleDisplay() {
        this.angleValue.textContent = `${this.angleSlider.value}°`;
        this.updateGradient();
    }

    updateGradient() {
        const gradientType = document.querySelector('input[name="gradient-type"]:checked').value;
        const colorStops = '#3b82f6 0%, #10b981 100%';
        let gradient = '';

        switch (gradientType) {
            case 'linear':
                gradient = `linear-gradient(${this.angleSlider.value}deg, ${colorStops})`;
                break;
            case 'radial':
                gradient = `radial-gradient(circle, ${colorStops})`;
                break;
            case 'conic':
                gradient = `conic-gradient(from ${this.angleSlider.value}deg, ${colorStops})`;
                break;
        }

        this.gradientDisplay.style.background = gradient;
    }

    randomizeGradient() {
        this.angleSlider.value = Math.floor(Math.random() * 361);
        this.angleValue.textContent = `${this.angleSlider.value}°`;
        this.updateGradient();
    }

    copyGradientCode() {
        navigator.clipboard.writeText(this.gradientDisplay.style.background).then(() => {
            this.copyGradientBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyGradientBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gradientStudio = new GradientStudio();
});