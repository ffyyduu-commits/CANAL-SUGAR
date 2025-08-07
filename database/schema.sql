-- قاعدة بيانات نظام حجز الوجبات - القناة للسكر
-- Canal Sugar Meal Booking System Database Schema

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) UNIQUE,
    department VARCHAR(50),
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الوجبات
CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner, suhour
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    image_path VARCHAR(255),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_reservations INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول خيارات الوجبات
CREATE TABLE IF NOT EXISTS meal_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER NOT NULL,
    option_name_ar VARCHAR(50) NOT NULL,
    option_name_en VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);

-- جدول الحجوزات
CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    meal_option_id INTEGER,
    reservation_date DATE NOT NULL,
    reservation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_option_id) REFERENCES meal_options(id) ON DELETE SET NULL,
    UNIQUE(user_id, meal_id, reservation_date)
);

-- جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول سجل النشاطات
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- إدراج البيانات الأولية

-- إدراج المشرف الافتراضي
INSERT OR IGNORE INTO users (username, email, password_hash, full_name, is_admin) 
VALUES ('admin', 'admin@canalsugar.com', 'canal2025', 'مدير النظام', TRUE);

-- إدراج الوجبات الافتراضية
INSERT OR IGNORE INTO meals (meal_type, name_ar, name_en, description_ar, description_en, image_path, start_time, end_time) VALUES
('breakfast', 'فطور صباحي', 'Breakfast', 'وجبة صباحية غنية بالطاقة، متاحة من الساعة 6:00 إلى 9:00 صباحاً.', 'Energy-rich morning meal, available from 6:00 AM to 9:00 AM.', 'images/breakfast.svg', '06:00', '09:00'),
('lunch', 'غداء', 'Lunch', 'وجبة غداء ساخنة أو صحية أو بديلة، متاحة من الساعة 12:00 إلى 1:00 مساءً.', 'Hot, healthy, or alternative lunch meal, available from 12:00 PM to 1:00 PM.', 'images/lunch.svg', '12:00', '13:00'),
('dinner', 'عشاء', 'Dinner', 'وجبة عشاء خفيفة أو صحية، متاحة من الساعة 6:00 إلى 8:00 مساءً.', 'Light or healthy dinner meal, available from 6:00 PM to 8:00 PM.', 'images/dinner.svg', '18:00', '20:00'),
('suhour', 'سحور', 'Suhour', 'وجبة سحور خفيفة وصحية، متاحة من الساعة 3:00 إلى 5:00 فجراً.', 'Light and healthy suhour meal, available from 3:00 AM to 5:00 AM.', 'images/suhour.svg', '03:00', '05:00');

-- إدراج خيارات الوجبات
INSERT OR IGNORE INTO meal_options (meal_id, option_name_ar, option_name_en) VALUES
(1, 'اختيار', 'Choice'),
(2, 'ساخن', 'Hot'),
(2, 'بديل', 'Alternative'),
(2, 'صحي', 'Healthy'),
(3, 'خفيف', 'Light'),
(3, 'صحي', 'Healthy'),
(4, 'خفيف', 'Light'),
(4, 'صحي', 'Healthy');

-- إدراج إعدادات النظام الافتراضية
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
('app_name_ar', 'القناة للسكر', 'اسم التطبيق بالعربية'),
('app_name_en', 'Canal Sugar', 'اسم التطبيق بالإنجليزية'),
('default_language', 'ar', 'اللغة الافتراضية'),
('max_daily_reservations', '3', 'الحد الأقصى للحجوزات اليومية لكل مستخدم'),
('booking_advance_days', '7', 'عدد الأيام المسموح بالحجز المسبق'),
('system_timezone', 'Asia/Riyadh', 'المنطقة الزمنية للنظام');

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_date ON reservations(user_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_meal_date ON reservations(meal_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, created_at);
