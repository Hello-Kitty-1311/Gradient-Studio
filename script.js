class GradientStudio {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadTheme();
        this.addInitialColorStops();
        this.updateGradient();
    }

    initializeElements() {
        this.gradientDisplay = document.getElementById('gradient-display');
        this.gradientTypeInputs = document.querySelectorAll('input[name="gradient-type"]');
        this.angleSlider = document.getElementById('angle-slider');
        this.angleValue = document.getElementById('angle-value');
        this.colorStopsContainer = document.getElementById('color-stops');
        this.addColorBtn = document.getElementById('add-color');
        this.randomizeBtn = document.getElementById('randomize');
        this.copyGradientBtn = document.getElementById('copy-gradient');
        this.themeSwitch = document.getElementById('theme-switch');
        this.exportFormat = document.getElementById('export-format');
        this.codeOutput = document.getElementById('code-output');
        this.copyCodeBtn = document.getElementById('copy-code');
        this.savePresetBtn = document.getElementById('save-preset');
        this.loadPresetBtn = document.getElementById('load-preset');
    }

    setupEventListeners() {
        this.angleSlider.addEventListener('input', () => this.updateAngleDisplay());
        this.gradientTypeInputs.forEach(input => 
            input.addEventListener('change', () => this.updateGradient())
        );
        this.addColorBtn.addEventListener('click', () => this.addColorStop());
        this.randomizeBtn.addEventListener('click', () => this.randomizeGradient());
        this.copyGradientBtn.addEventListener('click', () => this.copyGradientCode());
        this.themeSwitch.addEventListener('change', () => this.toggleTheme());
        this.exportFormat.addEventListener('change', () => this.updateCodeOutput());
        this.copyCodeBtn.addEventListener('click', () => this.copyCode());
        this.savePresetBtn.addEventListener('click', () => this.savePreset());
        this.loadPresetBtn.addEventListener('click', () => this.showPresets());
    }

    addInitialColorStops() {
        this.addColorStop('#3b82f6', 0);
        this.addColorStop('#10b981', 100);
    }

    addColorStop(color = this.generateRandomColor(), stop = 50) {
        const colorStop = document.createElement('div');
        colorStop.classList.add('color-stop');
        colorStop.innerHTML = `
            <input type="color" value="${color}">
            <input type="range" min="0" max="100" value="${stop}">
            <span>${stop}%</span>
            <button class="btn remove-color-stop">
                <i class="fas fa-trash"></i>
            </button>
        `;

        const colorInput = colorStop.querySelector('input[type="color"]');
        const rangeInput = colorStop.querySelector('input[type="range"]');
        const stopSpan = colorStop.querySelector('span');
        const removeBtn = colorStop.querySelector('.remove-color-stop');

        colorInput.addEventListener('input', () => this.updateGradient());
        rangeInput.addEventListener('input', () => {
            stopSpan.textContent = `${rangeInput.value}%`;
            this.updateGradient();
        });
        removeBtn.addEventListener('click', () => {
            if (this.colorStopsContainer.children.length > 2) {
                colorStop.remove();
                this.updateGradient();
            }
        });

        this.colorStopsContainer.appendChild(colorStop);
        this.updateGradient();
    }

    updateAngleDisplay() {
        this.angleValue.textContent = `${this.angleSlider.value}°`;
        this.updateGradient();
    }

    updateGradient() {
        const gradientType = document.querySelector('input[name="gradient-type"]:checked').value;
        const colorStops = this.getColorStops();
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
        this.updateCodeOutput();
    }

    getColorStops() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        return Array.from(colorStopElements)
            .map(stop => {
                const color = stop.querySelector('input[type="color"]').value;
                const stopValue = stop.querySelector('input[type="range"]').value;
                return `${color} ${stopValue}%`;
            })
            .join(', ');
    }

    randomizeGradient() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        
        colorStopElements.forEach((stop, index) => {
            const colorInput = stop.querySelector('input[type="color"]');
            const rangeInput = stop.querySelector('input[type="range"]');
            const stopSpan = stop.querySelector('span');

            colorInput.value = this.generateRandomColor();
            rangeInput.value = index === 0 ? 0 : 100;
            stopSpan.textContent = `${rangeInput.value}%`;
        });

        this.angleSlider.value = Math.floor(Math.random() * 361);
        this.angleValue.textContent = `${this.angleSlider.value}°`;
        this.updateGradient();
    }

    generateRandomColor() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    updateCodeOutput() {
        const gradient = this.gradientDisplay.style.background;
        const format = this.exportFormat.value;
        let output = '';

        switch (format) {
            case 'css':
                output = `background: ${gradient};`;
                break;
            case 'scss':
                output = `background: ${gradient};
@function gradient-bg() {
    @return ${gradient};
}`;
                break;
            case 'tailwind':
                output = `bg-[${gradient}]`;
                break;
        }

        this.codeOutput.value = output;
    }

    copyCode() {
        this.codeOutput.select();
        navigator.clipboard.writeText(this.codeOutput.value).then(() => {
            this.copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyCodeBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    copyGradientCode() {
        navigator.clipboard.writeText(this.gradientDisplay.style.background).then(() => {
            this.copyGradientBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyGradientBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    savePreset() {
        const currentPreset = {
            gradientType: document.querySelector('input[name="gradient-type"]:checked').value,
            angle: this.angleSlider.value,
            colorStops: this.getColorStopsData()
        };

        let savedPresets = JSON.parse(localStorage.getItem('gradient-presets') || '[]');
        savedPresets.push(currentPreset);
        localStorage.setItem('gradient-presets', JSON.stringify(savedPresets));
        
        this.showNotification('Gradient preset saved successfully!');
    }

    getColorStopsData() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        return Array.from(colorStopElements).map(stop => ({
            color: stop.querySelector('input[type="color"]').value,
            stop: stop.querySelector('input[type="range"]').value
        }));
    }

    showPresets() {
        console.log('TODO: Implement showPresets functionality');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('gradient-studio-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeSwitch.checked = true;
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            localStorage.setItem('gradient-studio-theme', 'dark');
        } else {
            localStorage.removeItem('gradient-studio-theme');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gradientStudio = new GradientStudio();
});