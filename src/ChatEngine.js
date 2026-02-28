export const getFlows = (projectName, goals = [], lang = 'ar') => {
    // Determine dynamic primary action string
    const getWaitAction = () => goals.includes('lead_gen') ? 'wait_for_lead' : 'wait_for_cs';

    const isAr = lang === 'ar';

    // Realistic Greeting Injectors (No Meta-Talk)
    let greetingExtra = '';
    if (goals.includes('delayed_replies')) {
        greetingExtra = ''; // Basic greeting is already fast and responsive
    } else if (goals.includes('appointments')) {
        greetingExtra = isAr ? 'يسعدنا مساعدتك في ترتيب وحجز مواعيدك بكل سهولة.\n\n' : 'We are happy to help you organize and book your appointments easily.\n\n';
    } else if (goals.includes('lost_sales')) {
        greetingExtra = isAr ? 'نحن هنا لاستقبال وتجهيز طلباتك في أي وقت.\n\n' : 'We are here to receive and process your orders anytime.\n\n';
    } else if (goals.includes('faq')) {
        greetingExtra = isAr ? 'جميع المعلومات التي تحتاجها متوفرة للإجابة على استفساراتك.\n\n' : 'All the information you need is available to answer your inquiries.\n\n';
    } else if (goals.includes('lead_gen')) {
        greetingExtra = isAr ? 'يسعدنا تواصلك لتقديم أفضل خدمة تناسب تطلعاتك.\n\n' : 'We are glad you contacted us to provide the best service for your needs.\n\n';
    }

    const baseFlows = {
        restaurant: {
            greeting1: isAr ? `يا هلا ومسهلا فيك بمطعم ${projectName} 🍔 نورتنا!` : `Welcome to ${projectName} 🍔!`,
            greeting2: greetingExtra + (isAr
                ? (goals.includes('sales') ? 'شنو حاب تطلب اليوم من المنيو؟' : 'شلون نقدر نخدمك اليوم؟')
                : (goals.includes('sales') ? 'What would you like to order today?' : 'How can we help you today?')),
            buttons: isAr ? ['استفسار عن المنيو', 'تتبع الطلب الحالي', 'حجز طاولة', '📍 أرسل الموقع'] : ['Menu Inquiry', 'Track Order', 'Book a Table', '📍 Send Location'],
            responses: isAr ? {
                'استفسار عن المنيو': { text: 'تفضل هذا المنيو حقنا 📋 تبي تطلب شي؟', buttons: ['اي بطلب', 'لا بس اتصفح', '📍 أرسل الموقع'], narrator: 'يتم عرض قائمة الطعام والتفاعل مع العميل 🍔' },
                'اي بطلب': { action: 'wait_for_cs', text: 'يا ليت تكتب لنا طلبك 📝', buttons: [], narrator: 'النظام يحول المحادثة لتسجيل الطلبات 📝' },
                'لا بس اتصفح': { text: 'حياك الله بأي وقت ونتشرف بخدمتك!', end_demo: true },
                'تتبع الطلب الحالي': { text: 'طلبك قيد التجهيز وبنسلمه للمندوب قريب 🛵', end_demo: true, narrator: 'يوفر النظام حالة الطلب بشكل آلي 📦' },
                'حجز طاولة': { text: 'خوش! جم عدد الأشخاص؟', buttons: ['١-٢', '٣-٤', '٥+'], narrator: 'يجمع النظام تفاصيل الحجز بدقة 🗓️' },
                '١-٢': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت (مثال: اليوم الساعة ٨ بالليل):', buttons: [], narrator: 'يسأل النظام عن موعد الحجز 🕒' },
                '٣-٤': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت (مثال: اليوم الساعة ٨ بالليل):', buttons: [], narrator: 'يسأل النظام عن موعد الحجز 🕒' },
                '٥+': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت (مثال: باجر الساعة ٧ بالليل):', buttons: [], narrator: 'يسأل النظام عن موعد الحجز 🕒' },
                '📍 أرسل الموقع': { text: `حياك الله! موقعنا يقع في قلب العاصمة.\n📍 رابط خرائط جوجل: https://maps.app.goo.gl/location`, end_demo: true, narrator: 'يتم مشاركة الموقع والاتجاهات آلياً 📍' }
            } : {
                'Menu Inquiry': { text: 'Here is our menu 📋 Would you like to order?', buttons: ['Yes, I want to order', 'Just browsing', '📍 Send Location'], narrator: 'Displays menu and interacts 🍔' },
                'Yes, I want to order': { action: 'wait_for_cs', text: 'Please write your order 📝', buttons: [], narrator: 'Routes to order taking 📝' },
                'Just browsing': { text: 'You are welcome anytime!', end_demo: true },
                'Track Order': { text: 'Your order is being prepared and will be handled by our driver soon 🛵', end_demo: true, narrator: 'Automated order status 📦' },
                'Book a Table': { text: 'Great! How many people?', buttons: ['1-2', '3-4', '5+'], narrator: 'Collects booking details 🗓️' },
                '1-2': { action: 'wait_for_time', text: 'Please specify the time (e.g., Today at 8 PM):', buttons: [], narrator: 'Asks for time input 🕒' },
                '3-4': { action: 'wait_for_time', text: 'Please specify the time (e.g., Today at 8 PM):', buttons: [], narrator: 'Asks for time input 🕒' },
                '5+': { action: 'wait_for_time', text: 'Please specify the time (e.g., Tomorrow at 7 PM):', buttons: [], narrator: 'Asks for time input 🕒' },
                '📍 Send Location': { text: `Welcome! We are located in the heart of the capital.\n📍 Google Maps Link: https://maps.app.goo.gl/location`, end_demo: true, narrator: 'Shares location automatically 📍' }
            }
        },
        ecommerce: {
            greeting1: isAr ? `يا هلا بك بمتجر ${projectName} 🛍️` : `Welcome to ${projectName} Store 🛍️`,
            greeting2: greetingExtra + (isAr ? `شلون نقدر نخدمك اليوم؟` : `How can we serve you today?`),
            buttons: isAr ? ['تصفح الأقسام', 'تتبع الطلب', 'تحدث مع خدمة العملاء'] : ['Browse Categories', 'Track Order', 'Customer Service'],
            responses: isAr ? {
                'تصفح الأقسام': { text: 'عندنا تشكيلة روعة! اختار القسم اللي تبيه:', buttons: ['إلكترونيات 📱', 'عطور وتجميل 💅', 'أزياء وملابس 👕'], narrator: 'مسار تفاعلي لعرض المنتجات 🛍️' },
                'إلكترونيات 📱': { text: 'اختيار ممتاز! 🔥 تبي نعتمد الطلب ونوصله لك؟', buttons: ['اعتماد وتوصيل 🚚', 'الاستلام من الفرع'], narrator: 'يسأل العميل عن التوصيل 🛵' },
                'عطور وتجميل 💅': { text: 'اختيار ممتاز! 🔥 تبي نعتمد الطلب ونوصله لك؟', buttons: ['اعتماد وتوصيل 🚚', 'الاستلام من الفرع'], narrator: 'يسأل العميل عن التوصيل 🛵' },
                'أزياء وملابس 👕': { text: 'اختيار ممتاز! 🔥 تبي نعتمد الطلب ونوصله لك؟', buttons: ['اعتماد وتوصيل 🚚', 'الاستلام من الفرع'], narrator: 'يسأل العميل عن التوصيل 🛵' },
                'الاستلام من الفرع': { text: 'حياك الله! تقدر تستلم طلبك من فرعنا الرئيسي.', end_demo: true },
                'اعتماد وتوصيل 🚚': { text: 'دز لنا اللوكيشن عشان نوصل لك الطلب 📍', buttons: ['دز اللوكيشن 📍'], narrator: 'يطلب النظام تحديد الموقع 📍' },
                'دز اللوكيشن 📍': { action: 'generate_order_number', text: (orderNumber) => `تم! طلبك تسجل برقم #ORD-${orderNumber}\n⏳ التوصيل راح يكون خلال 24 ساعة.`, end_demo: true, narrator: 'يتم إصدار رقم الطلب ✅' },
                'تتبع الطلب': { text: 'طلبك قيد التجهيز بمستودعاتنا 📦 وبنسلمه لشركة الشحن قريب.', end_demo: true, narrator: 'تغذية راجعة للطلب 📦' },
                'تحدث مع خدمة العملاء': { action: 'wait_for_cs', text: 'اكتب استفسارك، وبنرد عليك بأقرب وقت 📝', buttons: [], narrator: 'تحويل للموظف 👨‍💻' }
            } : {
                'Browse Categories': { text: 'We have a great selection! Choose a category:', buttons: ['Electronics 📱', 'Perfumes & Beauty 💅', 'Fashion & Clothing 👕'], narrator: 'Interactive product display 🛍️' },
                'Electronics 📱': { text: 'Excellent choice! 🔥 Confirm and deliver?', buttons: ['Confirm & Deliver 🚚', 'Store Pickup'], narrator: 'Asks for delivery options 🛵' },
                'Perfumes & Beauty 💅': { text: 'Excellent choice! 🔥 Confirm and deliver?', buttons: ['Confirm & Deliver 🚚', 'Store Pickup'], narrator: 'Asks for delivery options 🛵' },
                'Fashion & Clothing 👕': { text: 'Excellent choice! 🔥 Confirm and deliver?', buttons: ['Confirm & Deliver 🚚', 'Store Pickup'], narrator: 'Asks for delivery options 🛵' },
                'Store Pickup': { text: 'You are welcome! You can pick up your order from our main branch.', end_demo: true },
                'Confirm & Deliver 🚚': { text: 'Send us your location to deliver your order 📍', buttons: ['Send Location 📍'], narrator: 'Asks for location 📍' },
                'Send Location 📍': { action: 'generate_order_number', text: (orderNumber) => `Done! Order confirmed ✅\n🧾 Order #: #ORD-${orderNumber}\n⏳ Delivery within 24 hours.`, end_demo: true, narrator: 'Generates order number ✅' },
                'Track Order': { text: 'Your order is being prepared and will be shipped soon. 📦', end_demo: true, narrator: 'Automated order status 📦' },
                'Customer Service': { action: 'wait_for_cs', text: 'Write your inquiry, and we will reply soon 📝', buttons: [], narrator: 'Routes to human agent 👨‍💻' }
            }
        },
        clinic: {
            greeting1: isAr ? `أهلاً بك في ${projectName}. نحن هنا لرعايتك.` : `Welcome to ${projectName}. We are here for your care.`,
            greeting2: greetingExtra + (isAr ? `كيف يمكننا مساعدتك اليوم؟` : `How can we help you today?`),
            buttons: isAr ? ['حجز موعد طبي', 'الاستعلام عن النتائج', 'التحدث مع الاستقبال'] : ['Book Medical Appointment', 'Check Results', 'Talk to Reception'],
            responses: isAr ? {
                'حجز موعد طبي': { text: 'الرجاء اختيار التخصص المطلوب:', buttons: ['باطنية عامة', 'طب أسنان', 'جلدية وتجميل'], narrator: 'يجمع معلومات التخصص 🩺' },
                'باطنية عامة': { action: 'wait_for_time', text: 'الرجاء كتابة الوقت المناسب لك للحجز:', buttons: [], narrator: 'يسأل عن الموعد 🕒' },
                'طب أسنان': { action: 'wait_for_time', text: 'الرجاء كتابة الوقت المناسب لك للحجز:', buttons: [], narrator: 'يسأل عن الموعد 🕒' },
                'جلدية وتجميل': { action: 'wait_for_time', text: 'الرجاء كتابة الوقت المناسب لك للحجز:', buttons: [], narrator: 'يسأل عن الموعد 🕒' },
                'الاستعلام عن النتائج': { text: 'نتائجك جاهزة! يرجى التواصل مع طبيبك للمراجعة 🩺', end_demo: true, narrator: 'استعلام عن التحاليل 🔬' },
                'التحدث مع الاستقبال': { action: 'wait_for_cs', text: 'الرجاء كتابة استفسارك للرد عليها قريباً 📝', buttons: [], narrator: 'يحول للاستشارة 👨‍⚕️' }
            } : {
                'Book Medical Appointment': { text: 'Please select the required specialty:', buttons: ['Internal Medicine', 'Dentistry', 'Dermatology'], narrator: 'Collects specialty info 🩺' },
                'Internal Medicine': { action: 'wait_for_time', text: 'Please write your preferred time:', buttons: [], narrator: 'Asks for time 🕒' },
                'Dentistry': { action: 'wait_for_time', text: 'Please write your preferred time:', buttons: [], narrator: 'Asks for time 🕒' },
                'Dermatology': { action: 'wait_for_time', text: 'Please write your preferred time:', buttons: [], narrator: 'Asks for time 🕒' },
                'Check Results': { text: 'Your results are ready! Please contact your doctor for review 🩺', end_demo: true, narrator: 'Automated test results 🔬' },
                'Talk to Reception': { action: 'wait_for_cs', text: 'Please write your inquiry and we will reply soon 📝', buttons: [], narrator: 'Routes to reception 👨‍⚕️' }
            }
        },
        retail: {
            greeting1: isAr ? `أهلاً بك بمتجر ${projectName} 🛍️` : `Welcome to ${projectName} 🛍️`,
            greeting2: greetingExtra + (isAr ? `كيف يمكننا خدمتك اليوم؟` : `How can we serve you today?`),
            buttons: isAr ? ['العروض الحالية 🎁', 'تحدث مع المبيعات'] : ['Current Offers 🎁', 'Talk to Sales'],
            responses: isAr ? {
                'العروض الحالية 🎁': { text: 'عندنا خصومات 50%! نطرش لك الكتالوج؟', buttons: ['إي، طرش الكتالوج 📥', 'تحدث مع المبيعات'], narrator: 'تقديم العروض 🎁' },
                'إي، طرش الكتالوج 📥': { text: 'تم الإرسال! 📄 حاب تطلب منتج معين؟', buttons: ['طلب منتج 🛒', 'إنهاء التصفح'], narrator: 'إرسال الكتالوج 🛍️' },
                'طلب منتج 🛒': { text: 'دز اللوكيشن لتوصيل الطلب 📍', buttons: ['دز اللوكيشن 📍'], narrator: 'تحديد الموقع 📍' },
                'دز اللوكيشن 📍': { action: 'generate_order_number', text: (orderNumber) => `تم! طلبك تسجل برقم #SHP-${orderNumber}.`, end_demo: true, narrator: 'إصدار رقم الطلب ✅' },
                'إنهاء التصفح': { text: 'نتمنى لك وقتاً ممتعاً!', end_demo: true },
                'تحدث مع المبيعات': { action: 'wait_for_cs', text: 'اكتب استفسارك، وبنرد عليك فوراً 📝', buttons: [], narrator: 'تحويل للمبيعات 👨‍💻' }
            } : {
                'Current Offers 🎁': { text: 'We have up to 50% discounts! Send catalog?', buttons: ['Yes, send catalog 📥', 'Talk to Sales'], narrator: 'Presents offers 🎁' },
                'Yes, send catalog 📥': { text: 'Sent! 📄 Ready to order?', buttons: ['Order Product 🛒', 'End Browsing'], narrator: 'Sends product catalog 🛍️' },
                'Order Product 🛒': { text: 'Send your location for delivery 📍', buttons: ['Send Location 📍'], narrator: 'Asks for location 📍' },
                'Send Location 📍': { action: 'generate_order_number', text: (orderNumber) => `Done! Order #SHP-${orderNumber} confirmed.`, end_demo: true, narrator: 'Generates order number ✅' },
                'End Browsing': { text: 'Have a wonderful time!', end_demo: true },
                'Talk to Sales': { action: 'wait_for_cs', text: 'Write your inquiry, we will reply soon 📝', buttons: [], narrator: 'Routes to sales 👨‍💻' }
            }
        },
        other: {
            greeting1: isAr ? `أهلاً بك في ${projectName} ✨` : `Welcome to ${projectName} ✨`,
            greeting2: greetingExtra + (isAr ? `كيف نزودك بخدماتنا اليوم؟` : `How can we provide our services today?`),
            buttons: isAr ? ['تعرف على خدماتنا 🌟', 'حجز موعد 🗓️', 'خدمة العملاء'] : ['Discover Services 🌟', 'Book Appointment 🗓️', 'Customer Service'],
            responses: isAr ? {
                'تعرف على خدماتنا 🌟': { text: 'حاب نرسل لك ملفنا التعريفي؟', buttons: ['إي، أرسل الملف 📥', 'خدمة العملاء'], narrator: 'عرض المعلومات 🌟' },
                'إي، أرسل الملف 📥': { text: 'تم الإرسال! هل تود حجز موعد؟', buttons: ['حجز موعد 🗓️', 'إنهاء التصفح'], narrator: 'إرسال المستندات 📥' },
                'حجز موعد 🗓️': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت والموعد المناسب لك للحجز:', buttons: [], narrator: 'ميعاد الخدمة 🕒' },
                'إنهاء التصفح': { text: 'نتمنى لك وقتاً ممتعاً!', end_demo: true },
                'خدمة العملاء': { action: 'wait_for_cs', text: 'اكتب استفسارك، وسنرد أقرب وقت 📝', buttons: [], narrator: 'تحويل للمختص 👨‍💻' }
            } : {
                'Discover Services 🌟': { text: 'Would you like us to send our company profile?', buttons: ['Yes, send profile 📥', 'Customer Service'], narrator: 'Presenting info 🌟' },
                'Yes, send profile 📥': { text: 'Sent! Ready to book an appointment?', buttons: ['Book Appointment 🗓️', 'End Browsing'], narrator: 'Sends documents 📥' },
                'Book Appointment 🗓️': { action: 'wait_for_time', text: 'Please specify the suitable time and date:', buttons: [], narrator: 'Booking time 🕒' },
                'End Browsing': { text: 'Have a wonderful time!', end_demo: true },
                'Customer Service': { action: 'wait_for_cs', text: 'Write your inquiry, we will reply soon 📝', buttons: [], narrator: 'Routes to expert 👨‍💻' }
            }
        },
        travel: {
            greeting1: isAr ? `أهلاً بك في ${projectName}. كيف يمكننا ترتيب رحلتك؟` : `Welcome to ${projectName}. How can we arrange your trip?`,
            greeting2: greetingExtra + (isAr ? `تفضل باختيار الخدمة المطلوبة:` : `Please select the required service:`),
            buttons: isAr ? ['حجز تذاكر ✈️', 'عروض سياحية 🏖️', 'تعديل حجز حالي 📅'] : ['Book Flights ✈️', 'Tour Packages 🏖️', 'Modify Booking 📅'],
            responses: isAr ? {
                'حجز تذاكر ✈️': { text: 'وين وجهتك وجم عدد المسافرين؟', buttons: ['أوروبا 🌍', 'آسيا ⛩️', 'دول الخليج 🌴'], narrator: 'مسار التذاكر ✈️' },
                'أوروبا 🌍': { action: 'wait_for_time', text: 'حدد موعد سفرتك:', buttons: [], narrator: 'تفاصيل التواريخ 🕒' },
                'آسيا ⛩️': { action: 'wait_for_time', text: 'حدد موعد سفرتك:', buttons: [], narrator: 'تفاصيل التواريخ 🕒' },
                'دول الخليج 🌴': { action: 'wait_for_time', text: 'حدد موعد سفرتك:', buttons: [], narrator: 'تفاصيل التواريخ 🕒' },
                'عروض سياحية 🏖️': { text: 'عندنا باكجات شاملة! نطرش الكتالوج؟', buttons: ['إي، طرش الكتالوج 📥', 'تعديل حجز حالي 📅'], narrator: 'الباقات السياحية 🏖️' },
                'إي، طرش الكتالوج 📥': { text: 'تم الإرسال! حاب تحجز عرض مباشر؟', buttons: ['حجز عرض 🏖️', 'إنهاء التصفح'], narrator: 'إرسال العروض 📥' },
                'حجز عرض 🏖️': { action: 'wait_for_time', text: 'حدد التاريخ اللي يناسبك:', buttons: [], narrator: 'تواريخ العرض 🕒' },
                'إنهاء التصفح': { text: 'رحلة سعيدة!', end_demo: true },
                'تعديل حجز حالي 📅': { action: 'wait_for_cs', text: 'اكتب الرقم وسنساعدك 📝', buttons: [], narrator: 'تحويل لموظف الحجوزات 👨‍💻' }
            } : {
                'Book Flights ✈️': { text: 'What is your destination and number of passengers?', buttons: ['Europe 🌍', 'Asia ⛩️', 'GCC 🌴'], narrator: 'Ticket booking ✈️' },
                'Europe 🌍': { action: 'wait_for_time', text: 'Specify travel date:', buttons: [], narrator: 'Travel dates 🕒' },
                'Asia ⛩️': { action: 'wait_for_time', text: 'Specify travel date:', buttons: [], narrator: 'Travel dates 🕒' },
                'GCC 🌴': { action: 'wait_for_time', text: 'Specify travel date:', buttons: [], narrator: 'Travel dates 🕒' },
                'Tour Packages 🏖️': { text: 'We have amazing packages! Send catalog?', buttons: ['Yes, send catalog 📥', 'Modify Booking 📅'], narrator: 'Tour packages 🏖️' },
                'Yes, send catalog 📥': { text: 'Sent! Ready to book a package?', buttons: ['Book Package 🏖️', 'End Browsing'], narrator: 'Sends offers 📥' },
                'Book Package 🏖️': { action: 'wait_for_time', text: 'Specify your suitable date:', buttons: [], narrator: 'Package dates 🕒' },
                'End Browsing': { text: 'Have a happy trip!', end_demo: true },
                'Modify Booking 📅': { action: 'wait_for_cs', text: 'Write your inquiry here 📝', buttons: [], narrator: 'Routes to booking agent 👨‍💻' }
            }
        },
        consulting: {
            greeting1: isAr ? `أهلاً بك في ${projectName} للاستشارات 💡` : `Welcome to ${projectName} Consulting 💡`,
            greeting2: greetingExtra + (isAr ? `كيف نساعدك اليوم؟` : `How can we assist you today?`),
            buttons: isAr ? ['حجز استشارة 📅', 'التسجيل في الدورات 📚', 'خدمة العملاء'] : ['Book Consultation 📅', 'Register to Courses 📚', 'Customer Service'],
            responses: isAr ? {
                'حجز استشارة 📅': { text: 'اختار مجال الاستشارة اللي تحتاجه:', buttons: ['إدارية', 'مالية', 'تطوير ذاتي'], narrator: 'تخصص الاستشارة 🎯' },
                'إدارية': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت والموعد المناسب:', buttons: [], narrator: 'موعد الاستشارة 🕒' },
                'مالية': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت والموعد المناسب:', buttons: [], narrator: 'موعد الاستشارة 🕒' },
                'تطوير ذاتي': { action: 'wait_for_time', text: 'يا ليت تحدد الوقت والموعد المناسب:', buttons: [], narrator: 'موعد الاستشارة 🕒' },
                'التسجيل في الدورات 📚': { text: 'نطرش لك ملف الدورات التدريبية المتاحة؟', buttons: ['إي، أرسل الملف 📥', 'خدمة العملاء'], narrator: 'يعرض الدورات 📚' },
                'إي، أرسل الملف 📥': { text: 'تم الإرسال! 📄 هل تبي تسجل الحين؟', buttons: ['تسجيل في دورة ✍️', 'إنهاء التصفح'], narrator: 'مستند الدورات 📥' },
                'تسجيل في دورة ✍️': { action: 'wait_for_time', text: 'أرسل لنا اسم الدورة لنسجل لك 👍', buttons: [], narrator: 'بيانات التسجيل ✍️' },
                'إنهاء التصفح': { text: 'نتمنى لك التوفيق!', end_demo: true },
                'خدمة العملاء': { action: 'wait_for_cs', text: 'اكتب استفسارك للرد عليها 📝', buttons: [], narrator: 'المستشار 👨‍💻' }
            } : {
                'Book Consultation 📅': { text: 'Choose your consultation field:', buttons: ['Management', 'Financial', 'Self-dev'], narrator: 'Consultation info 🎯' },
                'Management': { action: 'wait_for_time', text: 'Please specify the suitable time:', buttons: [], narrator: 'Time selection 🕒' },
                'Financial': { action: 'wait_for_time', text: 'Please specify the suitable time:', buttons: [], narrator: 'Time selection 🕒' },
                'Self-dev': { action: 'wait_for_time', text: 'Please specify the suitable time:', buttons: [], narrator: 'Time selection 🕒' },
                'Register to Courses 📚': { text: 'Send you the available courses manual?', buttons: ['Yes, send manual 📥', 'Customer Service'], narrator: 'Presents courses 📚' },
                'Yes, send manual 📥': { text: 'Sent! 📄 Do you want to register now?', buttons: ['Register to Course ✍️', 'End Browsing'], narrator: 'Sends manual 📥' },
                'Register to Course ✍️': { action: 'wait_for_time', text: 'Send the course name to register 👍', buttons: [], narrator: 'Registration info ✍️' },
                'End Browsing': { text: 'Wishing you the best!', end_demo: true },
                'Customer Service': { action: 'wait_for_cs', text: 'Write your inquiry here 📝', buttons: [], narrator: 'Consultant agent 👨‍💻' }
            }
        }
    };

    // Deep Integration of Pain Points: Overriding Flows Dynamically
    Object.keys(baseFlows).forEach(nicheKey => {
        const flow = baseFlows[nicheKey];

        // 1. Enforce universal location sharing if specifically requested
        const sendLocationAR = '📍 أرسل الموقع';
        const sendLocationEN = '📍 Send Location';
        const hasLocationPain = goals.includes('location') || nicheKey === 'restaurant';

        if (isAr && hasLocationPain && !flow.buttons.includes(sendLocationAR)) {
            flow.buttons.push(sendLocationAR);
            flow.responses[sendLocationAR] = { text: `حياك الله! موقعنا يقع في قلب العاصمة.\n📍 رابط خرائط جوجل: https://maps.app.goo.gl/location`, end_demo: true, narrator: 'يتم مشاركة الموقع والاتجاهات آلياً 📍' };
        } else if (!isAr && hasLocationPain && !flow.buttons.includes(sendLocationEN)) {
            flow.buttons.push(sendLocationEN);
            flow.responses[sendLocationEN] = { text: `Welcome! We are located in the heart of the capital.\n📍 Google Maps: https://maps.app.goo.gl/location`, end_demo: true, narrator: 'Automated location sharing 📍' };
        }

        // 2. MANDATORY Universal Lead Gen on ALL High-Intent Actions ALWAYS!
        Object.keys(flow.responses).forEach(resKey => {
            const response = flow.responses[resKey];
            // Identify high intent actions universally
            const isTracking = resKey.includes('تتبع') || resKey.includes('Track');
            const isHighIntent = response.action === 'wait_for_time' || response.action === 'generate_order_number' || resKey.includes('التسجيل') || resKey.includes('حجز') || resKey.includes('Book') || resKey.includes('Register') || resKey.includes('اعتماد') || resKey.includes('Confirm') || resKey.includes('Order');

            if (isTracking || isHighIntent) {
                // Overwrite the normal response to ALWAYS collect lead data first
                if (isTracking) {
                    response.text = isAr
                        ? 'لمعرفة حالة طلبك، يرجى تزويدنا بالاسم ورقم الهاتف المسجل بالطلب 📋'
                        : 'To track your order, please provide the name and phone number registered with the order 📋';
                } else {
                    response.text = isAr
                        ? 'لإتمام طلبك، يرجى تزويدنا بالاسم الكريم ورقم التواصل 📋'
                        : 'To complete your request, please provide your name and phone number 📋';
                }
                response.action = 'wait_for_lead';
                response.buttons = [];
                response.narrator = isAr
                    ? 'يطلب النظام بيانات العميل لإتمام العملية (Lead Generation) 🎯'
                    : 'System requests user details to complete the transaction 🎯';
            }
        });

        // 3. Appointments Deep Integration
        if (goals.includes('appointments') && !goals.includes('lead_gen')) {
            Object.keys(flow.responses).forEach(resKey => {
                const response = flow.responses[resKey];
                if ((resKey.includes('حجز') || resKey.includes('Book')) && !response.action && (!response.buttons || response.buttons.length === 0)) {
                    response.action = 'wait_for_time';
                    response.text = isAr ? 'يا ليت تحدد الوقت والموعد المناسب لك 🕒:' : 'Please specify the suitable time and date 🕒:';
                    response.narrator = isAr ? 'يسأل النظام عن الموعد 🕒' : 'System asks for time 🕒';
                }
            });
        }
    });

    return baseFlows;
};

export const determineFlow = (niche) => {
    return niche || 'other';
};

export const getFallbackMessage = (lang = 'ar') => {
    return lang === 'ar' ? "عذراً، يرجى اختيار أحد الأزرار للمتابعة:" : "Sorry, please select one of the buttons to continue:";
};
