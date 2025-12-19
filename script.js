// Elementos del DOM
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const tabSlider = document.querySelector('.tab-slider');

/**
 * Actualizar posición del slider y efectos de luz
 */
function updateTabSlider(activeButton) {
    if (!tabSlider) return;
    
    const buttonRect = activeButton.getBoundingClientRect();
    const containerRect = activeButton.parentElement.parentElement.getBoundingClientRect();
    
    tabSlider.style.left = `${buttonRect.left - containerRect.left}px`;
    tabSlider.style.width = `${buttonRect.width}px`;
}

/**
 * Añadir efecto de luz al cambiar pestaña
 */
function addLightEffect(activeButton) {
    // Crear elemento de efecto de luz
    const lightEffect = document.createElement('div');
    lightEffect.className = 'tab-change-light';
    lightEffect.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
        animation: lightPulse 0.6s ease-out forwards;
    `;
    
    // Añadir al DOM
    activeButton.appendChild(lightEffect);
    
    // Remover después de la animación
    setTimeout(() => {
        lightEffect.remove();
    }, 600);
}

/**
 * Cambiar a una pestaña específica
 */
function switchTab(targetTabId) {
    // Remover clase 'active' de todos los botones
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Remover clase 'active' de todos los contenidos
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar el botón clickeado
    const activeButton = document.querySelector(`[data-tab="${targetTabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        
        // Actualizar slider
        updateTabSlider(activeButton);
        
        // Efecto de luz
        addLightEffect(activeButton);
    }
    
    // Mostrar el contenido correspondiente
    const activeContent = document.getElementById(targetTabId);
    if (activeContent) {
        activeContent.classList.add('active');
        
        // Efecto de entrada
        activeContent.style.animation = 'none';
        setTimeout(() => {
            activeContent.style.animation = 'fadeInUp 0.5s ease-out';
        }, 10);
    }
    
    // Guardar tab activo en localStorage
    localStorage.setItem('activeTab', targetTabId);
    
    // Feedback de consola
    const tabName = activeButton.querySelector('span').textContent;
    console.log(`🔆 Tab cambiado a: ${tabName}`);
}

/**
 * Obtener índice del tab activo
 */
function getActiveTabIndex() {
    const activeButton = document.querySelector('.tab-btn.active');
    return activeButton ? Array.from(tabButtons).indexOf(activeButton) : 0;
}

/**
 * Navegar al tab anterior
 */
function previousTab() {
    const currentIndex = getActiveTabIndex();
    const previousIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    const previousTabId = tabButtons[previousIndex].dataset.tab;
    switchTab(previousTabId);
}

/**
 * Navegar al tab siguiente
 */
function nextTab() {
    const currentIndex = getActiveTabIndex();
    const nextIndex = (currentIndex + 1) % tabButtons.length;
    const nextTabId = tabButtons[nextIndex].dataset.tab;
    switchTab(nextTabId);
}

// Event listeners para los botones de tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        switchTab(targetTab);
    });
    
    // Efecto hover con luz
    button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('active')) {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.2)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        }
    });
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    // Solo si estamos enfocados en un tab o en ningún input
    const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                          document.activeElement.tagName === 'TEXTAREA';
    
    if (isInputFocused) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousTab();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextTab();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            // Atajos numéricos: presionar 1, 2, 3, 4
            const tabIndex = parseInt(e.key);
            if (tabIndex <= tabButtons.length) {
                switchTab(`tab${tabIndex}`);
            }
            break;
        case 'Home':
            e.preventDefault();
            switchTab('tab1');
            break;
        case 'End':
            e.preventDefault();
            switchTab(`tab${tabButtons.length}`);
            break;
    }
});

// Manejar el formulario de contacto
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validación básica
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showNotification('Por favor completa todos los campos', 'info');
            return;
        }
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor ingresa un email válido', 'warning');
            return;
        }
        
        // Simular envío
        const submitBtn = contactForm.querySelector('.cta-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Efecto de envío con luz
        submitBtn.style.background = 'var(--gradient-accent)';
        
        setTimeout(() => {
            showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'var(--gradient-primary)';
        }, 1500);
    });
}

/**
 * Mostrar notificación con efectos de luz
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <div class="notification-glow"></div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Cargar tab guardado al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const savedTab = localStorage.getItem('activeTab');
    
    if (savedTab && document.getElementById(savedTab)) {
        setTimeout(() => {
            switchTab(savedTab);
        }, 300);
    } else {
        setTimeout(() => {
            switchTab('tab1');
        }, 300);
    }
    
    // Inicializar slider
    const activeButton = document.querySelector('.tab-btn.active');
    if (activeButton && tabSlider) {
        setTimeout(() => {
            updateTabSlider(activeButton);
        }, 500);
    }
    
    // Efecto de carga inicial
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Efectos iniciales
    console.log('%c✨ LuxTabs Inicializado', 'font-size: 18px; color: #667eea; font-weight: bold;');
    console.log('%cDiseño con efectos de luz y animaciones', 'color: #764ba2;');
    console.log('Atajos de teclado:');
    console.log('- ← → : Navegar entre pestañas');
    console.log('- 1-4 : Acceso directo a pestañas');
    console.log('- Home/End : Primera/Última pestaña');
});

// Añadir estilos para notificaciones
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes lightPulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    
    .notification {
        position: fixed;
        top: 30px;
        right: 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        z-index: 10000;
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid rgba(102, 126, 234, 0.1);
        max-width: 400px;
    }
    
    .notification.success {
        border-left: 4px solid #68d391;
    }
    
    .notification.warning {
        border-left: 4px solid #f6ad55;
    }
    
    .notification.info {
        border-left: 4px solid #667eea;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification i {
        font-size: 1.5rem;
    }
    
    .notification.success i {
        color: #68d391;
    }
    
    .notification.warning i {
        color: #f6ad55;
    }
    
    .notification.info i {
        color: #667eea;
    }
    
    .notification-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.05), transparent);
        border-radius: 15px;
        z-index: -1;
        animation: beam 3s infinite linear;
    }
`;
document.head.appendChild(notificationStyle);

// Mejorar accesibilidad
tabButtons.forEach(button => {
    button.addEventListener('focus', () => {
        button.style.outline = '2px solid var(--primary)';
        button.style.outlineOffset = '3px';
        button.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });
    
    button.addEventListener('blur', () => {
        button.style.outline = 'none';
        button.style.boxShadow = 'none';
    });
});