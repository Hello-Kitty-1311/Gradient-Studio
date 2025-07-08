class GradientStudio {
    constructor() {
        this.presets = [];
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
        this.presetModal = document.getElementById('preset-modal');
        this.presetList = document.getElementById('preset-list');
        this.closeModalBtn = document.getElementById('close-modal');
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
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
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

    loadTheme() {
        const savedTheme = this.getStoredTheme();
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeSwitch.checked = true;
        }
    }

    getStoredTheme() {
        try {
            return JSON.parse(localStorage.getItem('gradient-studio-theme') || 'null');
        } catch {
            return null;
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            this.setStoredTheme('dark');
        } else {
            this.removeStoredTheme();
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('gradient-studio-theme', JSON.stringify(theme));
        } catch {}
    }

    removeStoredTheme() {
        try {
            localStorage.removeItem('gradient-studio-theme');
        } catch {}
    }

    savePreset() {
        const currentPreset = {
            gradientType: document.querySelector('input[name="gradient-type"]:checked').value,
            angle: this.angleSlider.value,
            colorStops: this.getColorStopsData()
        };

        this.presets.push(currentPreset);
        this.savePresetsToStorage();
        this.showNotification('Gradient preset saved successfully!');
    }

    getColorStopsData() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        return Array.from(colorStopElements).map(stop => ({
            color: stop.querySelector('input[type="color"]').value,
            stop: stop.querySelector('input[type="range"]').value
        }));
    }

    savePresetsToStorage() {
        try {
            localStorage.setItem('gradient-presets', JSON.stringify(this.presets));
        } catch {}
    }

    loadPresetsFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('gradient-presets') || '[]');
        } catch {
            return [];
        }
    }

    showPresets() {
        this.presets = this.loadPresetsFromStorage();
        
        this.presetList.innerHTML = this.presets.map((preset, index) => `
            <div class="preset-item" data-index="${index}">
                <div class="preset-preview" style="background: ${this.generatePresetGradient(preset)}"></div>
                <div class="preset-actions">
                    <button class="btn load-preset">Load</button>
                    <button class="btn delete-preset">Delete</button>
                </div>
            </div>
        `).join('');

        this.presetList.addEventListener('click', (e) => {
            const presetItem = e.target.closest('.preset-item');
            if (!presetItem) return;

            const index = presetItem.dataset.index;
            if (e.target.classList.contains('load-preset')) {
                this.loadPreset(this.presets[index]);
            } else if (e.target.classList.contains('delete-preset')) {
                this.deletePreset(index);
            }
        });

        this.presetModal.style.display = 'flex';
    }

    generatePresetGradient(preset) {
        const colorStops = preset.colorStops
            .map(stop => `${stop.color} ${stop.stop}%`)
            .join(', ');

        switch (preset.gradientType) {
            case 'linear':
                return `linear-gradient(${preset.angle}deg, ${colorStops})`;
            case 'radial':
                return `radial-gradient(circle, ${colorStops})`;
            case 'conic':
                return `conic-gradient(from ${preset.angle}deg, ${colorStops})`;
        }
    }

    loadPreset(preset) {
        document.querySelector(`input[value="${preset.gradientType}"]`).checked = true;
        this.angleSlider.value = preset.angle;
        this.angleValue.textContent = `${preset.angle}°`;

        this.colorStopsContainer.innerHTML = '';
        preset.colorStops.forEach(stop => {
            this.addColorStop(stop.color, stop.stop);
        });

        this.updateGradient();
        this.closeModal();
    }

    deletePreset(index) {
        this.presets.splice(index, 1);
        this.savePresetsToStorage();
        this.showPresets();
    }

    closeModal() {
        this.presetModal.style.display = 'none';
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
}

document.addEventListener('DOMContentLoaded', () => {
    new GradientStudio();
});