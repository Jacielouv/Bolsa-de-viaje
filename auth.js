(function () {
    const AUTH_STORAGE_KEY = 'travel-app-auth';
    const AUTH_USERS = {
        cielo: { password: 'nuestra-bolsa-de-viaje-2026' },
        iria: { password: 'nuestra-bolsa-de-viaje-2026' }
    };

    const authScreen = document.getElementById('auth-screen');
    const appShell = document.getElementById('app-shell');
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('auth-username');
    const passwordInput = document.getElementById('auth-password');
    const authMessage = document.getElementById('auth-message');
    const logoutButton = document.getElementById('logout-btn');

    function showApp() {
        if (authScreen) authScreen.hidden = true;
        if (appShell) appShell.hidden = false;
        if (logoutButton) logoutButton.hidden = false;
    }

    function showAuth() {
        if (authScreen) authScreen.hidden = false;
        if (appShell) appShell.hidden = true;
        if (logoutButton) logoutButton.hidden = true;
    }

    function setMessage(text, isError = false) {
        if (authMessage) {
            authMessage.textContent = text;
            authMessage.classList.toggle('error', isError);
        }
    }

    function login(username, password) {
        const user = AUTH_USERS[username];
        if (!user || user.password !== password) {
            setMessage('Usuario o contraseña incorrectos.', true);
            return false;
        }

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username, authenticated: true }));
        setMessage('');
        showApp();
        return true;
    }

    function logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        setMessage('');
        showAuth();
    }

    function restoreSession() {
        try {
            const saved = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
            if (saved?.authenticated && AUTH_USERS[saved.username]) {
                showApp();
                return;
            }
        } catch (error) {
            console.warn('No se pudo restaurar la sesión:', error);
        }
        showAuth();
    }

    // Helper global para consultar el usuario actual desde otros scripts
    window.getCurrentUser = function () {
        try {
            const saved = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
            if (saved?.authenticated && AUTH_USERS[saved.username]) {
                return saved.username;
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    if (authForm) {
        authForm.addEventListener('submit', (event) => {
            event.preventDefault();
            login(usernameInput?.value.trim().toLowerCase() || '', passwordInput?.value || '');
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    restoreSession();
})();