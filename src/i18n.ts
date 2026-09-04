import { Language } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  sellMyCrop: string;
  sellMyCropSubtitle: string;
  home: string;
  sell: string;
  buyers: string;
  myCrops: string;
  profile: string;
  orders: string;
  askAi: string;
  namaskar: string;
  demoDataLabel: string;
  demoPaymentLabel: string;
  
  // Crop step 2
  whatAreYouSelling: string;
  selectCropPrompt: string;
  speak: string;
  listening: string;
  processingVoice: string;
  voiceInstruction: string;
  quantity: string;
  unit: string;
  continueBtn: string;
  backBtn: string;

  // Step 3
  takePhotoTitle: string;
  takePhotoSubtitle: string;
  takePhotoBtn: string;
  uploadPhotoBtn: string;
  useThisPhotoBtn: string;
  retakePhotoBtn: string;
  photoClearPrompt: string;

  // Step 4 AI Quality
  aiQualityTitle: string;
  aiQualityGrade: string;
  visualCondition: string;
  visibleDamage: string;
  aiConfidence: string;
  aiDisclaimer: string;
  photoUnclearWarning: string;
  gradeA: string;
  gradeB: string;
  gradeC: string;
  good: string;
  fair: string;
  poor: string;
  low: string;
  medium: string;
  high: string;

  // Step 5 Market Price & Farmer Control
  marketPriceTitle: string;
  marketReference: string;
  aiSuggestedPrice: string;
  priceSuggestionExplainer: string;
  setYourPriceTitle: string;
  yourPriceLabel: string;
  yourCropWillBeListedAt: string;
  farmerPriceNotice: string;

  // Step 6 Sell or Hold
  whatDoYouWantToDo: string;
  sellNow: string;
  hold: string;
  aiRecommendation: string;
  aiSellReason: string;
  aiHoldReason: string;
  aiDisclaimerNoGuarantee: string;
  holdingNotice: string;
  checkAgain: string;

  // Step 7 Retailer or Wholesaler
  whoDoYouWantToSellTo: string;
  retailerTitle: string;
  retailerSubtitle: string;
  wholesalerTitle: string;
  wholesalerSubtitle: string;

  // Buyer List & Details
  nearbyWholesalers: string;
  nearbyRetailers: string;
  call: string;
  callBuyer: string;
  callFarmer: string;
  sendBuyRequest: string;
  lookingFor: string;
  quantityNeeded: string;
  indicativePrice: string;
  statusBuyingToday: string;
  notEnoughHistory: string;
  smallOrderWarning: string;

  // My Buyers
  myBuyersTitle: string;
  addBuyerBtn: string;
  regularCustomer: string;
  usuallyBuys: string;
  typicalQuantity: string;
  buyerName: string;
  shopName: string;
  mobileNumber: string;
  location: string;
  buyerType: string;

  // Requests & Orders
  newBuyerRequest: string;
  accept: string;
  reject: string;
  confirmed: string;
  availableQuantity: string;
  orderCreated: string;
  completed: string;

  // Payment Protection
  paymentProtectionTitle: string;
  paymentSecured: string;
  paymentReleased: string;
  paymentOnHold: string;
  paymentRequired: string;
  deliveryPending: string;
  awaitingConfirmation: string;
  proceedToPayment: string;
  buyerProtectionExplain: string;
  farmerPaymentConfidence: string;
  markDelivered: string;
  confirmDelivery: string;
  raiseDispute: string;
  disputeExplain: string;
  resolveDispute: string;

  // Receipts
  digitalReceipt: string;
  viewReceipt: string;
  downloadReceipt: string;
  printReceipt: string;
  receiptId: string;
  orderId: string;
  seller: string;
  buyer: string;
  totalProduceValue: string;
  totalAmount: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AgriConnect',
    tagline: 'From Farm to the Right Market.',
    sellMyCrop: 'SELL MY CROP',
    sellMyCropSubtitle: 'Upload a photo and get AI quality guidance.',
    home: 'Home',
    sell: 'Sell',
    buyers: 'Buyers',
    myCrops: 'My Crops',
    profile: 'Profile',
    orders: 'Orders',
    askAi: 'Ask AgriConnect',
    namaskar: 'Namaskar',
    demoDataLabel: 'Demo / simulated market data',
    demoPaymentLabel: 'Demo / Simulated Payment',

    whatAreYouSelling: 'What are you selling?',
    selectCropPrompt: 'Select your crop or speak below',
    speak: 'Speak',
    listening: 'Listening... (Speak now)',
    processingVoice: 'Understanding your speech...',
    voiceInstruction: 'Say: "Majhyakade 200 kilo tomato aahe" or "I have 200 kg tomatoes"',
    quantity: 'Quantity',
    unit: 'Unit',
    continueBtn: 'Continue',
    backBtn: 'Back',

    takePhotoTitle: 'Take a Photo',
    takePhotoSubtitle: 'Take a clear, well-lit photo of your harvested crop.',
    takePhotoBtn: 'TAKE PHOTO',
    uploadPhotoBtn: 'UPLOAD PHOTO',
    useThisPhotoBtn: 'USE THIS PHOTO',
    retakePhotoBtn: 'RETAKE PHOTO',
    photoClearPrompt: 'Crop cha clear photo ghya.',

    aiQualityTitle: 'AI QUALITY CHECK',
    aiQualityGrade: 'AI Quality Grade',
    visualCondition: 'Visual condition',
    visibleDamage: 'Visible damage',
    aiConfidence: 'AI confidence',
    aiDisclaimer: 'AI visual quality assessment. Final quality may vary after physical inspection.',
    photoUnclearWarning: 'Photo clear nahi aahe. Please take another photo.',
    gradeA: 'Grade A (Premium)',
    gradeB: 'Grade B (Standard)',
    gradeC: 'Grade C (Secondary)',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    low: 'Low',
    medium: 'Medium',
    high: 'High',

    marketPriceTitle: 'MARKET PRICE',
    marketReference: 'Market / Mandi Reference',
    aiSuggestedPrice: 'Suggested Starting Price',
    priceSuggestionExplainer: 'This is a suggested starting price based on available market reference information and crop grade.',
    setYourPriceTitle: 'SET YOUR SELLING PRICE',
    yourPriceLabel: 'Your Price',
    yourCropWillBeListedAt: 'Your crop will be listed at',
    farmerPriceNotice: 'You control your final price. You can adjust this anytime.',

    whatDoYouWantToDo: 'What do you want to do?',
    sellNow: 'SELL NOW',
    hold: 'HOLD',
    aiRecommendation: 'AI Recommendation',
    aiSellReason: 'Based on available market and buyer information, selling now may be a reasonable option.',
    aiHoldReason: 'Based on available information, waiting may be worth considering.',
    aiDisclaimerNoGuarantee: 'AI does not guarantee future prices. You always decide.',
    holdingNotice: 'Saved under My Crops as Holding.',
    checkAgain: 'CHECK AGAIN',

    whoDoYouWantToSellTo: 'Who do you want to sell to?',
    retailerTitle: 'RETAILER',
    retailerSubtitle: 'Sell smaller quantities directly to shops.',
    wholesalerTitle: 'WHOLESALER',
    wholesalerSubtitle: 'Sell larger quantities in bulk.',

    nearbyWholesalers: 'Nearby Wholesalers',
    nearbyRetailers: 'Nearby Retailers',
    call: 'CALL',
    callBuyer: 'CALL BUYER',
    callFarmer: 'CALL FARMER',
    sendBuyRequest: 'SEND BUY REQUEST',
    lookingFor: 'Looking for',
    quantityNeeded: 'Quantity needed',
    indicativePrice: 'Indicative price',
    statusBuyingToday: 'Buying today',
    notEnoughHistory: 'Not enough transaction history yet.',
    smallOrderWarning: 'This quantity may have higher delivery cost.',

    myBuyersTitle: 'MY BUYERS',
    addBuyerBtn: '+ ADD BUYER',
    regularCustomer: 'Regular customer',
    usuallyBuys: 'Usually buys',
    typicalQuantity: 'Typical quantity',
    buyerName: 'Buyer Name',
    shopName: 'Shop / Business Name',
    mobileNumber: 'Mobile Number',
    location: 'Location',
    buyerType: 'Buyer Type',

    newBuyerRequest: 'New Buyer Request',
    accept: 'ACCEPT',
    reject: 'REJECT',
    confirmed: 'Confirmed',
    availableQuantity: 'Available Quantity',
    orderCreated: 'Order Created',
    completed: 'Completed',

    paymentProtectionTitle: 'AgriConnect Payment Protection',
    paymentSecured: 'Payment Secured ✓',
    paymentReleased: 'Payment Released ✓',
    paymentOnHold: 'Payment On Hold',
    paymentRequired: 'Payment Required',
    deliveryPending: 'Delivery Pending',
    awaitingConfirmation: 'Awaiting Delivery Confirmation',
    proceedToPayment: 'PROCEED TO PAYMENT',
    buyerProtectionExplain: 'Your payment is secured through AgriConnect and will be released according to transaction terms after successful fulfillment.',
    farmerPaymentConfidence: 'Buyer has secured payment. Proceed with safe fulfillment.',
    markDelivered: 'MARK DELIVERED',
    confirmDelivery: 'CONFIRM DELIVERY & RELEASE PAYMENT',
    raiseDispute: 'REPORT ISSUE / DISPUTE',
    disputeExplain: 'Payment temporarily on hold while transaction issue is reviewed.',
    resolveDispute: 'RESOLVE DISPUTE',

    digitalReceipt: 'AgriConnect Digital Receipt',
    viewReceipt: 'VIEW RECEIPT',
    downloadReceipt: 'DOWNLOAD RECEIPT',
    printReceipt: 'PRINT RECEIPT',
    receiptId: 'Receipt ID',
    orderId: 'Order ID',
    seller: 'Seller (Farmer / FPO)',
    buyer: 'Buyer (Shop / Trader)',
    totalProduceValue: 'Produce Value',
    totalAmount: 'Total Amount',
  },

  mr: {
    appName: 'AgriConnect',
    tagline: 'शेतातून योग्य बाजारात.',
    sellMyCrop: 'माझे पीक विका',
    sellMyCropSubtitle: 'पिकाचा फोटो घ्या आणि AI दर्जा मार्गदर्शन मिळवा.',
    home: 'मुख्य पान',
    sell: 'विक्री',
    buyers: 'खरेदीदार',
    myCrops: 'माझी पिके',
    profile: 'प्रोफाइल',
    orders: 'ऑर्डर्स',
    askAi: 'AgriConnect मदतनीस',
    namaskar: 'नमस्कार',
    demoDataLabel: 'डेमो / अंदाजित बाजार माहिती',
    demoPaymentLabel: 'डेमो / सुरक्षित पेमेंट प्रणाली',

    whatAreYouSelling: 'तुम्ही काय विकत आहात?',
    selectCropPrompt: 'खालील पीक निवडा किंवा बोला',
    speak: 'बोला',
    listening: 'ऐकत आहे... (आता बोला)',
    processingVoice: 'तुमचा आवाज समजून घेत आहे...',
    voiceInstruction: 'म्हणा: "माझ्याकडे २०० किलो टोमॅटो आहे"',
    quantity: 'वजन / प्रमाण',
    unit: 'एकक',
    continueBtn: 'पुढे जा',
    backBtn: 'मागे',

    takePhotoTitle: 'पिकाचा फोटो घ्या',
    takePhotoSubtitle: 'पिकाचा स्पष्ट आणि उजेडातला फोटो काढा.',
    takePhotoBtn: 'फोटो काढा',
    uploadPhotoBtn: 'फोटो अपलोड करा',
    useThisPhotoBtn: 'हा फोटो वापरा',
    retakePhotoBtn: 'पुन्हा फोटो घ्या',
    photoClearPrompt: 'पिकाचा स्पष्ट फोटो घ्या.',

    aiQualityTitle: 'AI दर्जा तपासणी',
    aiQualityGrade: 'AI क्वालिटी ग्रेड',
    visualCondition: 'दिसणारा दर्जा',
    visibleDamage: 'दिसणारे नुकसान',
    aiConfidence: 'AI खात्री',
    aiDisclaimer: 'AI द्वारे केलेले हे दृश्य दर्जा परीक्षण आहे. प्रत्यक्ष तपासणीनंतर अंतिम दर्जात फरक पडू शकतो.',
    photoUnclearWarning: 'फोटो स्पष्ट नाही आहे. कृपया दुसरा फोटो घ्या.',
    gradeA: 'ग्रेड A (उत्कृष्ट)',
    gradeB: 'ग्रेड B (चांगला)',
    gradeC: 'ग्रेड C (मध्यम)',
    good: 'उत्तम',
    fair: 'चांगला',
    poor: 'कमी',
    low: 'कमी',
    medium: 'मध्यम',
    high: 'जास्त',

    marketPriceTitle: 'बाजार भाव',
    marketReference: 'मंडी संदर्भ दर',
    aiSuggestedPrice: 'AI सुचवलेला सुरुवातीचा दर',
    priceSuggestionExplainer: 'हा उपलब्ध मंडी दर आणि पिकाच्या दर्जानुसार सुचवलेला सुरुवातीचा दर आहे.',
    setYourPriceTitle: 'तुमचा विक्री दर ठरवा',
    yourPriceLabel: 'तुमचा दर',
    yourCropWillBeListedAt: 'तुमचे पीक या दराने नोंदवले जाईल:',
    farmerPriceNotice: 'अंतिम दर तुम्हीच ठरवता. तुम्ही हा दर कधीही बदलू शकता.',

    whatDoYouWantToDo: 'तुम्हाला काय करायचे आहे?',
    sellNow: 'आता विका',
    hold: 'होल्ड करा',
    aiRecommendation: 'AI शिफारस',
    aiSellReason: 'सध्याच्या बाजार आणि खरेदीदारांच्या स्थितीनुसार आता विकणे योग्य पर्याय असू शकतो.',
    aiHoldReason: 'उपलब्ध माहितीनुसार काही दिवस थांबणे फायदेशीर ठरू शकते.',
    aiDisclaimerNoGuarantee: 'AI भविष्यातील दरांची खात्री देत नाही. निर्णय नेहमी तुमचाच असेल.',
    holdingNotice: 'माझी पिके मध्ये होल्ड म्हणून सुरक्षित ठेवले आहे.',
    checkAgain: 'पुन्हा तपासा',

    whoDoYouWantToSellTo: 'तुम्हाला कोणाला विकायचे आहे?',
    retailerTitle: 'किरकोळ दुकानदार (रिटेलर)',
    retailerSubtitle: 'दुकानदारांना कमी प्रमाणात थेट विका.',
    wholesalerTitle: 'थोक व्यापारी (होलसेलर)',
    wholesalerSubtitle: 'मोठ्या प्रमाणात एकदम माल विका.',

    nearbyWholesalers: 'जवळचे थोक व्यापारी',
    nearbyRetailers: 'जवळचे किरकोळ दुकानदार',
    call: 'कॉल करा',
    callBuyer: 'खरेदीदाराला कॉल करा',
    callFarmer: 'शेतकऱ्याला कॉल करा',
    sendBuyRequest: 'विक्री विनंती पाठवा',
    lookingFor: 'हवे असणारे पीक',
    quantityNeeded: 'हवी असलेली मागणी',
    indicativePrice: 'अंदाजित खरेदी दर',
    statusBuyingToday: 'आज खरेदी चालू आहे',
    notEnoughHistory: 'अजून पुरेसा व्यवहार इतिहास नाही.',
    smallOrderWarning: 'कमी प्रमाणासाठी वाहतूक खर्च जास्त होऊ शकतो.',

    myBuyersTitle: 'माझे नियमित खरेदीदार',
    addBuyerBtn: '+ खरेदीदार जोडा',
    regularCustomer: 'नियमित ग्राहक',
    usuallyBuys: 'नेहमी खरेदी करतो',
    typicalQuantity: 'नेहमीचे प्रमाण',
    buyerName: 'खरेदीदाराचे नाव',
    shopName: 'दुकान / व्यवसायाचे नाव',
    mobileNumber: 'मोबाईल नंबर',
    location: 'ठिकाण',
    buyerType: 'खरेदीदार प्रकार',

    newBuyerRequest: 'नवीन खरेदी विनंती',
    accept: 'स्वीकारा',
    reject: 'नाकारा',
    confirmed: 'निश्चित झाली',
    availableQuantity: 'उपलब्ध प्रमाण',
    orderCreated: 'ऑर्डर तयार झाली',
    completed: 'पूर्ण झाली',

    paymentProtectionTitle: 'AgriConnect पेमेंट संरक्षण',
    paymentSecured: 'पेमेंट सुरक्षित झाले ✓',
    paymentReleased: 'पेमेंट शेतकऱ्याला मिळाले ✓',
    paymentOnHold: 'पेमेंट तात्पुरते थांबवले',
    paymentRequired: 'पेमेंट बाकी आहे',
    deliveryPending: 'डिलिव्हरी बाकी आहे',
    awaitingConfirmation: 'डिलिव्हरी खात्रीची प्रतीक्षा',
    proceedToPayment: 'पेमेंट करा (सुरक्षित)',
    buyerProtectionExplain: 'तुमचे पेमेंट AgriConnect द्वारे सुरक्षित आहे आणि यशस्वी डिलिव्हरीनंतरच शेतकऱ्याला दिले जाईल.',
    farmerPaymentConfidence: 'खरेदीदाराने पैसे जमा केले आहेत. सुरक्षितपणे माल पाठवा.',
    markDelivered: 'माल पोहोचवला नोंदवा',
    confirmDelivery: 'डिलिव्हरी मान्य करा आणि पैसे द्या',
    raiseDispute: 'तक्रार नोंदवा',
    disputeExplain: 'तक्रारीची चौकशी होईपर्यंत पेमेंट थांबवले आहे.',
    resolveDispute: 'तक्रार सोडवा',

    digitalReceipt: 'AgriConnect डिजिटल पावती',
    viewReceipt: 'पावती पहा',
    downloadReceipt: 'पावती डाऊनलोड करा',
    printReceipt: 'पावती प्रिंट करा',
    receiptId: 'पावती क्रमांक',
    orderId: 'ऑर्डर क्रमांक',
    seller: 'विक्रेता (शेतकरी / एफपीओ)',
    buyer: 'खरेदीदार',
    totalProduceValue: 'पिकाचे एकूण मूल्य',
    totalAmount: 'एकूण रक्कम',
  },

  hi: {
    appName: 'AgriConnect',
    tagline: 'खेत से सही बाजार तक।',
    sellMyCrop: 'मेरी फसल बेचें',
    sellMyCropSubtitle: 'फसल की फोटो लें और AI गुणवत्ता मार्गदर्शन पाएं।',
    home: 'होम',
    sell: 'बेचें',
    buyers: 'खरीदार',
    myCrops: 'मेरी फसलें',
    profile: 'प्रोफाइल',
    orders: 'ऑर्डर्स',
    askAi: 'AgriConnect सहायक',
    namaskar: 'नमस्ते',
    demoDataLabel: 'डेमो / अनुमानित मंडी डेटा',
    demoPaymentLabel: 'डेमो / सुरक्षित भुगतान',

    whatAreYouSelling: 'आप क्या बेच रहे हैं?',
    selectCropPrompt: 'फसल चुनें या बोलकर बताएं',
    speak: 'बोलें',
    listening: 'सुन रहे हैं... (अब बोलें)',
    processingVoice: 'आपकी आवाज को समझा जा रहा है...',
    voiceInstruction: 'बोलें: "मेरे पास 200 किलो टमाटर है"',
    quantity: 'मात्रा / वजन',
    unit: 'इकाई',
    continueBtn: 'आगे बढ़ें',
    backBtn: 'वापस',

    takePhotoTitle: 'फसल की फोटो लें',
    takePhotoSubtitle: 'फसल की साफ और रोशनी वाली फोटो लें।',
    takePhotoBtn: 'फोटो लें',
    uploadPhotoBtn: 'फोटो अपलोड करें',
    useThisPhotoBtn: 'यह फोटो इस्तेमाल करें',
    retakePhotoBtn: 'दोबारा फोटो लें',
    photoClearPrompt: 'फसल की साफ फोटो लें।',

    aiQualityTitle: 'AI गुणवत्ता जांच',
    aiQualityGrade: 'AI क्वालिटी ग्रेड',
    visualCondition: 'दृश्य स्थिति',
    visibleDamage: 'दिखने वाला नुकसान',
    aiConfidence: 'AI विश्वास स्तर',
    aiDisclaimer: 'यह AI दृश्य गुणवत्ता अनुमान है। वास्तविक निरीक्षण के बाद गुणवत्ता में अंतर संभव है।',
    photoUnclearWarning: 'फोटो साफ नहीं है। कृपया दूसरी फोटो लें।',
    gradeA: 'ग्रेड A (प्रीमियम)',
    gradeB: 'ग्रेड B (मानक)',
    gradeC: 'ग्रेड C (साधारण)',
    good: 'उत्तम',
    fair: 'अच्छा',
    poor: 'कमजोर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'अधिक',

    marketPriceTitle: 'मंडी भाव',
    marketReference: 'मंडी संदर्भ भाव',
    aiSuggestedPrice: 'AI सुझाया गया शुरुआती भाव',
    priceSuggestionExplainer: 'यह उपलब्ध मंडी संदर्भ और फसल ग्रेड पर आधारित एक सुझाया गया शुरुआती भाव है।',
    setYourPriceTitle: 'अपना बिक्री भाव तय करें',
    yourPriceLabel: 'आपका भाव',
    yourCropWillBeListedAt: 'आपकी फसल इस भाव पर दर्ज होगी:',
    farmerPriceNotice: 'अंतिम भाव आपका अपना फैसला है। आप इसे कभी भी बदल सकते हैं।',

    whatDoYouWantToDo: 'आप क्या करना चाहते हैं?',
    sellNow: 'तुरंत बेचें',
    hold: 'होल्ड करें',
    aiRecommendation: 'AI सलाह',
    aiSellReason: 'उपलब्ध बाजार और खरीदार जानकारी के आधार पर तुरंत बेचना एक समझदारी भरा विकल्प हो सकता है।',
    aiHoldReason: 'उपलब्ध जानकारी के अनुसार कुछ दिन रुकना फायदेमंद हो सकता है।',
    aiDisclaimerNoGuarantee: 'AI भविष्य के भाव की गारंटी नहीं देता। फैसला हमेशा आपका है।',
    holdingNotice: 'मेरी फसलें में होल्ड स्थिति में सुरक्षित कर दिया गया है।',
    checkAgain: 'दोबारा जांचें',

    whoDoYouWantToSellTo: 'आप किसे बेचना चाहते हैं?',
    retailerTitle: 'दुकानदार (रिटेलर)',
    retailerSubtitle: 'दुकानों को छोटी मात्रा सीधे बेचें।',
    wholesalerTitle: 'थोक व्यापारी (होलसेलर)',
    wholesalerSubtitle: 'बड़ी मात्रा थोक में एक साथ बेचें।',

    nearbyWholesalers: 'आसपास के थोक व्यापारी',
    nearbyRetailers: 'आसपास के दुकानदार',
    call: 'कॉल करें',
    callBuyer: 'खरीदार को कॉल करें',
    callFarmer: 'किसान को कॉल करें',
    sendBuyRequest: 'खरीद अनुरोध भेजें',
    lookingFor: 'मांगी गई फसल',
    quantityNeeded: 'मात्रा की जरूरत',
    indicativePrice: 'अनुमानित भाव',
    statusBuyingToday: 'आज खरीद रहे हैं',
    notEnoughHistory: 'अभी पर्याप्त लेनदेन इतिहास नहीं है।',
    smallOrderWarning: 'इस छोटी मात्रा के लिए डिलीवरी लागत अधिक हो सकती है।',

    myBuyersTitle: 'मेरे खरीदार',
    addBuyerBtn: '+ खरीदार जोड़ें',
    regularCustomer: 'नियमित ग्राहक',
    usuallyBuys: 'अक्सर खरीदते हैं',
    typicalQuantity: 'सामान्य मात्रा',
    buyerName: 'खरीदार का नाम',
    shopName: 'दुकान / व्यापार का नाम',
    mobileNumber: 'मोबाइल नंबर',
    location: 'स्थान',
    buyerType: 'खरीदार प्रकार',

    newBuyerRequest: 'नया खरीद अनुरोध',
    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    confirmed: 'स्वीकृत',
    availableQuantity: 'उपलब्ध मात्रा',
    orderCreated: 'ऑर्डर तैयार',
    completed: 'पूर्ण',

    paymentProtectionTitle: 'AgriConnect पेमेंट सुरक्षा',
    paymentSecured: 'पेमेंट सुरक्षित हो गया ✓',
    paymentReleased: 'पेमेंट किसान को जारी किया गया ✓',
    paymentOnHold: 'पेमेंट रोक दिया गया',
    paymentRequired: 'पेमेंट बाकी है',
    deliveryPending: 'डिलीवरी लंबित',
    awaitingConfirmation: 'डिलीवरी पुष्टि की प्रतीक्षा',
    proceedToPayment: 'सुरक्षित भुगतान करें',
    buyerProtectionExplain: 'आपका भुगतान AgriConnect द्वारा सुरक्षित है और सफल डिलीवरी के बाद ही किसान को जारी किया जाएगा।',
    farmerPaymentConfidence: 'खरीदार ने भुगतान जमा कर दिया है। सुरक्षित रूप से माल भेजें।',
    markDelivered: 'डिलीवर किया गया मार्क करें',
    confirmDelivery: 'डिलीवरी कन्फर्म करें और पेमेंट जारी करें',
    raiseDispute: 'शिकायत दर्ज करें',
    disputeExplain: 'मामले की समीक्षा होने तक भुगतान सुरक्षित रूप से रोका गया है।',
    resolveDispute: 'विवाद सुलझाएं',

    digitalReceipt: 'AgriConnect डिजिटल रसीद',
    viewReceipt: 'रसीद देखें',
    downloadReceipt: 'रसीद डाउनलोड करें',
    printReceipt: 'रसीद प्रिंट करें',
    receiptId: 'रसीद संख्या',
    orderId: 'ऑर्डर संख्या',
    seller: 'विक्रेता (किसान / FPO)',
    buyer: 'खरीदार',
    totalProduceValue: 'फसल का कुल मूल्य',
    totalAmount: 'कुल राशि',
  },
};
