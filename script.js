class GradientStudio {
    constructor() {
        this.presets = [];
        this.themes = {
            light: 'light',
            dark: 'dark-mode',
            neon: 'neon-mode',
            vintage: 'vintage-mode',
            ocean: 'ocean-mode',
            sunset: 'sunset-mode'
        };
        this.initializeElements();
        this.setupEventListeners();
        this.loadTheme();
        this.loadPresetsFromStorage();
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
        this.themeSelect = document.getElementById('theme-select');
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
        this.themeSelect.addEventListener('change', () => this.changeTheme());
        this.exportFormat.addEventListener('change', () => this.updateCodeOutput());
        this.copyCodeBtn.addEventListener('click', () => this.copyCode());
        this.savePresetBtn.addEventListener('click', () => this.savePreset());
        this.loadPresetBtn.addEventListener('click', () => this.showPresets());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        this.presetModal.addEventListener('click', (e) => {
            if (e.target === this.presetModal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
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
        const stops = Array.from(colorStopElements)
            .map(stop => {
                const color = stop.querySelector('input[type="color"]').value;
                const stopValue = stop.querySelector('input[type="range"]').value;
                return { color, stopValue: parseInt(stopValue) };
            })
            .sort((a, b) => a.stopValue - b.stopValue);

        return stops.map(stop => `${stop.color} ${stop.stopValue}%`).join(', ');
    }

    randomizeGradient() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        const numStops = colorStopElements.length;
        
        colorStopElements.forEach((stop, index) => {
            const colorInput = stop.querySelector('input[type="color"]');
            const rangeInput = stop.querySelector('input[type="range"]');
            const stopSpan = stop.querySelector('span');

            colorInput.value = this.generateRandomColor();
            
            if (numStops === 2) {
                rangeInput.value = index === 0 ? 0 : 100;
            } else {
                rangeInput.value = Math.round((index / (numStops - 1)) * 100);
            }
            
            stopSpan.textContent = `${rangeInput.value}%`;
        });

        this.angleSlider.value = Math.floor(Math.random() * 361);
        this.angleValue.textContent = `${this.angleSlider.value}°`;
        
        const gradientTypes = ['linear', 'radial', 'conic'];
        const randomType = gradientTypes[Math.floor(Math.random() * gradientTypes.length)];
        document.querySelector(`input[value="${randomType}"]`).checked = true;
        
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
                output = `$gradient: ${gradient};
background: $gradient;

@mixin gradient-bg {
    background: ${gradient};
}`;
                break;
            case 'tailwind':
                const colorStops = this.getColorStopsData();
                const gradientType = document.querySelector('input[name="gradient-type"]:checked').value;
                const angle = this.angleSlider.value;
                
                if (gradientType === 'linear') {
                    const direction = this.getDirectionFromAngle(angle);
                    output = `bg-gradient-to-${direction} from-[${colorStops[0]?.color}] to-[${colorStops[colorStops.length - 1]?.color}]`;
                } else {
                    output = `bg-[${gradient}]`;
                }
                break;
        }

        this.codeOutput.value = output;
    }

    getDirectionFromAngle(angle) {
        const normalizedAngle = ((angle % 360) + 360) % 360;
        
        if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return 'r';
        if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'br';
        if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'b';
        if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'bl';
        if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'l';
        if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'tl';
        if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 't';
        if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return 'tr';
        
        return 'r';
    }

    copyCode() {
        this.codeOutput.select();
        navigator.clipboard.writeText(this.codeOutput.value).then(() => {
            this.showNotification('Code copied to clipboard!');
            this.copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
                this.copyCodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
            }, 2000);
        }).catch(() => {
            this.showNotification('Failed to copy code');
        });
    }

    copyGradientCode() {
        const gradient = this.gradientDisplay.style.background;
        navigator.clipboard.writeText(`background: ${gradient};`).then(() => {
            this.showNotification('Gradient copied to clipboard!');
            this.copyGradientBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
                this.copyGradientBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        }).catch(() => {
            this.showNotification('Failed to copy gradient');
        });
    }

    loadTheme() {
        const savedTheme = this.getStoredTheme() || 'light';
        this.themeSelect.value = savedTheme;
        this.applyTheme(savedTheme);
    }

    changeTheme() {
        const selectedTheme = this.themeSelect.value;
        this.applyTheme(selectedTheme);
        this.setStoredTheme(selectedTheme);
    }

    applyTheme(theme) {
        document.body.className = '';
        if (theme !== 'light') {
            document.body.classList.add(this.themes[theme]);
        }
    }

    getStoredTheme() {
        return this.presets.theme || null;
    }

    setStoredTheme(theme) {
        this.presets.theme = theme;
        this.savePresetsToStorage();
    }

    savePreset() {
        const presetName = prompt('Enter a name for this preset:');
        if (!presetName || presetName.trim() === '') return;

        const currentPreset = {
            name: presetName.trim(),
            gradientType: document.querySelector('input[name="gradient-type"]:checked').value,
            angle: this.angleSlider.value,
            colorStops: this.getColorStopsData(),
            id: Date.now()
        };

        if (!Array.isArray(this.presets)) {
            this.presets = [];
        }

        this.presets.push(currentPreset);
        this.savePresetsToStorage();
        this.showNotification(`Preset "${presetName}" saved successfully!`);
    }

    getColorStopsData() {
        const colorStopElements = this.colorStopsContainer.querySelectorAll('.color-stop');
        return Array.from(colorStopElements).map(stop => ({
            color: stop.querySelector('input[type="color"]').value,
            stop: parseInt(stop.querySelector('input[type="range"]').value)
        }));
    }

    savePresetsToStorage() {
        const dataToSave = {
            presets: Array.isArray(this.presets) ? this.presets : [],
            theme: this.presets.theme || 'light'
        };
        this.presets = dataToSave;
    }

    loadPresetsFromStorage() {
        this.presets = {
            presets: [],
            theme: 'light'
        };
    }

    showPresets() {
        const presetArray = Array.isArray(this.presets) ? this.presets : (this.presets.presets || []);
        
        if (presetArray.length === 0) {
            this.presetList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No saved presets yet. Create your first gradient and save it!</p>';
        } else {
            this.presetList.innerHTML = presetArray.map((preset, index) => `
                <div class="preset-item" data-index="${index}">
                    <div class="preset-preview" style="background: ${this.generatePresetGradient(preset)}"></div>
                    <div class="preset-info">
                        <h4 style="margin: 0.5rem; font-size: 0.875rem; color: var(--text-primary);">${preset.name}</h4>
                    </div>
                    <div class="preset-actions">
                        <button class="btn load-preset" data-index="${index}">Load</button>
                        <button class="btn delete-preset" data-index="${index}">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        this.setupPresetEventListeners();
        this.presetModal.style.display = 'flex';
    }

    setupPresetEventListeners() {
        const loadButtons = this.presetList.querySelectorAll('.load-preset');
        const deleteButtons = this.presetList.querySelectorAll('.delete-preset');

        loadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const presetArray = Array.isArray(this.presets) ? this.presets : (this.presets.presets || []);
                if (presetArray[index]) {
                    this.loadPreset(presetArray[index]);
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deletePreset(index);
            });
        });
    }

    generatePresetGradient(preset) {
        const colorStops = preset.colorStops
            .sort((a, b) => a.stop - b.stop)
            .map(stop => `${stop.color} ${stop.stop}%`)
            .join(', ');

        switch (preset.gradientType) {
            case 'linear':
                return `linear-gradient(${preset.angle}deg, ${colorStops})`;
            case 'radial':
                return `radial-gradient(circle, ${colorStops})`;
            case 'conic':
                return `conic-gradient(from ${preset.angle}deg, ${colorStops})`;
            default:
                return `linear-gradient(${preset.angle}deg, ${colorStops})`;
        }
    }

    loadPreset(preset) {
        document.querySelector(`input[value="${preset.gradientType}"]`).checked = true;
        this.angleSlider.value = preset.angle;
        this.angleValue.textContent = `${preset.angle}°`;

        this.colorStopsContainer.innerHTML = '';
        preset.colorStops
            .sort((a, b) => a.stop - b.stop)
            .forEach(stop => {
                this.addColorStop(stop.color, stop.stop);
            });

        this.updateGradient();
        this.closeModal();
        this.showNotification(`Preset "${preset.name}" loaded successfully!`);
    }

    deletePreset(index) {
        const presetArray = Array.isArray(this.presets) ? this.presets : (this.presets.presets || []);
        
        if (presetArray[index]) {
            const presetName = presetArray[index].name;
            if (confirm(`Are you sure you want to delete the preset "${presetName}"?`)) {
                presetArray.splice(index, 1);
                
                if (Array.isArray(this.presets)) {
                    this.presets = presetArray;
                } else {
                    this.presets.presets = presetArray;
                }
                
                this.savePresetsToStorage();
                this.showPresets();
                this.showNotification(`Preset "${presetName}" deleted successfully!`);
            }
        }
    }

    closeModal() {
        this.presetModal.style.display = 'none';
    }

    showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GradientStudio();
});