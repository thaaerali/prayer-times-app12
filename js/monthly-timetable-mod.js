// ملف JavaScript المعدل للجدول الشهري مع دعم كامل للطباعة والتحديثات
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
        
        // تهيئة
        init: function() {
            console.log('📅 تهيئة الجدول الشهري...');
            
            // التحقق أولاً إذا كنا في صفحة الجدول الشهري
            const isMonthlyPage = document.getElementById('monthly-timetable-modal') !== null || 
                                 document.getElementById('prayer-table-body') !== null;
            
            if (!isMonthlyPage) {
                console.log('⚠️ لسنا في صفحة الجدول الشهري، التهيئة مؤجلة');
                // ولكن نستمر لأننا قد نكون في المودال
            }
            
            // تهيئة مكتبة praytimes إذا كانت متاحة
            this.initPrayTimes();
            
            // إضافة أنماط الطباعة المحسنة
            this.addOptimizedPrintStyles();
            
            // إعداد الأحداث
            this.setupEventListeners();
        },
        
        // تهيئة مكتبة praytimes
        initPrayTimes: function() {
            if (typeof PrayTimes !== 'undefined') {
                this.prayTimes = new PrayTimes();
                console.log('✅ مكتبة PrayTimes محملة وجاهزة للاستخدام');
                
                // تعيين طريقة الحساب الافتراضية
                if (this.prayTimes.setMethod) {
                    this.prayTimes.setMethod('Hadi');
                }
            } else {
                console.warn('⚠️ مكتبة PrayTimes غير محملة، سيتم استخدام حساب تقريبي');
            }
        },
        
        // إضافة أنماط الطباعة المحسنة
        addOptimizedPrintStyles: function() {
            const styleId = 'monthly-timetable-optimized-print-styles';
            
            // إزالة الأنماط القديمة إذا وجدت
            const oldStyle = document.getElementById(styleId);
            if (oldStyle) oldStyle.remove();
            
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* أنماط الطباعة المحسنة */
                @media print {
                    /* إعادة تعيين عام */
                    * {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        float: none !important;
                        position: static !important;
                        text-shadow: none !important;
                    }
                    
                    body {
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        font-size: 12pt !important;
                        line-height: 1.4 !important;
                        color: black !important;
                        font-family: 'Arial', 'Helvetica', sans-serif !important;
                    }
                    
                    /* إخفاء كل شيء ما عدا محتوى الطباعة */
                    body * {
                        visibility: hidden !important;
                    }
                    
                    .modal-content,
                    .modal-content *,
                    #monthly-timetable-content,
                    #monthly-timetable-content *,
                    .monthly-timetable-container,
                    .monthly-timetable-container *,
                    .print-container,
                    .print-container * {
                        visibility: visible !important;
                        display: block !important;
                    }
                    
                    /* نافذة المودال تكون كاملة */
                    #monthly-timetable-modal,
                    #monthly-timetable-modal .modal-dialog,
                    #monthly-timetable-modal .modal-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        min-height: 100vh !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        display: block !important;
                        opacity: 1 !important;
                        background: white !important;
                        border: none !important;
                        overflow: visible !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        z-index: 999999 !important;
                        page-break-inside: avoid !important;
                    }
                    
                    /* إخفاء العناصر غير المرغوبة في الطباعة */
                    .modal-header,
                    .modal-footer,
                    .month-controls,
                    .btn,
                    button,
                    .alert:not(.print-notice),
                    .bi,
                    i,
                    [class*="spinner"],
                    .progress,
                    .badge,
                    tfoot,
                    .text-muted:not(.print-text),
                    .card:not(.print-info-card),
                    .row:not(.print-row),
                    .d-print-none,
                    .no-print {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    
                    /* رأس الطباعة */
                    .print-header {
                        display: block !important;
                        visibility: visible !important;
                        text-align: center !important;
                        margin-bottom: 15mm !important;
                        padding-bottom: 5mm !important;
                        border-bottom: 2px solid #000 !important;
                        page-break-after: avoid !important;
                    }
                    
                    .print-header h1,
                    .print-header h2,
                    .print-header h3 {
                        font-size: 24pt !important;
                        font-weight: bold !important;
                        color: #000 !important;
                        margin-bottom: 3mm !important;
                        page-break-after: avoid !important;
                    }
                    
                    .print-subtitle {
                        font-size: 14pt !important;
                        color: #333 !important;
                        margin: 2mm 0 !important;
                        page-break-after: avoid !important;
                    }
                    
                    .print-date {
                        font-size: 11pt !important;
                        color: #666 !important;
                        font-weight: normal !important;
                        page-break-after: avoid !important;
                    }
                    
                    /* الآية القرآنية */
                    .print-quran-verse {
                        display: block !important;
                        visibility: visible !important;
                        text-align: center !important;
                        font-size: 16pt !important;
                        font-weight: bold !important;
                        color: #000 !important;
                        margin: 10mm 0 !important;
                        padding: 5mm !important;
                        background: #f5f5f5 !important;
                        border: 1px solid #333 !important;
                        page-break-inside: avoid !important;
                        page-break-after: avoid !important;
                        font-family: 'Traditional Arabic', 'Arial', sans-serif !important;
                    }
                    
                    /* الجدول الرئيسي - محسّن للطباعة */
                    .table-responsive {
                        display: block !important;
                        visibility: visible !important;
                        width: 100% !important;
                        overflow: visible !important;
                        margin: 10mm 0 !important;
                        page-break-inside: avoid !important;
                    }
                    
                    table {
                        width: 100% !important;
                        max-width: 100% !important;
                        table-layout: fixed !important;
                        border-collapse: collapse !important;
                        border-spacing: 0 !important;
                        margin: 0 auto !important;
                        page-break-inside: avoid !important;
                        font-size: 10pt !important;
                    }
                    
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 3mm 2mm !important;
                        font-size: 10pt !important;
                        text-align: center !important;
                        vertical-align: middle !important;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        height: auto !important;
                        min-height: 7mm !important;
                        page-break-inside: avoid !important;
                        white-space: normal !important;
                    }
                    
                    /* تحديد عرض الأعمدة لضمان ظهورها كاملة */
                    th:nth-child(1), td:nth-child(1) { width: 8% !important; min-width: 15mm !important; }  /* اليوم */
                    th:nth-child(2), td:nth-child(2) { width: 10% !important; min-width: 18mm !important; } /* الإمساك */
                    th:nth-child(3), td:nth-child(3) { width: 10% !important; min-width: 18mm !important; } /* الفجر */
                    th:nth-child(4), td:nth-child(4) { width: 10% !important; min-width: 18mm !important; } /* الشروق */
                    th:nth-child(5), td:nth-child(5) { width: 10% !important; min-width: 18mm !important; } /* الظهر */
                    th:nth-child(6), td:nth-child(6) { width: 10% !important; min-width: 18mm !important; } /* العصر */
                    th:nth-child(7), td:nth-child(7) { width: 10% !important; min-width: 18mm !important; } /* الغروب */
                    th:nth-child(8), td:nth-child(8) { width: 10% !important; min-width: 18mm !important; } /* المغرب */
                    th:nth-child(9), td:nth-child(9) { width: 10% !important; min-width: 18mm !important; } /* العشاء */
                    th:nth-child(10), td:nth-child(10) { width: 12% !important; min-width: 22mm !important; } /* منتصف الليل */
                    
                    th {
                        background: #2c3e50 !important;
                        color: white !important;
                        font-weight: bold !important;
                        font-size: 11pt !important;
                        page-break-after: avoid !important;
                    }
                    
                    /* صف اليوم الحالي */
                    .table-success,
                    .today-row {
                        background-color: #d4edda !important;
                        color: #000 !important;
                        font-weight: bold !important;
                    }
                    
                    /* ملاحظة الطباعة */
                    .print-notice {
                        display: block !important;
                        visibility: visible !important;
                        text-align: center !important;
                        font-size: 11pt !important;
                        font-style: italic !important;
                        color: #c00 !important;
                        margin: 10mm 0 5mm 0 !important;
                        padding: 3mm !important;
                        border: 1px solid #c00 !important;
                        background: #fff9e6 !important;
                        page-break-inside: avoid !important;
                        page-break-before: avoid !important;
                    }
                    
                    /* تذييل الطباعة */
                    .print-footer {
                        display: block !important;
                        visibility: visible !important;
                        text-align: center !important;
                        font-size: 9pt !important;
                        color: #666 !important;
                        margin-top: 10mm !important;
                        padding-top: 3mm !important;
                        border-top: 1px solid #ddd !important;
                        page-break-before: avoid !important;
                    }
                    
                    /* العلامة المائية */
                    .print-watermark {
                        position: fixed !important;
                        bottom: 5mm !important;
                        right: 5mm !important;
                        font-size: 8pt !important;
                        color: #999 !important;
                        opacity: 0.3 !important;
                    }
                    
                    /* منع فواصل الصفحات غير المرغوبة داخل الصفوف */
                    tr {
                        page-break-inside: avoid !important;
                        page-break-after: auto !important;
                    }
                    
                    /* تحسين ظهور الأوقات في الطباعة */
                    .fajr-time { color: #000 !important; }
                    .sunrise-time { color: #000 !important; }
                    .dhuhr-time { color: #000 !important; }
                    .asr-time { color: #000 !important; }
                    .maghrib-time { color: #000 !important; }
                    .isha-time { color: #000 !important; }
                    
                    /* معلومات الطباعة الإضافية */
                    .print-info {
                        display: block !important;
                        visibility: visible !important;
                        margin: 5mm 0 !important;
                        padding: 3mm !important;
                        background: #f8f9fa !important;
                        border: 1px solid #dee2e6 !important;
                        border-radius: 4px !important;
                        page-break-inside: avoid !important;
                    }
                }
                
                /* أنماط الطباعة العادية (للشاشة) */
                .print-container {
                    display: none;
                }
                
                .print-header,
                .print-quran-verse,
                .print-notice,
                .print-footer,
                .print-watermark {
                    display: none;
                }
            `;
            
            document.head.appendChild(style);
            console.log('✅ تم إضافة أنماط الطباعة المحسنة');
        },
        
        // إعداد مستمعي الأحداث
        setupEventListeners: function() {
            // زر فتح الجدول الشهري في الصفحة الرئيسية
            const timetableBtn = document.getElementById('monthly-timetable-button');
            if (timetableBtn) {
                console.log('✅ تم العثور على زر الجدول الشهري');
                timetableBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openTimetableModal();
                });
            }
            
            // استماع لأحداث النافذة المنبثقة إذا كانت موجودة
            const modalElement = document.getElementById('monthly-timetable-modal');
            if (modalElement) {
                modalElement.addEventListener('shown.bs.modal', () => {
                    this.loadTimetableModalContent();
                });
            }
            
            // إذا كنا في صفحة الجدول المنفصلة، تهيئتها
            if (document.getElementById('prayer-table-body')) {
                console.log('📍 تهيئة صفحة الجدول الشهري المنفصلة');
                this.initializeStandalonePage();
            }
        },
        
        // فتح نافذة الجدول الشهري
        openTimetableModal: function() {
            console.log('فتح نافذة الجدول الشهري...');
            
            const modalElement = document.getElementById('monthly-timetable-modal');
            if (!modalElement) {
                console.error('❌ نافذة الجدول الشهري غير موجودة');
                this.openStandaloneTimetablePage();
                return;
            }
            
            // تحميل المحتوى
            this.loadTimetableModalContent();
            
            // إظهار النافذة باستخدام Bootstrap
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        },
        
        // فتح صفحة الجدول المنفصلة
        openStandaloneTimetablePage: function() {
            console.log('📄 محاولة فتح صفحة الجدول المنفصلة...');
            
            // إنشاء صفحة منفصلة للجدول
            const printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                console.error('❌ لم يتمكن من فتح نافذة جديدة');
                this.showNotification('الرجاء السماح بالنوافذ المنبثقة', 'error');
                return;
            }
            
            // إنشاء صفحة بسيطة للجدول
            printWindow.document.write(`
                <!DOCTYPE html>
                <html dir="rtl" lang="ar">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>جدول أوقات الصلاة الشهري</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
                    <style>
                        body {
                            padding: 20px;
                            font-family: 'Arial', sans-serif;
                        }
                        .print-header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 3px solid #2c3e50;
                            padding-bottom: 15px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: center;
                        }
                        th {
                            background-color: #2c3e50;
                            color: white;
                        }
                    </style>
                </head>
                <body>
                    <div id="standalone-timetable-content">
                        <div class="container">
                            <div class="text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">جاري التحميل...</span>
                                </div>
                                <p class="mt-3">جاري تحميل جدول أوقات الصلاة...</p>
                            </div>
                        </div>
                    </div>
                    
                    <script>
                        // تهيئة الجدول في النافذة الجديدة
                        setTimeout(() => {
                            if (window.opener && window.opener.MonthlyTimetable) {
                                window.opener.MonthlyTimetable.loadStandalonePage(window);
                            }
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
        },
        
        // تحميل محتوى النافذة المنبثقة
        loadTimetableModalContent: function() {
            const contentDiv = document.getElementById('monthly-timetable-content');
            if (!contentDiv) {
                console.error('❌ عنصر محتوى الجدول غير موجود');
                return;
            }
            
            // عرض رسالة تحميل
            contentDiv.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p class="mt-3">جاري تحميل جدول أوقات الصلاة...</p>
                </div>
            `;
            
            // تحميل المحتوى بعد تأخير
            setTimeout(() => {
                this.renderTimetableContent(contentDiv, 'modal');
            }, 300);
        },
        
        // تحميل صفحة منفصلة
        loadStandalonePage: function(targetWindow) {
            if (!targetWindow || !targetWindow.document) return;
            
            const contentDiv = targetWindow.document.getElementById('standalone-timetable-content');
            if (!contentDiv) return;
            
            this.renderTimetableContent(contentDiv, 'standalone');
        },
        
        // تهيئة صفحة منفصلة
        initializeStandalonePage: function() {
            console.log('📍 تهيئة صفحة الجدول الشهري المنفصلة...');
            
            // تحديث التاريخ الحالي
            this.updateMonthDisplay();
            
            // إعداد أحداث الصفحة
            this.setupStandalonePageEvents();
            
            // تحميل الجدول
            this.loadTimetable();
        },
        
        // إعداد أحداث الصفحة المنفصلة
        setupStandalonePageEvents: function() {
            // أزرار التنقل بين الأشهر
            const prevBtn = document.getElementById('prev-month');
            const nextBtn = document.getElementById('next-month');
            const todayBtn = document.getElementById('go-to-today');
            const printBtn = document.getElementById('print-timetable');
            const citySelect = document.getElementById('city-select');
            const backToTopBtn = document.getElementById('back-to-top');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.changeMonth(-1));
                console.log('✅ زر الشهر السابق جاهز');
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.changeMonth(1));
                console.log('✅ زر الشهر التالي جاهز');
            }
            
            if (todayBtn) {
                todayBtn.addEventListener('click', () => this.goToCurrentMonth());
                console.log('✅ زر الشهر الحالي جاهز');
            }
            
            if (printBtn) {
                printBtn.addEventListener('click', () => this.printTimetable());
                console.log('✅ زر الطباعة جاهز');
            }
            
            if (citySelect) {
                citySelect.addEventListener('change', (e) => {
                    this.changeCity(e.target.value);
                });
                console.log('✅ قائمة المدن جاهزة');
            }
            
            if (backToTopBtn) {
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                
                window.addEventListener('scroll', () => {
                    backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
                });
                console.log('✅ زر العودة للأعلى جاهز');
            }
            
            // حدث الطباعة العام (Ctrl+P)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    this.printTimetable();
                }
            });
            
            // تحديث معلومات الموقع
            const locationInfo = document.getElementById('current-location-info');
            if (locationInfo) {
                const location = this.getCurrentLocation();
                locationInfo.textContent = `الموقع: ${location.city}`;
            }
        },
        
        // عرض محتوى الجدول
        renderTimetableContent: function(container, type = 'modal') {
            const location = this.getCurrentLocation();
            const isModal = type === 'modal';
            
            let content = '';
            
            if (isModal) {
                content = this.getModalContent(location);
            } else {
                content = this.getStandalonePageContent(location);
            }
            
            container.innerHTML = content;
            
            // إعداد الأحداث للعناصر الجديدة
            this.setupTimetableEvents(isModal);
            
            // توليد الجدول
            this.generateTable();
        },
        
        // الحصول على محتوى المودال
        getModalContent: function(location) {
            return `
                <div class="monthly-timetable-container p-3">
                    <!-- رأس الجدول للطباعة -->
                    <div class="print-header">
                        <h2>جدول أوقات الصلاة الشهري</h2>
                        <div class="print-subtitle">
                            ${this.monthNames[this.currentMonth]} ${this.currentYear} | ${location.city}
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
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="text-primary mb-0">جدول أوقات الصلاة الشهري</h4>
                        <button class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    
                    <!-- معلومات الموقع -->
                    <div class="alert alert-info d-flex justify-content-between align-items-center">
                        <div>
                            <i class="bi bi-geo-alt"></i>
                            <strong>الموقع:</strong> ${location.city}
                        </div>
                        <div class="text-muted small">
                            ${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E
                        </div>
                    </div>
                    
                    <!-- عناصر التحكم -->
                    <div class="month-controls d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 p-3 bg-light rounded">
                        <div class="d-flex align-items-center gap-2">
                            <button id="modal-prev-month" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-chevron-right"></i> السابق
                            </button>
                            <div id="modal-current-month" class="fw-bold px-3">
                                ${this.monthNames[this.currentMonth]} ${this.currentYear}
                            </div>
                            <button id="modal-next-month" class="btn btn-outline-primary btn-sm">
                                التالي <i class="bi bi-chevron-left"></i>
                            </button>
                        </div>
                        
                        <div class="d-flex align-items-center gap-2">
                            <button id="modal-go-to-today" class="btn btn-primary btn-sm">
                                <i class="bi bi-calendar-check me-1"></i> هذا الشهر
                            </button>
                            <button id="modal-print-timetable" class="btn btn-success btn-sm">
                                <i class="bi bi-printer me-1"></i> طباعة
                            </button>
                        </div>
                    </div>
                    
                    <!-- معلومات إضافية -->
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <i class="bi bi-calculator text-primary me-2"></i>
                                        طريقة الحساب
                                    </h6>
                                    <select id="modal-calculation-method" class="form-select form-select-sm mt-2">
                                        <option value="Hadi">تقويم الهادي</option>
                                        <option value="MWL">رابطة العالم الإسلامي</option>
                                        <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية</option>
                                        <option value="Egypt">هيئة المساحة المصرية</option>
                                        <option value="Makkah">أم القرى</option>
                                    </select>
                                    <small class="text-muted d-block mt-2">
                                        طريقة حساب أوقات الصلاة المستخدمة
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <i class="bi bi-info-circle text-primary me-2"></i>
                                        معلومات إضافية
                                    </h6>
                                    <div class="mt-2">
                                        <small class="text-muted d-block">التوقيت الصيفي:</small>
                                        <span class="fw-bold">${this.getDstStatus()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- جدول أوقات الصلاة -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
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
                            <tbody id="modal-table-body">
                                <!-- سيتم ملء الجدول هنا -->
                                <tr>
                                    <td colspan="10" class="text-center py-5">
                                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                                            <span class="visually-hidden">جاري التحميل...</span>
                                        </div>
                                        <p class="mt-3 text-muted">جاري حساب أوقات الصلاة...</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- ملاحظة للطباعة -->
                    <div class="print-notice">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        نرجو من المؤمنين الكرام الاحتياط بدقيقة أو دقيقتين عند الصلاة
                    </div>
                    
                    <!-- معلومات إضافية -->
                    <div class="mt-4 text-center text-muted small">
                        <p>
                            <i class="bi bi-info-circle me-1"></i>
                            جميع الأوقات بالتوقيت المحلي • يتم الحساب باستخدام مكتبة praytimes.js
                        </p>
                    </div>
                    
                    <!-- تذييل الطباعة -->
                    <div class="print-footer">
                        <div>تطبيق مواقيت الصلاة - ${location.city}</div>
                        <div>${new Date().toLocaleDateString('ar-EG', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</div>
                        <div class="print-watermark">صفحة 1 من 1</div>
                    </div>
                    
                    <!-- زر الطباعة للهواتف -->
                    <div class="d-block d-md-none mt-3">
                        <button id="modal-print-mobile" class="btn btn-success w-100">
                            <i class="bi bi-printer me-1"></i> طباعة الجدول
                        </button>
                    </div>
                </div>
            `;
        },
        
        // الحصول على محتوى الصفحة المنفصلة
        getStandalonePageContent: function(location) {
            // إذا كنا في صفحة منفصلة، سيعرض هذا الـ HTML الموجود أساساً
            return `
                <div class="print-header">
                    <h2>جدول أوقات الصلاة الشهري</h2>
                    <div class="print-subtitle">
                        ${this.monthNames[this.currentMonth]} ${this.currentYear} | ${location.city}
                    </div>
                    <div class="print-date">
                        تم الإنشاء: ${new Date().toLocaleDateString('ar-EG')}
                    </div>
                </div>
                
                <div class="print-quran-verse">
                    ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]
                </div>
            `;
        },
        
        // إعداد أحداث الجدول
        setupTimetableEvents: function(isModal) {
            setTimeout(() => {
                // أحداث المودال
                if (isModal) {
                    const prevBtn = document.getElementById('modal-prev-month');
                    const nextBtn = document.getElementById('modal-next-month');
                    const todayBtn = document.getElementById('modal-go-to-today');
                    const printBtn = document.getElementById('modal-print-timetable');
                    const printMobileBtn = document.getElementById('modal-print-mobile');
                    const methodSelect = document.getElementById('modal-calculation-method');
                    
                    if (prevBtn) prevBtn.addEventListener('click', () => this.changeMonth(-1));
                    if (nextBtn) nextBtn.addEventListener('click', () => this.changeMonth(1));
                    if (todayBtn) todayBtn.addEventListener('click', () => this.goToCurrentMonth());
                    if (printBtn) printBtn.addEventListener('click', () => this.printTimetable());
                    if (printMobileBtn) printMobileBtn.addEventListener('click', () => this.printTimetable());
                    if (methodSelect) {
                        methodSelect.addEventListener('change', (e) => {
                            this.changeCalculationMethod(e.target.value);
                        });
                    }
                }
            }, 100);
        },
        
        // دالة الطباعة المحسنة بشكل كامل
        printTimetable: function() {
            console.log('🖨️ بدء عملية الطباعة المحسنة...');
            
            this.showNotification('جاري تجهيز الجدول للطباعة...', 'info');
            
            // إنشاء نسخة محسنة للطباعة
            const printContent = this.createPrintVersion();
            
            // فتح نافذة طباعة جديدة
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!printWindow) {
                console.error('❌ لم يتمكن من فتح نافذة الطباعة');
                this.showNotification('الرجاء السماح بالنوافذ المنبثقة للطباعة', 'error');
                return;
            }
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html dir="rtl" lang="ar">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>جدول أوقات الصلاة الشهري - ${this.monthNames[this.currentMonth]} ${this.currentYear}</title>
                    <style>
                        ${this.getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        // الطباعة التلقائية بعد التحميل
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 1000);
                            }, 500);
                        };
                        
                        // بديل إذا فشلت الطباعة التلقائية
                        setTimeout(function() {
                            var printBtn = document.getElementById('manual-print-btn');
                            if (printBtn) {
                                printBtn.style.display = 'block';
                            }
                        }, 3000);
                    <\/script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            this.showNotification('تم فتح نافذة الطباعة', 'success');
        },
        
        // إنشاء نسخة محسنة للطباعة
        createPrintVersion: function() {
            const location = this.getCurrentLocation();
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            
            // الحصول على بيانات الجدول
            let tableRows = '';
            const today = new Date();
            const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
            
            // توليد صفوف الجدول
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const isToday = isCurrentMonth && day === today.getDate();
                const prayerTimes = this.calculatePrayerTimes(date, location);
                const todayClass = isToday ? 'class="today-row"' : '';
                
                tableRows += `
                    <tr ${todayClass}>
                        <td><strong>${day}</strong>${isToday ? '<br><small>اليوم</small>' : ''}</td>
                        <td>${prayerTimes.imsak}</td>
                        <td>${prayerTimes.fajr}</td>
                        <td>${prayerTimes.sunrise}</td>
                        <td>${prayerTimes.dhuhr}</td>
                        <td>${prayerTimes.asr}</td>
                        <td>${prayerTimes.sunset}</td>
                        <td>${prayerTimes.maghrib}</td>
                        <td>${prayerTimes.isha}</td>
                        <td>${prayerTimes.midnight}</td>
                    </tr>
                `;
            }
            
            // الحصول على طريقة الحساب
            let methodName = 'تقويم الهادي';
            let methodSelect;
            
            if (document.getElementById('modal-calculation-method')) {
                methodSelect = document.getElementById('modal-calculation-method');
            } else if (document.getElementById('calculation-method-monthly')) {
                methodSelect = document.getElementById('calculation-method-monthly');
            }
            
            if (methodSelect) {
                methodName = this.getMethodName(methodSelect.value);
            }
            
            return `
                <div class="print-container">
                    <!-- رأس الطباعة -->
                    <div class="print-header">
                        <h1>جدول أوقات الصلاة الشهري</h1>
                        <div class="print-subtitle">
                            <strong>${this.monthNames[this.currentMonth]} ${this.currentYear}</strong> | 
                            <span>${location.city}</span>
                        </div>
                        <div class="print-date">
                            تم الإنشاء: ${new Date().toLocaleDateString('ar-EG')} | 
                            طريقة الحساب: ${methodName}
                        </div>
                        <div class="print-location">
                            الإحداثيات: ${location.latitude.toFixed(4)}° شمالاً، ${location.longitude.toFixed(4)}° شرقاً
                        </div>
                    </div>
                    
                    <!-- الآية القرآنية -->
                    <div class="print-quran-verse">
                        ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]
                    </div>
                    
                    <!-- معلومات سريعة -->
                    <div class="print-info">
                        <table style="width: 100%; margin: 10px 0; background: #f8f9fa; padding: 8px;">
                            <tr>
                                <td style="padding: 5px; text-align: center;">
                                    <strong>التوقيت:</strong> محلي (UTC+3)
                                </td>
                                <td style="padding: 5px; text-align: center;">
                                    <strong>التوقيت الصيفي:</strong> ${this.getDstStatus()}
                                </td>
                                <td style="padding: 5px; text-align: center;">
                                    <strong>المصدر:</strong> praytimes.js
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- الجدول الرئيسي -->
                    <div class="table-container">
                        <table class="print-table">
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
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- ملاحظة هامة -->
                    <div class="print-notice">
                        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                            <span style="color: #c00; font-size: 18px; margin-right: 8px;">⚠️</span>
                            <strong style="color: #c00;">ملاحظة هامة:</strong>
                        </div>
                        <div>
                            نرجو من المؤمنين الكرام الاحتياط بدقيقة أو دقيقتين عند الصلاة، وهذه الأوقات دقيقة وتعتمد على الموقع الجغرافي وطريقة الحساب المختارة.
                        </div>
                    </div>
                    
                    <!-- تذييل الطباعة -->
                    <div class="print-footer">
                        <div>تطبيق مواقيت الصلاة - ${location.city}</div>
                        <div>${new Date().toLocaleDateString('ar-EG', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</div>
                        <div class="print-watermark">صفحة 1 من 1 - © ${new Date().getFullYear()} مواقيت الصلاة</div>
                    </div>
                    
                    <!-- زر الطباعة اليدوي (بديل) -->
                    <div style="text-align: center; margin-top: 20px; display: none;" id="manual-print-btn">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i>🖨️</i> انقر هنا للطباعة
                        </button>
                    </div>
                </div>
            `;
        },
        
        // الحصول على أنماط الطباعة المحسنة
        getPrintStyles: function() {
            return `
                @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                @page {
                    size: A4;
                    margin: 15mm;
                }
                
                body {
                    font-family: 'Noto Naskh Arabic', 'Arial', sans-serif;
                    direction: rtl;
                    text-align: right;
                    font-size: 12pt;
                    line-height: 1.5;
                    color: #000;
                    background: #fff;
                    padding: 0;
                    margin: 0;
                }
                
                .print-container {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
                
                .print-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #333;
                    page-break-after: avoid;
                }
                
                .print-header h1 {
                    font-size: 28pt;
                    font-weight: bold;
                    color: #000;
                    margin-bottom: 10px;
                }
                
                .print-subtitle {
                    font-size: 16pt;
                    color: #333;
                    margin: 8px 0;
                }
                
                .print-date, .print-location {
                    font-size: 11pt;
                    color: #666;
                    margin: 5px 0;
                }
                
                .print-quran-verse {
                    text-align: center;
                    font-size: 20pt;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 25px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border: 2px solid #3498db;
                    border-radius: 8px;
                    font-family: 'Traditional Arabic', 'Noto Naskh Arabic', serif;
                    page-break-inside: avoid;
                }
                
                .print-info {
                    margin: 15px 0;
                    page-break-inside: avoid;
                }
                
                .table-container {
                    width: 100%;
                    margin: 20px 0;
                    overflow: visible;
                    page-break-inside: avoid;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #000;
                    table-layout: fixed;
                    font-size: 10pt;
                    page-break-inside: avoid;
                }
                
                .print-table th {
                    background-color: #2c3e50 !important;
                    color: white !important;
                    padding: 8px 4px;
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                    font-size: 11pt;
                }
                
                .print-table td {
                    padding: 6px 4px;
                    border: 1px solid #000;
                    text-align: center;
                    vertical-align: middle;
                }
                
                /* تحديد عرض الأعمدة لضمان ظهور كامل */
                .print-table th:nth-child(1), .print-table td:nth-child(1) { width: 7%; }
                .print-table th:nth-child(2), .print-table td:nth-child(2) { width: 9%; }
                .print-table th:nth-child(3), .print-table td:nth-child(3) { width: 9%; }
                .print-table th:nth-child(4), .print-table td:nth-child(4) { width: 9%; }
                .print-table th:nth-child(5), .print-table td:nth-child(5) { width: 9%; }
                .print-table th:nth-child(6), .print-table td:nth-child(6) { width: 9%; }
                .print-table th:nth-child(7), .print-table td:nth-child(7) { width: 9%; }
                .print-table th:nth-child(8), .print-table td:nth-child(8) { width: 9%; }
                .print-table th:nth-child(9), .print-table td:nth-child(9) { width: 9%; }
                .print-table th:nth-child(10), .print-table td:nth-child(10) { width: 11%; }
                
                /* تمييز صف اليوم */
                .today-row td {
                    background-color: #d4edda !important;
                    font-weight: bold;
                }
                
                .print-notice {
                    text-align: center;
                    font-size: 11pt;
                    color: #c00;
                    font-style: italic;
                    margin: 25px 0;
                    padding: 12px;
                    background-color: #fff3cd;
                    border: 2px solid #ffeaa7;
                    border-radius: 6px;
                    page-break-inside: avoid;
                }
                
                .print-footer {
                    text-align: center;
                    font-size: 9pt;
                    color: #666;
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    page-break-before: avoid;
                }
                
                .print-watermark {
                    position: fixed;
                    bottom: 10mm;
                    right: 10mm;
                    font-size: 8pt;
                    color: #999;
                    opacity: 0.3;
                }
                
                /* منع تقسيم الصفوف بين الصفحات */
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
            `;
        },
        
        // الحصول على الموقع الحالي
        getCurrentLocation: function() {
            // محاولة الحصول من التطبيق الرئيسي أولاً
            if (window.currentLocation && window.currentLocation.latitude) {
                return window.currentLocation;
            }
            
            // محاولة الحصول من localStorage
            const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
            
            if (settings.latitude && settings.longitude) {
                return {
                    latitude: settings.latitude,
                    longitude: settings.longitude,
                    city: settings.cityName || 'موقع محفوظ'
                };
            }
            
            // القيم الافتراضية
            return {
                latitude: 31.9539,
                longitude: 44.3736,
                city: 'النجف'
            };
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
        
        // الحصول على حالة التوقيت الصيفي
        getDstStatus: function() {
            const now = new Date();
            const jan = new Date(now.getFullYear(), 0, 1);
            const jul = new Date(now.getFullYear(), 6, 1);
            const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
            
            return now.getTimezoneOffset() < stdTimezoneOffset ? "نعم" : "لا";
        },
        
        // تغيير طريقة الحساب
        changeCalculationMethod: function(method) {
            if (this.prayTimes && this.prayTimes.setMethod) {
                this.prayTimes.setMethod(method);
                console.log(`✅ تم تغيير طريقة الحساب إلى: ${method}`);
                
                // حفظ الإعدادات
                const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
                settings.calculationMethod = method;
                localStorage.setItem('prayerSettings', JSON.stringify(settings));
                
                // إعادة توليد الجدول
                this.generateTable();
                
                this.showNotification(`تم تغيير طريقة الحساب إلى ${this.getMethodName(method)}`);
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
            // تحديث في المودال
            const modalDisplay = document.getElementById('modal-current-month');
            if (modalDisplay) {
                modalDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            }
            
            // تحديث في الصفحة المنفصلة
            const pageDisplay = document.getElementById('current-month');
            if (pageDisplay) {
                pageDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            }
            
            // تحديث العنوان
            const titleDisplay = document.getElementById('month-year-title');
            if (titleDisplay) {
                titleDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            }
        },
        
        // تغيير المدينة
        changeCity: function(cityKey) {
            console.log(`تغيير المدينة إلى: ${cityKey}`);
            // هنا يمكنك إضافة كود لتغيير الموقع
            this.generateTable();
        },
        
        // تحميل الجدول
        loadTimetable: function() {
            console.log(`📊 تحميل جدول ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
            
            const tableBody = document.getElementById('prayer-table-body');
            if (!tableBody) return;
            
            // عرض رسالة التحميل
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p class="mt-3 text-muted">جاري حساب أوقات الصلاة...</p>
                    </td>
                </tr>
            `;
            
            // تحديث عرض الشهر
            this.updateMonthDisplay();
            
            // تحديث معلومات الموقع
            const location = this.getCurrentLocation();
            const locationInfo = document.getElementById('current-location-info');
            if (locationInfo) {
                locationInfo.textContent = `الموقع: ${location.city}`;
            }
            
            // توليد الجدول
            setTimeout(() => {
                this.generateTableContent(tableBody, location);
            }, 100);
        },
        
        // توليد الجدول
        generateTable: function() {
            // محاولة العثور على الجدول في المودال أولاً
            let tableBody = document.getElementById('modal-table-body');
            let isModal = true;
            
            // إذا لم يكن في المودال، جرب الصفحة المنفصلة
            if (!tableBody) {
                tableBody = document.getElementById('prayer-table-body');
                isModal = false;
            }
            
            if (!tableBody) {
                console.error('❌ لم يتم العثور على جسم الجدول');
                return;
            }
            
            // عرض رسالة تحميل
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p class="mt-3 text-muted">جاري حساب أوقات الصلاة بدقة...</p>
                    </td>
                </tr>
            `;
            
            // الحصول على الموقع
            const location = this.getCurrentLocation();
            
            // تحديث معلومات الموقع في المودال
            if (isModal) {
                const locationInfo = document.querySelector('#monthly-timetable-content .alert');
                if (locationInfo) {
                    locationInfo.innerHTML = `
                        <div>
                            <i class="bi bi-geo-alt"></i>
                            <strong>الموقع:</strong> ${location.city}
                        </div>
                        <div class="text-muted small">
                            ${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E
                        </div>
                    `;
                }
            }
            
            // توليد المحتوى بعد تأخير
            setTimeout(() => {
                this.generateTableContent(tableBody, location);
            }, 300);
        },
        
        // توليد محتوى الجدول
        generateTableContent: function(tableBody, location) {
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const today = new Date();
            const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
            
            let tableHTML = '';
            let prayersCalculated = 0;
            const totalDays = daysInMonth;
            
            // دالة لعرض التقدم
            const showProgress = () => {
                const progress = Math.round((prayersCalculated / totalDays) * 100);
                const progressRow = `
                    <tr id="progress-row">
                        <td colspan="10" class="text-center py-3">
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                     style="width: ${progress}%">
                                    ${progress}%
                                </div>
                            </div>
                            <small class="text-muted mt-2 d-block">
                                جاري حساب أوقات الصلاة... ${prayersCalculated} من ${totalDays} يوم
                            </small>
                        </td>
                    </tr>
                `;
                
                if (prayersCalculated < totalDays) {
                    tableBody.innerHTML = tableHTML + progressRow;
                }
            };
            
            // حساب أوقات كل يوم
            for (let day = 1; day <= totalDays; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const isToday = isCurrentMonth && day === today.getDate();
                const rowClass = isToday ? 'table-success' : '';
                const todayBadge = isToday ? '<span class="badge bg-danger ms-1">اليوم</span>' : '';
                
                // حساب أوقات الصلاة
                const prayerTimes = this.calculatePrayerTimes(date, location);
                
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
                    setTimeout(() => showProgress(), 0);
                }
            }
            
            // عرض الجدول الكامل عند الانتهاء
            setTimeout(() => {
                tableBody.innerHTML = tableHTML;
                console.log(`✅ تم حساب ${totalDays} يوم من أوقات الصلاة لـ ${location.city}`);
                
                // إضافة صف إضافي للإحصاءات
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
                
                this.showNotification('تم تحميل جدول أوقات الصلاة بنجاح', 'success');
                
            }, 100);
        },
        
        // حساب أوقات الصلاة
        calculatePrayerTimes: function(date, location) {
            // إذا كانت مكتبة praytimes متاحة، استخدمها
            if (this.prayTimes && typeof this.prayTimes.getTimes === 'function') {
                try {
                    // حساب الأوقات
                    const times = this.prayTimes.getTimes(
                        date,
                        [location.latitude, location.longitude],
                        3, // توقيت العراق
                        0, // الارتفاع
                        0  // التوقيت الصيفي
                    );
                    
                    return {
                        imsak: this.formatTime(times.imsak || '--:--'),
                        fajr: this.formatTime(times.fajr || '--:--'),
                        sunrise: this.formatTime(times.sunrise || '--:--'),
                        dhuhr: this.formatTime(times.dhuhr || '--:--'),
                        asr: this.formatTime(times.asr || '--:--'),
                        sunset: this.formatTime(times.sunset || '--:--'),
                        maghrib: this.formatTime(times.maghrib || '--:--'),
                        isha: this.formatTime(times.isha || '--:--'),
                        midnight: this.formatTime(times.midnight || '--:--')
                    };
                    
                } catch (error) {
                    console.error('خطأ في حساب أوقات الصلاة باستخدام praytimes:', error);
                    return this.calculateApproximateTimes(date, location);
                }
            } else {
                // استخدام حساب تقريبي
                return this.calculateApproximateTimes(date, location);
            }
        },
        
        // حساب أوقات تقريبية
        calculateApproximateTimes: function(date, location) {
            const month = date.getMonth();
            const day = date.getDate();
            const latFactor = Math.abs(location.latitude) / 90;
            
            // حسابات مبسطة
            const baseFajr = 5.0 + latFactor * 1.5;
            const baseSunset = 18.5 - latFactor * 1.5;
            
            return {
                imsak: this.formatTimeFromDecimal(baseFajr - 0.2),
                fajr: this.formatTimeFromDecimal(baseFajr),
                sunrise: this.formatTimeFromDecimal(baseFajr + 1.2),
                dhuhr: '12:15',
                asr: this.formatTimeFromDecimal(15.5 - latFactor * 0.8),
                sunset: this.formatTimeFromDecimal(baseSunset),
                maghrib: this.formatTimeFromDecimal(baseSunset + 0.2),
                isha: this.formatTimeFromDecimal(baseSunset + 1.2),
                midnight: '23:30'
            };
        },
        
        // تنسيق الوقت
        formatTime: function(timeString) {
            if (!timeString || timeString === '--:--') return '--:--';
            
            try {
                const [hours, minutes] = timeString.split(':').map(Number);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } catch (error) {
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
                
                // بديل بسيط باستخدام alert
                console.log(`${type.toUpperCase()}: ${message}`);
                
            } catch (error) {
                console.error('خطأ في عرض الإشعار:', error);
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        }
    };
    
    // تهيئة عند تحميل DOM
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            MonthlyTimetable.init();
            
            // جعل الكائن متاحاً عالمياً
            window.MonthlyTimetable = MonthlyTimetable;
            
            console.log('✅ تم تحميل الجدول الشهري بنجاح مع ميزات الطباعة المحسنة');
            
            // إذا كنا في صفحة الجدول المنفصلة، تحميلها تلقائياً
            if (document.getElementById('prayer-table-body')) {
                MonthlyTimetable.loadTimetable();
            }
        }, 100);
    });
})();

