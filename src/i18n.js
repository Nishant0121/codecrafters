import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Dashboard: "Dashboard",
      "Welcome back! Here's an overview of your investments.":
        "Welcome back! Here's an overview of your investments.",
      Notifications: "Notifications",
      "New Investment": "New Investment",
      "Total Portfolio Value": "Total Portfolio Value",
      "Monthly Returns": "Monthly Returns",
      "Available Cash": "Available Cash",
      "Ready to invest": "Ready to invest",
      Deposit: "Deposit",
      Invest: "Invest",
      Summary: "Summary",
      Investments: "Investments",
      Activity: "Activity",
      "Your Investments": "Your Investments",
      "A detailed view of all your current investments":
        "A detailed view of all your current investments",
    },
  },
  hi: {
    translation: {
      Dashboard: "डैशबोर्ड",
      "Welcome back! Here's an overview of your investments.":
        "वापसी पर स्वागत है! यहाँ आपके निवेश का एक अवलोकन है।",
      Notifications: "सूचनाएं",
      "New Investment": "नया निवेश",
      "Total Portfolio Value": "कुल पोर्टफोलियो मूल्य",
      "Monthly Returns": "मासिक रिटर्न",
      "Available Cash": "उपलब्ध नकद",
      "Ready to invest": "निवेश के लिए तैयार",
      Deposit: "जमा करें",
      Invest: "निवेश करें",
      Summary: "सारांश",
      Investments: "निवेश",
      Activity: "गतिविधि",
      "Your Investments": "आपके निवेश",
      "A detailed view of all your current investments":
        "आपके सभी मौजूदा निवेशों का विस्तृत दृश्य",
    },
  },
  mr: {
    translation: {
      Dashboard: "डॅशबोर्ड",
      "Welcome back! Here's an overview of your investments.":
        "परत स्वागत आहे! येथे तुमच्या गुंतवणुकीचे विहंगावलोकन आहे.",
      Notifications: "सूचना",
      "New Investment": "नवीन गुंतवणूक",
      "Total Portfolio Value": "एकूण पोर्टफोलिओ मूल्य",
      "Monthly Returns": "मासिक परतावा",
      "Available Cash": "उपलब्ध रोख",
      "Ready to invest": "गुंतवणुकीसाठी तयार",
      Deposit: "ठेव",
      Invest: "गुंतवणूक करा",
      Summary: "सारांश",
      Investments: "गुंतवणूक",
      Activity: "क्रियाकलाप",
      "Your Investments": "तुमच्या गुंतवणुकी",
      "A detailed view of all your current investments":
        "तुमच्या सर्व विद्यमान गुंतवणुकींचे तपशीलवार दृश्य",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
