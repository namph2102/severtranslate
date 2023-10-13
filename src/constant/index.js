// English–Arabic
// English–Bengali
// English–Catalan
// English–Czech
// English–Danish
// English–Hindi
// English–Korean
// English–Malay
// English–Marathi
// English–Russian
// English–Tamil
// English–Telugu
// English–Thai
// English–Turkish
// English–Ukrainian
// English–Vietnamese

export const CambridgeLanguage = {
  vi: {
    name: "Vietnamese",
    country: "Việt Nam",
    isOpposite: false,
  },
  "zh-cn": {
    name: "chinese-simplified",
    country: "Trung Quốc giản thể",
    isOpposite: true,
  },
  "zh-tw": {
    name: "chinese-traditional",
    country: "Trung Quốc phồng thể",
    isOpposite: true,
  },
  fr: {
    name: "french",
    country: "Pháp",
    isOpposite: true,
  },
  ja: {
    name: "japanese",
    country: "Nhật bản",
    isOpposite: true,
  },
  de: {
    name: "german",
    country: "Đức",
    isOpposite: true,
  },
  ru: {
    name: "russian",
    country: "Nga",
    isOpposite: false,
  },
  en: {
    name: "english",
    country: "Vương quốc Anh",
    isOpposite: true,
  },
  hi: {
    name: "hindi",
    country: "Ấn Độ",
    isOpposite: false,
  },
};

export const renderUrlCambridge = {
  dictionary(language, work) {
    return `https://dictionary.cambridge.org/dictionary/${language}/${work}`;
  },
};
