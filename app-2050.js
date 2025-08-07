// 🚀 تطبيق القناة للسكر 2050 - JavaScript محسن
console.log('🚀 تحميل تطبيق القناة للسكر 2050...');

// 🎯 إدارة حالة التطبيق
class AppState {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.currentLanguage = 'ar';
    this.currentSection = 'login-section';
    this.isAdminLoggedIn = false;
    this.testMode = false;
    this.testTime = null;
    this.timerInterval = null;
    this.disabledMeals = new Set();
    this.currentActiveMeal = null;
  }

  // تحديث حالة تسجيل الدخول
  setLoginState(isLoggedIn, user = null) {
    this.isLoggedIn = isLoggedIn;
    this.currentUser = user;
    console.log('🔐 تحديث حالة تسجيل الدخول:', { isLoggedIn, user });
  }

  // تحديث القسم الحالي
  setCurrentSection(sectionId) {
    this.currentSection = sectionId;
    console.log('📄 تحديث القسم الحالي:', sectionId);
  }

  // تحديث اللغة
  setLanguage(lang) {
    this.currentLanguage = lang;
    console.log('🌐 تحديث اللغة:', lang);
  }
}

// 🌟 إنشاء مثيل حالة التطبيق
const appState = new AppState();

// 🎨 إدارة الواجهة
class UIManager {
  constructor() {
    this.animations = new Map();
  }

  // إظهار قسم مع تأثيرات
  showSection(sectionId) {
    console.log('🎭 إظهار القسم:', sectionId);

    // التحقق من تسجيل الدخول
    if (!appState.isLoggedIn && sectionId !== 'login-section') {
      this.showNotification('يرجى تسجيل الدخول أولاً', 'warning');
      return;
    }

    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
      section.classList.add('hidden');
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
    });

    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      
      // تأثير الظهور
      setTimeout(() => {
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
        targetSection.style.transition = 'all 0.3s ease-out';
      }, 50);

      appState.setCurrentSection(sectionId);

      // تحميل البيانات حسب القسم
      this.loadSectionData(sectionId);
    } else {
      console.error('❌ القسم غير موجود:', sectionId);
    }
  }

  // تحميل بيانات القسم
  loadSectionData(sectionId) {
    switch (sectionId) {
      case 'meal-section':
        setTimeout(() => mealManager.initializeMealsSection(), 100);
        break;
      case 'reservations-section':
        setTimeout(() => reservationManager.loadUserReservations(), 100);
        break;
      case 'profile-section':
        setTimeout(() => profileManager.loadProfile(), 100);
        break;
      case 'admin-section':
        setTimeout(() => adminManager.initializeAdmin(), 100);
        break;
    }
  }

  // إظهار إشعار
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // تنسيق الإشعار
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '10000',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      border: 'var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-md)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-glass)',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '400px'
    });

    document.body.appendChild(notification);

    // تأثير الظهور
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // إزالة تلقائية
    if (duration > 0) {
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  }

  // أيقونات الإشعارات
  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  // تحديث واجهة المستخدم بعد تسجيل الدخول المحسن
  updateUIAfterLogin(userData) {
    const userNameDisplay = document.getElementById('user-name-display');
    const welcomeMessage = document.getElementById('welcome-message');

    // إذا كانت البيانات نص بسيط (للتوافق مع النسخة القديمة)
    if (typeof userData === 'string') {
      if (userNameDisplay) {
        userNameDisplay.textContent = userData;
      }
      if (welcomeMessage) {
        welcomeMessage.textContent = `مرحباً بك، ${userData}`;
      }
      this.showNotification(`مرحباً بك، ${userData}! 🎉`, 'success');
      return;
    }

    // البيانات المحسنة
    const displayName = userData.employeeName || userData.username;
    const employeeId = userData.employeeId;
    const department = userData.department;

    if (userNameDisplay) {
      userNameDisplay.innerHTML = `
        <div class="user-info">
          <div class="user-name">${displayName}</div>
          <div class="user-details">
            <span class="employee-id">🆔 ${employeeId}</span>
            <span class="department">🏢 ${department}</span>
          </div>
        </div>
      `;
    }

    if (welcomeMessage) {
      welcomeMessage.innerHTML = `
        <span>مرحباً بك، </span>
        <strong>${displayName}</strong>
        <br>
        <small style="color: var(--text-secondary);">
          ${employeeId} - ${department}
        </small>
      `;
    }

    // إضافة تأثيرات ترحيبية محسنة
    this.showNotification(`مرحباً بك، ${displayName}! 🎉\n🆔 ${employeeId} - 🏢 ${department}`, 'success', 4000);
  }

  // تحديث النصوص حسب اللغة
  updateTexts() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = translations[appState.currentLanguage]?.[key];
      if (translation) {
        element.textContent = translation;
      }
    });

    // تحديث placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      const translation = translations[appState.currentLanguage]?.[key];
      if (translation) {
        element.placeholder = translation;
      }
    });
  }
}

// 🌐 إدارة اللغات
class LanguageManager {
  switchLanguage(lang) {
    console.log('🌐 تغيير اللغة إلى:', lang);
    
    appState.setLanguage(lang);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      }
    });

    // تحديث النصوص
    uiManager.updateTexts();

    // حفظ اللغة
    localStorage.setItem('selectedLanguage', lang);

    // إشعار
    const message = lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English';
    uiManager.showNotification(message, 'success');
  }

  loadSavedLanguage() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'ar';
    this.switchLanguage(savedLang);
  }
}

// 🔐 إدارة المصادقة
class AuthManager {
  constructor() {
    this.ADMIN_CREDENTIALS = {
      username: 'admin',
      password: 'canal2025'
    };
  }

  // تسجيل الدخول الرئيسي المحسن
  async handleMainLogin(event) {
    event.preventDefault();

    const username = document.getElementById('main-username')?.value;
    const password = document.getElementById('main-password')?.value;
    const employeeName = document.getElementById('employee-name')?.value;
    const employeeId = document.getElementById('employee-id')?.value;
    const rememberMe = document.getElementById('remember-me')?.checked;

    // التحقق من البيانات المطلوبة
    if (!username || !password || !employeeName || !employeeId) {
      uiManager.showNotification('يرجى إدخال جميع البيانات المطلوبة', 'warning');
      return;
    }

    // التحقق من صحة رقم الموظف
    if (!/^[A-Z0-9]+$/i.test(employeeId)) {
      uiManager.showNotification('رقم الموظف يجب أن يحتوي على أحرف وأرقام فقط', 'warning');
      return;
    }

    try {
      // إظهار تحميل
      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>⏳</span><span>جاري تسجيل الدخول...</span>';
      submitBtn.disabled = true;

      // محاكاة تسجيل الدخول مع البيانات الجديدة
      await new Promise(resolve => setTimeout(resolve, 1000));

      // بيانات المستخدم المحسنة
      const userData = {
        username: username,
        employeeName: employeeName,
        employeeId: employeeId,
        loginTime: new Date().toISOString(),
        department: this.getDepartmentByEmployeeId(employeeId)
      };

      // حفظ البيانات إذا تم اختيار الحفظ التلقائي
      if (rememberMe) {
        this.saveUserData(userData);
        uiManager.showNotification('تم حفظ البيانات تلقائياً ✅', 'success', 2000);
      }

      // تسجيل الدخول
      appState.setLoginState(true, userData);
      uiManager.updateUIAfterLogin(userData);
      uiManager.showSection('home-section');

      // إعادة تعيين الزر
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      uiManager.showNotification('حدث خطأ في تسجيل الدخول', 'error');

      // إعادة تعيين الزر في حالة الخطأ
      const submitBtn = event.target.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<span>🚀</span><span>دخول</span>';
      submitBtn.disabled = false;
    }
  }

  // تحديد القسم بناءً على رقم الموظف
  getDepartmentByEmployeeId(employeeId) {
    const departmentMap = {
      'ADMIN': 'الإدارة',
      'HR': 'الموارد البشرية',
      'IT': 'تقنية المعلومات',
      'FIN': 'المالية',
      'OPS': 'العمليات',
      'QC': 'مراقبة الجودة',
      'PROD': 'الإنتاج',
      'MAINT': 'الصيانة'
    };

    const prefix = employeeId.substring(0, 2).toUpperCase();
    return departmentMap[prefix] || 'عام';
  }

  // حفظ بيانات المستخدم محلياً
  saveUserData(userData) {
    try {
      const dataToSave = {
        username: userData.username,
        employeeName: userData.employeeName,
        employeeId: userData.employeeId,
        department: userData.department,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem('canalSugar_savedUserData', JSON.stringify(dataToSave));
      console.log('✅ تم حفظ بيانات المستخدم محلياً');

    } catch (error) {
      console.error('❌ خطأ في حفظ البيانات:', error);
    }
  }

  // تحميل البيانات المحفوظة
  loadSavedUserData() {
    try {
      const savedData = localStorage.getItem('canalSugar_savedUserData');
      if (savedData) {
        const userData = JSON.parse(savedData);

        // ملء الحقول
        const usernameField = document.getElementById('main-username');
        const employeeNameField = document.getElementById('employee-name');
        const employeeIdField = document.getElementById('employee-id');
        const rememberCheckbox = document.getElementById('remember-me');

        if (usernameField) usernameField.value = userData.username || '';
        if (employeeNameField) employeeNameField.value = userData.employeeName || '';
        if (employeeIdField) employeeIdField.value = userData.employeeId || '';
        if (rememberCheckbox) rememberCheckbox.checked = true;

        console.log('✅ تم تحميل البيانات المحفوظة');
        uiManager.showNotification('تم تحميل البيانات المحفوظة 📋', 'info', 2000);
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات المحفوظة:', error);
    }
  }

  // مسح البيانات المحفوظة
  clearSavedData() {
    if (confirm('هل أنت متأكد من مسح جميع البيانات المحفوظة؟')) {
      try {
        localStorage.removeItem('canalSugar_savedUserData');

        // مسح الحقول
        document.getElementById('main-username').value = '';
        document.getElementById('employee-name').value = '';
        document.getElementById('employee-id').value = '';
        document.getElementById('remember-me').checked = false;

        uiManager.showNotification('تم مسح البيانات المحفوظة 🗑️', 'success');
        console.log('✅ تم مسح البيانات المحفوظة');

      } catch (error) {
        console.error('❌ خطأ في مسح البيانات:', error);
        uiManager.showNotification('حدث خطأ في مسح البيانات', 'error');
      }
    }
  }

  // تسجيل الخروج
  async logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      try {
        await canalAPI.logout();
        appState.setLoginState(false, null);
        
        // مسح النماذج
        document.getElementById('main-login-form')?.reset();
        
        // العودة لصفحة تسجيل الدخول
        uiManager.showSection('login-section');
        uiManager.showNotification('تم تسجيل الخروج بنجاح', 'success');
        
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        uiManager.showNotification('حدث خطأ في تسجيل الخروج', 'error');
      }
    }
  }

  // إنشاء حساب المشرف السريع المحسن
  async createAdminQuick() {
    try {
      uiManager.showNotification('جاري إنشاء حساب المشرف...', 'info');

      // ملء بيانات تسجيل الدخول المحسنة
      document.getElementById('main-username').value = 'admin';
      document.getElementById('main-password').value = 'canal2025';
      document.getElementById('employee-name').value = 'مدير النظام';
      document.getElementById('employee-id').value = 'ADMIN001';
      document.getElementById('remember-me').checked = true;

      uiManager.showNotification('تم ملء بيانات المشرف! ✅\nيمكنك الآن الضغط على دخول', 'success', 3000);

      // تأثير بصري للحقول المملوءة
      const fields = ['main-username', 'main-password', 'employee-name', 'employee-id'];
      fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.style.borderColor = 'var(--neon-green)';
          field.style.boxShadow = '0 0 10px rgba(104, 211, 145, 0.3)';

          setTimeout(() => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, 2000);
        }
      });

    } catch (error) {
      console.error('خطأ في إنشاء حساب المشرف:', error);
      uiManager.showNotification('حدث خطأ في إنشاء حساب المشرف', 'error');
    }
  }

  // تسجيل دخول المشرف
  handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username')?.value;
    const password = document.getElementById('admin-password')?.value;

    if (username === this.ADMIN_CREDENTIALS.username && password === this.ADMIN_CREDENTIALS.password) {
      appState.isAdminLoggedIn = true;
      document.getElementById('admin-login-container')?.classList.add('hidden');
      document.getElementById('admin-dashboard')?.classList.remove('hidden');
      
      uiManager.showNotification('مرحباً بك في لوحة تحكم المشرف! 🔧', 'success');
      adminManager.updateAdminUI();
    } else {
      uiManager.showNotification('اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
    }
  }

  // تسجيل خروج المشرف
  logoutAdmin() {
    appState.isAdminLoggedIn = false;
    document.getElementById('admin-login-container')?.classList.remove('hidden');
    document.getElementById('admin-dashboard')?.classList.add('hidden');
    uiManager.showNotification('تم تسجيل خروج المشرف', 'info');
  }
}

// 🍽️ إدارة الوجبات
class MealManager {
  constructor() {
    this.meals = {
      suhour: {
        name: { ar: 'سحور', en: 'Suhour' },
        desc: {
          ar: 'وجبة سحور مغذية ومتوازنة تحضرك ليوم طويل من العمل. تشمل التمر والحليب والخبز الطازج مع الجبن والعسل الطبيعي.',
          en: 'Nutritious and balanced suhour meal to prepare you for a long day of work. Includes dates, milk, fresh bread with cheese and natural honey.'
        },
        detailedDesc: {
          ar: 'وجبة السحور في القناة للسكر مصممة خصيصاً لتوفير الطاقة المستدامة طوال اليوم. تحتوي على:\n• تمر طازج من أجود الأنواع\n• حليب طبيعي غني بالكالسيوم\n• خبز طازج مخبوز يومياً\n• جبن أبيض طبيعي\n• عسل نحل طبيعي\n• فواكه موسمية طازجة',
          en: 'Suhour meal at Canal Sugar is specially designed to provide sustainable energy throughout the day.'
        },
        img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
        startTime: '03:00',
        endTime: '05:00',
        options: { ar: ['خفيف', 'مغذي', 'صحي'], en: ['Light', 'Nutritious', 'Healthy'] },
        calories: '350-450 سعرة حرارية',
        ingredients: { ar: ['تمر', 'حليب', 'خبز', 'جبن', 'عسل', 'فواكه'], en: ['Dates', 'Milk', 'Bread', 'Cheese', 'Honey', 'Fruits'] }
      },
      breakfast: {
        name: { ar: 'فطور صباحي', en: 'Breakfast' },
        desc: {
          ar: 'فطور شهي ومتكامل يبدأ يومك بطاقة وحيوية. يشمل البيض الطازج والخضار والخبز المحمص مع المربى والزبدة.',
          en: 'Delicious and complete breakfast that starts your day with energy and vitality. Includes fresh eggs, vegetables, toasted bread with jam and butter.'
        },
        detailedDesc: {
          ar: 'فطور صباحي متكامل يوفر جميع العناصر الغذائية الأساسية:\n• بيض طازج مسلوق أو مقلي\n• خضار طازجة (طماطم، خيار، خس)\n• خبز محمص طازج\n• مربى طبيعية متنوعة\n• زبدة طبيعية\n• عصير طازج أو شاي/قهوة\n• جبن أبيض وحلاوة طحينية',
          en: 'Complete morning breakfast providing all essential nutrients.'
        },
        img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
        startTime: '06:00',
        endTime: '09:00',
        options: { ar: ['كلاسيكي', 'صحي', 'سريع'], en: ['Classic', 'Healthy', 'Quick'] },
        calories: '450-600 سعرة حرارية',
        ingredients: { ar: ['بيض', 'خضار', 'خبز', 'مربى', 'زبدة', 'عصير'], en: ['Eggs', 'Vegetables', 'Bread', 'Jam', 'Butter', 'Juice'] }
      },
      lunch: {
        name: { ar: 'غداء', en: 'Lunch' },
        desc: {
          ar: 'وجبة غداء رئيسية متكاملة تشمل الأرز الأبيض واللحم أو الدجاج مع الخضار المطبوخة والسلطة الطازجة.',
          en: 'Complete main lunch meal including white rice, meat or chicken with cooked vegetables and fresh salad.'
        },
        detailedDesc: {
          ar: 'وجبة غداء رئيسية مطبوخة بعناية فائقة:\n• أرز أبيض مفلفل طازج\n• لحم أو دجاج مشوي أو مطبوخ\n• خضار مطبوخة متنوعة\n• سلطة خضار طازجة\n• شوربة يومية\n• خبز عربي طازج\n• مشروب بارد أو ساخن\n• حلوى شرقية',
          en: 'Main lunch meal cooked with exceptional care.'
        },
        img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        startTime: '12:00',
        endTime: '13:00',
        options: { ar: ['لحم', 'دجاج', 'سمك', 'نباتي'], en: ['Meat', 'Chicken', 'Fish', 'Vegetarian'] },
        calories: '600-800 سعرة حرارية',
        ingredients: { ar: ['أرز', 'لحم/دجاج', 'خضار', 'سلطة', 'شوربة', 'خبز'], en: ['Rice', 'Meat/Chicken', 'Vegetables', 'Salad', 'Soup', 'Bread'] }
      },
      dinner: {
        name: { ar: 'عشاء', en: 'Dinner' },
        desc: {
          ar: 'عشاء خفيف ومغذي يساعد على الهضم الجيد. يشمل الشوربة الدافئة والسندويشات الصحية مع السلطة.',
          en: 'Light and nutritious dinner that aids good digestion. Includes warm soup and healthy sandwiches with salad.'
        },
        detailedDesc: {
          ar: 'عشاء مثالي لنهاية يوم عمل مثمر:\n• شوربة خضار دافئة\n• سندويشات متنوعة (جبن، تونة، مرتديلا)\n• سلطة خضراء طازجة\n• فواكه موسمية\n• مشروب ساخن (شاي، قهوة)\n• معجنات خفيفة\n• زبادي طبيعي',
          en: 'Perfect dinner for the end of a productive work day.'
        },
        img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
        startTime: '18:00',
        endTime: '20:00',
        options: { ar: ['خفيف', 'مشبع', 'صحي'], en: ['Light', 'Filling', 'Healthy'] },
        calories: '400-550 سعرة حرارية',
        ingredients: { ar: ['شوربة', 'سندويشات', 'سلطة', 'فواكه', 'مشروب ساخن'], en: ['Soup', 'Sandwiches', 'Salad', 'Fruits', 'Hot Drink'] }
      }
    };
  }

  // تهيئة صفحة الوجبات المحسنة
  initializeMealsSection() {
    console.log('🍽️ تهيئة صفحة الوجبات...');

    try {
      const mealTypeSelect = document.getElementById('meal-type');
      if (!mealTypeSelect) {
        console.error('❌ عنصر اختيار نوع الوجبة غير موجود');
        return;
      }

      // بدء نظام التوقيت الحقيقي
      timerManager.startRealTimeSystem();

      // إضافة مستمع لتغيير نوع الوجبة
      mealTypeSelect.onchange = () => {
        this.updateMealDetails(mealTypeSelect.value);
      };

      console.log('✅ تم تهيئة صفحة الوجبات مع النظام الحقيقي');
      uiManager.showNotification('تم تفعيل نظام التوقيت الحقيقي ⏰', 'success', 2000);

    } catch (error) {
      console.error('❌ خطأ في تهيئة صفحة الوجبات:', error);
    }
  }

  // تحديث تفاصيل الوجبة
  updateMealDetails(selected) {
    console.log('🔄 تحديث تفاصيل الوجبة:', selected);
    
    const elements = {
      mealName: document.getElementById('meal-name'),
      mealDesc: document.getElementById('meal-desc'),
      mealImg: document.getElementById('meal-img'),
      mealOptions: document.getElementById('meal-options'),
      mealTimeRange: document.getElementById('meal-time-range')
    };

    // التحقق من وجود العناصر
    const missingElements = Object.entries(elements)
      .filter(([key, element]) => !element)
      .map(([key]) => key);

    if (missingElements.length > 0) {
      console.error('❌ عناصر مفقودة:', missingElements);
      return;
    }

    const meal = this.meals[selected];
    if (!meal) {
      console.error('❌ الوجبة غير موجودة:', selected);
      return;
    }

    const lang = appState.currentLanguage;

    try {
      // تحديث النصوص
      elements.mealName.textContent = meal.name[lang];
      elements.mealDesc.textContent = meal.desc[lang];
      
      // تحديث الصورة
      elements.mealImg.src = meal.img;
      elements.mealImg.alt = meal.name[lang];
      
      // تحديث التوقيت
      if (elements.mealTimeRange) {
        elements.mealTimeRange.textContent = `${meal.startTime} - ${meal.endTime}`;
      }

      // تحديث الخيارات
      this.updateMealOptions(elements.mealOptions, meal.options[lang]);
      
      console.log('✅ تم تحديث تفاصيل الوجبة بنجاح');
      
    } catch (error) {
      console.error('❌ خطأ في تحديث تفاصيل الوجبة:', error);
    }
  }

  // تحديث خيارات الوجبة
  updateMealOptions(container, options) {
    container.innerHTML = '';
    
    if (options && Array.isArray(options)) {
      options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'option-btn';
        btn.onclick = () => {
          document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          console.log('✅ تم اختيار:', option);
        };
        container.appendChild(btn);
      });
    } else {
      // خيار افتراضي
      const defaultBtn = document.createElement('button');
      defaultBtn.textContent = appState.currentLanguage === 'ar' ? 'اختيار' : 'Choice';
      defaultBtn.className = 'option-btn selected';
      container.appendChild(defaultBtn);
    }
  }

  // تحديث حالة الوجبة
  updateMealStatus() {
    // سيتم تنفيذها لاحقاً
    console.log('🔄 تحديث حالة الوجبة...');
  }

  // حجز وجبة محسن مع التحقق من التوقيت
  async handleReservation() {
    if (!appState.isLoggedIn) {
      uiManager.showNotification('يجب تسجيل الدخول أولاً', 'warning');
      return;
    }

    // التحقق من توفر الوجبة حالياً
    if (!timerManager.currentMeal) {
      uiManager.showNotification('لا توجد وجبة متاحة حالياً ⏰', 'warning');
      return;
    }

    try {
      const mealTypeSelect = document.getElementById('meal-type');
      const selectedMealType = mealTypeSelect?.value;

      if (!selectedMealType) {
        uiManager.showNotification('يرجى اختيار نوع الوجبة', 'warning');
        return;
      }

      // التحقق من أن الوجبة المختارة هي المتاحة حالياً
      if (selectedMealType !== timerManager.currentMeal.id) {
        uiManager.showNotification(`الوجبة المتاحة حالياً هي: ${timerManager.currentMeal.name}`, 'warning');
        return;
      }

      // إظهار تحميل
      const reserveBtn = document.getElementById('reserve-btn');
      const originalHTML = reserveBtn.innerHTML;
      reserveBtn.innerHTML = '<span>⏳</span><span>جاري الحجز...</span>';
      reserveBtn.disabled = true;

      // محاكاة حجز الوجبة
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedOption = document.querySelector('.option-btn.selected');
      const mealName = timerManager.currentMeal.name;

      // بيانات الحجز
      const reservationData = {
        mealType: selectedMealType,
        mealName: mealName,
        option: selectedOption ? selectedOption.textContent : 'اختيار',
        reservationTime: new Date().toISOString(),
        employeeName: appState.currentUser?.employeeName || 'المستخدم',
        employeeId: appState.currentUser?.employeeId || 'غير محدد'
      };

      // حفظ الحجز محلياً
      this.saveReservation(reservationData);

      let message = '🎉 تم حجز الوجبة بنجاح!\n\n';
      message += `🍽️ الوجبة: ${mealName}\n`;
      message += `🎯 الخيار: ${reservationData.option}\n`;
      message += `👤 الموظف: ${reservationData.employeeName}\n`;
      message += `🆔 الرقم: ${reservationData.employeeId}\n`;
      message += `⏰ وقت الحجز: ${new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;

      uiManager.showNotification(message, 'success', 6000);

      // إعادة تعيين الزر
      reserveBtn.innerHTML = originalHTML;
      reserveBtn.disabled = false;

    } catch (error) {
      console.error('خطأ في حجز الوجبة:', error);
      uiManager.showNotification('حدث خطأ في حجز الوجبة', 'error');

      // إعادة تعيين الزر في حالة الخطأ
      const reserveBtn = document.getElementById('reserve-btn');
      reserveBtn.innerHTML = '<span>🎫</span><span>احجز الآن</span>';
      reserveBtn.disabled = false;
    }
  }

  // حفظ الحجز محلياً
  saveReservation(reservationData) {
    try {
      const existingReservations = JSON.parse(localStorage.getItem('canalSugar_reservations') || '[]');

      const newReservation = {
        id: Date.now(),
        ...reservationData,
        status: 'confirmed',
        date: new Date().toISOString().split('T')[0]
      };

      existingReservations.push(newReservation);
      localStorage.setItem('canalSugar_reservations', JSON.stringify(existingReservations));

      console.log('✅ تم حفظ الحجز محلياً:', newReservation);

    } catch (error) {
      console.error('❌ خطأ في حفظ الحجز:', error);
    }
  }
}

// إنشاء مثيلات المدراء
const uiManager = new UIManager();
const languageManager = new LanguageManager();
const authManager = new AuthManager();
const mealManager = new MealManager();

// 🚀 تهيئة التطبيق المحسنة
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 بدء تهيئة التطبيق...');

  try {
    // تهيئة قاعدة البيانات
    if (typeof canalAPI !== 'undefined') {
      const dbSuccess = await canalAPI.init();
      if (dbSuccess) {
        console.log('✅ تم تهيئة قاعدة البيانات');
      }
    }

    // تحميل اللغة المحفوظة
    languageManager.loadSavedLanguage();

    // إظهار صفحة تسجيل الدخول
    uiManager.showSection('login-section');

    // ربط الأحداث
    bindEvents();

    // تحميل البيانات المحفوظة بعد تأخير قصير
    setTimeout(() => {
      authManager.loadSavedUserData();
    }, 500);

    console.log('✅ تم تهيئة التطبيق بنجاح');

  } catch (error) {
    console.error('❌ خطأ في تهيئة التطبيق:', error);
  }
});

// 🔗 ربط الأحداث
function bindEvents() {
  // أزرار اللغة
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      languageManager.switchLanguage(lang);
    });
  });

  // نموذج تسجيل الدخول
  const loginForm = document.getElementById('main-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', authManager.handleMainLogin.bind(authManager));
  }

  // نموذج تسجيل دخول المشرف
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', authManager.handleAdminLogin.bind(authManager));
  }

  // زر الحجز
  const reserveBtn = document.getElementById('reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', mealManager.handleReservation.bind(mealManager));
  }

  console.log('🔗 تم ربط جميع الأحداث');
}

// 🌐 تصدير الدوال للاستخدام العام
window.showSection = uiManager.showSection.bind(uiManager);
window.switchLanguage = languageManager.switchLanguage.bind(languageManager);
window.logout = authManager.logout.bind(authManager);
window.createAdminQuick = authManager.createAdminQuick.bind(authManager);
window.handleReservation = mealManager.handleReservation.bind(mealManager);

// 📋 إدارة الحجوزات
class ReservationManager {
  async loadUserReservations() {
    console.log('📋 تحميل حجوزات المستخدم...');

    const reservationsList = document.getElementById('reservations-list');
    if (!reservationsList) return;

    if (!appState.isLoggedIn) {
      reservationsList.innerHTML = '<p class="no-reservations">يجب تسجيل الدخول لعرض الحجوزات</p>';
      return;
    }

    try {
      // محاكاة تحميل الحجوزات
      reservationsList.innerHTML = '<p class="no-reservations loading">جاري تحميل الحجوزات...</p>';

      await new Promise(resolve => setTimeout(resolve, 1000));

      // بيانات وهمية للحجوزات
      const mockReservations = [
        {
          id: 1,
          meal_type: 'lunch',
          meal_name: 'غداء',
          option: 'ساخن',
          date: '2025-01-15',
          time: '12:30',
          status: 'confirmed'
        },
        {
          id: 2,
          meal_type: 'dinner',
          meal_name: 'عشاء',
          option: 'صحي',
          date: '2025-01-14',
          time: '19:00',
          status: 'completed'
        }
      ];

      if (mockReservations.length === 0) {
        reservationsList.innerHTML = '<p class="no-reservations">لا توجد حجوزات حالياً</p>';
      } else {
        let html = '<div class="reservations-grid">';

        mockReservations.forEach(reservation => {
          html += `
            <div class="reservation-card">
              <div class="reservation-header">
                <h4>🍽️ ${reservation.meal_name}</h4>
                <span class="reservation-status status-${reservation.status}">
                  ${reservation.status === 'confirmed' ? 'مؤكد' :
                    reservation.status === 'completed' ? 'مكتمل' : 'ملغي'}
                </span>
              </div>
              <div class="reservation-details">
                <p><strong>📅 التاريخ:</strong> <span>${reservation.date}</span></p>
                <p><strong>⏰ الوقت:</strong> <span>${reservation.time}</span></p>
                <p><strong>🎯 الخيار:</strong> <span>${reservation.option}</span></p>
                <p><strong>🆔 رقم الحجز:</strong> <span>#${reservation.id}</span></p>
              </div>
              ${reservation.status === 'confirmed' ? `
                <div class="reservation-actions">
                  <button class="cancel-reservation-btn" onclick="cancelReservation(${reservation.id})">
                    <span>❌</span>
                    <span>إلغاء الحجز</span>
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        });

        html += '</div>';
        reservationsList.innerHTML = html;
      }

      uiManager.showNotification('تم تحميل الحجوزات بنجاح', 'success');

    } catch (error) {
      console.error('خطأ في تحميل الحجوزات:', error);
      reservationsList.innerHTML = '<p class="error-message">حدث خطأ في تحميل الحجوزات</p>';
      uiManager.showNotification('فشل في تحميل الحجوزات', 'error');
    }
  }

  async cancelReservation(reservationId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
      try {
        // محاكاة إلغاء الحجز
        await new Promise(resolve => setTimeout(resolve, 500));

        uiManager.showNotification('تم إلغاء الحجز بنجاح', 'success');
        this.loadUserReservations(); // إعادة تحميل القائمة

      } catch (error) {
        console.error('خطأ في إلغاء الحجز:', error);
        uiManager.showNotification('فشل في إلغاء الحجز', 'error');
      }
    }
  }
}

// 👤 إدارة الملف الشخصي
class ProfileManager {
  loadProfile() {
    console.log('👤 تحميل الملف الشخصي...');

    const profileInfo = document.querySelector('.profile-info');
    if (!profileInfo) return;

    if (!appState.isLoggedIn) {
      profileInfo.innerHTML = '<p>يجب تسجيل الدخول لعرض الملف الشخصي</p>';
      return;
    }

    // بيانات وهمية للمستخدم
    const userProfile = {
      name: appState.currentUser || 'المستخدم',
      email: 'user@canalsugar.com',
      department: 'تقنية المعلومات',
      employee_id: 'EMP001',
      phone: '0501234567',
      join_date: '2024-01-15'
    };

    profileInfo.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar">👤</div>
        <h3>${userProfile.name}</h3>
        <div class="profile-details">
          <p><strong>📧 البريد الإلكتروني:</strong> ${userProfile.email}</p>
          <p><strong>🏢 القسم:</strong> ${userProfile.department}</p>
          <p><strong>🆔 رقم الموظف:</strong> ${userProfile.employee_id}</p>
          <p><strong>📱 الهاتف:</strong> ${userProfile.phone}</p>
          <p><strong>📅 تاريخ الانضمام:</strong> ${userProfile.join_date}</p>
        </div>
        <div class="profile-actions">
          <button class="btn btn-primary" onclick="editProfile()">
            <span>✏️</span>
            <span>تعديل الملف الشخصي</span>
          </button>
        </div>
      </div>
    `;
  }
}

// 🔧 إدارة المشرف
class AdminManager {
  initializeAdmin() {
    console.log('🔧 تهيئة لوحة المشرف...');
    this.updateAdminUI();
  }

  updateAdminUI() {
    // تحديث واجهة المشرف
    console.log('🔧 تحديث واجهة المشرف...');
  }

  async exportData() {
    try {
      if (!appState.isAdminLoggedIn) {
        uiManager.showNotification('غير مصرح لك بهذه العملية', 'error');
        return;
      }

      uiManager.showNotification('جاري تحضير ملف Excel...', 'info');

      // بيانات المستخدمين
      const usersData = [
        ['رقم المستخدم', 'اسم المستخدم', 'الاسم الكامل', 'البريد الإلكتروني', 'القسم', 'رقم الموظف', 'الهاتف', 'تاريخ التسجيل'],
        ['1', 'admin', 'مدير النظام', 'admin@canalsugar.com', 'الإدارة', 'ADMIN001', '0501234567', '2024-01-01'],
        ['2', 'user1', 'محمد أحمد', 'user1@canalsugar.com', 'الموارد البشرية', 'EMP001', '0501234568', '2024-01-15'],
        ['3', 'user2', 'فاطمة علي', 'user2@canalsugar.com', 'المالية', 'EMP002', '0501234569', '2024-02-01']
      ];

      // بيانات الحجوزات
      const reservationsData = [
        ['رقم الحجز', 'اسم المستخدم', 'نوع الوجبة', 'الخيار', 'التاريخ', 'الوقت', 'الحالة'],
        ['1', 'admin', 'غداء', 'ساخن', '2025-01-15', '12:30', 'مؤكد'],
        ['2', 'user1', 'فطور', 'اختيار', '2025-01-15', '07:00', 'مؤكد'],
        ['3', 'user2', 'عشاء', 'صحي', '2025-01-14', '19:00', 'مكتمل'],
        ['4', 'admin', 'سحور', 'خفيف', '2025-01-14', '04:00', 'مكتمل']
      ];

      // بيانات الوجبات
      const mealsData = [
        ['نوع الوجبة', 'الاسم بالعربية', 'الاسم بالإنجليزية', 'وقت البداية', 'وقت النهاية', 'الحالة'],
        ['breakfast', 'فطور صباحي', 'Breakfast', '06:00', '09:00', 'نشط'],
        ['lunch', 'غداء', 'Lunch', '12:00', '13:00', 'نشط'],
        ['dinner', 'عشاء', 'Dinner', '18:00', '20:00', 'نشط'],
        ['suhour', 'سحور', 'Suhour', '03:00', '05:00', 'نشط']
      ];

      // إنشاء ملف Excel
      const workbook = this.createExcelWorkbook({
        'المستخدمون': usersData,
        'الحجوزات': reservationsData,
        'الوجبات': mealsData
      });

      // تحويل إلى blob وتحميل
      const excelBuffer = this.workbookToBuffer(workbook);
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `تقرير_القناة_للسكر_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      uiManager.showNotification('تم تصدير البيانات إلى Excel بنجاح! 📊', 'success');

    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      uiManager.showNotification('فشل في تصدير البيانات', 'error');
    }
  }

  // إنشاء ملف Excel
  createExcelWorkbook(sheets) {
    // إنشاء workbook بسيط باستخدام HTML table format
    let excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>`;

    Object.keys(sheets).forEach((sheetName, index) => {
      excelContent += `
              <x:ExcelWorksheet>
                <x:Name>${sheetName}</x:Name>
                <x:WorksheetSource HRef="sheet${index + 1}.htm"/>
              </x:ExcelWorksheet>`;
    });

    excelContent += `
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #4CAF50; color: white; font-weight: bold; }
          .header { background-color: #2196F3; color: white; font-size: 16px; padding: 10px; }
        </style>
      </head>
      <body>
        <div class="header">تقرير القناة للسكر - ${new Date().toLocaleDateString('ar-SA')}</div>`;

    Object.entries(sheets).forEach(([sheetName, data]) => {
      excelContent += `
        <h2>${sheetName}</h2>
        <table>`;

      data.forEach((row, rowIndex) => {
        excelContent += '<tr>';
        row.forEach(cell => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          excelContent += `<${tag}>${cell}</${tag}>`;
        });
        excelContent += '</tr>';
      });

      excelContent += '</table><br><br>';
    });

    excelContent += `
        <div style="margin-top: 20px; font-size: 12px; color: #666;">
          تم إنشاء هذا التقرير بواسطة نظام القناة للسكر المستقبلي<br>
          تاريخ الإنشاء: ${new Date().toLocaleString('ar-SA')}<br>
          إجمالي المستخدمين: ${sheets['المستخدمون'].length - 1}<br>
          إجمالي الحجوزات: ${sheets['الحجوزات'].length - 1}<br>
          إجمالي الوجبات: ${sheets['الوجبات'].length - 1}
        </div>
      </body>
      </html>`;

    return excelContent;
  }

  // تحويل المحتوى إلى buffer
  workbookToBuffer(content) {
    const encoder = new TextEncoder();
    return encoder.encode(content);
  }

  resetSystem() {
    if (confirm('هل أنت متأكد من إعادة تعيين النظام؟ سيتم حذف جميع البيانات!')) {
      if (confirm('تأكيد أخير: هذا الإجراء لا يمكن التراجع عنه!')) {
        // محاكاة إعادة تعيين النظام
        localStorage.clear();
        uiManager.showNotification('تم إعادة تعيين النظام بنجاح', 'success');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }
  }
}

// ⏰ إدارة المؤقت والوجبات الحقيقية
class TimerManager {
  constructor() {
    this.timerInterval = null;
    this.currentMeal = null;
    this.nextMeal = null;
  }

  // بدء نظام التوقيت الحقيقي
  startRealTimeSystem() {
    console.log('⏰ بدء نظام التوقيت الحقيقي...');

    // تحديث فوري
    this.updateCurrentMealStatus();

    // تحديث كل ثانية
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.updateCurrentMealStatus();
    }, 1000);
  }

  // تحديث حالة الوجبة الحالية
  updateCurrentMealStatus() {
    const now = new Date();
    const currentTime = this.formatTime(now);

    // تحديث الوقت الحالي
    const timeDisplay = document.getElementById('current-time-display');
    if (timeDisplay) {
      timeDisplay.textContent = currentTime;
    }

    // العثور على الوجبة الحالية والتالية
    const mealStatus = this.getCurrentAndNextMeal(now);
    this.currentMeal = mealStatus.current;
    this.nextMeal = mealStatus.next;

    // تحديث واجهة المستخدم
    this.updateMealStatusUI(mealStatus);
    this.updateTimerDisplay(mealStatus);
    this.updateMealSelector(mealStatus);
  }

  // الحصول على الوجبة الحالية والتالية
  getCurrentAndNextMeal(now) {
    const meals = [
      { id: 'suhour', name: 'سحور', start: '03:00', end: '05:00' },
      { id: 'breakfast', name: 'فطور صباحي', start: '06:00', end: '09:00' },
      { id: 'lunch', name: 'غداء', start: '12:00', end: '13:00' },
      { id: 'dinner', name: 'عشاء', start: '18:00', end: '20:00' }
    ];

    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    let currentMeal = null;
    let nextMeal = null;
    let timeToNext = null;
    let timeToEnd = null;

    // البحث عن الوجبة الحالية
    for (const meal of meals) {
      const startMinutes = this.timeToMinutes(meal.start);
      const endMinutes = this.timeToMinutes(meal.end);

      if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
        currentMeal = meal;
        timeToEnd = endMinutes - currentTimeMinutes;
        break;
      }
    }

    // البحث عن الوجبة التالية
    for (const meal of meals) {
      const startMinutes = this.timeToMinutes(meal.start);

      if (currentTimeMinutes < startMinutes) {
        nextMeal = meal;
        timeToNext = startMinutes - currentTimeMinutes;
        break;
      }
    }

    // إذا لم نجد وجبة تالية اليوم، فالوجبة التالية هي أول وجبة غداً
    if (!nextMeal) {
      nextMeal = meals[0]; // سحور
      timeToNext = (24 * 60) - currentTimeMinutes + this.timeToMinutes(nextMeal.start);
    }

    return {
      current: currentMeal,
      next: nextMeal,
      timeToNext: timeToNext,
      timeToEnd: timeToEnd,
      isAvailable: !!currentMeal
    };
  }

  // تحويل الوقت إلى دقائق
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // تنسيق الوقت
  formatTime(date) {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  // تحديث واجهة حالة الوجبة
  updateMealStatusUI(mealStatus) {
    const statusElement = document.getElementById('meal-status-text');
    const reserveBtn = document.getElementById('reserve-btn');

    if (!statusElement) return;

    if (mealStatus.isAvailable) {
      statusElement.textContent = `متاحة الآن: ${mealStatus.current.name}`;
      statusElement.className = 'meal-status status-available';

      if (reserveBtn) {
        reserveBtn.disabled = false;
        reserveBtn.innerHTML = '<span>🎫</span><span>احجز الآن</span>';
      }
    } else {
      statusElement.textContent = `غير متاحة - التالية: ${mealStatus.next.name}`;
      statusElement.className = 'meal-status status-unavailable';

      if (reserveBtn) {
        reserveBtn.disabled = true;
        reserveBtn.innerHTML = '<span>⏰</span><span>غير متاحة حالياً</span>';
      }
    }
  }

  // تحديث عرض المؤقت
  updateTimerDisplay(mealStatus) {
    const timerElement = document.getElementById('meal-timer');
    const timerTitle = document.getElementById('timer-title');

    if (!timerElement || !timerTitle) return;

    let timeToShow = null;
    let titleText = '';

    if (mealStatus.isAvailable) {
      // عرض الوقت المتبقي لانتهاء الوجبة الحالية
      timeToShow = mealStatus.timeToEnd;
      titleText = `الوقت المتبقي لانتهاء ${mealStatus.current.name}`;
      timerElement.style.display = 'block';
    } else {
      // عرض الوقت المتبقي للوجبة التالية
      timeToShow = mealStatus.timeToNext;
      titleText = `الوقت المتبقي لبداية ${mealStatus.next.name}`;
      timerElement.style.display = 'block';
    }

    timerTitle.textContent = titleText;

    if (timeToShow !== null) {
      const hours = Math.floor(timeToShow / 60);
      const minutes = timeToShow % 60;
      const seconds = 0; // نعرض الدقائق فقط للبساطة

      this.updateTimerNumbers(hours, minutes, seconds);
    }
  }

  // تحديث أرقام المؤقت
  updateTimerNumbers(hours, minutes, seconds) {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
  }

  // تحديث قائمة اختيار الوجبة
  updateMealSelector(mealStatus) {
    const mealSelect = document.getElementById('meal-type');
    if (!mealSelect) return;

    // تحديد الوجبة الحالية أو التالية في القائمة
    const targetMeal = mealStatus.current || mealStatus.next;
    if (targetMeal && mealSelect.value !== targetMeal.id) {
      mealSelect.value = targetMeal.id;

      // تحديث تفاصيل الوجبة
      if (typeof mealManager !== 'undefined') {
        mealManager.updateMealDetails(targetMeal.id);
      }
    }
  }

  // إيقاف النظام
  stopRealTimeSystem() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log('⏹️ تم إيقاف نظام التوقيت الحقيقي');
    }
  }

  // إعادة تشغيل النظام
  restartRealTimeSystem() {
    this.stopRealTimeSystem();
    this.startRealTimeSystem();
    uiManager.showNotification('تم إعادة تشغيل نظام التوقيت 🔄', 'success');
  }
}

// 🐛 أدوات التشخيص
class DiagnosticManager {
  debugMealsSection() {
    console.log('🐛 تشخيص صفحة الوجبات...');

    const report = {
      elements: {},
      data: {},
      status: {}
    };

    // فحص العناصر
    const elements = [
      'meal-name', 'meal-desc', 'meal-img', 'meal-options',
      'meal-time-range', 'meal-type', 'meal-timer', 'reserve-btn'
    ];

    elements.forEach(id => {
      const element = document.getElementById(id);
      report.elements[id] = {
        exists: !!element,
        visible: element ? !element.classList.contains('hidden') : false,
        content: element ? (element.textContent || element.value || element.src || 'empty') : null
      };
    });

    // فحص البيانات
    report.data = {
      mealsExists: !!mealManager.meals,
      mealsCount: mealManager.meals ? Object.keys(mealManager.meals).length : 0,
      currentLanguage: appState.currentLanguage,
      isLoggedIn: appState.isLoggedIn,
      currentUser: appState.currentUser
    };

    // فحص الحالة
    report.status = {
      currentSection: appState.currentSection,
      testMode: appState.testMode,
      timerRunning: !!timerManager.timerInterval
    };

    console.log('📊 تقرير التشخيص:', report);

    // عرض التقرير
    let message = '🐛 تقرير تشخيص صفحة الوجبات:\n\n';

    message += '📋 العناصر:\n';
    Object.entries(report.elements).forEach(([id, info]) => {
      const status = info.exists ? (info.visible ? '✅' : '⚠️') : '❌';
      message += `${status} ${id}: ${info.exists ? 'موجود' : 'مفقود'}\n`;
    });

    message += '\n📊 البيانات:\n';
    message += `الوجبات: ${report.data.mealsExists ? report.data.mealsCount + ' وجبة' : 'مفقودة'}\n`;
    message += `اللغة: ${report.data.currentLanguage}\n`;
    message += `تسجيل الدخول: ${report.data.isLoggedIn ? 'نعم' : 'لا'}\n`;

    message += '\n⚡ الحالة:\n';
    message += `القسم الحالي: ${report.status.currentSection}\n`;
    message += `وضع الاختبار: ${report.status.testMode ? 'مفعل' : 'معطل'}\n`;
    message += `المؤقت: ${report.status.timerRunning ? 'يعمل' : 'متوقف'}\n`;

    alert(message);

    return report;
  }

  forceRefreshMealsSection() {
    console.log('🔄 إجبار تحديث صفحة الوجبات...');

    // إعادة تعيين المحتوى
    const elements = ['meal-name', 'meal-desc', 'meal-options'];
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === 'DIV') {
          element.innerHTML = '<p>جاري التحميل...</p>';
        } else {
          element.textContent = 'جاري التحميل...';
        }
      }
    });

    // تأخير قصير ثم إعادة التهيئة
    setTimeout(() => {
      mealManager.initializeMealsSection();
      uiManager.showNotification('تم تحديث صفحة الوجبات', 'success');
    }, 500);
  }
}

// إنشاء مثيلات المدراء الإضافية
const reservationManager = new ReservationManager();
const profileManager = new ProfileManager();
const adminManager = new AdminManager();
const timerManager = new TimerManager();
const diagnosticManager = new DiagnosticManager();

// 🌐 تصدير الدوال الإضافية للاستخدام العام
window.loadUserReservations = reservationManager.loadUserReservations.bind(reservationManager);
window.cancelReservation = reservationManager.cancelReservation.bind(reservationManager);
window.editProfile = () => uiManager.showNotification('ميزة تعديل الملف الشخصي قيد التطوير', 'info');
window.exportData = adminManager.exportData.bind(adminManager);
window.resetSystem = adminManager.resetSystem.bind(adminManager);
window.logoutAdmin = authManager.logoutAdmin.bind(authManager);
// وظائف النظام الحقيقي
window.restartTimerSystem = timerManager.restartRealTimeSystem.bind(timerManager);
window.stopTimerSystem = timerManager.stopRealTimeSystem.bind(timerManager);
window.showForgotPassword = () => uiManager.showNotification('ميزة استرداد كلمة المرور قيد التطوير', 'info');
window.showRegisterForm = () => uiManager.showNotification('ميزة التسجيل قيد التطوير', 'info');
window.clearSavedData = authManager.clearSavedData.bind(authManager);

console.log('🎉 تم تحميل تطبيق القناة للسكر 2050 بنجاح!');
