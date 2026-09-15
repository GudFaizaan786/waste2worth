'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Language = 'EN' | 'HI'

type Dictionary = Record<string, string>

const hi: Dictionary = {
  'Don\'t throw value away': 'मूल्य को कचरे में न जाने दें',
  Citizen: 'नागरिक', Collector: 'कलेक्टर', Hub: 'हब', Login: 'लॉग इन',
  'Turn your recyclable waste into value': 'अपने पुनर्चक्रण योग्य कचरे को मूल्य में बदलें',
  'Your collection jobs': 'आपके संग्रह कार्य', 'Material recovery & traceability': 'सामग्री पुनर्प्राप्ति और ट्रेसबिलिटी',
  'Book doorstep pickups, choose cash or Eco-Credits, and trace every kilogram to the recycler.': 'घर से पिकअप बुक करें, नकद या ईको-क्रेडिट चुनें और हर किलोग्राम की यात्रा देखें।',
  'Accept pickups, verify weight with photo and OTP, and release instant citizen payouts.': 'पिकअप स्वीकार करें, फोटो और ओटीपी से वजन सत्यापित करें और नागरिकों को तुरंत भुगतान करें।',
  'Aggregate incoming material, segregate streams, and dispatch traceable batches to recyclers.': 'आने वाली सामग्री को एकत्र करें, अलग करें और ट्रेस योग्य बैच रिसाइक्लर को भेजें।',
  'Eco Wallet': 'ईको वॉलेट', 'Eco Points': 'ईको पॉइंट्स', 'Book a Pickup': 'पिकअप बुक करें', 'Active order': 'सक्रिय ऑर्डर',
  'No active pickups': 'कोई सक्रिय पिकअप नहीं', 'Today\'s rates': 'आज की दरें', 'Your recycling passport': 'आपका रीसाइक्लिंग पासपोर्ट',
  'Book a doorstep pickup': 'घर से पिकअप बुक करें', 'Segregate, schedule, and choose your reward.': 'कचरा अलग करें, समय चुनें और अपना पुरस्कार चुनें।',
  'What do you have?': 'आपके पास क्या है?', 'Approximate quantity': 'अनुमानित मात्रा', 'Pickup address': 'पिकअप पता',
  'How would you like your reward?': 'आप अपना पुरस्कार कैसे चाहते हैं?', Cash: 'नकद', 'Estimated reward': 'अनुमानित पुरस्कार', 'Request Pickup': 'पिकअप अनुरोध करें', BONUS: 'बोनस',
  Materials: 'सामग्री', 'Est. weight': 'अनुमानित वजन', Address: 'पता', Payout: 'भुगतान', 'Share this OTP with your collector': 'यह ओटीपी कलेक्टर के साथ साझा करें', 'Confirms the verified weight at your door.': 'यह आपके दरवाजे पर सत्यापित वजन की पुष्टि करता है।',
  'Trace my waste journey': 'अपनी कचरा यात्रा देखें', 'No jobs in your queue': 'आपकी कतार में कोई कार्य नहीं', 'Active job': 'सक्रिय कार्य', 'Verified citizen': 'सत्यापित नागरिक', Navigate: 'नेविगेट', Call: 'कॉल', 'Verify & pay out': 'सत्यापित करें और भुगतान करें', 'Verified weight (kg)': 'सत्यापित वजन (किग्रा)', 'Photo proof': 'फोटो प्रमाण', 'Citizen OTP': 'नागरिक ओटीपी', 'Instant payout': 'तुरंत भुगतान', 'Confirm collection & pay': 'संग्रह की पुष्टि करें और भुगतान करें',
  'Collected today': 'आज एकत्रित', 'Segregation accuracy': 'अलगाव सटीकता', 'Active collectors': 'सक्रिय कलेक्टर', 'Citizen rewards': 'नागरिक पुरस्कार', 'Incoming material': 'आने वाली सामग्री', 'Material distribution': 'सामग्री वितरण', 'Dispatch queue': 'डिस्पैच कतार', 'Segregate streams': 'सामग्री अलग करें', 'Create batch': 'बैच बनाएं', 'View journey': 'यात्रा देखें',
  'Waste journey': 'कचरा यात्रा', 'Citizen': 'नागरिक', 'Verified Collector': 'सत्यापित कलेक्टर', 'Material Recovery Hub': 'सामग्री रिकवरी हब', 'Authorized Recycler': 'अधिकृत रिसाइक्लर',
}

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (value: string) => string } | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN')
  const value = useMemo(() => ({ language, setLanguage, t: (value: string) => language === 'HI' ? hi[value] ?? value : value }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export type { Language }
