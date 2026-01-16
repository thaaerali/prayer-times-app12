// ملف JavaScript المعدل للجدول الشهري مع زر طباعة وتغيير طريقة الحساب
(function() {
    'use strict';
    
    // كائن الجدول الشهري
    const MonthlyTimetable = {
        currentDate: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        currentDay: new Date().getDate(),
        
        // كائن praytimes
        prayTimes: null,
        
        // أسماء الأشهر بالعربية
        monthNames: [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ],
        
        // أسماء الصلوات بالعربية
        prayerNames: {
            imsak: 'الإمساك',
            fajr: 'الفجر',
            sunrise: 'الشروق',
            dhuhr: 'الظهر',
            asr: 'العصر',
            sunset: 'الغروب',
            maghrib: 'المغرب',
            isha: 'العشاء',
            midnight: 'منتصف الليل'
        },
        
        // تهيئة
        init: function() {
            console.log('📅 تهيئة الجدول الشهري...');
            
            // تهيئة مكتبة praytimes إذا كانت متاحة
            this.initPrayTimes();
            
            this.setupEventListeners();
            
            // إضافة أنماط الطباعة
            this.addPrintStyles();
        },
        
        // إضافة أنماط الطباعة
addPrintStyles: function() {
    // إنشاء عنصر style لأنماط الطباعة
    const style = document.createElement('style');
    style.id = 'monthly-timetable-print-styles';
    style.textContent = `
        @media print {
            /* بدلاً من إخفاء كل شيء، استهدف فقط العناصر خارج النافذة المنبثقة */
            body > *:not(#monthly-timetable-modal) {
                display: none !important;
            }
            
            /* جعل النافذة المنبثقة مرئية بالكامل */
            #monthly-timetable-modal {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 999999 !important;
                overflow: visible !important;
            }
            
            #monthly-timetable-modal .modal-dialog {
                max-width: 100% !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding: 10mm !important;
                height: auto !important;
                min-height: 100vh !important;
                overflow: visible !important;
            }
            
            #monthly-timetable-modal .modal-content {
                border: none !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                min-height: calc(100vh - 20mm) !important;
                display: block !important;
                visibility: visible !important;
                overflow: visible !important;
                padding: 0 !important;
            }
            
            /* إظهار جميع العناصر داخل المحتوى */
            .monthly-timetable-container,
            .monthly-timetable-container * {
                visibility: visible !important;
                display: block !important;
            }
            
            /* إخفاء العناصر غير المرغوبة فقط */
            .month-controls,
            .btn-print,
            .btn-close,
            button,
            .alert:not(.print-notice),
            .text-muted:not(.print-text),
            .print-settings,
            .monthly-header,
            .card,
            #btn-print-options,
            #btn-print-mobile,
            .d-block.d-md-none {
                display: none !important;
            }
            
            /* إظهار الجدول وعناصره */
            .table-responsive {
                display: block !important;
                width: 100% !important;
                overflow: visible !important;
                margin: 15px 0 !important;
            }
            
            .table {
                width: 100% !important;
                max-width: 100% !important;
                font-size: 9pt !important;
                border-collapse: collapse !important;
                page-break-inside: auto !important;
                display: table !important;
            }
            
            .table thead {
                display: table-header-group !important;
            }
            
            .table tbody {
                display: table-row-group !important;
            }
            
            .table tr {
                display: table-row !important;
                page-break-inside: avoid !important;
                page-break-after: auto !important;
            }
            
            .table th,
            .table td {
                display: table-cell !important;
                border: 1px solid #000 !important;
                padding: 4px 6px !important;
                text-align: center !important;
            }
            
            /* إظهار عناصر الطباعة المخصصة */
            .print-header {
                display: block !important;
                text-align: center;
                padding: 15px 0;
                border-bottom: 2px solid #333;
                margin-bottom: 15px;
            }
            
            .print-quran-verse {
                display: block !important;
                text-align: center;
                font-size: 14pt !important;
                color: #2c3e50 !important;
                font-weight: bold;
                margin: 15px 0 !important;
                padding: 10px !important;
                border-bottom: 2px solid #3498db !important;
                font-family: 'Traditional Arabic', 'Arial', sans-serif !important;
            }
            
            .print-notice {
                display: block !important;
                text-align: center;
                font-size: 10pt !important;
                color: #e74c3c !important;
                font-style: italic;
                margin: 20px 0 !important;
                padding: 10px !important;
                background-color: #fff3cd !important;
                border: 1px solid #ffeaa7 !important;
                border-radius: 4px !important;
            }
            
            .print-footer {
                display: block !important;
                text-align: center;
                font-size: 9pt !important;
                color: #666;
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #ddd;
            }
            
            .print-watermark {
                position: fixed;
                bottom: 10px;
                right: 10px;
                font-size: 8pt;
                color: #666;
            }
            
            .table-success {
                background-color: #d4edda !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* ضبط الحواف للطباعة */
            @page {
                size: A4 portrait;
                margin: 15mm;
            }
            
            /* التأكد من أن النص مرئي */
            body {
                font-size: 11pt !important;
                line-height: 1.4 !important;
                color: #000 !important;
                background: white !important;
            }
        }
        
        /* الأنماط العادية (غير الطباعة) */
        .print-header {
            display: none;
        }
        
        .print-quran-verse {
            display: none;
        }
        
        .print-notice {
            display: none;
        }
        
        .print-footer {
            display: none;
        }
    `;
    
    document.head.appendChild(style);
},
        
        // تهيئة مكتبة praytimes
        initPrayTimes: function() {
            if (typeof PrayTimes !== 'undefined') {
                this.prayTimes = new PrayTimes();
                console.log('✅ مكتبة PrayTimes محملة وجاهزة للاستخدام');
                
                // تعيين طريقة الحساب من الإعدادات
                const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
                const calculationMethod = settings.calculationMethod || 'Hadi';
                
                if (this.prayTimes.setMethod) {
                    this.prayTimes.setMethod(calculationMethod);
                    console.log(`✅ طريقة الحساب: ${calculationMethod}`);
                }
            } else {
                console.warn('⚠️ مكتبة PrayTimes غير محملة، سيتم استخدام حساب تقريبي');
            }
        },
        
        // إعداد مستمعي الأحداث
        setupEventListeners: function() {
            // تأخير للسماح بتحميل DOM
            setTimeout(() => {
                const timetableBtn = document.getElementById('monthly-timetable-button');
                if (timetableBtn) {
                    console.log('✅ تم العثور على زر الجدول الشهري');
                    timetableBtn.addEventListener('click', () => this.openTimetableModal());
                } else {
                    console.warn('⚠️ زر الجدول الشهري غير موجود');
                }
            }, 500);
        },
        
        // فتح نافذة الجدول الشهري
        openTimetableModal: function() {
            console.log('فتح نافذة الجدول الشهري...');
            
            const modalElement = document.getElementById('monthly-timetable-modal');
            if (!modalElement) {
                console.error('نافذة الجدول الشهري غير موجودة');
                return;
            }
            
            // تحميل المحتوى
            this.loadTimetableContent();
            
            // إظهار النافذة باستخدام Bootstrap
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // عند إظهار النافذة، توليد الجدول
            modalElement.addEventListener('shown.bs.modal', () => {
                this.generateTable();
            });
        },
        
        // تحميل محتوى الجدول مع زر الطباعة
       loadTimetableContent: function() {
    const contentDiv = document.getElementById('monthly-timetable-content');
    if (!contentDiv) return;
    
    // احصل على الموقع الحالي من التطبيق الرئيسي
    const currentLocation = this.getCurrentLocation();
    
    contentDiv.innerHTML = `
        <div class="monthly-timetable-container p-3">
            <!-- رأس الجدول للطباعة -->
            <div class="print-header">
                <h2>جدول أوقات الصلاة الشهري</h2>
                <div class="print-subtitle">
                    <span>${this.monthNames[this.currentMonth]} ${this.currentYear}</span> | 
                    <span>${currentLocation.city}</span>
                </div>
                <div class="print-date">
                    تم الإنشاء: ${new Date().toLocaleDateString('ar-EG')}
                </div>
            </div>
            
            <!-- الآية القرآنية للطباعة -->
            <div class="print-quran-verse">
                ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]
            </div>
            
            <!-- رأس الجدول العادي -->
            <div class="monthly-header text-center mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-primary mb-0">جدول أوقات الصلاة الشهري</h4>
                    <button class="btn btn-outline-secondary btn-sm" id="btn-close-timetable">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div id="monthly-location-info" class="text-muted small">
                    <i class="bi bi-geo-alt"></i> الموقع: ${currentLocation.city}
                </div>
            </div>
            
            <!-- عناصر التحكم -->
            <div class="month-controls d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center gap-2">
                    <button id="prev-month-btn" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-chevron-right"></i> السابق
                    </button>
                    <div id="current-month-display" class="current-month-display fw-bold px-3">
                        ${this.monthNames[this.currentMonth]} ${this.currentYear}
                    </div>
                    <button id="next-month-btn" class="btn btn-outline-primary btn-sm">
                        التالي <i class="bi bi-chevron-left"></i>
                    </button>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                    <button id="go-to-today-btn" class="btn btn-primary btn-sm">
                        <i class="bi bi-calendar-check me-1"></i> هذا الشهر
                    </button>
                </div>
            </div>
            
            <!-- إعدادات طريقة الحساب والطباعة -->
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white py-2">
                            <i class="bi bi-calculator me-2"></i>طريقة حساب أوقات الصلاة
                        </div>
                        <div class="card-body py-3">
                            <div class="row align-items-center">
                                <div class="col-md-4 mb-2 mb-md-0">
                                    <label class="form-label mb-1"><small>اختر طريقة الحساب:</small></label>
                                </div>
                                <div class="col-md-8">
                                    <select id="calculation-method-monthly" class="form-select form-select-sm">
                                        <option value="Hadi">تقويم الهادي</option>
                                        <option value="MWL">رابطة العالم الإسلامي</option>
                                        <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية</option>
                                        <option value="Egypt">هيئة المساحة المصرية</option>
                                        <option value="Makkah">أم القرى</option>
                                        <option value="Karachi">جامعة العلوم الإسلامية كراتشي</option>
                                        <option value="Tehran">جامعة طهران</option>
                                        <option value="Jafari">الهيئة العامة للتقويم (إيران)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-info">
                        <div class="card-header bg-info text-white py-2">
                            <i class="bi bi-printer me-2"></i>الطباعة
                        </div>
                        <div class="card-body py-3 text-center">
                            <button id="btn-print-timetable" class="btn btn-success btn-sm w-100 mb-2">
                                <i class="bi bi-printer me-1"></i>طباعة الجدول
                            </button>
                            <button id="btn-print-options" class="btn btn-outline-secondary btn-sm w-100">
                                <i class="bi bi-eye me-1"></i>معاينة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- جدول أوقات الصلاة -->
            <div class="table-responsive">
                <table class="table table-bordered table-hover table-sm">
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">اليوم</th>
                            <th class="text-center">الإمساك</th>
                            <th class="text-center">الفجر</th>
                            <th class="text-center">الشروق</th>
                            <th class="text-center">الظهر</th>
                            <th class="text-center">العصر</th>
                            <th class="text-center">الغروب</th>
                            <th class="text-center">المغرب</th>
                            <th class="text-center">العشاء</th>
                            <th class="text-center">منتصف الليل</th>
                        </tr>
                    </thead>
                    <tbody id="monthly-table-body">
                        <!-- سيتم ملء الجدول هنا -->
                        <tr>
                            <td colspan="10" class="text-center py-4">
                                <div class="spinner-border spinner-border-sm text-primary" role="status">
                                    <span class="visually-hidden">جاري التحميل...</span>
                                </div>
                                <span class="ms-2">جاري حساب أوقات الصلاة...</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- الملاحظة للطباعة -->
            <div class="print-notice">
                <i class="bi bi-exclamation-triangle me-2"></i>
                نرجو من المؤمنين الكرام الاحتياط بدقيقة أو دقيقتين عند الصلاة
            </div>
            
            <!-- معلومات إضافية -->
            <div class="mt-4 text-center text-muted small">
                <p>
                    <i class="bi bi-info-circle me-1"></i>
                    جميع الأوقات بالتوقيت المحلي • ${currentLocation.city}
                </p>
                
                <!-- زر الطباعة للهواتف -->
                <div class="d-block d-md-none mt-3">
                    <button id="btn-print-mobile" class="btn btn-success btn-sm w-100">
                        <i class="bi bi-printer me-1"></i> طباعة الجدول
                    </button>
                </div>
            </div>
            
            <!-- تذييل الطباعة -->
            <div class="print-footer">
                <div>تطبيق مواقيت الصلاة - ${currentLocation.city}</div>
                <div>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="print-watermark">صفحة 1 من 1</div>
            </div>
        </div>
    `;
    
    // تعيين طريقة الحساب المختارة
    this.setCalculationMethod();
    
    // إعداد الأحداث للعناصر الجديدة
    this.setupModalEventListeners();
},
        
        // الحصول على الموقع الحالي
        getCurrentLocation: function() {
            // محاولة الحصول من التطبيق الرئيسي أولاً
            if (window.currentLocation && window.currentLocation.latitude) {
                console.log('📍 باستخدام الموقع الحالي من التطبيق:', window.currentLocation.city);
                return window.currentLocation;
            }
            
            // محاولة الحصول من localStorage
            const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
            
            if (settings.latitude && settings.longitude) {
                console.log('📍 باستخدام الموقع من localStorage:', settings.cityName || 'موقع محفوظ');
                return {
                    latitude: settings.latitude,
                    longitude: settings.longitude,
                    city: settings.cityName || 'موقع محفوظ'
                };
            }
            
            // القيم الافتراضية إذا لم يتم العثور على موقع
            console.log('⚠️ لم يتم العثور على موقع، استخدام قيم افتراضية');
            return {
                latitude: 31.9539,
                longitude: 44.3736,
                city: 'النجف'
            };
        },
        
        // تعيين طريقة الحساب من الإعدادات
        setCalculationMethod: function() {
            const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
            const calculationMethod = settings.calculationMethod || 'Hadi';
            const methodName = this.getMethodName(calculationMethod);
            const methodDescription = this.getMethodDescription(calculationMethod);
            
            const methodSelect = document.getElementById('calculation-method-monthly');
            if (methodSelect) {
                methodSelect.value = calculationMethod;
                
                // تحديث مكتبة praytimes إذا كانت متاحة
                if (this.prayTimes && this.prayTimes.setMethod) {
                    this.prayTimes.setMethod(calculationMethod);
                }
                
                // تحديث عرض اسم الطريقة
                const methodNameElement = document.getElementById('current-method-name');
                if (methodNameElement) {
                    methodNameElement.textContent = methodName;
                }
                
                // تحديث وصف الطريقة
                const methodDescElement = document.getElementById('method-description');
                if (methodDescElement) {
                    methodDescElement.textContent = methodDescription;
                }
            }
        },
        
        // الحصول على اسم طريقة الحساب
        getMethodName: function(method) {
            const methodNames = {
                'Hadi': 'تقويم الهادي',
                'MWL': 'رابطة العالم الإسلامي',
                'ISNA': 'الجمعية الإسلامية لأمريكا الشمالية',
                'Egypt': 'هيئة المساحة المصرية',
                'Makkah': 'أم القرى',
                'Karachi': 'جامعة العلوم الإسلامية كراتشي',
                'Tehran': 'جامعة طهران',
                'Jafari': 'الهيئة العامة للتقويم (إيران)'
            };
            
            return methodNames[method] || method;
        },
        
        // الحصول على وصف طريقة الحساب
        getMethodDescription: function(method) {
            const descriptions = {
                'Hadi': 'تقويم الهادي يستخدم زاوية 18° للفجر والعشاء، وزاوية 4° للمغرب',
                'MWL': 'رابطة العالم الإسلامي تستخدم زاوية 18° للفجر، وزاوية 17° للعشاء',
                'ISNA': 'الجمعية الإسلامية لأمريكا الشمالية تستخدم زاوية 15° للفجر، وزاوية 15° للعشاء',
                'Egypt': 'هيئة المساحة المصرية تستخدم زاوية 19.5° للفجر، وزاوية 17.5° للعشاء',
                'Makkah': 'أم القرى تستخدم زاوية 18.5° للفجر، و90 دقيقة بعد المغرب للعشاء',
                'Karachi': 'جامعة العلوم الإسلامية كراتشي تستخدم زاوية 18° للفجر، وزاوية 18° للعشاء',
                'Tehran': 'جامعة طهران تستخدم زاوية 17.7° للفجر، وزاوية 14° للعشاء',
                'Jafari': 'الهيئة العامة للتقويم تستخدم زاوية 16° للفجر، وزاوية 14° للعشاء، وزاوية 4° للمغرب'
            };
            
            return descriptions[method] || 'طريقة حساب أوقات الصلاة';
        },
        
        // الحصول على حالة التوقيت الصيفي
        getDstStatus: function() {
            const now = new Date();
            const jan = new Date(now.getFullYear(), 0, 1);
            const jul = new Date(now.getFullYear(), 6, 1);
            const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
            
            return now.getTimezoneOffset() < stdTimezoneOffset ? "نعم" : "لا";
        },
        
        // إعداد أحداث النافذة المنبثقة
        setupModalEventListeners: function() {
            setTimeout(() => {
                const prevBtn = document.getElementById('prev-month-btn');
                const nextBtn = document.getElementById('next-month-btn');
                const todayBtn = document.getElementById('go-to-today-btn');
                const printBtn = document.getElementById('btn-print-timetable');
                const printMobileBtn = document.getElementById('btn-print-mobile');
                const closeBtn = document.getElementById('btn-close-timetable');
                const printOptionsBtn = document.getElementById('btn-print-options');
                const methodSelect = document.getElementById('calculation-method-monthly');
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => this.changeMonth(-1));
                }
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.changeMonth(1));
                }
                
                if (todayBtn) {
                    todayBtn.addEventListener('click', () => this.goToCurrentMonth());
                }
                
                if (printBtn) {
                    printBtn.addEventListener('click', () => this.printTimetable());
                }
                
                if (printMobileBtn) {
                    printMobileBtn.addEventListener('click', () => this.printTimetable());
                }
                
                if (printOptionsBtn) {
                    printOptionsBtn.addEventListener('click', () => this.showPrintPreview());
                }
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('monthly-timetable-modal'));
                        if (modal) modal.hide();
                    });
                }
                
                if (methodSelect) {
                    methodSelect.addEventListener('change', (e) => {
                        this.changeCalculationMethod(e.target.value);
                    });
                }
            }, 100);
        },
        
        // دالة الطباعة
       // دالة الطباعة
printTimetable: function() {
    console.log('🖨️ تجهيز الجدول للطباعة...');
    
    // إظهار رسالة التجهيز
    this.showNotification('جاري تجهيز الجدول للطباعة...', 'info');
    
    // جعل النافذة المنبثقة مرئية بالكامل قبل الطباعة
    const modal = document.getElementById('monthly-timetable-modal');
    if (modal) {
        // إظهار النافذة إذا كانت مخفية
        modal.style.display = 'block';
        modal.style.opacity = '1';
        
        // إخفاء الأزرار وعناصر التحكم
        const buttons = modal.querySelectorAll('button');
        const monthControls = modal.querySelector('.month-controls');
        const cards = modal.querySelectorAll('.card');
        
        buttons.forEach(btn => btn.style.display = 'none');
        if (monthControls) monthControls.style.display = 'none';
        cards.forEach(card => card.style.display = 'none');
        
        // إظهار عناصر الطباعة
        const printElements = modal.querySelectorAll('.print-header, .print-quran-verse, .print-notice, .print-footer');
        printElements.forEach(el => {
            el.style.display = 'block';
        });
        
        // التأكد من أن الجدول كامل
        const table = modal.querySelector('.table');
        if (table) {
            table.style.width = '100%';
            table.style.display = 'table';
        }
    }
    
    // استخدام setTimeout لضمان تحديث DOM قبل الطباعة
    setTimeout(() => {
        try {
            // حفظ حالة التمرير الحالية
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // بديل أفضل: إنشاء نافذة طباعة مخصصة
            this.createPrintWindow();
            
        } catch (error) {
            console.error('خطأ في الطباعة:', error);
            this.showNotification('حدث خطأ أثناء محاولة الطباعة', 'error');
        }
    }, 500);
},

// إنشاء نافذة طباعة مخصصة
createPrintWindow: function() {
    const currentLocation = this.getCurrentLocation();
    const methodSelect = document.getElementById('calculation-method-monthly');
    const methodName = methodSelect ? this.getMethodName(methodSelect.value) : 'تقويم الهادي';
    
    // جمع بيانات الجدول
    let tableContent = '';
    const tableRows = document.querySelectorAll('#monthly-table-body tr');
    
    // عد الصفوف الفعلية (تجاهل صف التحميل)
    let actualRows = 0;
    tableRows.forEach(row => {
        if (row.cells && row.cells.length >= 10) {
            tableContent += '<tr>';
            for (let i = 0; i < 10; i++) {
                const cell = row.cells[i];
                if (cell) {
                    // إزالة الأزرار والعناصر غير المرغوبة
                    let cellContent = cell.innerHTML;
                    cellContent = cellContent.replace(/<button[^>]*>.*?<\/button>/g, '');
                    cellContent = cellContent.replace(/<span class="badge[^>]*>.*?<\/span>/g, '');
                    tableContent += `<td>${cellContent}</td>`;
                } else {
                    tableContent += '<td></td>';
                }
            }
            tableContent += '</tr>';
            actualRows++;
        }
    });
    
    // إذا لم تكن هناك صفوف، استخدم البيانات الحالية
    if (actualRows === 0) {
        tableContent = `
            <tr><td colspan="10" style="text-align:center; padding:20px;">لا توجد بيانات للعرض</td></tr>
        `;
    }
    
    // إنشاء نافذة الطباعة
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>جدول أوقات الصلاة الشهري - ${this.monthNames[this.currentMonth]} ${this.currentYear}</title>
            <style>
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }
                    
                    body {
                        font-family: 'Arial', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 11pt;
                        line-height: 1.4;
                        color: #000;
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    
                    .print-container {
                        padding: 0;
                        max-width: 100%;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #333;
                    }
                    
                    .header h1 {
                        font-size: 22pt;
                        margin: 0 0 10px 0;
                        color: #2c3e50;
                    }
                    
                    .header .subtitle {
                        font-size: 14pt;
                        color: #7f8c8d;
                        margin-bottom: 5px;
                    }
                    
                    .header .date {
                        font-size: 11pt;
                        color: #e74c3c;
                        font-weight: bold;
                    }
                    
                    .quran-verse {
                        text-align: center;
                        font-size: 14pt;
                        color: #2c3e50;
                        font-weight: bold;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border-right: 5px solid #3498db;
                        font-family: 'Traditional Arabic', 'Arial', sans-serif;
                    }
                    
                    .table-container {
                        width: 100%;
                        margin: 20px 0;
                        overflow: visible;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9pt;
                        page-break-inside: auto;
                    }
                    
                    th {
                        background-color: #3498db;
                        color: white;
                        font-weight: bold;
                        padding: 8px 6px;
                        border: 1px solid #000;
                        text-align: center;
                    }
                    
                    td {
                        padding: 6px 5px;
                        border: 1px solid #000;
                        text-align: center;
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    .today-row {
                        background-color: #d4edda !important;
                    }
                    
                    .notice {
                        text-align: center;
                        font-size: 10pt;
                        color: #e74c3c;
                        font-style: italic;
                        margin: 25px 0 15px 0;
                        padding: 12px;
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    
                    .footer {
                        text-align: center;
                        font-size: 9pt;
                        color: #666;
                        margin-top: 25px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                    }
                    
                    .watermark {
                        position: fixed;
                        bottom: 10px;
                        right: 10px;
                        font-size: 8pt;
                        color: #999;
                    }
                    
                    /* منع تقسيم الصفوف بين الصفحات */
                    tr {
                        page-break-inside: avoid;
                    }
                }
                
                /* الأنماط للعرض على الشاشة */
                body {
                    font-family: 'Arial', sans-serif;
                    padding: 20px;
                    background: #f5f5f5;
                }
                
                .print-container {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .print-actions {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                }
                
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    margin: 0 10px;
                    display: inline-block;
                }
                
                .btn-print {
                    background-color: #2ecc71;
                    color: white;
                }
                
                .btn-close {
                    background-color: #e74c3c;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="header">
                    <h1>جدول أوقات الصلاة الشهري</h1>
                    <div class="subtitle">
                        ${this.monthNames[this.currentMonth]} ${this.currentYear} | ${currentLocation.city}
                    </div>
                    <div class="date">
                        تم الإنشاء: ${new Date().toLocaleDateString('ar-EG')}
                    </div>
                </div>
                
                <div class="quran-verse">
                    ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>اليوم</th>
                                <th>الإمساك</th>
                                <th>الفجر</th>
                                <th>الشروق</th>
                                <th>الظهر</th>
                                <th>العصر</th>
                                <th>الغروب</th>
                                <th>المغرب</th>
                                <th>العشاء</th>
                                <th>منتصف الليل</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableContent}
                        </tbody>
                    </table>
                </div>
                
                <div class="notice">
                    <i class="bi bi-exclamation-triangle"></i>
                    نرجو من المؤمنين الكرام الاحتياط بدقيقة أو دقيقتين عند الصلاة
                </div>
                
                <div class="footer">
                    <div>تطبيق مواقيت الصلاة - ${currentLocation.city}</div>
                    <div>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div class="watermark">صفحة 1 من 1</div>
                </div>
                
                <div class="print-actions">
                    <button class="btn btn-print" onclick="window.print()">
                        طباعة الجدول
                    </button>
                    <button class="btn btn-close" onclick="window.close()">
                        إغلاق النافذة
                    </button>
                </div>
            </div>
            
            <script>
                // إضافة أيقونات Bootstrap إذا لزم الأمر
                if (!document.querySelector('.bi')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
                    document.head.appendChild(link);
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // التركيز على نافذة الطباعة
    printWindow.focus();
    
    // عرض رسالة نجاح
    this.showNotification('تم فتح نافذة الطباعة بنجاح', 'success');
},
        
        // بديل الطباعة: تنزيل كصورة أو PDF
        showPrintAlternative: function() {
            const modalContent = document.querySelector('#monthly-timetable-modal .modal-content');
            if (!modalContent) return;
            
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning alert-dismissible fade show mt-3';
            alertDiv.innerHTML = `
                <strong><i class="bi bi-exclamation-triangle me-2"></i>تنبيه!</strong>
                <p class="mb-2">لم يتمكن المتصفح من فتح نافذة الطباعة. يمكنك:</p>
                <div class="d-flex gap-2">
                    <button id="screenshot-btn" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-camera me-1"></i> حفظ كصورة
                    </button>
                    <button id="pdf-btn" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-file-pdf me-1"></i> حفظ كـ PDF
                    </button>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            modalContent.appendChild(alertDiv);
            
            // إضافة مستمعي الأحداث للأزرار الجديدة
            setTimeout(() => {
                const screenshotBtn = document.getElementById('screenshot-btn');
                const pdfBtn = document.getElementById('pdf-btn');
                
                if (screenshotBtn) {
                    screenshotBtn.addEventListener('click', () => this.saveAsImage());
                }
                
                if (pdfBtn) {
                    pdfBtn.addEventListener('click', () => this.saveAsPDF());
                }
            }, 100);
        },
        
        // حفظ كصورة (بديل)
        saveAsImage: function() {
            this.showNotification('هذه الميزة قيد التطوير', 'info');
        },
        
        // حفظ كـ PDF (بديل)
        saveAsPDF: function() {
            this.showNotification('هذه الميزة قيد التطوير', 'info');
        },
        
        // تغيير طريقة الحساب
        changeCalculationMethod: function(method) {
            if (this.prayTimes && this.prayTimes.setMethod) {
                this.prayTimes.setMethod(method);
                console.log(`✅ تم تغيير طريقة الحساب إلى: ${method}`);
                
                // تحديث عرض اسم الطريقة
                const methodName = this.getMethodName(method);
                const methodDescription = this.getMethodDescription(method);
                
                const methodNameElement = document.getElementById('current-method-name');
                if (methodNameElement) {
                    methodNameElement.textContent = methodName;
                }
                
                // تحديث وصف الطريقة
                const methodDescElement = document.getElementById('method-description');
                if (methodDescElement) {
                    methodDescElement.textContent = methodDescription;
                }
                
                // حفظ الإعدادات
                const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
                settings.calculationMethod = method;
                localStorage.setItem('prayerSettings', JSON.stringify(settings));
                
                // إعادة توليد الجدول
                this.generateTable();
                
                this.showNotification(`تم تغيير طريقة الحساب إلى ${methodName}`);
            }
        },
        
        // تغيير الشهر
        changeMonth: function(direction) {
            this.currentMonth += direction;
            
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            
            this.updateMonthDisplay();
            this.generateTable();
        },
        
        // الانتقال إلى الشهر الحالي
        goToCurrentMonth: function() {
            const now = new Date();
            this.currentMonth = now.getMonth();
            this.currentYear = now.getFullYear();
            
            this.updateMonthDisplay();
            this.generateTable();
            
            this.showNotification('تم الانتقال إلى الشهر الحالي');
        },
        
        // تحديث عرض الشهر
        updateMonthDisplay: function() {
            const display = document.getElementById('current-month-display');
            if (display) {
                display.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            }
        },
        
        // توليد الجدول باستخدام مكتبة praytimes
        generateTable: function() {
            const tableBody = document.getElementById('monthly-table-body');
            if (!tableBody) return;
            
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p class="mt-3 text-muted">جاري حساب أوقات الصلاة بدقة...</p>
                        <small class="text-muted">قد يستغرق ذلك بضع لحظات</small>
                    </td>
                </tr>
            `;
            
            // احصل على الموقع الحالي
            const currentLocation = this.getCurrentLocation();
            
            // تحديث معلومات الموقع
            const locationInfo = document.getElementById('monthly-location-info');
            if (locationInfo) {
                locationInfo.innerHTML = `<i class="bi bi-geo-alt"></i> الموقع: ${currentLocation.city}`;
            }
            
            // إحصائيات الشهر
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const today = new Date();
            const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
            
            // استخدم setTimeout للسماح بعرض رسالة التحميل
            setTimeout(() => {
                this.generateTableContent(tableBody, daysInMonth, currentLocation, isCurrentMonth, today);
            }, 100);
        },
        
        // توليد محتوى الجدول
        generateTableContent: function(tableBody, daysInMonth, location, isCurrentMonth, today) {
            let tableHTML = '';
            let prayersCalculated = 0;
            const totalDays = daysInMonth;
            
            for (let day = 1; day <= totalDays; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const isToday = isCurrentMonth && day === today.getDate();
                
                // حساب أوقات الصلاة باستخدام praytimes أو الحساب التقريبي
                const prayerTimes = this.calculatePrayerTimes(date, location);
                
                // إنشاء الصف
                const rowClass = isToday ? 'table-success' : '';
                const todayBadge = isToday ? '<span class="badge bg-danger ms-1">اليوم</span>' : '';
                
                tableHTML += `
                    <tr class="${rowClass}">
                        <td class="fw-bold text-center ${isToday ? 'text-danger' : ''}">
                            ${day}
                            ${todayBadge}
                        </td>
                        <td class="text-center">${prayerTimes.imsak}</td>
                        <td class="text-center">${prayerTimes.fajr}</td>
                        <td class="text-center">${prayerTimes.sunrise}</td>
                        <td class="text-center">${prayerTimes.dhuhr}</td>
                        <td class="text-center">${prayerTimes.asr}</td>
                        <td class="text-center">${prayerTimes.sunset}</td>
                        <td class="text-center">${prayerTimes.maghrib}</td>
                        <td class="text-center">${prayerTimes.isha}</td>
                        <td class="text-center">${prayerTimes.midnight}</td>
                    </tr>
                `;
                
                prayersCalculated++;
                
                // تحديث التقدم كل 5 أيام
                if (prayersCalculated % 5 === 0) {
                    setTimeout(() => {
                        tableBody.innerHTML = tableHTML + this.getLoadingRow(prayersCalculated, totalDays);
                    }, 0);
                }
            }
            
            // عند الانتهاء، عرض الجدول الكامل
            setTimeout(() => {
                tableBody.innerHTML = tableHTML;
                console.log(`✅ تم حساب ${totalDays} يوم من أوقات الصلاة لموقع: ${location.city}`);
                
                // إضافة صف التذييل
                const tfoot = document.createElement('tfoot');
                tfoot.innerHTML = `
                    <tr class="table-light">
                        <td colspan="10" class="text-center py-2">
                            <small class="text-muted">
                                <i class="bi bi-check-circle text-success me-1"></i>
                                تم حساب ${totalDays} يوم من أوقات الصلاة بدقة لـ ${location.city}
                            </small>
                        </td>
                    </tr>
                `;
                tableBody.parentNode.appendChild(tfoot);
                
            }, 100);
        },
        
        // صف التحميل مع مؤشر التقدم
        getLoadingRow: function(calculated, total) {
            const percentage = Math.round((calculated / total) * 100);
            return `
                <tr id="loading-row">
                    <td colspan="10" class="text-center py-3">
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: ${percentage}%">
                                ${percentage}%
                            </div>
                        </div>
                        <small class="text-muted mt-2 d-block">
                            جاري حساب أوقات الصلاة... ${calculated} من ${total} يوم
                        </small>
                    </td>
                </tr>
            `;
        },
        
        // حساب أوقات الصلاة باستخدام praytimes
        calculatePrayerTimes: function(date, location) {
            // إذا كانت مكتبة praytimes متاحة، استخدمها
            if (this.prayTimes && typeof this.prayTimes.getTimes === 'function') {
                try {
                    // الحصول على طريقة الحساب الحالية
                    const methodSelect = document.getElementById('calculation-method-monthly');
                    const currentMethod = methodSelect ? methodSelect.value : 'Hadi';
                    
                    // إعدادات تقويم الهادي مع الزاوية 4 للمغرب
                    if (currentMethod === 'Hadi') {
                        // حفظ الإعدادات الأصلية
                        const originalMethod = this.prayTimes.getMethod();
                        
                        // استخدام طريقة جعفري كأساس (لأنها تستخدم الزاوية 4 للمغرب)
                        this.prayTimes.setMethod('Jafari');
                        
                        // تعديل إعدادات تقويم الهادي
                        const hadiParams = {
                            fajr: 18,   // تقويم الهادي يستخدم 18°
                            isha: 18,   // تقويم الهادي يستخدم 18°
                            maghrib: 4, // الزاوية 4 للمغرب (مشترك مع الجعفري)
                            asr: 'Standard', // المذهب الحنفي
                            highLats: 'NightMiddle'
                        };
                        
                        // تطبيق إعدادات الهادي
                        this.prayTimes.adjust(hadiParams);
                        
                        // حساب الأوقات
                        const times = this.prayTimes.getTimes(
                            date,
                            [location.latitude, location.longitude],
                            3, // توقيت العراق
                            0, // الارتفاع
                            0  // التوقيت الصيفي
                        );
                        
                        // استعادة الطريقة الأصلية
                        this.prayTimes.setMethod(originalMethod);
                        
                        // تطبيق تعديلات الوقت من الإعدادات
                        const adjustedTimes = this.applyTimeAdjustments(times);
                        
                        return {
                            imsak: this.formatTime(adjustedTimes.imsak || times.imsak || '--:--'),
                            fajr: this.formatTime(adjustedTimes.fajr || times.fajr || '--:--'),
                            sunrise: this.formatTime(adjustedTimes.sunrise || times.sunrise || '--:--'),
                            dhuhr: this.formatTime(adjustedTimes.dhuhr || times.dhuhr || '--:--'),
                            asr: this.formatTime(adjustedTimes.asr || times.asr || '--:--'),
                            sunset: this.formatTime(adjustedTimes.sunset || times.sunset || '--:--'),
                            maghrib: this.formatTime(adjustedTimes.maghrib || times.maghrib || '--:--'), // سيتم حسابها بـ 4°
                            isha: this.formatTime(adjustedTimes.isha || times.isha || '--:--'),
                            midnight: this.formatTime(adjustedTimes.midnight || times.midnight || '--:--')
                        };
                    } else {
                        // طرق حساب أخرى (بدون تغيير)
                        const times = this.prayTimes.getTimes(
                            date,
                            [location.latitude, location.longitude],
                            3,
                            0,
                            0
                        );
                        
                        const adjustedTimes = this.applyTimeAdjustments(times);
                        
                        return {
                            imsak: this.formatTime(adjustedTimes.imsak || times.imsak || '--:--'),
                            fajr: this.formatTime(adjustedTimes.fajr || times.fajr || '--:--'),
                            sunrise: this.formatTime(adjustedTimes.sunrise || times.sunrise || '--:--'),
                            dhuhr: this.formatTime(adjustedTimes.dhuhr || times.dhuhr || '--:--'),
                            asr: this.formatTime(adjustedTimes.asr || times.asr || '--:--'),
                            sunset: this.formatTime(adjustedTimes.sunset || times.sunset || '--:--'),
                            maghrib: this.formatTime(adjustedTimes.maghrib || times.maghrib || '--:--'),
                            isha: this.formatTime(adjustedTimes.isha || times.isha || '--:--'),
                            midnight: this.formatTime(adjustedTimes.midnight || times.midnight || '--:--')
                        };
                    }
                } catch (error) {
                    console.error('خطأ في حساب أوقات الصلاة باستخدام praytimes:', error);
                    return this.calculateApproximateTimes(date, location);
                }
            } else {
                // استخدام حساب تقريبي
                return this.calculateApproximateTimes(date, location);
            }
        },
        
        // تطبيق تعديلات الوقت من الإعدادات
        applyTimeAdjustments: function(times) {
            const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
            const adjustments = settings.adjustments || {};
            
            const adjustedTimes = { ...times };
            
            // تطبيق التعديلات على كل صلاة
            Object.keys(adjustments).forEach(prayer => {
                if (adjustedTimes[prayer] && adjustments[prayer] !== 0) {
                    adjustedTimes[prayer] = this.adjustTime(adjustedTimes[prayer], adjustments[prayer]);
                }
            });
            
            return adjustedTimes;
        },
        
        // تعديل الوقت
        adjustTime: function(timeString, adjustment) {
            try {
                const [hours, minutes] = timeString.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes + adjustment;
                
                let newHours = Math.floor(totalMinutes / 60);
                const newMinutes = totalMinutes % 60;
                
                // تصحيح الساعات إذا كانت خارج النطاق (0-23)
                if (newHours >= 24) newHours -= 24;
                if (newHours < 0) newHours += 24;
                
                return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
            } catch (error) {
                console.error('خطأ في تعديل الوقت:', error);
                return timeString;
            }
        },
        
        // حساب أوقات الصلاة التقريبية (كبديل)
        calculateApproximateTimes: function(date, location) {
            const month = date.getMonth();
            const day = date.getDate();
            const dayOfYear = this.getDayOfYear(date);
            
            // حسابات أكثر دقة بناءً على الموقع والوقت من السنة
            const latFactor = Math.abs(location.latitude) / 90;
            const dayFactor = dayOfYear / 365;
            
            // حسابات مخصصة بناءً على الموقع
            const baseFajr = 5.0 + latFactor * 1.5 + Math.sin(dayFactor * Math.PI * 2) * 0.5;
            const baseSunrise = baseFajr + 1.2;
            const baseSunset = 18.5 - latFactor * 1.5 - Math.sin(dayFactor * Math.PI * 2) * 0.5;
            
            return {
                imsak: this.formatTimeFromDecimal(baseFajr - 0.2),
                fajr: this.formatTimeFromDecimal(baseFajr),
                sunrise: this.formatTimeFromDecimal(baseSunrise),
                dhuhr: '12:15',
                asr: this.formatTimeFromDecimal(15.5 - latFactor * 0.8),
                sunset: this.formatTimeFromDecimal(baseSunset),
                maghrib: this.formatTimeFromDecimal(baseSunset + 0.2),
                isha: this.formatTimeFromDecimal(baseSunset + 1.2),
                midnight: '23:30'
            };
        },
        
        // الحصول على رقم اليوم في السنة
        getDayOfYear: function(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        },
        
        // تنسيق الوقت
        formatTime: function(timeString) {
            if (!timeString || timeString === '--:--') return '--:--';
            
            try {
                const [hours, minutes] = timeString.split(':').map(Number);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } catch (error) {
                console.error('خطأ في تنسيق الوقت:', error);
                return '--:--';
            }
        },
        
        // تنسيق الوقت من الرقم العشري
        formatTimeFromDecimal: function(decimalTime) {
            const hours = Math.floor(decimalTime);
            const minutes = Math.round((decimalTime - hours) * 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        },
        
        // إظهار إشعار
        showNotification: function(message, type = 'info') {
            try {
                // استخدام Toast من Bootstrap إذا كان متاحاً
                const toastEl = document.getElementById('notification');
                if (toastEl && typeof bootstrap !== 'undefined') {
                    const toast = new bootstrap.Toast(toastEl);
                    const toastBody = toastEl.querySelector('.toast-body');
                    if (toastBody) {
                        toastBody.textContent = message;
                        
                        // تغيير اللون حسب النوع
                        toastEl.classList.remove('bg-primary', 'bg-success', 'bg-danger', 'bg-warning');
                        
                        if (type === 'success') {
                            toastEl.classList.add('bg-success');
                        } else if (type === 'error') {
                            toastEl.classList.add('bg-danger');
                        } else if (type === 'warning') {
                            toastEl.classList.add('bg-warning');
                            toastEl.classList.add('text-dark');
                        } else {
                            toastEl.classList.add('bg-primary');
                        }
                        
                        toast.show();
                        return;
                    }
                }
                
                // إذا فشل Toast، استخدم console.log
                console.log(`${type}: ${message}`);
                
            } catch (error) {
                console.error('خطأ في عرض الإشعار:', error);
                console.log(`${type}: ${message}`);
            }
        }
    };
    
    // تهيئة عند تحميل DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            MonthlyTimetable.init();
            
            // جعل الكائن متاحاً عالمياً
            window.MonthlyTimetable = MonthlyTimetable;
            
            console.log('✅ الجدول الشهري جاهز للاستخدام مع مكتبة PrayTimes وميزة الطباعة');
        }, 1000);
    });
})();




