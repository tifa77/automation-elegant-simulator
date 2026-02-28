import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Instagram, Utensils, Stethoscope, ShoppingBag, Store, Plane, Lightbulb, Sparkles, CheckCheck } from 'lucide-react';

const nichesListData = {
    ar: [
        { id: 'restaurant', label: 'مطعم / كافيه 🍔', icon: Utensils },
        { id: 'clinic', label: 'عيادة / مركز طبي 🩺', icon: Stethoscope },
        { id: 'ecommerce', label: 'متجر إلكتروني 🛍️', icon: ShoppingBag },
        { id: 'retail', label: 'محل تجاري 🏬', icon: Store },
        { id: 'travel', label: 'مكتب سفريات ✈️', icon: Plane },
        { id: 'consulting', label: 'استشارات وتدريب 💡', icon: Lightbulb },
        { id: 'other', label: 'خدمات أخرى ✨', icon: Sparkles }
    ],
    en: [
        { id: 'restaurant', label: 'Restaurant / Cafe 🍔', icon: Utensils },
        { id: 'clinic', label: 'Clinic / Medical 🩺', icon: Stethoscope },
        { id: 'ecommerce', label: 'E-commerce 🛍️', icon: ShoppingBag },
        { id: 'retail', label: 'Retail Store 🏬', icon: Store },
        { id: 'travel', label: 'Travel Agency ✈️', icon: Plane },
        { id: 'consulting', label: 'Consulting & Training 💡', icon: Lightbulb },
        { id: 'other', label: 'Other Services ✨', icon: Sparkles }
    ]
};

const goalsListData = {
    ar: [
        { id: 'delayed_replies', label: 'فقدان العملاء بسبب تأخر الردود ⏳' },
        { id: 'appointments', label: 'صعوبة تنظيم حجوزات المواعيد 📅' },
        { id: 'lost_sales', label: 'خسارة مبيعات محتملة خارج أوقات العمل 📉' },
        { id: 'faq', label: 'استنزاف الوقت في الإجابة على الأسئلة المتكررة 🔄' },
        { id: 'lead_gen', label: 'صعوبة وتشتت جمع بيانات العملاء 📝' }
    ],
    en: [
        { id: 'delayed_replies', label: 'Losing customers due to delayed replies ⏳' },
        { id: 'appointments', label: 'Difficulty organizing appointments 📅' },
        { id: 'lost_sales', label: 'Lost potential sales outside working hours 📉' },
        { id: 'faq', label: 'Wasting time answering repetitive questions 🔄' },
        { id: 'lead_gen', label: 'Difficulty collecting customer data 📝' }
    ]
};

const t = {
    ar: {
        title: 'إعداد عرض Demo',
        subtitle: 'جرب الآن نموذجاً تفاعلياً لنظام الأتمتة الذي يمكننا تصميمه لمشروعك ✨',
        projectName: 'اسم المشروع',
        projectNamePlaceholder: 'مثال: عيادة ابتسامتك، متجر الأناقة...',
        nicheLabel: 'اختار ما هو أقرب نشاط لمشروعك',
        goalsLabel: 'ما هي التحديات التي تسعى لحلها عبر الأتمتة والذكاء الاصطناعي؟ (يمكنك اختيار أكثر من خيار)',
        goalsError: 'يرجى اختيار هدف واحد على الأقل',
        platformLabel: 'اختر منصة العرض:',
        whatsapp: 'واتساب',
        instagram: 'إنستغرام',
        submit: 'توليد العرض'
    },
    en: {
        title: 'Demo Setup',
        subtitle: 'Try an interactive model of the automation system we can design for your business ✨',
        projectName: 'Project Name',
        projectNamePlaceholder: 'e.g., Smile Clinic, Elegance Store...',
        nicheLabel: 'Select your closest business niche',
        goalsLabel: 'What challenges do you want to solve with automation and AI? (Select all that apply)',
        goalsError: 'Please select at least one challenge',
        platformLabel: 'Select Demo Platform:',
        whatsapp: 'WhatsApp',
        instagram: 'Instagram',
        submit: 'Generate Demo'
    }
};

const Onboarding = ({ onComplete, lang = 'ar', onBackToSplash }) => {
    const [projectName, setProjectName] = useState('');
    const [niche, setNiche] = useState('restaurant');
    const [platform, setPlatform] = useState('whatsapp');
    const [goals, setGoals] = useState([]);

    const nichesList = nichesListData[lang];
    const goalsList = goalsListData[lang];
    const ui = t[lang];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (projectName && niche && goals.length > 0) {
            onComplete({ projectName, niche, platform, goals });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-[#111111] border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] relative"
            dir={lang === 'ar' ? "rtl" : "ltr"}
        >
            {/* Back Button */}
            {onBackToSplash && (
                <button
                    onClick={onBackToSplash}
                    className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} text-slate-400 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full`}
                >
                    <ArrowLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                </button>
            )}

            <div className={`text-center mb-8 ${onBackToSplash ? 'mt-4' : ''}`}>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    {ui.title}
                </h2>
                <p className="text-slate-400 mt-2 text-sm md:text-base">{ui.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{ui.projectName}</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder={ui.projectNamePlaceholder}
                        className="w-full bg-[#0A0A0A] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-cairo"
                        dir={lang === 'ar' ? "rtl" : "ltr"}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">{ui.nicheLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                        {nichesList.map((item) => {
                            const Icon = item.icon;
                            const isSelected = niche === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setNiche(item.id)}
                                    className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border transition-all ${isSelected
                                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                        : 'border-slate-800 hover:border-slate-700 bg-[#0A0A0A] text-slate-400'
                                        } ${item.id === 'other' ? 'col-span-2' : ''}`}
                                >
                                    <Icon size={20} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">{ui.goalsLabel}</label>
                    <div className="flex flex-col gap-3">
                        {goalsList.map((item) => {
                            const isSelected = goals.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setGoals(prev =>
                                            prev.includes(item.id)
                                                ? prev.filter(g => g !== item.id)
                                                : [...prev, item.id]
                                        );
                                    }}
                                    className={`relative flex items-center justify-between w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 group ${isSelected
                                        ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
                                        : 'border-slate-800 hover:border-slate-700 bg-[#0A0A0A]'
                                        }`}
                                >
                                    <span className={`text-[13px] font-medium ${lang === 'ar' ? 'text-right' : 'text-left'} transition-colors ${lang === 'ar' ? 'pr-1' : 'pl-1'} ${isSelected ? 'text-cyan-400 font-bold' : 'text-slate-300 group-hover:text-slate-200'}`}>{item.label}</span>
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${lang === 'ar' ? 'ml-1' : 'mr-1'} ${isSelected ? 'bg-cyan-500 border-none' : 'bg-slate-800 group-hover:bg-slate-700 border border-slate-700'}`}>
                                        {isSelected && <CheckCheck size={14} className="text-[#0A0A0A]" strokeWidth={3} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {goals.length === 0 && (
                        <p className="text-red-400 text-xs mt-2">{ui.goalsError}</p>
                    )}
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-300 mb-3 text-center">{ui.platformLabel}</label>
                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setPlatform('whatsapp')}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${platform === 'whatsapp'
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : 'border-slate-800 hover:border-slate-700 bg-[#0A0A0A] text-slate-400'
                                }`}
                        >
                            <MessageCircle size={20} />
                            {ui.whatsapp}
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatform('instagram')}
                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${platform === 'instagram'
                                ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                                : 'border-slate-800 hover:border-slate-700 bg-[#0A0A0A] text-slate-400'
                                }`}
                        >
                            <Instagram size={20} />
                            {ui.instagram}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_cyan] hover:shadow-[0_0_25px_-5px_cyan] transition-all flex items-center justify-center gap-2 group mt-8"
                >
                    <span>{ui.submit}</span>
                    <ArrowLeft size={20} className={`transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'}`} />
                </button>
            </form>
        </motion.div>
    );
};

export default Onboarding;
