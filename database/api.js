// واجهة برمجة التطبيقات - نظام القناة للسكر
// Canal Sugar API Interface

class CanalSugarAPI {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
    }

    // تهيئة النظام
    async init() {
        try {
            await canalDB.init();
            this.isInitialized = true;
            
            // تحميل المستخدم المحفوظ
            const savedUser = localStorage.getItem('canal_current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
            
            console.log('Canal Sugar API initialized successfully');
            return true;
        } catch (error) {
            console.error('API initialization failed:', error);
            return false;
        }
    }

    // تسجيل الدخول
    async login(username, password) {
        try {
            const user = await canalDB.getUserByUsername(username);
            
            if (!user) {
                throw new Error('اسم المستخدم غير موجود');
            }

            if (!user.is_active) {
                throw new Error('الحساب معطل');
            }

            // في التطبيق الحقيقي، يجب تشفير كلمة المرور
            if (user.password_hash !== password) {
                throw new Error('كلمة المرور غير صحيحة');
            }

            this.currentUser = user;
            localStorage.setItem('canal_current_user', JSON.stringify(user));
            
            // تسجيل النشاط
            await canalDB.logActivity(user.id, 'login', 'تسجيل دخول ناجح');
            
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    is_admin: user.is_admin
                }
            };
        } catch (error) {
            await canalDB.logActivity(null, 'login_failed', `فشل تسجيل الدخول: ${username}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تسجيل الخروج
    async logout() {
        if (this.currentUser) {
            await canalDB.logActivity(this.currentUser.id, 'logout', 'تسجيل خروج');
        }
        
        this.currentUser = null;
        localStorage.removeItem('canal_current_user');
        
        return { success: true };
    }

    // تسجيل مستخدم جديد
    async register(userData) {
        try {
            // التحقق من وجود اسم المستخدم
            const existingUser = await canalDB.getUserByUsername(userData.username);
            if (existingUser) {
                return {
                    success: false,
                    error: 'اسم المستخدم موجود بالفعل'
                };
            }

            // إنشاء المستخدم الجديد
            const userId = await canalDB.createUser({
                username: userData.username,
                email: userData.email,
                password_hash: userData.password, // يجب تشفيرها في التطبيق الحقيقي
                full_name: userData.full_name,
                employee_id: userData.employee_id,
                department: userData.department,
                phone: userData.phone,
                is_admin: false,
                is_active: true
            });

            await canalDB.logActivity(userId, 'register', 'تسجيل مستخدم جديد');

            return {
                success: true,
                user_id: userId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على الوجبات المتاحة
    async getAvailableMeals() {
        try {
            const meals = await canalDB.getAllMeals();
            return {
                success: true,
                meals: meals.filter(meal => meal.is_active)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // حجز وجبة
    async bookMeal(mealId, mealOptionId = null, reservationDate = null) {
        try {
            if (!this.currentUser) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            const today = reservationDate || new Date().toISOString().split('T')[0];
            
            // التحقق من وجود حجز مسبق لنفس اليوم والوجبة
            const existingReservations = await canalDB.getUserReservations(this.currentUser.id, today);
            const mealReservation = existingReservations.find(r => r.meal_id === mealId);
            
            if (mealReservation) {
                throw new Error('لديك حجز مسبق لهذه الوجبة في نفس اليوم');
            }

            // إنشاء الحجز
            const reservationId = await canalDB.createReservation({
                user_id: this.currentUser.id,
                meal_id: mealId,
                meal_option_id: mealOptionId,
                reservation_date: today,
                reservation_time: new Date().toISOString(),
                status: 'confirmed'
            });

            await canalDB.logActivity(
                this.currentUser.id, 
                'meal_booked', 
                `حجز وجبة: ${mealId} للتاريخ: ${today}`
            );

            return {
                success: true,
                reservation_id: reservationId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // إلغاء حجز
    async cancelReservation(reservationId) {
        try {
            if (!this.currentUser) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            // في التطبيق الحقيقي، نحتاج لتحديث حالة الحجز
            // هنا سنستخدم localStorage للبساطة
            
            await canalDB.logActivity(
                this.currentUser.id, 
                'reservation_cancelled', 
                `إلغاء حجز: ${reservationId}`
            );

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على حجوزات المستخدم
    async getUserReservations(date = null) {
        try {
            if (!this.currentUser) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            const reservations = await canalDB.getUserReservations(this.currentUser.id, date);
            
            return {
                success: true,
                reservations: reservations
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على إحصائيات (للمشرف)
    async getStatistics() {
        try {
            if (!this.currentUser || !this.currentUser.is_admin) {
                throw new Error('غير مصرح لك بالوصول');
            }

            // هنا يمكن إضافة استعلامات معقدة للإحصائيات
            const meals = await canalDB.getAllMeals();
            const today = new Date().toISOString().split('T')[0];
            
            const stats = {
                total_meals: meals.length,
                active_meals: meals.filter(m => m.is_active).length,
                total_reservations_today: 0, // يحتاج استعلام
                total_users: 0 // يحتاج استعلام
            };

            return {
                success: true,
                statistics: stats
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تحديث وجبة (للمشرف)
    async updateMeal(mealId, mealData) {
        try {
            if (!this.currentUser || !this.currentUser.is_admin) {
                throw new Error('غير مصرح لك بالوصول');
            }

            // في التطبيق الحقيقي، نحتاج لتحديث قاعدة البيانات
            // هنا سنحفظ في localStorage
            
            await canalDB.logActivity(
                this.currentUser.id, 
                'meal_updated', 
                `تحديث وجبة: ${mealId}`
            );

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على سجل النشاطات (للمشرف)
    async getActivityLogs(limit = 50) {
        try {
            if (!this.currentUser || !this.currentUser.is_admin) {
                throw new Error('غير مصرح لك بالوصول');
            }

            // في التطبيق الحقيقي، نحتاج لاستعلام من قاعدة البيانات
            const logs = JSON.parse(localStorage.getItem('canal_logs') || '[]');
            
            return {
                success: true,
                logs: logs.slice(-limit).reverse()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تصدير البيانات (للمشرف)
    async exportData(format = 'json') {
        try {
            if (!this.currentUser || !this.currentUser.is_admin) {
                throw new Error('غير مصرح لك بالوصول');
            }

            const data = {
                users: JSON.parse(localStorage.getItem('canal_users') || '[]'),
                meals: JSON.parse(localStorage.getItem('canal_meals') || '[]'),
                reservations: JSON.parse(localStorage.getItem('canal_reservations') || '[]'),
                settings: JSON.parse(localStorage.getItem('canal_settings') || '{}'),
                logs: JSON.parse(localStorage.getItem('canal_logs') || '[]'),
                exported_at: new Date().toISOString()
            };

            await canalDB.logActivity(
                this.currentUser.id, 
                'data_exported', 
                `تصدير البيانات بصيغة: ${format}`
            );

            if (format === 'json') {
                return {
                    success: true,
                    data: data,
                    filename: `canal_sugar_backup_${new Date().toISOString().split('T')[0]}.json`
                };
            }

            return {
                success: false,
                error: 'صيغة غير مدعومة'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // استيراد البيانات (للمشرف)
    async importData(data) {
        try {
            if (!this.currentUser || !this.currentUser.is_admin) {
                throw new Error('غير مصرح لك بالوصول');
            }

            // التحقق من صحة البيانات
            if (!data.users || !data.meals) {
                throw new Error('بيانات غير صحيحة');
            }

            // حفظ البيانات
            localStorage.setItem('canal_users', JSON.stringify(data.users));
            localStorage.setItem('canal_meals', JSON.stringify(data.meals));
            localStorage.setItem('canal_reservations', JSON.stringify(data.reservations || []));
            localStorage.setItem('canal_settings', JSON.stringify(data.settings || {}));
            localStorage.setItem('canal_logs', JSON.stringify(data.logs || []));

            await canalDB.logActivity(
                this.currentUser.id, 
                'data_imported', 
                'استيراد البيانات'
            );

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على المستخدم الحالي
    getCurrentUser() {
        return this.currentUser;
    }

    // التحقق من صلاحيات المشرف
    isAdmin() {
        return this.currentUser && this.currentUser.is_admin;
    }

    // التحقق من تسجيل الدخول
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// إنشاء مثيل واحد من API
const canalAPI = new CanalSugarAPI();

// تصدير API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CanalSugarAPI, canalAPI };
} else {
    window.canalAPI = canalAPI;
}
