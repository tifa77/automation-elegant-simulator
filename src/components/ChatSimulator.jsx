import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, Bot, CheckCheck, Loader2, Phone, Video, MoreVertical, Paperclip, Smile, Mic, Info, Sparkles, MessageCircle } from 'lucide-react';
import { getFlows, determineFlow, getFallbackMessage } from '../ChatEngine';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ChatSimulator Crash Blocked:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#0A0A0A]">
                    <Bot size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">انتهى العرض</h2>
                    <p className="text-slate-400 mb-6 font-medium text-sm">حدث خطأ داخلي. تم إيقاف المسار لحماية النظام.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl transition-all font-bold"
                    >
                        إعادة تشغيل النظام
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const ChatSimulatorInner = ({ config, onBack, onChangePlatform }) => {
    const { projectName, niche, platform, goals, lang = 'ar' } = config;
    const isAr = lang === 'ar';
    const flowType = determineFlow(niche); // niche is now 'clinic', 'ecommerce', etc.
    const flows = getFlows(projectName, goals, lang);
    const currentFlow = flows[flowType];

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [activeButtons, setActiveButtons] = useState([]);
    const [interactionCount, setInteractionCount] = useState(0);
    const [showCTA, setShowCTA] = useState(false);
    const [hasSeenModal, setHasSeenModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [toast, setToast] = useState('');
    const [narratorText, setNarratorText] = useState(isAr ? 'يبدأ العميل المحادثة 👋' : 'Customer starts chat 👋');
    const [isWaitingForCs, setIsWaitingForCs] = useState(false);
    const [isWaitingForTime, setIsWaitingForTime] = useState(false);
    const [isWaitingForLead, setIsWaitingForLead] = useState(false);
    const [isDemoEnded, setIsDemoEnded] = useState(false);

    const initialized = useRef(false);
    const messagesEndRef = useRef(null);
    const demoEndedCardRef = useRef(null);

    const isInsta = platform === 'instagram';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, activeButtons]);

    useEffect(() => {
        if (isDemoEnded && demoEndedCardRef.current) {
            setTimeout(() => {
                demoEndedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isDemoEnded]);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        showToast(isAr ? 'تسجيل دخول العميل...' : 'Customer logging in...');

        setTimeout(() => {
            setMessages([{ id: Date.now(), text: isAr ? 'هلا' : 'Hello', sender: 'user', timestamp: new Date() }]);
            setIsTyping(true);
            setNarratorText(isAr ? 'يقوم النظام الآن بالترحيب بالعميل 👋' : 'System welcomes the customer 👋');

            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now(), text: currentFlow.greeting1, sender: 'bot', timestamp: new Date() }]);
                setNarratorText(isAr ? 'يسأل النظام عن هدف التواصل 🎯' : 'System asks for the contact purpose 🎯');

                setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: currentFlow.greeting2, sender: 'bot', timestamp: new Date() }]);
                    setActiveButtons(currentFlow.buttons || []);
                    setIsTyping(false);
                    setToast('');
                }, 1000); // 1s gap

            }, 1500);
        }, 1000);
    }, [currentFlow, config]); // Added config to dependency array

    // Removed the showCTA modal effect logic completely

    const showToast = (msg) => setToast(msg);

    const generateOrderNumber = () => Math.floor(1000 + Math.random() * 9000).toString();

    const generateWaLink = () => {
        const goalsMap = {
            'delayed_replies': isAr ? 'فقدان العملاء بسبب تأخر الردود' : 'Losing customers due to delayed replies',
            'appointments': isAr ? 'صعوبة تنظيم حجوزات المواعيد' : 'Difficulty organizing appointments',
            'lost_sales': isAr ? 'خسارة مبيعات محتملة خارج أوقات العمل' : 'Lost potential sales outside working hours',
            'faq': isAr ? 'استنزاف الوقت في الإجابة على الأسئلة المتكررة' : 'Wasting time answering repetitive questions',
            'lead_gen': isAr ? 'صعوبة وتشتت جمع بيانات العملاء' : 'Difficulty collecting customer data'
        };
        const selectedGoalsText = (goals || []).map(g => goalsMap[g] || g).join(isAr ? '، ' : ', ');
        const text = isAr
            ? encodeURIComponent(`أهلاً، أريد تفعيل الأتمتة لمشروعي للحصول على خصم 70%. التحديات التي أريد حلها: ${selectedGoalsText}`)
            : encodeURIComponent(`Hello, I want to activate automation for my business to claim the 70% discount. The challenges I want to solve are: ${selectedGoalsText}`);
        window.open(`https://wa.me/96566305551?text=${text}`, '_blank');
    };

    const triggerDemoEnded = () => {
        setNarratorText(isAr ? 'النظام ينهي المسار 🚀' : 'System ends the flow 🚀');
        showToast(isAr ? 'تجهيز العرض النهائي...' : 'Preparing final view...');
        setTimeout(() => {
            setIsDemoEnded(true);
            setToast('');
        }, 1500);
    };

    const returnToMainMenu = () => {
        setIsDemoEnded(false);
        setIsTyping(true);
        setNarratorText(isAr ? 'يعود النظام إلى القائمة الرئيسية 🔙' : 'System returning to main menu 🔙');
        showToast(isAr ? 'جاري العودة للقائمة...' : 'Returning to menu...');
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: currentFlow.greeting2, sender: 'bot', timestamp: new Date() }]);
            setActiveButtons(currentFlow.buttons || []);
            setIsWaitingForCs(false);
            setIsWaitingForTime(false);
            setIsWaitingForLead(false);
            setIsTyping(false);
            setToast('');
        }, 1200);
    };

    const safeStateTransitionGuard = (newState) => {
        if (!newState) {
            console.warn("State engine returned undefined -> triggering fallback");
            triggerDemoEnded();
            return false;
        }
        return true;
    }

    const handleSendText = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user', timestamp: new Date() }]);
        setInputText('');
        setInteractionCount(prev => prev + 1);

        if (isWaitingForTime) {
            setIsTyping(true);
            setNarratorText(isAr ? 'يتحقق النظام من توفر المواعيد آلياً 🕒' : 'System checks appointment availability automatically 🕒');
            showToast(isAr ? 'جاري التحقق...' : 'Checking availability...');

            setTimeout(() => {
                const orderNum = generateOrderNumber();
                const confirmationMsg = isAr
                    ? `لحظات بس نشيك لك عالمواعيد... ⏳\n\nيعطيك العافية، حجزك تأكد ✅\n🧾 رقم الحجز: #RES-${orderNum}\nننطرك تنورنا قريباً ✨`
                    : `Checking available slots... ⏳\n\nGreat, your appointment is confirmed ✅\n🧾 Reservation #: #RES-${orderNum}\nLooking forward to seeing you soon ✨`;

                setMessages(prev => [...prev, { id: Date.now(), text: confirmationMsg, sender: 'bot', timestamp: new Date() }]);
                setIsWaitingForTime(false);
                setIsTyping(false);
                setToast('');
                setNarratorText(isAr ? 'يتم الآن إصدار رقم الحجز بنجاح ✅' : 'Reservation number issued successfully ✅');
                setTimeout(() => triggerDemoEnded(), 1500);
            }, 2000);
            return;
        }

        if (isWaitingForCs) {
            setIsTyping(true);
            setNarratorText(isAr ? 'يتلقى النظام رسالة صريحة ويحفظها للوكيل البشري 📝' : 'System receives direct message and assigns human agent 📝');
            showToast(isAr ? 'يتم توجيه الرسالة...' : 'Routing message...');

            setTimeout(() => {
                const okMsg = isAr
                    ? 'تم طال عمرك! رسالتك وصلتنا وبنحولها للقسم المختص عشان يتواصلون معاك ✅'
                    : 'Noted! Your message is received and routed to the relevant team who will contact you soon ✅';
                setMessages(prev => [...prev, { id: Date.now(), text: okMsg, sender: 'bot', timestamp: new Date() }]);
                setIsWaitingForCs(false);
                setIsTyping(false);
                setToast('');
                setTimeout(() => triggerDemoEnded(), 1500);
            }, 1000);
            return;
        }

        if (isWaitingForLead) {
            setIsTyping(true);
            setNarratorText(isAr ? 'يفهم النظام المدخلات ويحفظ بيانات العميل (Lead Gen) 📝' : 'System records customer details (Lead Gen) 📝');
            showToast(isAr ? 'يتم تسجيل البيانات...' : 'Recording details...');

            setTimeout(() => {
                const leadOkMsg = isAr
                    ? 'تم تسجيل بياناتك بنجاح! موظفنا بيتواصل معاك بأقرب وقت لتأكيد طلبك ✅'
                    : 'Your details are recorded successfully! Our agent will contact you soon to confirm your request ✅';
                setMessages(prev => [...prev, { id: Date.now(), text: leadOkMsg, sender: 'bot', timestamp: new Date() }]);
                setIsWaitingForLead(false);
                setIsTyping(false);
                setToast('');
                setTimeout(() => triggerDemoEnded(), 1800);
            }, 1500);
            return;
        }

        // Fallback logic for wrong input during regular Button flows
        setIsTyping(true);
        setNarratorText(isAr ? 'يقوم النظام بتحليل النص المدخل وتوجيه العميل 🔍' : 'System analyzes text input 🔍');
        showToast(isAr ? 'النظام يقوم بالتحليل...' : 'Analyzing...');
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: getFallbackMessage(lang), sender: 'bot', timestamp: new Date() }]);
            setActiveButtons(prev => prev.length > 0 ? prev : (currentFlow.buttons || []));
            setIsTyping(false);
            setToast('');
        }, 1000);
    };

    const handleButtonClick = (buttonText) => {
        setMessages(prev => [...prev, { id: Date.now(), text: buttonText, sender: 'user', timestamp: new Date() }]);
        setActiveButtons([]);
        setInteractionCount(prev => prev + 1);
        setIsWaitingForCs(false);
        setIsWaitingForTime(false);
        setIsWaitingForLead(false);

        if (buttonText === 'نرد للرئيسية') {
            returnToMainMenu();
            return;
        }

        if (buttonText === 'تواصل معنا للأسعار') {
            generateWaLink();
            triggerDemoEnded();
            return;
        }

        setIsTyping(true);
        showToast(buttonText.includes(isAr ? 'اللوكيشن' : 'Location')
            ? (isAr ? 'جاري العمليات بالخلفية...' : 'Background processing...')
            : (isAr ? `النظام يجهز الاستجابة لـ "${buttonText}"...` : `Preparing response to "${buttonText}"...`));

        setTimeout(() => {
            const response = currentFlow.responses[buttonText];

            if (safeStateTransitionGuard(response)) {
                let msgText = response.text;
                if (typeof msgText === 'function') {
                    msgText = msgText(generateOrderNumber());
                }

                if (response.action === 'wait_for_cs') setIsWaitingForCs(true);
                else if (response.action === 'wait_for_time') setIsWaitingForTime(true);
                else if (response.action === 'wait_for_lead') {
                    setIsWaitingForLead(true);
                }

                setMessages(prev => [...prev, { id: Date.now(), text: msgText, sender: 'bot', timestamp: new Date() }]);

                if (response.narrator) setNarratorText(response.narrator);

                if (response.end_demo) {
                    setIsTyping(false);
                    setTimeout(() => triggerDemoEnded(), 2000);
                } else {
                    setActiveButtons(response.buttons || []);
                    if (!response.buttons?.length && !response.action && !response.end_demo) {
                        setTimeout(() => triggerDemoEnded(), 2000);
                    } else {
                        setIsTyping(false);
                    }
                }
            }
            setToast('');
        }, 1200);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const bgColors = isInsta ? 'bg-[#000000]' : 'bg-[#0b141a]';
    const headerBg = isInsta ? 'bg-[#111111] border-b border-[#262626]' : 'bg-[#202c33]';
    const headerText = isInsta ? 'text-white' : 'text-[#e9edef]';
    const headerSubText = isInsta ? 'text-slate-400' : 'text-[#8696a0]';
    const headerIcons = isInsta ? 'text-white' : 'text-[#aebac1]';
    const inputBg = isInsta ? 'bg-[#111111] border-t border-[#262626]' : 'bg-[#202c33]';
    const inputFieldBg = isInsta ? 'bg-[#262626] text-white placeholder-slate-400' : 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]';
    const botBubble = isInsta ? 'bg-[#262626] text-[#f5f5f5] rounded-2xl' : 'bg-[#202c33] text-[#e9edef] rounded-lg rounded-tl-none';
    const userBubble = isInsta ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl' : 'bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tr-none';
    const buttonContainer = isInsta ? 'bg-[#000000]' : 'bg-[#0b141a]';
    const actionButton = isInsta ? 'bg-[#111111] border border-[#262626] text-white hover:bg-[#262626] rounded-xl cursor-pointer pointer-events-auto z-10' : 'bg-[#202c33] border-b border-[#222d34] text-[#00a884] active:bg-[#182229] rounded-md cursor-pointer pointer-events-auto z-10';

    return (
        <div className="w-full flex justify-center items-center px-4 relative flex-col gap-6">

            {/* Top Title Banner */}
            <div className="text-center max-w-lg z-10 hidden md:block" dir={isAr ? "rtl" : "ltr"}>
                <h2 className="text-lg md:text-xl font-semibold text-white/90 leading-relaxed shadow-sm">
                    {isAr ? 'هذا العرض (Demo) لأتمتة الرسائل تم تصميمه خصيصاً لمشروع ' : 'This automation Demo is specially crafted for '}
                    <span className="text-cyan-400 font-bold bg-cyan-900/30 px-2 py-0.5 rounded">{projectName}</span> ✨
                </h2>
            </div>
            <div className="text-center max-w-sm z-10 block md:hidden" dir={isAr ? "rtl" : "ltr"}>
                <h2 className="text-base font-semibold text-white/90 leading-relaxed shadow-sm">
                    {isAr ? 'هذا العرض (Demo) لأتمتة الرسائل تم تصميمه خصيصاً لمشروع ' : 'This Demo is specially crafted for '}
                    <span className="text-cyan-400 font-bold">{projectName}</span> ✨
                </h2>
            </div>

            <div className="w-full max-w-[350px] md:max-w-[380px] relative mx-auto">

                {/* Vertical Instagram Floating Badge */}
                {isInsta && (
                    <div className="absolute -left-9 top-32 origin-bottom-right -rotate-90 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-t-xl text-xs font-bold shadow-lg border border-purple-400/50 border-b-0 z-0 tracking-wide">
                        تجربة انستجرام ✨
                    </div>
                )}

                {/* Main Simulator Container with iPhone Pro Mockup */}
                <div className="w-full aspect-[9/19.5] max-h-[850px] bg-[#0A0A0A] flex flex-col relative overflow-hidden font-cairo shadow-2xl border-[12px] border-black rounded-[3rem]">

                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[110px] h-7 bg-black rounded-full z-[60] flex items-center justify-between px-2 shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-slate-800/80"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-800/80"></div>
                    </div>

                    {/* Narrator Top Banner */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={narratorText}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-[115px] left-0 right-0 z-20 flex justify-center pointer-events-none"
                        >
                            <div className="bg-cyan-950/90 border border-cyan-500/50 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_4px_20px_-5px_cyan] flex items-center gap-2 max-w-[90%] pointer-events-auto" dir="rtl">
                                <Info size={16} className="text-cyan-400 flex-shrink-0 animate-pulse" />
                                <span className="text-cyan-50 text-xs md:text-sm font-medium">{narratorText}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Chat Header */}
                    <div className={`${headerBg} px-4 pt-10 pb-3 flex items-center justify-between z-10 shrink-0 relative`} dir="rtl">
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className={`${headerIcons} hover:opacity-80 transition-opacity`}>
                                <ArrowRight size={20} />
                            </button>
                            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-600/50">
                                {isInsta ? <img src="/logo.png" alt="Bot" className="w-full h-full object-cover bg-black p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} /> : null}
                                <Bot className={`${headerIcons} ${isInsta ? 'hidden' : 'block'}`} size={24} />
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-1.5">
                                    <h3 className={`font-semibold ${headerText} text-[15px] leading-tight truncate max-w-[130px]`}>{projectName}</h3>
                                    <svg viewBox="0 0 24 24" width="16" height="16" className={`${isAr ? 'ml-0.5' : 'mr-0.5'}`}>
                                        <path fill={isInsta ? "#0095F6" : "#25D366"} d="M12 22a.995.995 0 0 1-.707-.293l-1.636-1.636-2.288.169a1 1 0 0 1-1.05-.826l-.32-2.269-1.921-1.258a1 1 0 0 1-.35-1.254L4.855 12.5l-1.127-2.133a1 1 0 0 1 .35-1.254l1.921-1.258.32-2.269a1 1 0 0 1 1.05-.826l2.288.169 1.636-1.636A1 1 0 0 1 12 2a.995.995 0 0 1 .707.293l1.636 1.636 2.288-.169a1 1 0 0 1 1.05.826l.32 2.269 1.921 1.258a1 1 0 0 1 .35 1.254l-1.127 2.133 1.127 2.133a1 1 0 0 1-.35 1.254l-1.921 1.258-.32 2.269a1 1 0 0 1-1.05.826l-2.288-.169-1.636 1.636A.995.995 0 0 1 12 22z" />
                                        <path fill="#ffffff" d="M10.828 15.828a1 1 0 0 1-.707-.293l-2.828-2.829 1.414-1.414L10.828 13.414l5.657-5.657 1.414 1.415-6.364 6.364a1 1 0 0 1-.707.292z" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] ${headerSubText}`}>{isInsta ? (isAr ? 'شركة أتمتة بالذكاء الاصطناعي' : 'AI Automation Agency') : (isAr ? 'متصل الآن' : 'Online')}</span>
                            </div>
                        </div>
                        <div className={`flex items-center gap-4 ${headerIcons}`}>
                            <Video size={22} className="cursor-pointer" />
                            <Phone size={19} className="cursor-pointer" />
                            {!isInsta && <MoreVertical size={20} className="cursor-pointer" />}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 overflow-y-auto relative w-full flex flex-col p-4 ${bgColors} scroll-smooth`} dir="rtl">
                        {!isInsta && (
                            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                style={{ backgroundImage: 'url("https://w7.pngwing.com/pngs/912/621/png-transparent-whatsapp-pattern-logo.png")', backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
                            </div>
                        )}

                        <div className={`flex flex-col space-y-3 z-10 w-full mb-auto pb-6 pt-16`}>
                            <div className="flex justify-center mb-4">
                                <span className={`${isInsta ? 'text-slate-500 text-xs' : 'bg-[#182229] text-[#8696a0] text-xs px-3 py-1.5 rounded-lg shadow-sm'}`}>
                                    {formatTime(new Date())}
                                </span>
                            </div>

                            <AnimatePresence>
                                {messages.map((msg, index) => {
                                    const showTail = index === 0 || messages[index - 1].sender !== msg.sender;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={`flex w-full ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} group items-end gap-2`}
                                        >
                                            {isInsta && msg.sender === 'bot' && (
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden mb-1 border border-slate-700 ${showTail ? 'bg-slate-800' : 'invisible'}`}>
                                                    {showTail && (
                                                        <>
                                                            <img src="/logo.png" className="w-full h-full object-cover p-1 bg-black" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                                            <Bot className="text-slate-400 hidden" size={16} />
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className={`relative max-w-[85%] px-3.5 py-2.5 text-[15px] leading-relaxed shadow-sm break-words ${msg.sender === 'user' ? `${userBubble} ml-auto` : `${botBubble} mr-auto`
                                                } ${!showTail ? (msg.sender === 'user' ? 'rounded-tr-lg mr-2' : 'rounded-tl-lg ml-2') : ''}`}>
                                                {!isInsta && showTail && (
                                                    <span className={`absolute top-0 w-2 h-3 overflow-hidden ${msg.sender === 'user' ? '-right-2' : '-left-2'}`}>
                                                        <svg viewBox="0 0 8 13" width="8" height="13" className={msg.sender === 'user' ? "text-[#005c4b]" : "text-[#202c33]"}>
                                                            <path opacity=".13" fill="#0000000" d="M1.533 3.118L8 2.01.866.15C.31.062 0 .476 0 .991v1.65l1.533.477z" />
                                                            <path fill="currentColor" d={msg.sender === 'user' ? "M0 0h8v13L0 0z" : "M8 0H0v13L8 0z"} />
                                                        </svg>
                                                    </span>
                                                )}

                                                <div className="whitespace-pre-wrap">{msg.text}</div>

                                                <div className="flex items-center justify-end gap-1 mt-1 -mb-1 float-right clear-both">
                                                    {!isInsta && <span className="text-[11px] text-white/50">{formatTime(msg.timestamp)}</span>}
                                                    {msg.sender === 'user' && !isInsta && <CheckCheck size={15} className="text-[#53bdeb]" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex w-full justify-end items-end gap-2"
                                    >
                                        {isInsta && (
                                            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden mb-1 border border-slate-700">
                                                <img src="/logo.png" className="w-full h-full object-cover p-1 bg-black" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                                <Bot className="text-slate-400 hidden" size={16} />
                                            </div>
                                        )}
                                        <div className={`${botBubble} px-4 py-4 relative mr-auto flex items-center justify-center gap-1.5 shadow-sm w-[4.5rem]`}>
                                            {!isInsta && (
                                                <span className="absolute top-0 -left-2 text-[#202c33]">
                                                    <svg viewBox="0 0 8 13" width="8" height="13"><path fill="currentColor" d="M8 0H0v13L8 0z" /></svg>
                                                </span>
                                            )}
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className={`w-1.5 h-1.5 rounded-full ${isInsta ? 'bg-slate-400' : 'bg-[#8696a0]'}`} />
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className={`w-1.5 h-1.5 rounded-full ${isInsta ? 'bg-slate-400' : 'bg-[#8696a0]'}`} />
                                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className={`w-1.5 h-1.5 rounded-full ${isInsta ? 'bg-slate-400' : 'bg-[#8696a0]'}`} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: -10, x: '-50%' }}
                                className={`absolute ${isInsta ? 'top-44' : 'top-40'} left-1/2 ${isInsta ? 'bg-[#262626] border-[#333]' : 'bg-[#182229]/90 border-[#222d34]'} text-slate-300 text-xs py-2 px-4 rounded-lg border shadow-md z-20 flex items-center gap-2 max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis`}
                            >
                                <Loader2 size={12} className={`animate-spin ${isInsta ? 'text-slate-400' : 'text-[#00a884]'}`} />
                                {toast}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {activeButtons.length > 0 && !isTyping && !isDemoEnded && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex flex-col ${buttonContainer} z-10 w-full px-4 pt-1 pb-3 ${isInsta ? 'gap-2' : 'gap-1'} overflow-x-hidden relative`}
                                dir="rtl"
                            >
                                {activeButtons.map((btn, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleButtonClick(btn)}
                                        className={`w-full font-medium py-3 px-4 text-[14px] transition-colors flex items-center justify-center ${actionButton} ${btn === 'نرد للرئيسية' ? 'text-red-400 hover:text-red-300 border-none' : ''} ${btn === 'تواصل معنا للأسعار' ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 font-bold' : ''}`}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`${inputBg} px-2 py-3 flex items-end gap-2 z-10 transition-opacity ${isDemoEnded ? 'opacity-50 pointer-events-none' : ''}`} dir="rtl">
                        <button className={`p-2 ${headerIcons} hover:opacity-80 flex-shrink-0 mb-0.5`}>
                            <Smile size={isInsta ? 22 : 24} />
                        </button>
                        {!isInsta && (
                            <button className={`p-2 ${headerIcons} hover:opacity-80 flex-shrink-0 mb-0.5 -mr-1`}>
                                <Paperclip size={24} />
                            </button>
                        )}

                        <form onSubmit={handleSendText} className="flex-1 flex items-end ml-1 w-full">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={(isWaitingForCs || isWaitingForTime || isWaitingForLead) ? (isAr ? "اكتب رسالتك..." : "Type your message...") : (isAr ? "اكتب رسالة" : "Type a message")}
                                className={`w-full ${inputFieldBg} rounded-full px-4 py-[9px] outline-none text-[15px] mr-1`}
                                disabled={isDemoEnded}
                            />
                        </form>

                        <button
                            onClick={inputText.trim() ? handleSendText : undefined}
                            className={`p-2 ${headerIcons} hover:opacity-80 flex-shrink-0 mb-0.5`}
                            disabled={isDemoEnded}
                        >
                            {inputText.trim() ? (
                                <Send size={isInsta ? 22 : 24} className={`rtl:rotate-180 ${!isInsta && 'text-[#00a884]'}`} />
                            ) : (
                                <Mic size={isInsta ? 22 : 24} />
                            )}
                        </button>
                    </div>
                </div>

                {isDemoEnded && (
                    <motion.div
                        ref={demoEndedCardRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full mt-6 bg-[#111111]/80 backdrop-blur-md border border-white/10 p-5 z-10 flex flex-col gap-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                        dir={isAr ? "rtl" : "ltr"}
                    >
                        <div className={`text-center px-1 ${isAr ? '' : 'text-left'}`}>
                            <h3 className={`text-white text-[16px] leading-relaxed font-bold mb-2 ${isAr ? '' : 'text-center'}`}>
                                {isAr ? '✨ انتهت تجربة العرض' : '✨ Demo Experience Ended'}
                            </h3>
                            <p className={`text-slate-300 text-[14px] leading-relaxed font-medium mb-3 ${isAr ? '' : 'text-center'}`}>
                                {isAr ? 'ريّح بالك من ضغط الرسائل وخلي مبيعاتك شغالة 24/7!' : 'Relax from message pressure and keep sales running 24/7!'}
                            </p>
                            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                                <p className={`text-slate-400 text-[11px] leading-tight font-medium ${isAr ? '' : 'text-center'}`}>
                                    {isAr ? '💡 تنويه: محتوى وسيناريو الأتمتة الفعلي سيتم تصميمه وتخصيصه بالكامل حسب طبيعة مشروعك ورغبتك.' : '💡 Note: The actual automation script and content will be fully customized according to your unique business needs.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-1">
                            <button onClick={generateWaLink} className="relative w-full font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/50 transition-all hover:-translate-y-1 text-[15px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none mt-2">
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-yellow-300 whitespace-nowrap shadow-md">
                                    {isAr ? '⏳ لفترة محدودة' : '⏳ Limited Time'}
                                </div>
                                <span className={`flex items-center gap-2 ${isAr ? '' : 'flex-row-reverse'}`}>
                                    <MessageCircle size={18} /> {isAr ? '🚀 فعّل الأتمتة لمشروعك الآن (خصم 70%)' : '🚀 Activate Automation Now (70% Off)'}
                                </span>
                            </button>
                            <button onClick={onBack} className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 border border-white/10">
                                {isAr ? 'عودة للصفحة الرئيسية 🏠' : 'Return to Main Menu 🏠'}
                            </button>
                            <button onClick={() => onChangePlatform(isInsta ? 'whatsapp' : 'instagram')} className={`w-full font-medium py-3 px-4 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 border ${isInsta ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/20' : 'bg-pink-500/10 text-pink-500 border-pink-500/30 hover:bg-pink-500/20'}`}>
                                {isInsta ? (isAr ? '💬 جرب نسخة واتساب' : '💬 Try WhatsApp Version') : (isAr ? '📸 جرب نسخة إنستجرام' : '📸 Try Instagram Version')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default function ChatSimulator(props) {
    return (
        <ErrorBoundary>
            <ChatSimulatorInner {...props} />
        </ErrorBoundary>
    );
}
