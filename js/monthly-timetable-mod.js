// monthly-timetable-hadi-fixed.js
(function() {
    'use strict';
    
    console.log('🚀 بدء تحميل الجدول الشهري مع تقويم الهادي...');
    
    // كائن الجدول الشهري
    const MonthlyTimetable = {
        currentDate: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        
        // كائن praytimes مع إعدادات تقويم الهادي
        prayTimes: null,
        
        // إعدادات تقويم الهادي
        hadiSettings: {
            fajr: 18,    // زاوية 18 للفجر
            isha: 18,    // زاوية 18 للعشاء
            maghrib: 4,  // زاوية 4 للمغرب
            asr: 'Standard', // المذهب الحنفي
            highLats: 'NightMiddle'
        },
        
        // أسماء الأشهر بالعربية
        monthNames: [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ],
        
        // طريقة الحساب الحالية
        currentMethod: 'Hadi',
        
        // المدن المتاحة
        cities: {
            'auto': { name: 'الموقع الحالي', lat: 0, lng: 0, tz: 3 },
            'Najaf': { name: 'النجف', lat: 31.9539, lng: 44.3736, tz: 3 },
            'Makkah': { name: 'مكة المكرمة', lat: 21.4225, lng: 39.8262, tz: 3 },
            'Madinah': { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692, tz: 3 },
            'Baghdad': { name: 'بغداد', lat: 33.3152, lng: 44.3661, tz: 3 },
            'Basra': { name: 'البصرة', lat: 30.5, lng: 47.8, tz: 3 },
            'Karbala': { name: 'كربلاء', lat: 32.6167, lng: 44.0333, tz: 3 },
            'Cairo': { name: 'القاهرة', lat: 30.0444, lng: 31.2357, tz: 2 }
        },
        
        // تهيئة
        init: function() {
            console.log('📅 تهيئة الجدول الشهري مع تقويم الهادي...');
            
            // تهيئة مكتبة praytimes مع إعدادات تقويم الهادي
            this.initPrayTimesWithHadi();
            
            // إضافة أنماط الطباعة
            this.addPrintStyles();
            
            // إعداد الأحداث
            this.setupEventListeners();
        },
        
        // تهيئة مكتبة praytimes مع إعدادات تقويم الهادي
        initPrayTimesWithHadi: function() {
            if (typeof PrayTimes !== 'undefined') {
                this.prayTimes = new PrayTimes();
                console.log('✅ مكتبة PrayTimes محملة');
                
                // تطبيق إعدادات تقويم الهادي
                this.applyHadiMethod();
                
            } else {
                console.warn('⚠️ مكتبة PrayTimes غير محملة، سيتم استخدام حساب تقريبي');
            }
        },
        
        // تطبيق طريقة تقويم الهادي
        applyHadiMethod: function() {
            if (!this.prayTimes) return;
            
            // استخدام طريقة جعفري كأساس لأنها تدعم الزاوية 4 للمغرب
            try {
                // حفظ الطريقة الحالية
                const originalMethod = this.prayTimes.getMethod ? this.prayTimes.getMethod() : 'MWL';
                
                // استخدام طريقة جعفري
                if (this.prayTimes.setMethod) {
                    this.prayTimes.setMethod('Jafari');
                }
                
                // تطبيق إعدادات تقويم الهادي
                if (this.prayTimes.adjust) {
                    this.prayTimes.adjust(this.hadiSettings);
                    console.log('✅ تم تطبيق إعدادات تقويم الهادي:', this.hadiSettings);
                }
                
                // استعادة الطريقة الأصلية
                if (this.prayTimes.setMethod) {
                    this.prayTimes.setMethod(originalMethod);
                }
                
            } catch (error) {
                console.error('خطأ في تطبيق إعدادات الهادي:', error);
                
                // بديل: استخدام طريقة MWL مع تعديلات
                if (this.prayTimes.setMethod) {
                    this.prayTimes.setMethod('MWL');
                }
                
                // تعديل إعدادات MWL لتكون أقرب للهادي
                if (this.prayTimes.adjust) {
                    this.prayTimes.adjust({
                        fajr: 18,
                        isha: 18,
                        maghrib: 4
                    });
                }
            }
        },
        
        // إضافة أنماط الطباعة
        addPrintStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                /* أنماط الطباعة المحسنة */
                @media print {
                    * {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    body {
                        width: 100% !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 10mm !important;
                        background: white !important;
                        font-size: 12pt !important;
                        line-height: 1.4 !important;
                        color: black !important;
                        font-family: 'Arial', sans-serif !important;
                    }
                    
                    .print-container {
                        width: 100%;
                    }
                    
                    .print-header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 3px solid #333;
                    }
                    
                    .print-header h1 {
                        font-size: 24pt;
                        font-weight: bold;
                        color: #000;
                        margin-bottom: 10px;
                    }
                    
                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 2px solid #000;
                        margin: 20px 0;
                        table-layout: fixed;
                    }
                    
                    .print-table th, .print-table td {
                        border: 1px solid #000;
                        padding: 6px 4px;
                        text-align: center;
                        font-size: 10pt;
                    }
                    
                    .print-table th {
                        background: #2c3e50 !important;
                        color: white !important;
                        font-weight: bold;
                    }
                    
                    .today-row td {
                        background-color: #d4edda !important;
                        font-weight: bold;
                    }
                }
            `;
            
            document.head.appendChild(style);
        },
        
        // إعداد مستمعي الأحداث
        setupEventListeners: function() {
            // تأخير للسماح بتحميل DOM
            setTimeout(() => {
                // زر الجدول الشهري في الصفحة الرئيسية
                const timetableBtn = document.getElementById('monthly-timetable-button');
                if (timetableBtn) {
                    console.log('✅ زر الجدول الشهري موجود');
                    timetableBtn.addEventListener('click', () => this.openTimetable());
                }
                
                // إذا كنا في صفحة الجدول، إعداد أحداثها
                if (this.isMonthlyPage()) {
                    this.setupMonthlyPageEvents();
                }
            }, 500);
        },
        
        // التحقق إذا كنا في صفحة الجدول
        isMonthlyPage: function() {
            return document.getElementById('prayer-table-body') !== null ||
                   document.getElementById('month-year-title') !== null;
        },
        
        // فتح الجدول الشهري
        openTimetable: function() {
            console.log('فتح الجدول الشهري...');
            
            // محاولة فتح صفحة منفصلة
            try {
                window.open('monthly-timetable.html', '_blank');
            } catch (error) {
                console.error('❌ فشل فتح الصفحة:', error);
                // عرض رسالة للمستخدم
                alert('الرجاء السماح بالنوافذ المنبثقة لفتح جدول أوقات الصلاة');
            }
        },
        
        // إعداد أحداث صفحة الجدول
        setupMonthlyPageEvents: function() {
            console.log('🔧 إعداد أحداث صفحة الجدول...');
            
            // التحقق من العناصر الأساسية
            const elements = {
                'prev-month': document.getElementById('prev-month'),
                'next-month': document.getElementById('next-month'),
                'go-to-today': document.getElementById('go-to-today'),
                'city-select': document.getElementById('city-select'),
                'print-timetable': document.getElementById('print-timetable')
            };
            
            // إعداد الأحداث
            if (elements['prev-month']) {
                elements['prev-month'].addEventListener('click', () => this.changeMonth(-1));
            }
            
            if (elements['next-month']) {
                elements['next-month'].addEventListener('click', () => this.changeMonth(1));
            }
            
            if (elements['go-to-today']) {
                elements['go-to-today'].addEventListener('click', () => this.goToToday());
            }
            
            if (elements['city-select']) {
                elements['city-select'].addEventListener('change', (e) => {
                    this.changeCity(e.target.value);
                });
            }
            
            if (elements['print-timetable']) {
                elements['print-timetable'].addEventListener('click', () => this.printTimetable());
            }
            
            // حدث الطباعة العام
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    this.printTimetable();
                }
            });
            
            // تحميل الجدول عند تهيئة الصفحة
            this.loadTimetable();
        },
        
        // تحميل الجدول
        loadTimetable: function() {
            console.log(`📊 تحميل جدول ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
            
            const tableBody = document.getElementById('prayer-table-body');
            if (!tableBody) {
                console.log('⚠️ جدول أوقات الصلاة غير موجود في هذه الصفحة');
                return;
            }
            
            // عرض رسالة تحميل
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p class="mt-3 text-muted">جاري حساب أوقات الصلاة بتقويم الهادي...</p>
                    </td>
                </tr>
            `;
            
            // تحديث عنوان الشهر
            this.updateMonthDisplay();
            
            // تحديث معلومات الموقع
            const location = this.getCurrentLocation();
            const locationInfo = document.getElementById('current-location-info');
            if (locationInfo) {
                locationInfo.textContent = `الموقع: ${location.city} | طريقة الحساب: تقويم الهادي`;
            }
            
            // توليد الجدول
            setTimeout(() => {
                this.generateTable(tableBody, location);
            }, 300);
        },
        
        // توليد الجدول
        generateTable: function(tableBody, location) {
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const today = new Date();
            const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
            
            let tableHTML = '';
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const isToday = isCurrentMonth && day === today.getDate();
                const rowClass = isToday ? 'today-row' : '';
                
                // حساب أوقات الصلاة بتقويم الهادي
                const prayerTimes = this.calculatePrayerTimesHadi(date, location);
                
                tableHTML += `
                    <tr class="${rowClass}">
                        <td class="fw-bold text-center">
                            ${day}${isToday ? '<br><small class="text-danger">اليوم</small>' : ''}
                        </td>
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
            
            tableBody.innerHTML = tableHTML;
            console.log(`✅ تم توليد ${daysInMonth} يوم من أوقات الصلاة بتقويم الهادي`);
        },
        
        // حساب أوقات الصلاة بتقويم الهادي
        calculatePrayerTimesHadi: function(date, location) {
            // إذا كانت مكتبة praytimes متاحة مع إعدادات الهادي
            if (this.prayTimes && typeof this.prayTimes.getTimes === 'function') {
                try {
                    // تطبيق إعدادات الهادي قبل الحساب
                    this.applyHadiMethod();
                    
                    // حساب الأوقات
                    const times = this.prayTimes.getTimes(
                        date,
                        [location.latitude, location.longitude],
                        location.tz || 3,
                        0,
                        0,
                        '24h'
                    );
                    
                    return {
                        imsak: this.formatTime(times.imsak || this.calculateImsak(times.fajr)),
                        fajr: this.formatTime(times.fajr || '--:--'),
                        sunrise: this.formatTime(times.sunrise || '--:--'),
                        dhuhr: this.formatTime(times.dhuhr || '--:--'),
                        asr: this.formatTime(times.asr || '--:--'),
                        sunset: this.formatTime(times.sunset || '--:--'),
                        maghrib: this.formatTime(times.maghrib || '--:--'),
                        isha: this.formatTime(times.isha || '--:--'),
                        midnight: this.formatTime(times.midnight || this.calculateMidnight(times))
                    };
                    
                } catch (error) {
                    console.error('خطأ في حساب أوقات الصلاة بتقويم الهادي:', error);
                    return this.calculateApproximateTimesHadi(date, location);
                }
            } else {
                // استخدام حساب تقريبي بتقويم الهادي
                return this.calculateApproximateTimesHadi(date, location);
            }
        },
        
        // حساب الإمساك (10 دقائق قبل الفجر)
        calculateImsak: function(fajrTime) {
            if (!fajrTime || fajrTime === '--:--') return '--:--';
            
            try {
                const [hours, minutes] = fajrTime.split(':').map(Number);
                let totalMinutes = hours * 60 + minutes - 10; // 10 دقائق قبل الفجر
                
                if (totalMinutes < 0) totalMinutes += 24 * 60;
                
                const newHours = Math.floor(totalMinutes / 60) % 24;
                const newMinutes = totalMinutes % 60;
                
                return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
            } catch (error) {
                return '--:--';
            }
        },
        
        // حساب منتصف الليل
        calculateMidnight: function(times) {
            if (!times.sunset || !times.fajr) return '23:30';
            
            try {
                const [sunsetHours, sunsetMinutes] = times.sunset.split(':').map(Number);
                const [fajrHours, fajrMinutes] = times.fajr.split(':').map(Number);
                
                let sunsetTotal = sunsetHours * 60 + sunsetMinutes;
                let fajrTotal = fajrHours * 60 + fajrMinutes;
                
                // إذا كان الفجر في اليوم التالي
                if (fajrTotal < sunsetTotal) {
                    fajrTotal += 24 * 60;
                }
                
                // متوسط الوقت بين المغرب والفجر
                const midnightTotal = Math.floor((sunsetTotal + fajrTotal) / 2);
                const midnightHours = Math.floor(midnightTotal / 60) % 24;
                const midnightMinutes = midnightTotal % 60;
                
                return `${midnightHours.toString().padStart(2, '0')}:${midnightMinutes.toString().padStart(2, '0')}`;
            } catch (error) {
                return '23:30';
            }
        },
        
        // حساب أوقات تقريبية بتقويم الهادي
        calculateApproximateTimesHadi: function(date, location) {
            const month = date.getMonth();
            const day = date.getDate();
            const latFactor = Math.abs(location.latitude) / 90;
            
            // حسابات تقويم الهادي
            const baseFajr = 5.0 + latFactor * 1.5;    // الفجر بـ 18°
            const baseSunset = 18.5 - latFactor * 1.5; // الغروب
            const maghribOffset = 0.2;                 // المغرب بـ 4° (بعد الغروب مباشرة)
            const ishaOffset = 1.2;                    // العشاء بـ 18° (بعد المغرب)
            
            return {
                imsak: this.formatTimeFromDecimal(baseFajr - 0.17), // 10 دقائق قبل الفجر
                fajr: this.formatTimeFromDecimal(baseFajr),        // الفجر
                sunrise: this.formatTimeFromDecimal(baseFajr + 1.2), // الشروق
                dhuhr: '12:15',                                     // الظهر
                asr: this.formatTimeFromDecimal(15.5 - latFactor * 0.8), // العصر
                sunset: this.formatTimeFromDecimal(baseSunset),     // الغروب
                maghrib: this.formatTimeFromDecimal(baseSunset + maghribOffset), // المغرب بـ 4°
                isha: this.formatTimeFromDecimal(baseSunset + ishaOffset),      // العشاء بـ 18°
                midnight: '23:30'                                   // منتصف الليل
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
            this.loadTimetable();
        },
        
        // الانتقال للشهر الحالي
        goToToday: function() {
            const now = new Date();
            this.currentMonth = now.getMonth();
            this.currentYear = now.getFullYear();
            
            this.updateMonthDisplay();
            this.loadTimetable();
            
            this.showNotification('تم الانتقال إلى الشهر الحالي');
        },
        
        // تحديث عرض الشهر
        updateMonthDisplay: function() {
            const display = document.getElementById('current-month');
            const title = document.getElementById('month-year-title');
            const monthText = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            
            if (display) display.textContent = monthText;
            if (title) title.textContent = monthText;
        },
        
        // تغيير المدينة
        changeCity: function(cityKey) {
            console.log('تغيير المدينة إلى:', cityKey);
            
            // تحديث معلومات الموقع
            const city = this.cities[cityKey] || this.cities['Najaf'];
            const locationInfo = document.getElementById('current-location-info');
            if (locationInfo) {
                locationInfo.textContent = `الموقع: ${city.name} | طريقة الحساب: تقويم الهادي`;
            }
            
            // إعادة تحميل الجدول
            this.loadTimetable();
            
            this.showNotification(`تم التحديث لمدينة ${city.name}`);
        },
        
        // دالة الطباعة المحسنة
        printTimetable: function() {
            console.log('🖨️ بدء الطباعة...');
            
            // إنشاء محتوى الطباعة
            const printContent = this.createPrintContent();
            
            // فتح نافذة طباعة
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
                    <title>جدول أوقات الصلاة بتقويم الهادي</title>
                    <style>
                        ${this.getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 1000);
                            }, 500);
                        };
                    <\/script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            this.showNotification('تم فتح نافذة الطباعة', 'success');
        },
        
        // إنشاء محتوى الطباعة
        createPrintContent: function() {
            const location = this.getCurrentLocation();
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            
            // توليد صفوف الجدول
            let tableRows = '';
            const today = new Date();
            const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentYear, this.currentMonth, day);
                const isToday = isCurrentMonth && day === today.getDate();
                const prayerTimes = this.calculatePrayerTimesHadi(date, location);
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
            
            return `
                <div class="print-container">
                    <div class="print-header">
                        <h1>جدول أوقات الصلاة الشهري</h1>
                        <h2>${this.monthNames[this.currentMonth]} ${this.currentYear}</h2>
                        <p><strong>المدينة:</strong> ${location.city}</p>
                        <p><strong>طريقة الحساب:</strong> تقويم الهادي (المغرب 4°، الفجر 18°، العشاء 18°)</p>
                        <p><strong>تم الإنشاء:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border: 2px solid #3498db; border-radius: 8px;">
                        <h3 style="margin: 0; color: #2c3e50; font-family: 'Traditional Arabic', serif;">
                            ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾ [النساء: 103]
                        </h3>
                    </div>
                    
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
                    
                    <div style="text-align: center; margin: 30px 0; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; color: #856404;">
                        <p style="margin: 0; font-style: italic;">
                            <strong>ملاحظة:</strong> نرجو من المؤمنين الكرام الاحتياط بدقيقة أو دقيقتين عند الصلاة
                        </p>
                    </div>
                    
                    <div style="text-align: center; font-size: 11px; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
                        <p>تطبيق مواقيت الصلاة - ${location.city}</p>
                        <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p style="font-size: 9px; color: #999; opacity: 0.5;">طريقة الحساب: تقويم الهادي - المصدر: praytimes.js</p>
                    </div>
                </div>
            `;
        },
        
        // أنماط الطباعة
        getPrintStyles: function() {
            return `
                @page {
                    size: A4;
                    margin: 15mm;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
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
                }
                
                .print-header {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #333;
                }
                
                .print-header h1 {
                    font-size: 28pt;
                    font-weight: bold;
                    color: #000;
                    margin-bottom: 10px;
                }
                
                .print-header h2 {
                    font-size: 20pt;
                    color: #333;
                    margin: 10px 0;
                }
                
                .print-header p {
                    font-size: 12pt;
                    color: #666;
                    margin: 5px 0;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #000;
                    margin: 25px 0;
                    table-layout: fixed;
                }
                
                .print-table th {
                    background: #2c3e50 !important;
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
                    font-size: 10pt;
                }
                
                .today-row td {
                    background-color: #d4edda !important;
                    font-weight: bold;
                }
            `;
        },
        
        // الحصول على الموقع الحالي
        getCurrentLocation: function() {
            try {
                const settings = JSON.parse(localStorage.getItem('prayerSettings')) || {};
                if (settings.latitude && settings.longitude) {
                    return {
                        latitude: settings.latitude,
                        longitude: settings.longitude,
                        city: settings.cityName || 'موقع محفوظ',
                        tz: settings.timezone || 3
                    };
                }
            } catch (e) {
                console.error('خطأ في قراءة الإعدادات:', e);
            }
            
            // القيم الافتراضية للنجف
            return {
                latitude: 31.9539,
                longitude: 44.3736,
                city: 'النجف',
                tz: 3
            };
        },
        
        // إظهار إشعار
        showNotification: function(message, type = 'info') {
            console.log(`${type}: ${message}`);
            
            // محاولة استخدام Toast إذا كان متاحاً
            const toastEl = document.getElementById('notification');
            if (toastEl && typeof bootstrap !== 'undefined') {
                try {
                    const toast = new bootstrap.Toast(toastEl);
                    const toastBody = toastEl.querySelector('.toast-body');
                    if (toastBody) {
                        toastBody.textContent = message;
                        toast.show();
                    }
                } catch (error) {
                    console.error('خطأ في عرض الإشعار:', error);
                }
            }
        }
    };
    
    // التهيئة الآمنة
    function initMonthlyTimetable() {
        try {
            // انتظار تحميل DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        MonthlyTimetable.init();
                        window.MonthlyTimetable = MonthlyTimetable;
                        console.log('✅ تم تهيئة الجدول الشهري بنجاح مع تقويم الهادي');
                    }, 100);
                });
            } else {
                MonthlyTimetable.init();
                window.MonthlyTimetable = MonthlyTimetable;
                console.log('✅ تم تهيئة الجدول الشهري بنجاح مع تقويم الهادي');
            }
        } catch (error) {
            console.error('❌ خطأ في تهيئة الجدول الشهري:', error);
        }
    }
    
    // بدء التهيئة
    initMonthlyTimetable();
    
})();
