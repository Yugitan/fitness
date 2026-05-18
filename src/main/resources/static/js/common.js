/**
 * Fitness健身记录 - 公共JavaScript工具
 * 原生JavaScript实现，无jQuery依赖
 */

// ========== 上下文路径（自动检测） ==========
var CTX = (function() {
    if (document.currentScript && document.currentScript.src) {
        var m = document.currentScript.src.match(/^(.*?)\/static\/js\/common\.js/);
        if (m) return m[1];
    }
    var parts = window.location.pathname.split('/');
    return parts.length > 2 ? '/' + parts[1] : '';
})();

// ========== Toast 消息提示 ==========
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'success', duration = 3000) {
        this.init();
        const toast = document.createElement('div');
        toast.className = `toast-msg ${type}`;
        toast.textContent = message;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error', 5000); },
    warning(msg) { this.show(msg, 'warning'); }
};

// ========== API 请求封装 ==========
const API = {
    baseURL: CTX,

    async request(url, options = {}) {
        const defaultOptions = {
            headers: { 'Content-Type': 'application/json' },
        };
        const merged = { ...defaultOptions, ...options };
        if (merged.body && typeof merged.body === 'object') {
            merged.body = JSON.stringify(merged.body);
        }

        try {
            const response = await fetch(this.baseURL + url, merged);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API请求失败:', error);
            return { code: 500, message: '网络请求失败' };
        }
    },

    get(url) { return this.request(url); },
    post(url, data) { return this.request(url, { method: 'POST', body: data }); },
    put(url, data) { return this.request(url, { method: 'PUT', body: data }); },
    delete(url) { return this.request(url, { method: 'DELETE' }); }
};

// ========== DOM 工具 ==========
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ========== 日期工具 ==========
const DateUtil = {
    today() {
        return new Date().toISOString().split('T')[0];
    },

    format(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    },

    formatCN(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
    },

    daysAgo(n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString().split('T')[0];
    }
};

// ========== 用户认证（登录状态管理） ==========
const Auth = {
    _user: null,
    _checked: false,

    async check() {
        try {
            const result = await API.get('/user/api/current');
            if (result.code === 200 && result.data) {
                this._user = result.data;
                this._checked = true;
                return this._user;
            }
        } catch(e) { /* 未登录 */ }
        this._user = null;
        this._checked = true;
        return null;
    },

    async current() {
        if (!this._checked) await this.check();
        return this._user;
    },

    isLoggedIn() {
        return this._user !== null;
    },

    async logout() {
        await API.post('/user/api/logout');
        this._user = null;
        this._checked = false;
        GuestMode.reset();
        window.location.href = CTX + '/';
    }
};

// ========== 游客模式 ==========
const GuestMode = {
    MAX_DAYS: 7,
    // 测试模式：设为 true 时使用30秒倒计时（改回 false 恢复7天）
    TEST_MODE: false,
    TEST_SECONDS: 30,
    STORE_KEY: 'guest_data',

    _data() {
        return LocalStore.get(this.STORE_KEY, { firstVisit: null, lastVisit: null, todayShown: false, firstVisitTime: null });
    },

    _save(data) {
        LocalStore.set(this.STORE_KEY, data);
    },

    init() {
        const data = this._data();
        const now = new Date();
        const today = DateUtil.today();

        if (!data.firstVisit) {
            data.firstVisit = today;
        }
        if (!data.firstVisitTime) {
            data.firstVisitTime = now.getTime();
        }

        // 检查是否新的一天
        if (data.lastVisit !== today) {
            data.todayShown = false;
            data.lastVisit = today;
        }

        this._save(data);
    },

    _elapsedSeconds() {
        const data = this._data();
        if (!data.firstVisitTime) return 0;
        return Math.floor((Date.now() - data.firstVisitTime) / 1000);
    },

    getDaysUsed() {
        if (this.TEST_MODE) {
            return Math.floor(this._elapsedSeconds() / this.TEST_SECONDS * this.MAX_DAYS);
        }
        const data = this._data();
        if (!data.firstVisit) return 0;
        const first = new Date(data.firstVisit);
        const now = new Date();
        return Math.floor((now - first) / (1000 * 60 * 60 * 24)) + 1;
    },

    getDaysRemaining() {
        return Math.max(0, this.MAX_DAYS - this.getDaysUsed());
    },

    isLocked() {
        if (this.TEST_MODE) {
            return this._elapsedSeconds() >= this.TEST_SECONDS;
        }
        return this.getDaysUsed() > this.MAX_DAYS;
    },

    shouldShowPopup() {
        const data = this._data();
        return !data.todayShown;
    },

    markPopupShown() {
        const data = this._data();
        data.todayShown = true;
        this._save(data);
    },

    reset() {
        LocalStore.remove(this.STORE_KEY);
    }
};

// ========== LocalStorage 操作（游客模式） ==========
const LocalStore = {
    set(key, value) {
        try {
            localStorage.setItem('fitness_' + key, JSON.stringify(value));
        } catch(e) {
            console.warn('LocalStorage写入失败:', e);
        }
    },

    get(key, defaultValue = null) {
        try {
            const val = localStorage.getItem('fitness_' + key);
            return val ? JSON.parse(val) : defaultValue;
        } catch(e) {
            return defaultValue;
        }
    },

    remove(key) {
        localStorage.removeItem('fitness_' + key);
    },

    clear() {
        Object.keys(localStorage)
            .filter(k => k.startsWith('fitness_'))
            .forEach(k => localStorage.removeItem(k));
    }
};

// ========== 页面加载完成后初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 激活当前导航链接
    const currentPath = window.location.pathname;
    $$('.nav-link').forEach(link => {
        var href = link.getAttribute('href');
        if (href === currentPath ||
            (currentPath.startsWith(CTX + '/exercise') && href === CTX + '/exercise') ||
            (currentPath.startsWith(CTX + '/training') && href === CTX + '/training') ||
            (currentPath.startsWith(CTX + '/plan') && href === CTX + '/plan') ||
            (currentPath.startsWith(CTX + '/blogger') && href === CTX + '/blogger') ||
            (currentPath.startsWith(CTX + '/statistics') && href === CTX + '/statistics')) {
            link.classList.add('active');
        }
    });
});
