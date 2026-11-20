import type { Trip } from './types'

/** Sample trips shown until Supabase is connected. Images from Unsplash. */
export const sampleTrips: Trip[] = [
  {
    id: 'sample-1',
    slug: 'kedarkantha-winter-trek',
    title_en: 'Kedarkantha Winter Trek',
    title_hi: 'केदारकांठा विंटर ट्रेक',
    title_mr: 'केदारकंठा हिवाळी ट्रेक',
    description_en:
      'Walk through snow-laden pine forests to one of the most stunning summit views in the Himalayas. Perfect for first-time trekkers, this 5-day adventure includes campsite stays under starlit skies, bonfires, and a sunrise summit climb at 12,500 ft.',
    description_hi:
      'बर्फ से ढके देवदार के जंगलों से होकर हिमालय के सबसे खूबसूरत शिखर दृश्यों में से एक तक पहुँचें। पहली बार ट्रेक करने वालों के लिए एकदम सही, इस 5-दिवसीय रोमांच में तारों भरे आसमान के नीचे कैम्पसाइट, बोनफायर और 12,500 फीट पर सूर्योदय शिखर चढ़ाई शामिल है।',
    description_mr:
      'बर्फाच्छादित देवदार जंगलांमधून हिमालयातील सर्वात सुंदर शिखर दृश्यांपैकी एकापर्यंत चाला. पहिल्यांदा ट्रेक करणाऱ्यांसाठी उत्तम, या ५ दिवसांच्या साहसात ताऱ्यांनी भरलेल्या आकाशाखाली कॅम्पसाईट, शेकोटी आणि १२,५०० फुटांवर सूर्योदय शिखर चढाई समाविष्ट आहे.',
    destination: 'Uttarakhand',
    region: 'uttarakhand',
    category: 'trek',
    duration_days: 5,
    duration_nights: 4,
    price: 8999,
    start_date: '2026-12-18',
    end_date: '2026-12-22',
    image_url:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Summit at 12,500 ft', 'Snow camping', 'Bonfire nights', 'All meals included'],
    is_active: true,
    is_featured: true,
  },
  {
    id: 'sample-2',
    slug: 'goa-beach-getaway',
    title_en: 'Goa Beach Getaway',
    title_hi: 'गोवा बीच गेटअवे',
    title_mr: 'गोवा बीच गेटवे',
    description_en:
      'Sun, sand and sunsets! A 4-day coastal escape covering North Goa beaches, water sports at Baga, a sunset cruise on the Mandovi river, and a day exploring Old Goa heritage. Stay at a beachside resort with breakfast included.',
    description_hi:
      'धूप, रेत और सूर्यास्त! 4-दिवसीय तटीय यात्रा जिसमें उत्तरी गोवा के समुद्र तट, बागा में वॉटर स्पोर्ट्स, मांडोवी नदी पर सनसेट क्रूज़ और ओल्ड गोवा की विरासत की सैर शामिल है। नाश्ते के साथ बीचसाइड रिसॉर्ट में ठहरें।',
    description_mr:
      'ऊन, वाळू आणि सूर्यास्त! ४ दिवसांची किनारी सहल ज्यात उत्तर गोव्याचे समुद्रकिनारे, बागा येथे वॉटर स्पोर्ट्स, मांडोवी नदीवर सनसेट क्रूझ आणि ओल्ड गोवा वारसा भ्रमंती समाविष्ट आहे. न्याहारीसह बीचसाइड रिसॉर्टमध्ये रहा.',
    destination: 'Goa',
    region: 'goa',
    category: 'beach',
    duration_days: 4,
    duration_nights: 3,
    price: 12499,
    start_date: '2026-12-05',
    end_date: '2026-12-08',
    image_url:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Beachside resort', 'Sunset cruise', 'Water sports', 'Breakfast included'],
    is_active: true,
    is_featured: true,
  },
  {
    id: 'sample-3',
    slug: 'harishchandragad-night-trek',
    title_en: 'Harishchandragad Night Trek',
    title_hi: 'हरिश्चंद्रगढ़ नाइट ट्रेक',
    title_mr: 'हरिश्चंद्रगड रात्र ट्रेक',
    description_en:
      "A thrilling weekend night trek to the legendary Konkan Kada cliff in the Sahyadris. Watch the sunrise from one of Maharashtra's most dramatic viewpoints, explore ancient caves and the Kedareshwar temple. Transport from Pune and Mumbai included.",
    description_hi:
      'सह्याद्रि की प्रसिद्ध कोंकण कड़ा चट्टान तक रोमांचक वीकेंड नाइट ट्रेक। महाराष्ट्र के सबसे नाटकीय दृश्य-स्थलों में से एक से सूर्योदय देखें, प्राचीन गुफाओं और केदारेश्वर मंदिर की खोज करें। पुणे और मुंबई से परिवहन शामिल।',
    description_mr:
      'सह्याद्रीतील प्रसिद्ध कोकण कड्यापर्यंत थरारक वीकेंड रात्र ट्रेक. महाराष्ट्रातील सर्वात नाट्यमय दृश्यस्थळांपैकी एकावरून सूर्योदय पहा, प्राचीन लेणी आणि केदारेश्वर मंदिर एक्सप्लोर करा. पुणे आणि मुंबईहून वाहतूक समाविष्ट.',
    destination: 'Maharashtra',
    region: 'maharashtra',
    category: 'weekend',
    duration_days: 2,
    duration_nights: 1,
    price: 1799,
    start_date: '2026-11-28',
    end_date: '2026-11-29',
    image_url:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Konkan Kada sunrise', 'Ancient caves', 'Pune & Mumbai pickup', 'Expert trek leads'],
    is_active: true,
    is_featured: true,
  },
  {
    id: 'sample-4',
    slug: 'spiti-valley-expedition',
    title_en: 'Spiti Valley Expedition',
    title_hi: 'स्पीति वैली एक्सपेडिशन',
    title_mr: 'स्पिती व्हॅली मोहीम',
    description_en:
      "An epic 7-day road trip through the cold desert mountains of Spiti. Visit the 1000-year-old Key Monastery, the world's highest post office at Hikkim, Chandratal lake, and sleep in cosy homestays under some of the darkest night skies in India.",
    description_hi:
      'स्पीति के ठंडे रेगिस्तानी पहाड़ों से होकर 7-दिवसीय शानदार रोड ट्रिप। 1000 साल पुराने की मठ, हिक्किम में दुनिया के सबसे ऊँचे डाकघर और चंद्रताल झील की यात्रा करें, और भारत के सबसे गहरे रात्रि आकाश के नीचे आरामदायक होमस्टे में रुकें।',
    description_mr:
      'स्पितीच्या थंड वाळवंटी पर्वतांमधून ७ दिवसांची भव्य रोड ट्रिप. १००० वर्ष जुन्या की मठाला, हिक्किम येथील जगातील सर्वात उंच पोस्ट ऑफिसला आणि चंद्रताल तलावाला भेट द्या, आणि भारतातील सर्वात गडद रात्रीच्या आकाशाखाली आरामदायी होमस्टेमध्ये रहा.',
    destination: 'Himachal Pradesh',
    region: 'himachal',
    category: 'roadtrip',
    duration_days: 7,
    duration_nights: 6,
    price: 18999,
    start_date: null,
    end_date: null,
    image_url:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Key Monastery', 'Chandratal lake', 'Homestay experience', 'Stargazing'],
    is_active: true,
    is_featured: false,
  },
  {
    id: 'sample-5',
    slug: 'bali-island-escape',
    title_en: 'Bali Island Escape',
    title_hi: 'बाली आइलैंड एस्केप',
    title_mr: 'बाली आयलंड एस्केप',
    description_en:
      'A 6-day international escape to the island of the gods. Ubud rice terraces, Uluwatu cliff temple sunsets, Nusa Penida island day-trip, and a private pool villa stay. Visa on arrival, airport transfers and daily breakfast included.',
    description_hi:
      'देवताओं के द्वीप की 6-दिवसीय अंतर्राष्ट्रीय यात्रा। उबुद के चावल के खेत, उलुवातु क्लिफ मंदिर के सूर्यास्त, नुसा पेनिडा द्वीप की डे-ट्रिप और प्राइवेट पूल विला में ठहराव। वीज़ा ऑन अराइवल, एयरपोर्ट ट्रांसफर और दैनिक नाश्ता शामिल।',
    description_mr:
      'देवतांच्या बेटावर ६ दिवसांची आंतरराष्ट्रीय सहल. उबुदची भातशेती, उलुवातु क्लिफ मंदिराचे सूर्यास्त, नुसा पेनिडा बेटाची डे-ट्रिप आणि प्रायव्हेट पूल व्हिलामध्ये मुक्काम. व्हिसा ऑन अरायव्हल, विमानतळ हस्तांतरण आणि दररोज न्याहारी समाविष्ट.',
    destination: 'Bali, Indonesia',
    region: 'international',
    category: 'international',
    duration_days: 6,
    duration_nights: 5,
    price: 54999,
    start_date: null,
    end_date: null,
    image_url:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Private pool villa', 'Nusa Penida trip', 'Airport transfers', 'Daily breakfast'],
    is_active: true,
    is_featured: false,
  },
  {
    id: 'sample-6',
    slug: 'kashi-ayodhya-yatra',
    title_en: 'Kashi & Ayodhya Yatra',
    title_hi: 'काशी और अयोध्या यात्रा',
    title_mr: 'काशी आणि अयोध्या यात्रा',
    description_en:
      'A soulful 5-day spiritual journey covering Varanasi and Ayodhya. Witness the grand Ganga Aarti at Dashashwamedh Ghat, sunrise boat ride on the Ganges, Kashi Vishwanath and Ram Mandir darshan with comfortable hotel stays throughout.',
    description_hi:
      'वाराणसी और अयोध्या की 5-दिवसीय आध्यात्मिक यात्रा। दशाश्वमेध घाट पर भव्य गंगा आरती देखें, गंगा में सूर्योदय नौका विहार, काशी विश्वनाथ और राम मंदिर दर्शन, पूरी यात्रा में आरामदायक होटल में ठहराव।',
    description_mr:
      'वाराणसी आणि अयोध्येची ५ दिवसांची आध्यात्मिक यात्रा. दशाश्वमेध घाटावर भव्य गंगा आरती पहा, गंगेत सूर्योदय नौकाविहार, काशी विश्वनाथ आणि राम मंदिर दर्शन, संपूर्ण प्रवासात आरामदायी हॉटेल मुक्काम.',
    destination: 'Uttar Pradesh',
    region: 'other',
    category: 'pilgrimage',
    duration_days: 5,
    duration_nights: 4,
    price: 14999,
    start_date: null,
    end_date: null,
    image_url:
      'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ganga Aarti', 'Sunrise boat ride', 'Temple darshan', 'Hotel stays'],
    is_active: true,
    is_featured: false,
  },
]
