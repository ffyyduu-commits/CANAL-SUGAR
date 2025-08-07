// نظام قاعدة البيانات - القناة للسكر
// Canal Sugar Database System

class CanalSugarDB {
    constructor() {
        this.dbName = 'canal_sugar_db';
        this.version = 1;
        this.db = null;
        this.isInitialized = false;
    }

    // تهيئة قاعدة البيانات
    async init() {
        try {
            // استخدام IndexedDB للمتصفح
            if (typeof window !== 'undefined' && window.indexedDB) {
                await this.initIndexedDB();
            } else {
                // استخدام localStorage كبديل
                await this.initLocalStorage();
            }
            this.isInitialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    // تهيئة IndexedDB
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // إنشاء جدول المستخدمين
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('employee_id', 'employee_id', { unique: true });
                }

                // إنشاء جدول الوجبات
                if (!db.objectStoreNames.contains('meals')) {
                    const mealStore = db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
                    mealStore.createIndex('meal_type', 'meal_type', { unique: false });
                }

                // إنشاء جدول خيارات الوجبات
                if (!db.objectStoreNames.contains('meal_options')) {
                    const optionStore = db.createObjectStore('meal_options', { keyPath: 'id', autoIncrement: true });
                    optionStore.createIndex('meal_id', 'meal_id', { unique: false });
                }

                // إنشاء جدول الحجوزات
                if (!db.objectStoreNames.contains('reservations')) {
                    const reservationStore = db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
                    reservationStore.createIndex('user_id', 'user_id', { unique: false });
                    reservationStore.createIndex('meal_id', 'meal_id', { unique: false });
                    reservationStore.createIndex('reservation_date', 'reservation_date', { unique: false });
                }

                // إنشاء جدول الإعدادات
                if (!db.objectStoreNames.contains('system_settings')) {
                    const settingStore = db.createObjectStore('system_settings', { keyPath: 'setting_key' });
                }

                // إنشاء جدول سجل النشاطات
                if (!db.objectStoreNames.contains('activity_logs')) {
                    const logStore = db.createObjectStore('activity_logs', { keyPath: 'id', autoIncrement: true });
                    logStore.createIndex('user_id', 'user_id', { unique: false });
                    logStore.createIndex('created_at', 'created_at', { unique: false });
                }
            };
        });
    }

    // تهيئة localStorage كبديل
    async initLocalStorage() {
        this.db = {
            users: JSON.parse(localStorage.getItem('canal_users') || '[]'),
            meals: JSON.parse(localStorage.getItem('canal_meals') || '[]'),
            meal_options: JSON.parse(localStorage.getItem('canal_meal_options') || '[]'),
            reservations: JSON.parse(localStorage.getItem('canal_reservations') || '[]'),
            system_settings: JSON.parse(localStorage.getItem('canal_settings') || '{}'),
            activity_logs: JSON.parse(localStorage.getItem('canal_logs') || '[]')
        };

        // إدراج البيانات الافتراضية إذا لم تكن موجودة
        await this.insertDefaultData();
    }

    // إدراج البيانات الافتراضية
    async insertDefaultData() {
        // إدراج المشرف الافتراضي
        const adminExists = await this.getUserByUsername('admin');
        if (!adminExists) {
            await this.createUser({
                username: 'admin',
                email: 'admin@canalsugar.com',
                password_hash: 'canal2025',
                full_name: 'مدير النظام',
                is_admin: true,
                is_active: true,
                created_at: new Date().toISOString()
            });
        }

        // إدراج الوجبات الافتراضية
        const mealsCount = await this.getMealsCount();
        if (mealsCount === 0) {
            const defaultMeals = [
                {
                    meal_type: 'breakfast',
                    name_ar: 'فطور صباحي',
                    name_en: 'Breakfast',
                    description_ar: 'وجبة صباحية غنية بالطاقة، متاحة من الساعة 6:00 إلى 9:00 صباحاً.',
                    description_en: 'Energy-rich morning meal, available from 6:00 AM to 9:00 AM.',
                    image_path: 'images/breakfast.svg',
                    start_time: '06:00',
                    end_time: '09:00',
                    is_active: true,
                    max_reservations: 100,
                    created_at: new Date().toISOString()
                },
                {
                    meal_type: 'lunch',
                    name_ar: 'غداء',
                    name_en: 'Lunch',
                    description_ar: 'وجبة غداء ساخنة أو صحية أو بديلة، متاحة من الساعة 12:00 إلى 1:00 مساءً.',
                    description_en: 'Hot, healthy, or alternative lunch meal, available from 12:00 PM to 1:00 PM.',
                    image_path: 'images/lunch.svg',
                    start_time: '12:00',
                    end_time: '13:00',
                    is_active: true,
                    max_reservations: 100,
                    created_at: new Date().toISOString()
                },
                {
                    meal_type: 'dinner',
                    name_ar: 'عشاء',
                    name_en: 'Dinner',
                    description_ar: 'وجبة عشاء خفيفة أو صحية، متاحة من الساعة 6:00 إلى 8:00 مساءً.',
                    description_en: 'Light or healthy dinner meal, available from 6:00 PM to 8:00 PM.',
                    image_path: 'images/dinner.svg',
                    start_time: '18:00',
                    end_time: '20:00',
                    is_active: true,
                    max_reservations: 100,
                    created_at: new Date().toISOString()
                },
                {
                    meal_type: 'suhour',
                    name_ar: 'سحور',
                    name_en: 'Suhour',
                    description_ar: 'وجبة سحور خفيفة وصحية، متاحة من الساعة 3:00 إلى 5:00 فجراً.',
                    description_en: 'Light and healthy suhour meal, available from 3:00 AM to 5:00 AM.',
                    image_path: 'images/suhour.svg',
                    start_time: '03:00',
                    end_time: '05:00',
                    is_active: true,
                    max_reservations: 100,
                    created_at: new Date().toISOString()
                }
            ];

            for (const meal of defaultMeals) {
                await this.createMeal(meal);
            }
        }

        // إدراج الإعدادات الافتراضية
        const defaultSettings = {
            'app_name_ar': 'القناة للسكر',
            'app_name_en': 'Canal Sugar',
            'default_language': 'ar',
            'max_daily_reservations': '3',
            'booking_advance_days': '7',
            'system_timezone': 'Asia/Riyadh'
        };

        for (const [key, value] of Object.entries(defaultSettings)) {
            const exists = await this.getSetting(key);
            if (!exists) {
                await this.setSetting(key, value);
            }
        }
    }

    // حفظ البيانات في localStorage
    saveToLocalStorage() {
        if (typeof this.db === 'object' && !this.db.transaction) {
            localStorage.setItem('canal_users', JSON.stringify(this.db.users));
            localStorage.setItem('canal_meals', JSON.stringify(this.db.meals));
            localStorage.setItem('canal_meal_options', JSON.stringify(this.db.meal_options));
            localStorage.setItem('canal_reservations', JSON.stringify(this.db.reservations));
            localStorage.setItem('canal_settings', JSON.stringify(this.db.system_settings));
            localStorage.setItem('canal_logs', JSON.stringify(this.db.activity_logs));
        }
    }

    // وظائف المستخدمين
    async createUser(userData) {
        userData.id = Date.now();
        userData.created_at = new Date().toISOString();
        userData.updated_at = new Date().toISOString();

        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                const request = store.add(userData);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            this.db.users.push(userData);
            this.saveToLocalStorage();
            return userData.id;
        }
    }

    async getUserByUsername(username) {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const index = store.index('username');
                const request = index.get(username);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            return this.db.users.find(user => user.username === username);
        }
    }

    async getUserById(id) {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['users'], 'readonly');
                const store = transaction.objectStore('users');
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            return this.db.users.find(user => user.id === id);
        }
    }

    // وظائف الوجبات
    async createMeal(mealData) {
        mealData.id = Date.now() + Math.random();
        mealData.created_at = new Date().toISOString();
        mealData.updated_at = new Date().toISOString();

        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['meals'], 'readwrite');
                const store = transaction.objectStore('meals');
                const request = store.add(mealData);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            this.db.meals.push(mealData);
            this.saveToLocalStorage();
            return mealData.id;
        }
    }

    async getMealsCount() {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['meals'], 'readonly');
                const store = transaction.objectStore('meals');
                const request = store.count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            return this.db.meals.length;
        }
    }

    async getAllMeals() {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['meals'], 'readonly');
                const store = transaction.objectStore('meals');
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            return [...this.db.meals];
        }
    }

    // وظائف الحجوزات
    async createReservation(reservationData) {
        reservationData.id = Date.now() + Math.random();
        reservationData.created_at = new Date().toISOString();
        reservationData.updated_at = new Date().toISOString();
        reservationData.status = reservationData.status || 'confirmed';

        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['reservations'], 'readwrite');
                const store = transaction.objectStore('reservations');
                const request = store.add(reservationData);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            this.db.reservations.push(reservationData);
            this.saveToLocalStorage();
            return reservationData.id;
        }
    }

    async getUserReservations(userId, date = null) {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['reservations'], 'readonly');
                const store = transaction.objectStore('reservations');
                const index = store.index('user_id');
                const request = index.getAll(userId);
                request.onsuccess = () => {
                    let results = request.result;
                    if (date) {
                        results = results.filter(r => r.reservation_date === date);
                    }
                    resolve(results);
                };
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            let reservations = this.db.reservations.filter(r => r.user_id === userId);
            if (date) {
                reservations = reservations.filter(r => r.reservation_date === date);
            }
            return reservations;
        }
    }

    // وظائف الإعدادات
    async setSetting(key, value) {
        const settingData = {
            setting_key: key,
            setting_value: value,
            updated_at: new Date().toISOString()
        };

        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['system_settings'], 'readwrite');
                const store = transaction.objectStore('system_settings');
                const request = store.put(settingData);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            this.db.system_settings[key] = value;
            this.saveToLocalStorage();
            return true;
        }
    }

    async getSetting(key) {
        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['system_settings'], 'readonly');
                const store = transaction.objectStore('system_settings');
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result?.setting_value);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            return this.db.system_settings[key];
        }
    }

    // تسجيل النشاطات
    async logActivity(userId, action, details = null) {
        const logData = {
            user_id: userId,
            action: action,
            details: details,
            ip_address: null, // يمكن إضافة IP لاحقاً
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
        };

        if (this.db.transaction) {
            // IndexedDB
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['activity_logs'], 'readwrite');
                const store = transaction.objectStore('activity_logs');
                logData.id = Date.now() + Math.random();
                const request = store.add(logData);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } else {
            // localStorage
            logData.id = Date.now() + Math.random();
            this.db.activity_logs.push(logData);
            this.saveToLocalStorage();
            return logData.id;
        }
    }
}

// إنشاء مثيل واحد من قاعدة البيانات
const canalDB = new CanalSugarDB();

// تصدير قاعدة البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CanalSugarDB, canalDB };
} else {
    window.canalDB = canalDB;
}
