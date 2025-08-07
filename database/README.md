# قاعدة بيانات نظام القناة للسكر
# Canal Sugar Database System

## 📋 نظرة عامة

نظام قاعدة بيانات متكامل لتطبيق حجز الوجبات في شركة القناة للسكر، يدعم:
- تخزين بيانات المستخدمين والوجبات والحجوزات
- نظام مصادقة وتسجيل دخول
- سجل النشاطات والإحصائيات
- تصدير واستيراد البيانات

## 🗄️ هيكل قاعدة البيانات

### الجداول الرئيسية:

#### 1. جدول المستخدمين (users)
```sql
- id: معرف فريد
- username: اسم المستخدم
- email: البريد الإلكتروني
- password_hash: كلمة المرور المشفرة
- full_name: الاسم الكامل
- employee_id: رقم الموظف
- department: القسم
- phone: رقم الهاتف
- is_admin: صلاحيات المشرف
- is_active: حالة النشاط
- created_at: تاريخ الإنشاء
- updated_at: تاريخ التحديث
```

#### 2. جدول الوجبات (meals)
```sql
- id: معرف فريد
- meal_type: نوع الوجبة (breakfast, lunch, dinner, suhour)
- name_ar: الاسم بالعربية
- name_en: الاسم بالإنجليزية
- description_ar: الوصف بالعربية
- description_en: الوصف بالإنجليزية
- image_path: مسار الصورة
- start_time: وقت البداية
- end_time: وقت النهاية
- is_active: حالة النشاط
- max_reservations: الحد الأقصى للحجوزات
- created_at: تاريخ الإنشاء
- updated_at: تاريخ التحديث
```

#### 3. جدول خيارات الوجبات (meal_options)
```sql
- id: معرف فريد
- meal_id: معرف الوجبة
- option_name_ar: اسم الخيار بالعربية
- option_name_en: اسم الخيار بالإنجليزية
- is_available: حالة التوفر
```

#### 4. جدول الحجوزات (reservations)
```sql
- id: معرف فريد
- user_id: معرف المستخدم
- meal_id: معرف الوجبة
- meal_option_id: معرف خيار الوجبة
- reservation_date: تاريخ الحجز
- reservation_time: وقت الحجز
- status: حالة الحجز (confirmed, cancelled, completed)
- notes: ملاحظات
- created_at: تاريخ الإنشاء
- updated_at: تاريخ التحديث
```

#### 5. جدول إعدادات النظام (system_settings)
```sql
- setting_key: مفتاح الإعداد
- setting_value: قيمة الإعداد
- description: وصف الإعداد
- updated_at: تاريخ التحديث
```

#### 6. جدول سجل النشاطات (activity_logs)
```sql
- id: معرف فريد
- user_id: معرف المستخدم
- action: نوع النشاط
- details: تفاصيل النشاط
- ip_address: عنوان IP
- user_agent: معلومات المتصفح
- created_at: تاريخ الإنشاء
```

## 🚀 كيفية الاستخدام

### 1. تهيئة قاعدة البيانات

```html
<!-- إضافة ملفات قاعدة البيانات -->
<script src="database/database.js"></script>
<script src="database/api.js"></script>

<script>
// تهيئة النظام
async function initApp() {
    const success = await canalAPI.init();
    if (success) {
        console.log('تم تهيئة قاعدة البيانات بنجاح');
    }
}

// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
</script>
```

### 2. تسجيل الدخول

```javascript
// تسجيل دخول مستخدم
async function login() {
    const result = await canalAPI.login('admin', 'canal2025');
    if (result.success) {
        console.log('تم تسجيل الدخول:', result.user);
    } else {
        console.error('خطأ:', result.error);
    }
}
```

### 3. حجز وجبة

```javascript
// حجز وجبة
async function bookMeal() {
    const result = await canalAPI.bookMeal(1, null, '2025-01-15');
    if (result.success) {
        console.log('تم الحجز بنجاح:', result.reservation_id);
    } else {
        console.error('خطأ في الحجز:', result.error);
    }
}
```

### 4. الحصول على الوجبات

```javascript
// الحصول على جميع الوجبات المتاحة
async function getMeals() {
    const result = await canalAPI.getAvailableMeals();
    if (result.success) {
        console.log('الوجبات المتاحة:', result.meals);
    }
}
```

### 5. عمليات المشرف

```javascript
// الحصول على الإحصائيات (للمشرف فقط)
async function getStats() {
    const result = await canalAPI.getStatistics();
    if (result.success) {
        console.log('الإحصائيات:', result.statistics);
    }
}

// تصدير البيانات
async function exportData() {
    const result = await canalAPI.exportData('json');
    if (result.success) {
        // تحميل الملف
        const blob = new Blob([JSON.stringify(result.data, null, 2)], 
                             { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        a.click();
    }
}
```

## 🔧 التكامل مع التطبيق الحالي

### تحديث ملف index.html

```html
<!-- إضافة قبل إغلاق </head> -->
<script src="database/database.js"></script>
<script src="database/api.js"></script>
```

### تحديث وظائف JavaScript

```javascript
// استبدال دالة تسجيل الدخول الحالية
async function handleMainLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('main-username').value;
    const password = document.getElementById('main-password').value;
    
    const result = await canalAPI.login(username, password);
    
    if (result.success) {
        isLoggedIn = true;
        currentUser = result.user.username;
        
        alert(`مرحباً ${result.user.full_name}! تم تسجيل الدخول بنجاح`);
        updateUIAfterLogin(result.user.full_name);
        showSection('home-section');
    } else {
        alert(result.error);
    }
}

// استبدال دالة الحجز الحالية
async function handleReservation() {
    if (!canalAPI.isLoggedIn()) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }
    
    const selectedMealType = mealType.value;
    const selectedOption = document.querySelector('.option-btn.selected');
    
    // الحصول على معرف الوجبة من قاعدة البيانات
    const mealsResult = await canalAPI.getAvailableMeals();
    const meal = mealsResult.meals.find(m => m.meal_type === selectedMealType);
    
    if (!meal) {
        alert('الوجبة غير متاحة');
        return;
    }
    
    const result = await canalAPI.bookMeal(meal.id);
    
    if (result.success) {
        alert('تم حجز الوجبة بنجاح!');
    } else {
        alert(result.error);
    }
}
```

## 📊 مميزات قاعدة البيانات

### ✅ المميزات المتاحة:
- **تخزين محلي**: IndexedDB + localStorage كبديل
- **نظام مصادقة**: تسجيل دخول وخروج آمن
- **إدارة الوجبات**: إنشاء وتحديث وحذف الوجبات
- **نظام الحجوزات**: حجز وإلغاء الوجبات
- **سجل النشاطات**: تتبع جميع العمليات
- **تصدير/استيراد**: نسخ احتياطية للبيانات
- **صلاحيات المشرف**: تحكم كامل في النظام

### 🔄 التطوير المستقبلي:
- **قاعدة بيانات سحابية**: Supabase أو Firebase
- **تشفير كلمات المرور**: bcrypt أو مشابه
- **API خادم**: Node.js + Express
- **مصادقة متقدمة**: JWT tokens
- **إشعارات**: تنبيهات الوجبات
- **تقارير متقدمة**: إحصائيات مفصلة

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

1. **قاعدة البيانات لا تعمل**:
   ```javascript
   // التحقق من التهيئة
   console.log('DB initialized:', canalAPI.isInitialized);
   ```

2. **فقدان البيانات**:
   ```javascript
   // التحقق من localStorage
   console.log('Users:', localStorage.getItem('canal_users'));
   ```

3. **مشاكل الصلاحيات**:
   ```javascript
   // التحقق من المستخدم الحالي
   console.log('Current user:', canalAPI.getCurrentUser());
   ```

## 📞 الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- تحقق من console.log للأخطاء
- راجع ملف schema.sql للهيكل
- اختبر API باستخدام المتصفح

---

**ملاحظة**: هذا النظام مصمم للاستخدام المحلي. للإنتاج، يُنصح باستخدام قاعدة بيانات خادم حقيقية.
