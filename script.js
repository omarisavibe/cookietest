// --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed - Merged Script");

    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'imperial'; // Default to imperial for EN start
    const BASE_BUTTER_GRAMS = 226; // Base butter amount for scaling calculations AND default input
    const BASE_YIELD_MIN = 18; // Base minimum yield for classic recipe at BASE_BUTTER_GRAMS
    const BASE_YIELD_MAX = 24; // Base maximum yield for classic recipe at BASE_BUTTER_GRAMS
    const IMAGE_CLASS_SELECTED = 'selected-type-image'; // Class applied to specific cookie image

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = {
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp',
        comparison: '3-cookie-types.jpg', // Default comparison image
        stuffed: 'stuffed_cookie.webp', // Easter egg image
    };

    // --- DATA (Structured) ---

    // Language Strings
    const langData = {
         en: {
             pageTitle: "🍪 Omar's Cookie Lab! 🍪",
             mainTitle: '<span class="emoji">🍪</span> Omar\'s Insanely Good Cookie Guide! <span class="emoji">🍪</span>',
             chooseStyle: "Pick Your Cookie Destiny:",
             typeClassic: "The Classic Balanced Cookie", // Full name (used for alt text etc.)
             typeClassicShort: "Classic Balanced", // Button text
             typeThick: "The Thick & Gooey Cookie",
             typeThickShort: "Thick & Gooey",
             typeThin: "The Thin & Crispy Cookie",
             typeThinShort: "Thin & Crispy",
             omarsFavText: "Omar's Fave! 😉",
             placeholderSelect: "👆 Select a cookie style above to load the recipe and details! ✨",
             keyDifferencesTitleBase: "🔑 Key Differences Breakdown!",
             keyDifferencesTitleFor: "for", // Used like "Key Differences for [Cookie Name]"
             yieldInfoBase: "Yield:", // Base text for yield line
             yieldInfoApprox: "approx.", // Approx text
             yieldInfoTemplate: "approx. {min}-{max} cookies 🍪", // Template for dynamic yield
             unitLabelEn: "Units:",
             unitLabelAr: "الوحدات:",
             unitImperial: "Imperial",
             unitMetric: "Metric",
             unitCups: "أكواب", // Arabic for Cups
             unitGrams: "جرامات", // Arabic for Grams
             scalerTitle: "🧈 Customize Your Batch Size!",
             scalerDesc: "Enter your starting butter amount (grams) to scale the metric recipe.",
             scalerLabel: "Starting Butter (g):",
             scalerButton: "Update Scale",
             scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup/tbsp) units are approximate and not scaled.",
             recipeTitlePrefix: "Recipe:", // E.g., "Recipe: The Classic Cookie"
             ingredientsTitle: "Ingredients",
             stepsTitle: "Instructions",
             tipsTitle: "💡 Omar's Pro Tips! 🔬", // Combined emojis here
             scienceNoteTitle: "🔬 The Science Bit!",
             howToToastMilkPowderTitle: "Toasting Milk Powder (Optional but Recommended!)",
             howToToastMilkPowderDesc: "Spread milk powder on a baking sheet. Bake at 150°C (300°F) for 5-8 mins, stirring occasionally, until lightly golden and nutty. Watch carefully, it burns fast!",
             toastNutsTitle: "Toasting Nuts (Optional)",
             toastNutsDesc: "Spread nuts on a baking sheet. Bake at 175°C (350°F) for 6-10 mins until fragrant and lightly browned. Let cool before chopping.",
             finalTag: 'Nailed it? Show off your bake! Tag me on Insta: <a href="https://www.instagram.com/omarisavibe/" target="_blank">@omarisavibe</a> 😄',
             alertInvalidButter: 'Invalid butter amount. Please enter a positive number. Resetting to default scale.',

             // Ingredients (Keys match recipeData)
             ingredientButter: "Unsalted Butter",
             ingredientSugarBrown: "Brown Sugar (Light or Dark)",
             ingredientSugarGran: "Granulated Sugar",
             ingredientEgg: "Large Egg(s)",
             ingredientEggYolk: "Large Egg Yolk(s)",
             ingredientVanilla: "Vanilla Extract",
             ingredientFlourAP: "All-Purpose Flour",
             ingredientMilkPowder: "Milk Powder (Whole Fat)",
             ingredientCornstarch: "Cornstarch",
             ingredientBakingSoda: "Baking Soda",
             ingredientSalt: "Salt (Fine Sea Salt)",
             ingredientChocolateChips: "Chocolate Chips or Chunks",
             ingredientNuts: "Chopped Nuts (e.g., Walnuts, Pecans)",
             ingredientFlakySalt: "Flaky Sea Salt",

             // Units
             unitGram: "g",
             unitMl: "ml",
             unitCup: "cup(s)",
             unitTbsp: "tbsp",
             unitTsp: "tsp",
             unitStick: "stick(s)", // (Not used in current recipeData)
             unitOz: "oz", // (Not used)
             unitWhole: " ", // Use space for whole eggs etc.
             unitPinch: "pinch",

             // Notes / Modifiers
             noteRoomTemp: "room temperature",
             noteMelted: "melted",
             noteMeltedCooled: "melted & slightly cooled", // Added for thick
             noteCold: "cold, cubed", // (Not used)
             notePacked: "packed",
             noteToasted: "toasted (see how-to)",
             noteOptional: "optional",
             noteFinishing: "for finishing",
             noteVaries: "amount varies", // (Not used)

             // Key Differences Text (Keys match keyDifferencesData)
             diffTextureTitle: "Texture",
             diffTextureClassic: "Chewy center, crisp edges. The classic contrast.",
             diffTextureThick: "Soft, doughy, gooey center. Minimal crispness.",
             diffTextureThin: "Uniformly crisp and snappy throughout. Buttery.",
             diffSpreadTitle: "Spread & Thickness",
             diffSpreadClassic: "Moderate spread, medium thickness.",
             diffSpreadThick: "Minimal spread, very thick and tall.",
             diffSpreadThin: "Significant spread, very thin.",
             diffFlavorTitle: "Flavor Profile",
             diffFlavorClassic: "Balanced butterscotch and vanilla notes.",
             diffFlavorThick: "Rich, buttery, slightly more intense due to less spread.",
             diffFlavorThin: "Pronounced buttery and caramelized sugar flavor.",
             diffChillTitle: "Chill Time <span class='emoji'>🥶</span>",
             diffChillClassic: "<span class='highlight'>Recommended (30min+)</span>: Enhances texture and prevents over-spreading.",
             diffChillThick: "<span class='critical'>Required (Minimum 1-2 hours)</span>: Essential for thickness and preventing puddles.",
             diffChillThin: "<span class='highlight'>Optional/Short (15-30min)</span>: Mainly for easier handling, not required for crispness.",
             diffButterTitle: "Butter State <span class='emoji'>🧈</span>",
             diffButterClassic: "Softened / Room Temperature.",
             diffButterThick: "Melted (often cooled slightly).",
             diffButterThin: "Melted.",
             diffSugarTitle: "Sugar Ratio",
             diffSugarClassic: "Balanced brown and white sugar.",
             diffSugarThick: "Higher ratio of brown sugar usually.",
             diffSugarThin: "Higher ratio of white sugar often used for crispness.",

             // Steps (Keys match recipeData steps)
             stepPrep: "Preheat oven to 190°C (375°F). Line baking sheets with parchment paper.",
             stepPrepThick: "Line baking sheets with parchment paper. (Oven preheating comes later).",
             stepPrepThin: "Preheat oven to 175°C (350°F). Line baking sheets with parchment paper.",
             stepCreamButterSugar: "In a large bowl, cream together the <span class='highlight'>softened butter</span>, brown sugar, and granulated sugar until light and fluffy (about 2-3 minutes).",
             stepCreamButterSugarThick: "In a large bowl, whisk together the <span class='highlight'>melted (and slightly cooled) butter</span>, brown sugar, and granulated sugar until combined. It won't be fluffy.",
             stepCreamButterSugarThin: "In a large bowl, whisk together the <span class='highlight'>melted butter</span>, brown sugar, and granulated sugar until well combined.",
             stepAddEggsVanilla: "Beat in the egg(s) and vanilla extract until just combined. Don't overmix.",
             stepAddEggsVanillaThick: "Beat in the egg(s), egg yolk(s), and vanilla extract until just combined.",
             stepCombineDry: "In a separate bowl, whisk together the flour, milk powder (if using, toasted or untoasted), cornstarch (if using), baking soda, and salt.",
             stepCombineDryThin: "In a separate bowl, whisk together the flour, baking soda, and salt.",
             stepAddDryToWet: "Gradually add the dry ingredients to the wet ingredients, mixing on low speed (or by hand) until <span class='critical'>just combined</span>. Be careful not to overmix.",
             stepFoldInMixins: "Stir in the chocolate chips and nuts (if using).",
             stepChillClassic: "<span class='highlight'>Chill Dough (Recommended):</span> Cover the bowl and refrigerate for at least 30 minutes (or up to 72 hours) for better texture and less spread.",
             stepChillThick: "<span class='critical'>Chill Dough (Required):</span> Cover the bowl tightly and refrigerate for <span class='highlight'>at least 1-2 hours</span>, or ideally overnight (up to 72 hours). This is crucial for thickness.",
             stepChillThin: "<span class='highlight'>Chill Dough (Optional):</span> You can chill for 15-30 minutes for easier scooping, but it's not essential for the final texture.",
             stepPreheatThick: "Preheat oven to 200°C (400°F) near the end of the chilling time.", // Higher temp for thick
             stepScoopClassic: "Scoop rounded tablespoons (about 45-50g) of dough onto the prepared baking sheets, leaving space between them.",
             stepScoopThick: "Scoop large mounds of dough (about 85-100g or 1/3 cup) onto the prepared baking sheets. Leave <span class='critical'>plenty of space</span> (maybe only 6 per large sheet). Don't flatten them.",
             stepScoopThin: "Scoop small, slightly flattened tablespoons (about 30-35g) of dough onto the prepared baking sheets, leaving ample space as they will spread.",
             stepBakeClassic: "Bake for 9-12 minutes, or until the edges are golden brown and the centers look slightly soft.",
             stepBakeThick: "Bake for 11-14 minutes. The edges should be set and lightly golden, but the centers will look <span class='highlight'>very soft and slightly underdone</span>. This is key for gooiness.",
             stepBakeThin: "Bake for 10-13 minutes, or until the cookies are spread thin, golden brown all over, and the edges are visibly crisping.",
             stepCoolClassic: "Let cookies cool on the baking sheets for 5 minutes before transferring them to a wire rack to cool completely.",
             stepCoolThick: "Let cookies cool on the baking sheets for <span class='highlight'>10-15 minutes</span> (they need to set) before carefully transferring to a wire rack.",
             stepCoolThin: "Let cookies cool on the baking sheets for 2-3 minutes before transferring them to a wire rack to cool completely. They will crisp up as they cool.",
             stepFinishSprinkle: "If desired, sprinkle with flaky sea salt immediately after removing from the oven.",

             // Tips Text (Keys match tipsData)
             tipMeasureFlour: "Spoon flour into your measuring cup and level it off. Don't scoop directly from the bag – this packs it in and leads to dry cookies!",
             tipRoomTemp: "Use <span class='highlight'>room temperature eggs and butter</span> (for classic/softened butter recipes). They combine better for a smoother batter.",
             tipDontOvermix: "<span class='critical'>Don't overmix</span> the dough, especially after adding flour. Mix *just* until combined to keep cookies tender.",
             tipChillDough: "Chilling the dough isn't just for thickness! It <span class='highlight'>deepens flavor</span> and controls spread. Even 30 minutes helps most recipes.",
             tipUnderbakeSlightly: "For chewy or gooey cookies, <span class='highlight'>pull them out when the center looks *slightly* underdone</span>. They'll finish baking on the hot pan.",
             tipParchmentPaper: "Always use parchment paper or a silicone mat. It prevents sticking and promotes even baking.",
             tipCoolingRack: "Transfer cookies to a wire rack after a few minutes on the pan. This stops the bottoms from over-baking and helps them crisp (if applicable).",
             tipChocolateQuality: "Use good quality chocolate chips or chunks. It makes a HUGE difference in flavor!",
             tipToastedMilkPowder: "Toasted milk powder adds a <span class='highlight'>nutty, caramelized depth</span>. Try it, especially in the classic or thick cookies!",
             tipFlakySalt: "A sprinkle of flaky sea salt on top <span class='highlight'>balances sweetness</span> and adds a professional touch. Highly recommend!",
             tipOvenTemp: "Oven temperatures vary! Get an oven thermometer to ensure accuracy. Baking times are guidelines.",
             tipUniformScoops: "Use a cookie scoop for <span class='highlight'>uniform size and even baking</span>. Makes your batch look great too!",

             // Easter Egg
             easterEggTitle: "🤫 Omar's ULTIMATE Stuffed Cookie Secret!",
             easterEggIntro: "Alright, alright, you found the *real* treasure! This is how I make those insane, bakery-style <span class='highlight'>MEGA Stuffed Cookies</span>. It builds on the 'Thick & Gooey' base.",
             easterEggCoreConcept: "The Core Idea:",
             easterEggCoreDesc: "We're taking the chilled 'Thick & Gooey' dough and wrapping it around a frozen ball of deliciousness (like Nutella, Biscoff, ganache, or even another cookie dough!).",
             easterEggStep1: "Make the 'Thick & Gooey' dough as per the recipe. <span class='critical'>Chill it thoroughly (at least 2-3 hours).</span>",
             easterEggStep2: "Prepare your filling: Scoop balls (about 1-1.5 tbsp) of Nutella, Biscoff spread, firm ganache, or cream cheese onto parchment paper. <span class='critical'>Freeze solid (at least 1 hour).</span>",
             easterEggStep3: "Take a large scoop of the chilled cookie dough (maybe 1.5x the normal 'thick' size - ~120-140g). Flatten it in your palm.",
             easterEggStep4: "Place a <span class='highlight'>frozen filling ball</span> in the center.",
             easterEggStep5: "Carefully wrap the cookie dough around the filling, sealing it completely. Roll gently into a ball.",
             easterEggStep6: "<span class='critical'>Chill the stuffed dough balls AGAIN for at least 30-60 minutes.</span> This prevents the filling from exploding.",
             easterEggStep7: "Bake at a slightly lower temperature than the regular thick cookies, maybe <span class='highlight'>190°C (375°F)</span>, for a bit longer, <span class='highlight'>15-18 minutes</span>. Watch for edges setting.",
             easterEggStep8: "<span class='critical'>Cool COMPLETELY</span> on the baking sheet for at least 15-20 minutes before *carefully* moving. They are fragile when hot!",
             easterEggEnjoy: "Enjoy the ridiculously decadent results! 😉",
             stuffedCookieAltText: "A large, thick cookie cut in half revealing a gooey Nutella center.",

             // Science Notes
             scienceClassic: "The balance of softened butter (creamed for air), sugars, and flour creates the classic texture. Chilling allows flour hydration for chewiness and prevents excessive spread.",
             scienceThick: "Melted butter coats flour differently, reducing gluten development. More brown sugar adds moisture and acidity (reacting with baking soda for lift without much spread). Cornstarch absorbs moisture for tenderness. <span class='critical'>Chilling is vital</span> to solidify the fat, preventing the dough from spreading rapidly in the hot oven, allowing it to bake upwards.",
             scienceThin: "Melted butter and often more white sugar promote spread. Less flour or leavening compared to fat/sugar encourages a thinner result. Baking at a moderate temperature allows time for spreading before setting.",
         },
         ar: {
             // --- ARABIC TRANSLATIONS ---
             pageTitle: "🍪 معمل كوكيز عمر! 🍪",
             mainTitle: '<span class="emoji">🍪</span> دليل عمر للكوكيز الرهيبة! <span class="emoji">🍪</span>',
             chooseStyle: "اختر مصير الكوكيز الخاصة بك:",
             typeClassic: "الكوكيز الكلاسيكية المتوازنة",
             typeClassicShort: "كلاسيكية متوازنة",
             typeThick: "الكوكيز السميكة والطرية",
             typeThickShort: "سميكة وطرية",
             typeThin: "الكوكيز الرفيعة والمقرمشة",
             typeThinShort: "رفيعة ومقرمشة",
             omarsFavText: "مفضلة عمر! 😉",
             placeholderSelect: "👆 اختر نوع كوكيز أعلاه لتحميل الوصفة والتفاصيل! ✨",
             keyDifferencesTitleBase: "🔑 تفاصيل الفروقات الأساسية!",
             keyDifferencesTitleFor: "لـِ", // Used like "Key Differences for [Cookie Name]" -> "تفاصيل الفروقات لـ [اسم الكوكيز]"
             yieldInfoBase: "الكمية:",
             yieldInfoApprox: "تقريبًا",
             yieldInfoTemplate: "تقريبًا {min}-{max} قطعة كوكيز 🍪", // AR template
             unitLabelEn: "Units:", // Keep EN label maybe?
             unitLabelAr: "الوحدات:",
             unitImperial: "إمبريال",
             unitMetric: "متري",
             unitCups: "أكواب",
             unitGrams: "جرامات",
             scalerTitle: "🧈 عدّل حجم دفعتك!",
             scalerDesc: "أدخل كمية الزبدة الابتدائية (بالجرام) لتعديل مقادير الوصفة المترية.",
             scalerLabel: "الزبدة الابتدائية (جم):",
             scalerButton: "تحديث المقادير",
             scalerNote: "ملاحظة: يتم تعديل القيم المترية (بالجرام) فقط. الوحدات الإمبريالية (أكواب/ملاعق) تقريبية ولا يتم تعديلها.",
             recipeTitlePrefix: "وصفة:", // E.g., "وصفة: الكوكيز الكلاسيكية"
             ingredientsTitle: "المكونات",
             stepsTitle: "الخطوات",
             tipsTitle: "💡 نصائح عمر الاحترافية! 🔬", // Combined emojis
             scienceNoteTitle: "🔬 الجانب العلمي!",
             howToToastMilkPowderTitle: "تحميص بودرة الحليب (اختياري لكن موصى به!)",
             howToToastMilkPowderDesc: "وزّع بودرة الحليب على صينية خبز. اخبزها على 150°م (300°ف) لمدة 5-8 دقائق، مع التحريك من حين لآخر، حتى يصبح لونها ذهبيًا فاتحًا ورائحتها تشبه المكسرات. راقبها جيدًا، تحترق بسرعة!",
             toastNutsTitle: "تحميص المكسرات (اختياري)",
             toastNutsDesc: "وزّع المكسرات على صينية خبز. اخبزها على 175°م (350°ف) لمدة 6-10 دقائق حتى تفوح رائحتها وتصبح ذهبية اللون قليلاً. دعها تبرد قبل التقطيع.",
             finalTag: 'نجحت؟ شاركنا إبداعك! اعمل لي تاج على انستجرام: <a href="https://www.instagram.com/omarisavibe/" target="_blank">@omarisavibe</a> 😄',
             alertInvalidButter: 'كمية الزبدة غير صالحة. يرجى إدخال رقم موجب. تتم إعادة الضبط إلى المقياس الافتراضي.',

             // Ingredients (AR)
             ingredientButter: "زبدة غير مملحة",
             ingredientSugarBrown: "سكر بني (فاتح أو غامق)",
             ingredientSugarGran: "سكر حبيبات أبيض",
             ingredientEgg: "بيضة كبيرة (بيض)",
             ingredientEggYolk: "صفار بيضة كبيرة (صفار)",
             ingredientVanilla: "خلاصة فانيليا",
             ingredientFlourAP: "دقيق لجميع الأغراض",
             ingredientMilkPowder: "بودرة حليب (كامل الدسم)",
             ingredientCornstarch: "نشا ذرة",
             ingredientBakingSoda: "صودا الخبز (بيكربونات الصوديوم)",
             ingredientSalt: "ملح (ملح بحر ناعم)",
             ingredientChocolateChips: "رقائق أو قطع شوكولاتة",
             ingredientNuts: "مكسرات مقطعة (مثل الجوز، البيكان)",
             ingredientFlakySalt: "ملح بحري قشاري",

             // Units (AR)
             unitGram: "جم",
             unitMl: "مل",
             unitCup: "كوب",
             unitTbsp: "ملعقة كبيرة",
             unitTsp: "ملعقة صغيرة",
             unitStick: "إصبع",
             unitOz: "أونصة",
             unitWhole: " ", // Space for whole
             unitPinch: "رشة",

             // Notes / Modifiers (AR)
             noteRoomTemp: "بدرجة حرارة الغرفة",
             noteMelted: "مذابة",
             noteMeltedCooled: "مذابة ومبردة قليلاً",
             noteCold: "باردة، مقطعة مكعبات",
             notePacked: "مكبوس",
             noteToasted: "محمصة (انظر الطريقة)",
             noteOptional: "اختياري",
             noteFinishing: "للتزيين النهائي",
             noteVaries: "الكمية تختلف",

             // Key Differences Text (AR)
             diffTextureTitle: "القوام",
             diffTextureClassic: "قلب طري، حواف مقرمشة. التباين الكلاسيكي.",
             diffTextureThick: "قلب ناعم، عجيني، ولزج. قرمشة قليلة.",
             diffTextureThin: "مقرمشة وهشة بشكل متساوٍ. زبدية.",
             diffSpreadTitle: "الانتشار والسماكة",
             diffSpreadClassic: "انتشار معتدل، سماكة متوسطة.",
             diffSpreadThick: "انتشار قليل، سميكة جدًا وعالية.",
             diffSpreadThin: "انتشار كبير، رفيعة جدًا.",
             diffFlavorTitle: "النكهة",
             diffFlavorClassic: "نكهات متوازنة من الكراميل والفانيليا.",
             diffFlavorThick: "غنية، زبدية، أكثر كثافة قليلاً بسبب قلة الانتشار.",
             diffFlavorThin: "نكهة زبدية وسكر مكرمل واضحة.",
             diffChillTitle: "وقت التبريد <span class='emoji'>🥶</span>",
             diffChillClassic: "<span class='highlight'>موصى به (30 دقيقة+)</span>: يحسن القوام ويمنع الانتشار الزائد.",
             diffChillThick: "<span class='critical'>مطلوب (1-2 ساعة على الأقل)</span>: أساسي للسماكة ومنع الذوبان.",
             diffChillThin: "<span class='highlight'>اختياري/قصير (15-30 دقيقة)</span>: بشكل أساسي لسهولة التعامل، غير مطلوب للقرمشة.",
             diffButterTitle: "حالة الزبدة <span class='emoji'>🧈</span>",
             diffButterClassic: "طرية / بحرارة الغرفة.",
             diffButterThick: "مذابة (غالبًا مبردة قليلاً).",
             diffButterThin: "مذابة.",
             diffSugarTitle: "نسبة السكر",
             diffSugarClassic: "توازن بين السكر البني والأبيض.",
             diffSugarThick: "عادة نسبة أعلى من السكر البني.",
             diffSugarThin: "غالبًا نسبة أعلى من السكر الأبيض للقرمشة.",

             // Steps (AR)
             stepPrep: "سخّن الفرن إلى 190°م (375°ف). بطّن صواني الخبز بورق زبدة.",
             stepPrepThick: "بطّن صواني الخبز بورق زبدة. (تسخين الفرن لاحقًا).",
             stepPrepThin: "سخّن الفرن إلى 175°م (350°ف). بطّن صواني الخبز بورق زبدة.",
             stepCreamButterSugar: "في وعاء كبير، اخفق <span class='highlight'>الزبدة الطرية</span> والسكر البني والسكر الأبيض معًا حتى يصبح المزيج خفيفًا ورقيقًا (حوالي 2-3 دقائق).",
             stepCreamButterSugarThick: "في وعاء كبير، اخلط <span class='highlight'>الزبدة المذابة (والمبردة قليلاً)</span> والسكر البني والسكر الأبيض معًا حتى يتجانسوا. لن يكون المزيج رقيقًا.",
             stepCreamButterSugarThin: "في وعاء كبير، اخلط <span class='highlight'>الزبدة المذابة</span> والسكر البني والسكر الأبيض معًا حتى يتجانسوا جيدًا.",
             stepAddEggsVanilla: "أضف البيض وخلاصة الفانيليا واخفق حتى يتجانس المزيج فقط. لا تفرط في الخفق.",
             stepAddEggsVanillaThick: "أضف البيض وصفار البيض وخلاصة الفانيليا واخفق حتى يتجانس المزيج فقط.",
             stepCombineDry: "في وعاء منفصل، اخلط الدقيق، بودرة الحليب (إذا استخدمت، محمصة أو غير محمصة)، النشا (إذا استخدمت)، صودا الخبز، والملح.",
             stepCombineDryThin: "في وعاء منفصل، اخلط الدقيق، صودا الخبز، والملح.",
             stepAddDryToWet: "أضف المكونات الجافة تدريجيًا إلى المكونات الرطبة، واخلط على سرعة منخفضة (أو يدويًا) حتى <span class='critical'>يتجانس المزيج فقط</span>. احرص على عدم الإفراط في الخلط.",
             stepFoldInMixins: "أضف رقائق الشوكولاتة والمكسرات (إذا استخدمت) وقلّب.",
             stepChillClassic: "<span class='highlight'>برّد العجينة (موصى به):</span> غطّ الوعاء وضعه في الثلاجة لمدة 30 دقيقة على الأقل (أو حتى 72 ساعة) للحصول على قوام أفضل وتقليل الانتشار.",
             stepChillThick: "<span class='critical'>برّد العجينة (مطلوب):</span> غطّ الوعاء بإحكام وضعه في الثلاجة لمدة <span class='highlight'>1-2 ساعة على الأقل</span>، أو يفضل ليلة كاملة (حتى 72 ساعة). هذا ضروري للسماكة.",
             stepChillThin: "<span class='highlight'>برّد العجينة (اختياري):</span> يمكنك التبريد لمدة 15-30 دقيقة لسهولة التشكيل، لكنه ليس ضروريًا للقوام النهائي.",
             stepPreheatThick: "سخّن الفرن إلى 200°م (400°ف) قرب نهاية وقت التبريد.",
             stepScoopClassic: "شكّل كرات بحجم ملعقة كبيرة (حوالي 45-50 جم) من العجينة وضعها على صواني الخبز المُجهزة، مع ترك مسافة بينها.",
             stepScoopThick: "شكّل أكوامًا كبيرة من العجينة (حوالي 85-100 جم أو 1/3 كوب) على صواني الخبز المُجهزة. اترك <span class='critical'>مسافة كبيرة جدًا</span> بينها (ربما 6 فقط في الصينية الكبيرة). لا تبسطها.",
             stepScoopThin: "شكّل كرات صغيرة مسطحة قليلاً بحجم ملعقة كبيرة (حوالي 30-35 جم) من العجينة وضعها على صواني الخبز المُجهزة، مع ترك مسافة كافية لأنها ستنتشر.",
             stepBakeClassic: "اخبز لمدة 9-12 دقيقة، أو حتى تصبح الحواف ذهبية اللون ويبدو الوسط طريًا قليلاً.",
             stepBakeThick: "اخبز لمدة 11-14 دقيقة. يجب أن تكون الحواف متماسكة وذهبية قليلاً، لكن الوسط سيبدو <span class='highlight'>طريًا جدًا وغير مكتمل النضج قليلاً</span>. هذا هو مفتاح الطراوة.",
             stepBakeThin: "اخبز لمدة 10-13 دقيقة، أو حتى تنتشر الكوكيز وتصبح رفيعة، ذهبية اللون بالكامل، وتظهر الحواف مقرمشة.",
             stepCoolClassic: "اترك الكوكيز تبرد على صواني الخبز لمدة 5 دقائق قبل نقلها إلى رف سلكي لتبرد تمامًا.",
             stepCoolThick: "اترك الكوكيز تبرد على صواني الخبز لمدة <span class='highlight'>10-15 دقيقة</span> (تحتاج لتتماسك) قبل نقلها بحذر إلى رف سلكي.",
             stepCoolThin: "اترك الكوكيز تبرد على صواني الخبز لمدة 2-3 دقائق قبل نقلها إلى رف سلكي لتبرد تمامًا. ستصبح مقرمشة أكثر أثناء تبريدها.",
             stepFinishSprinkle: "إذا رغبت، رش الملح القشاري فور إخراجها من الفرن.",

             // Tips Text (AR)
             tipMeasureFlour: "املأ كوب القياس بالدقيق باستخدام ملعقة ثم سوِّ السطح. لا تغرف الدقيق مباشرة من الكيس – هذا يكبسه ويؤدي إلى كوكيز جافة!",
             tipRoomTemp: "استخدم <span class='highlight'>بيض وزبدة بدرجة حرارة الغرفة</span> (للوصفات الكلاسيكية/الزبدة الطرية). يمتزجون بشكل أفضل لعجينة أنعم.",
             tipDontOvermix: "<span class='critical'>لا تفرط في خلط</span> العجينة، خاصة بعد إضافة الدقيق. اخلط *فقط* حتى يتجانس للحفاظ على طراوة الكوكيز.",
             tipChillDough: "تبريد العجينة ليس فقط للسماكة! إنه <span class='highlight'>يعمق النكهة</span> ويتحكم في الانتشار. حتى 30 دقيقة تساعد معظم الوصفات.",
             tipUnderbakeSlightly: "للحصول على كوكيز طرية أو لزجة، <span class='highlight'>أخرجها عندما يبدو الوسط غير مكتمل النضج *قليلاً*</span>. ستكمل الخبز على الصينية الساخنة.",
             tipParchmentPaper: "استخدم دائمًا ورق زبدة أو حصيرة سيليكون. يمنع الالتصاق ويساعد على خبز متساوٍ.",
             tipCoolingRack: "انقل الكوكيز إلى رف سلكي بعد بضع دقائق على الصينية. هذا يوقف الإفراط في خبز القاع ويساعدها على أن تصبح مقرمشة (إذا كان ذلك مطلوبًا).",
             tipChocolateQuality: "استخدم رقائق أو قطع شوكولاتة ذات نوعية جيدة. تحدث فرقًا كبيرًا في النكهة!",
             tipToastedMilkPowder: "بودرة الحليب المحمصة تضيف <span class='highlight'>عمقًا بنكهة المكسرات والكراميل</span>. جربها، خاصة في الكوكيز الكلاسيكية أو السميكة!",
             tipFlakySalt: "رشة من الملح القشاري على الوجه <span class='highlight'>توازن الحلاوة</span> وتضيف لمسة احترافية. موصى به بشدة!",
             tipOvenTemp: "درجات حرارة الأفران تختلف! احصل على ميزان حرارة للفرن لضمان الدقة. أوقات الخبز هي إرشادات.",
             tipUniformScoops: "استخدم مغرفة كوكيز للحصول على <span class='highlight'>حجم موحد وخبز متساوٍ</span>. تجعل دفعتك تبدو رائعة أيضًا!",

             // Easter Egg (AR)
             easterEggTitle: "🤫 سر عمر النهائي للكوكيز المحشية!",
             easterEggIntro: "حسنًا، حسنًا، لقد وجدت الكنز *الحقيقي*! هذه هي طريقتي لصنع تلك <span class='highlight'>الكوكيز الضخمة المحشية</span> المجنونة على طراز المخابز. إنها مبنية على أساس وصفة 'السميكة والطرية'.",
             easterEggCoreConcept: "الفكرة الأساسية:",
             easterEggCoreDesc: "سنأخذ عجينة 'السميكة والطرية' المبردة ونلفها حول كرة مجمدة من الحشوة اللذيذة (مثل النوتيلا، أو زبدة اللوتس، أو الغاناش، أو حتى عجينة كوكيز أخرى!).",
             easterEggStep1: "اصنع عجينة 'السميكة والطرية' حسب الوصفة. <span class='critical'>برّدها جيدًا (2-3 ساعات على الأقل).</span>",
             easterEggStep2: "جهّز الحشوة: شكّل كرات (حوالي 1-1.5 ملعقة كبيرة) من النوتيلا، زبدة اللوتس، الغاناش المتماسك، أو الجبن الكريمي على ورق زبدة. <span class='critical'>جمّدها تمامًا (ساعة على الأقل).</span>",
             easterEggStep3: "خذ مغرفة كبيرة من عجينة الكوكيز المبردة (ربما 1.5 ضعف حجم 'السميكة' العادية - حوالي 120-140 جم). ابسطها في راحة يدك.",
             easterEggStep4: "ضع <span class='highlight'>كرة الحشوة المجمدة</span> في المنتصف.",
             easterEggStep5: "لف عجينة الكوكيز بحذر حول الحشوة، وأغلقها تمامًا. كوّرها برفق.",
             easterEggStep6: "<span class='critical'>برّد كرات العجين المحشوة مرة أخرى لمدة 30-60 دقيقة على الأقل.</span> هذا يمنع الحشوة من الانفجار.",
             easterEggStep7: "اخبزها على درجة حرارة أقل قليلاً من الكوكيز السميكة العادية، ربما <span class='highlight'>190°م (375°ف)</span>، لمدة أطول قليلاً، <span class='highlight'>15-18 دقيقة</span>. راقب تماسك الحواف.",
             easterEggStep8: "<span class='critical'>برّدها تمامًا</span> على صينية الخبز لمدة 15-20 دقيقة على الأقل قبل نقلها *بحذر*. تكون هشة وهي ساخنة!",
             easterEggEnjoy: "استمتع بالنتائج الفاخرة بجنون! 😉",
             stuffedCookieAltText: "كوكيز كبيرة وسميكة مقطوعة من المنتصف تظهر حشوة نوتيلا لزجة.",

             // Science Notes (AR)
             scienceClassic: "التوازن بين الزبدة الطرية (المخفوقة للهواء)، السكريات، والدقيق يخلق القوام الكلاسيكي. التبريد يسمح بترطيب الدقيق للمضغ ويمنع الانتشار المفرط.",
             scienceThick: "الزبدة المذابة تغلف الدقيق بشكل مختلف، مما يقلل من تطور الغلوتين. المزيد من السكر البني يضيف الرطوبة والحموضة (يتفاعل مع صودا الخبز للرفع دون انتشار كبير). النشا يمتص الرطوبة للطراوة. <span class='critical'>التبريد حيوي</span> لتجميد الدهون، ومنع العجين من الانتشار بسرعة في الفرن الساخن، مما يسمح له بالخبز للأعلى.",
             scienceThin: "الزبدة المذابة وغالبًا المزيد من السكر الأبيض يعززان الانتشار. كمية أقل من الدقيق أو مواد التخمير مقارنة بالدهون/السكر تشجع على نتيجة أرق. الخبز على درجة حرارة معتدلة يتيح وقتًا للانتشار قبل التماسك.",
         }
     };

    // Recipe Data (Structure, amounts, scaling flags)
    const recipeData = {
         classic: {
             id: 'classic',
             nameKey: 'typeClassicShort', // Use short name key
             cardImage: IMAGE_PATHS.classic,
             isOmarFav: false,
             ingredients: [
                 { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: BASE_BUTTER_GRAMS, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteRoomTemp' },
                 { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 210, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' },
                 { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 2, unitKey: 'unitWhole' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteRoomTemp' }, // Scaling eggs is tricky
                 { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '2', unitKey: 'unitTsp' }, metric: { amount: 10, unitKey: 'unitMl', isScalable: false } },
                 { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '2 3/4', unitKey: 'unitCup' }, metric: { amount: 345, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientMilkPowder', emoji: '🥛', imperial: { amount: '2', unitKey: 'unitTbsp' }, metric: { amount: 15, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteToasted', optional: true },
                 { nameKey: 'ingredientCornstarch', emoji: '🌽', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 3, unitKey: 'unitGram', isScalable: true }, optional: true }, // Optional for extra softness
                 { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 6, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '2', unitKey: 'unitCup' }, metric: { amount: 340, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientNuts', emoji: '🥜', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 110, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteOptional', optional: true },
                 { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
             ],
             steps: [ // Use keys matching langData step keys
                 { stepKey: 'stepPrep' },
                 { stepKey: 'stepCreamButterSugar' },
                 { stepKey: 'stepAddEggsVanilla' },
                 { stepKey: 'stepCombineDry' },
                 { stepKey: 'stepAddDryToWet' },
                 { stepKey: 'stepFoldInMixins' },
                 { stepKey: 'stepChillClassic' },
                 { stepKey: 'stepScoopClassic' },
                 { stepKey: 'stepBakeClassic' },
                 { stepKey: 'stepFinishSprinkle', optional: true },
                 { stepKey: 'stepCoolClassic' },
             ],
             toastMilkPowder: true, // Indicates section should be shown
             toastNuts: true,
             scienceNoteKey: 'scienceClassic',
             // Base yield for scaling calc (matches constants)
             baseYieldMin: BASE_YIELD_MIN,
             baseYieldMax: BASE_YIELD_MAX,
         },
         thick: {
             id: 'thick',
             nameKey: 'typeThickShort',
             cardImage: IMAGE_PATHS.thick,
             isOmarFav: true,
             ingredients: [
                 { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: BASE_BUTTER_GRAMS, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteMeltedCooled' }, // Melted & Cooled!
                 { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1 1/4', unitKey: 'unitCup' }, metric: { amount: 265, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' }, // More brown
                 { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 2, unitKey: 'unitWhole' }, metric: { amount: 100, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteRoomTemp' },
                 { nameKey: 'ingredientEggYolk', emoji: '🍳', imperial: { amount: 1, unitKey: 'unitWhole' }, metric: { amount: 18, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteRoomTemp' }, // Extra yolk for richness
                 { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '1', unitKey: 'unitTbsp' }, metric: { amount: 15, unitKey: 'unitMl', isScalable: false } }, // More vanilla
                 { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '3', unitKey: 'unitCup' }, metric: { amount: 380, unitKey: 'unitGram', isScalable: true } }, // Slightly more flour
                 { nameKey: 'ingredientMilkPowder', emoji: '🥛', imperial: { amount: '3', unitKey: 'unitTbsp' }, metric: { amount: 25, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteToasted', optional: true },
                 { nameKey: 'ingredientCornstarch', emoji: '🌽', imperial: { amount: '2', unitKey: 'unitTsp' }, metric: { amount: 6, unitKey: 'unitGram', isScalable: true }, optional: true }, // Cornstarch helps softness
                 { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1 1/4', unitKey: 'unitTsp' }, metric: { amount: 7, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '2.5', unitKey: 'unitCup' }, metric: { amount: 425, unitKey: 'unitGram', isScalable: true } }, // More chocolate!
                 { nameKey: 'ingredientNuts', emoji: '🥜', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 110, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteOptional', optional: true },
                 { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
             ],
             steps: [
                 { stepKey: 'stepPrepThick' }, // Note: No preheat yet
                 { stepKey: 'stepCreamButterSugarThick' }, // Melted butter method
                 { stepKey: 'stepAddEggsVanillaThick' }, // Includes yolk
                 { stepKey: 'stepCombineDry' }, // Standard dry combo, includes cornstarch if optional flag is true
                 { stepKey: 'stepAddDryToWet' },
                 { stepKey: 'stepFoldInMixins' },
                 { stepKey: 'stepChillThick' }, // Critical chill step
                 { stepKey: 'stepPreheatThick' }, // Preheat *after* chilling starts
                 { stepKey: 'stepScoopThick' }, // Large scoops
                 { stepKey: 'stepBakeThick' }, // Bake until just set
                 { stepKey: 'stepFinishSprinkle', optional: true },
                 { stepKey: 'stepCoolThick' }, // Longer cool on pan
             ],
             toastMilkPowder: true,
             toastNuts: true,
             scienceNoteKey: 'scienceThick',
             // Approx base yield for thick (adjust if needed for scaling)
             baseYieldMin: 10,
             baseYieldMax: 12,
         },
         thin: {
             id: 'thin',
             nameKey: 'typeThinShort',
             cardImage: IMAGE_PATHS.thin,
             isOmarFav: false,
             ingredients: [
                 { nameKey: 'ingredientButter', emoji: '🧈', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: BASE_BUTTER_GRAMS, unitKey: 'unitGram', isScalable: true }, noteKey: 'noteMelted' }, // Melted
                 { nameKey: 'ingredientSugarBrown', emoji: '🟫', imperial: { amount: '1/2', unitKey: 'unitCup' }, metric: { amount: 105, unitKey: 'unitGram', isScalable: true }, noteKey: 'notePacked' },
                 { nameKey: 'ingredientSugarGran', emoji: '🍚', imperial: { amount: '1', unitKey: 'unitCup' }, metric: { amount: 200, unitKey: 'unitGram', isScalable: true } }, // More white sugar
                 { nameKey: 'ingredientEgg', emoji: '🥚', imperial: { amount: 1, unitKey: 'unitWhole' }, metric: { amount: 50, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteRoomTemp' }, // Often just one egg
                 { nameKey: 'ingredientVanilla', emoji: '🍦', imperial: { amount: '1', unitKey: 'unitTsp' }, metric: { amount: 5, unitKey: 'unitMl', isScalable: false } },
                 { nameKey: 'ingredientFlourAP', emoji: '🌾', imperial: { amount: '2', unitKey: 'unitCup' }, metric: { amount: 250, unitKey: 'unitGram', isScalable: true } }, // Less flour
                 // No milk powder or cornstarch typically
                 { nameKey: 'ingredientBakingSoda', emoji: '✨', imperial: { amount: '1/2', unitKey: 'unitTsp' }, metric: { amount: 2.5, unitKey: 'unitGram', isScalable: true } }, // Maybe slightly less soda
                 { nameKey: 'ingredientSalt', emoji: '🧂', imperial: { amount: '1/2', unitKey: 'unitTsp' }, metric: { amount: 3, unitKey: 'unitGram', isScalable: true } },
                 { nameKey: 'ingredientChocolateChips', emoji: '🍫', imperial: { amount: '1.5', unitKey: 'unitCup' }, metric: { amount: 255, unitKey: 'unitGram', isScalable: true } }, // Less chocolate needed due to spread
                 { nameKey: 'ingredientFlakySalt', emoji: '💎', imperial: { amount: '1', unitKey: 'unitPinch' }, metric: { amount: 1, unitKey: 'unitGram', isScalable: false }, noteKey: 'noteFinishing', optional: true }
             ],
             steps: [
                 { stepKey: 'stepPrepThin' }, // Lower temp
                 { stepKey: 'stepCreamButterSugarThin' }, // Melted butter
                 { stepKey: 'stepAddEggsVanilla' }, // Usually just egg
                 { stepKey: 'stepCombineDryThin' }, // Simpler dry mix (no cornstarch/milk powder)
                 { stepKey: 'stepAddDryToWet' },
                 { stepKey: 'stepFoldInMixins' },
                 { stepKey: 'stepChillThin' }, // Optional chill
                 { stepKey: 'stepScoopThin' }, // Smaller, flatter scoops
                 { stepKey: 'stepBakeThin' }, // Bake until crisp
                 { stepKey: 'stepFinishSprinkle', optional: true },
                 { stepKey: 'stepCoolThin' }, // Quick cool on pan
             ],
             toastMilkPowder: false, // Not typical for thin/crispy
             toastNuts: false, // Less common, can add if desired
             scienceNoteKey: 'scienceThin',
             // Approx base yield for thin
             baseYieldMin: 24,
             baseYieldMax: 30,
         }
     };

    // Key Differences Data
    const keyDifferencesData = {
         classic: [
             { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureClassic' },
             { emoji: '📏', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadClassic' },
             { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterClassic' },
             { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarClassic' },
             { emoji: '❄️', titleKey: 'diffChillTitle', descKey: 'diffChillClassic' }, // Consistent emoji
             { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorClassic' },
         ],
         thick: [
             { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureThick' },
             { emoji: '🧱', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadThick' },
             { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterThick' },
             { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarThick' },
             { emoji: '🥶', titleKey: 'diffChillTitle', descKey: 'diffChillThick' }, // Specific emoji
             { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorThick' },
         ],
         thin: [
             { emoji: '😋', titleKey: 'diffTextureTitle', descKey: 'diffTextureThin' },
             { emoji: '🧇', titleKey: 'diffSpreadTitle', descKey: 'diffSpreadThin' }, // Specific emoji
             { emoji: '🧈', titleKey: 'diffButterTitle', descKey: 'diffButterThin' },
             { emoji: '🍬', titleKey: 'diffSugarTitle', descKey: 'diffSugarThin' },
             { emoji: '⏳', titleKey: 'diffChillTitle', descKey: 'diffChillThin' }, // Specific emoji
             { emoji: '👅', titleKey: 'diffFlavorTitle', descKey: 'diffFlavorThin' },
         ]
     };

    // Tips Data
    const tipsData = [
         { emoji: '🥄', tipKey: 'tipMeasureFlour' },
         { emoji: '🌡️', tipKey: 'tipRoomTemp' },
         { emoji: '🚫', tipKey: 'tipDontOvermix' },
         { emoji: '🥶', tipKey: 'tipChillDough' },
         { emoji: '🤔', tipKey: 'tipUnderbakeSlightly' },
         { emoji: '📜', tipKey: 'tipParchmentPaper' },
         { emoji: '♨️', tipKey: 'tipCoolingRack' },
         { emoji: '⭐', tipKey: 'tipChocolateQuality' },
         { emoji: '🥛', tipKey: 'tipToastedMilkPowder' },
         { emoji: '💎', tipKey: 'tipFlakySalt' },
         { emoji: '🔥', tipKey: 'tipOvenTemp' },
         { emoji: '🍪', tipKey: 'tipUniformScoops' },
     ];

    // Easter Egg Data
    const easterEggData = {
         titleKey: 'easterEggTitle',
         introKey: 'easterEggIntro',
         coreConceptKey: 'easterEggCoreConcept',
         coreDescKey: 'easterEggCoreDesc',
         imageSrc: IMAGE_PATHS.stuffed, // Use path from constants
         imageAltKey: 'stuffedCookieAltText',
         steps: [ // Use keys from langData for steps
             'easterEggStep1', 'easterEggStep2', 'easterEggStep3',
             'easterEggStep4', 'easterEggStep5', 'easterEggStep6',
             'easterEggStep7', 'easterEggStep8'
         ],
         enjoyKey: 'easterEggEnjoy'
     };

    // --- STATE VARIABLES ---
    let currentLang = DEFAULT_LANG;
    let currentCookieType = null; // 'classic', 'thick', 'thin'
    let currentUnits = DEFAULT_UNIT; // 'imperial' or 'metric'
    let currentScaleFactor = 1;

    // --- DOM ELEMENT REFERENCES ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const cookieTypeButtons = document.querySelectorAll('.selector-btn'); // Target the buttons directly
    const selectedCookieImage = document.getElementById('selected-cookie-image');
    const contentPlaceholder = document.querySelector('.content-placeholder');
    const keyDifferencesSection = document.getElementById('key-differences');
    const keyDiffPointsContainer = keyDifferencesSection?.querySelector('.diff-points');
    const keyDiffTitleElement = keyDifferencesSection?.querySelector('h3');
    const keyDiffDynamicNameSpan = keyDiffTitleElement?.querySelector('.dynamic-cookie-name');
    const recipeScalerSection = document.getElementById('recipe-scaler');
    const butterInput = document.getElementById('butter-amount-input');
    const updateScaleBtn = document.getElementById('update-scale-btn');
    const recipeDetailsSection = document.getElementById('recipe-details');
    const tipsListContainer = document.getElementById('tips-list');
    const yieldInfoDisplay = document.getElementById('yield-info-display'); // Specific element for yield
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');
    const omarsFavText = document.querySelector('.omars-fav-text'); // Omar's Fav tag
    const easterEggSection = document.getElementById('easter-egg-container');
    const scrollFadeElements = document.querySelectorAll('.fade-in-on-scroll'); // Elements for scroll animation

    // --- HELPER FUNCTIONS ---

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get translated text safely
    function getText(key, lang = currentLang, fallback = '') {
        return langData[lang]?.[key] ?? fallback;
    }

    // Format ingredient amounts (handles scaling display)
    function formatAmount(amount) {
        if (typeof amount === 'number') {
            // Basic rounding for metric scaled values
            if (amount === 0) return "0"; // Handle zero case
            if (amount < 1 && amount > 0) return amount.toFixed(1); // e.g., 0.5
            if (amount < 10) return parseFloat(amount.toFixed(1)); // e.g., 6.5, remove trailing .0
            return Math.round(amount); // Round whole numbers
        }
        // Handle fractions like "1/2", "2 3/4" - keep as string
        return amount;
    }

    // Show/Hide content sections using CSS classes
    function showContentSection(sectionElement) {
         if (!sectionElement) return;
         sectionElement.classList.remove('visually-hidden');
         requestAnimationFrame(() => {
             requestAnimationFrame(() => { // Double RAF trick
                 sectionElement.classList.add('visible');
             });
         });
     }

     function hideContentSection(sectionElement) {
         if (!sectionElement) return;
         sectionElement.classList.remove('visible');
         const style = getComputedStyle(sectionElement);
         const delay = (parseFloat(style.transitionDuration) + parseFloat(style.transitionDelay)) * 1000;

         // Add visually-hidden slightly after transition starts to fade out
         setTimeout(() => {
             // Re-check if it's still supposed to be hidden before applying class
             if (!sectionElement.classList.contains('visible')) {
                 sectionElement.classList.add('visually-hidden');
             }
         }, delay * 0.9); // Apply just before transition ends
     }

    // --- CORE FUNCTIONS ---

    // Function to update all text based on the current language
    function updateTextContent(lang = currentLang) {
        console.log(`Updating text content for language: ${lang}`);
        const elements = document.querySelectorAll('[data-lang-key]');
        if (!langData[lang]) {
            console.error(`Language data for "${lang}" not found.`);
            return;
        }

        document.title = getText('pageTitle', lang); // Update page title

        elements.forEach(el => {
            const key = el.dataset.langKey;
            const text = getText(key, lang);

            if (text !== undefined) {
                // Handle specific elements that allow HTML or need special formatting
                if (['mainTitle', 'finalTag', 'omarsFavText', 'scalerNote', 'diffChillTitle', 'diffButterTitle'].includes(key) || el.closest('.tip-box') || el.closest('.steps-list') || el.closest('.ingredient-list .note')) {
                     el.innerHTML = text; // Allow HTML in titles, tag, tips, steps, notes
                } else if (el.tagName === 'BUTTON') {
                     el.textContent = text; // Button text
                } else if (el.id === 'yield-info-display') {
                    // Yield is handled by updateYieldInfo()
                } else if (el.classList.contains('dynamic-cookie-name') || key === 'keyDifferencesTitleBase') {
                    // Key diff title handled by populateKeyDifferences
                } else {
                    // Default: use textContent for safety
                    el.textContent = text;
                }
            } else if (key && !['yieldInfoBase', 'placeholderSelect'].includes(key)) {
                // console.warn(`Lang key "${key}" not found for lang "${lang}" on element:`, el);
            }
        });

        // Update body direction and lang attribute
        document.documentElement.lang = lang;
        body.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Refresh dynamic content if a cookie is selected
        if (currentCookieType) {
            populateKeyDifferences(currentCookieType, lang);
            debouncedRegenerateRecipe(currentCookieType, lang, currentUnits, currentScaleFactor);
            populateTips(lang); // Refresh tips translations
            if (easterEggSection.classList.contains('visible')) {
                populateEasterEgg(lang);
            }
        } else {
            // Update placeholder text if no cookie selected
            const placeholderP = contentPlaceholder?.querySelector('p');
             if (placeholderP) {
                 placeholderP.textContent = getText('placeholderSelect', lang);
             }
             populateTips(lang); // Still populate tips even if no recipe selected
        }

         // Update yield text regardless of cookie selection
         updateYieldInfo();
         // Show/hide correct unit toggles and update their text/active states
         updateUnitToggleUI();

        console.log(`Text updated for ${lang}, dir set to ${body.dir}`);
    }

    // Function to handle language button clicks
    function handleLanguageChange(event) {
        const newLang = event.target.dataset.lang;
        if (newLang && newLang !== currentLang) {
            console.log(`Language change requested: ${newLang}`);
            currentLang = newLang;
            // Update button active states
            langButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === newLang);
            });
            // Update all text and dynamic content
            updateTextContent(newLang);
            // Set default units for the new language if no cookie selected yet
            if (!currentCookieType) {
                currentUnits = (newLang === 'ar') ? 'metric' : 'imperial';
            }
        }
    }

     // Function to update Yield Info text based on current state
     function updateYieldInfo() {
         const template = getText('yieldInfoTemplate', currentLang);
         if (!template || !yieldInfoDisplay) return;

         let yieldText = '';
         if (currentCookieType && recipeData[currentCookieType]) {
            const recipe = recipeData[currentCookieType];
            const baseMin = recipe.baseYieldMin || BASE_YIELD_MIN;
            const baseMax = recipe.baseYieldMax || BASE_YIELD_MAX;

             const scaledMinYield = Math.max(1, Math.round(baseMin * currentScaleFactor));
             const scaledMaxYield = Math.max(scaledMinYield, Math.round(baseMax * currentScaleFactor));

             yieldText = template
                 .replace('{min}', scaledMinYield)
                 .replace('{max}', scaledMaxYield);
         } else {
             yieldText = getText('yieldInfoBase', currentLang, ''); // Show base text or empty
             if (yieldText === 'Yield:') yieldText = ''; // Hide generic base text
         }

         yieldInfoDisplay.innerHTML = yieldText; // Use innerHTML for emoji
     }


    // --- Unit Toggle Functions ---

    // Creates and returns the HTML string for the unit toggles
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const tempWrapper = document.createElement('div');
        tempWrapper.innerHTML = unitTogglesTemplate.innerHTML;
        return tempWrapper.innerHTML;
    }

    // Updates visibility and active states of unit toggles *within the recipe details*
    function updateUnitToggleUI() {
        const clonedToggleContainer = recipeDetailsSection.querySelector('.recipe-unit-toggle');
        if (!clonedToggleContainer) return;

        const enSelector = clonedToggleContainer.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = clonedToggleContainer.querySelector('.unit-selector[data-lang="ar"]');
        const lang = currentLang;

        if (enSelector && arSelector) {
            enSelector.style.display = lang === 'en' ? 'inline-block' : 'none';
            arSelector.style.display = lang === 'ar' ? 'inline-block' : 'none';

            // Update button text based on language using data-lang-key
            enSelector.querySelectorAll('[data-lang-key]').forEach(el => {
                 const key = el.dataset.langKey;
                 if (key && el.tagName === 'BUTTON') el.textContent = getText(key, lang);
                 else if (key) el.textContent = getText(key, lang); // For labels etc.
            });
            arSelector.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.dataset.langKey;
                if (key && el.tagName === 'BUTTON') el.textContent = getText(key, lang);
                else if (key) el.textContent = getText(key, lang); // For labels etc.
            });

            // Update active button state
            const allUnitButtons = clonedToggleContainer.querySelectorAll('.unit-btn');
            allUnitButtons.forEach(btn => {
                const btnUnit = btn.dataset.unitType; // imperial, metric, cups, grams
                let isActive = false;
                 if (currentUnits === 'imperial') {
                    isActive = (btnUnit === 'imperial' || btnUnit === 'cups');
                 } else { // currentUnits === 'metric'
                     isActive = (btnUnit === 'metric' || btnUnit === 'grams');
                 }
                btn.classList.toggle('active', isActive);
            });
        }
    }

    // Handles clicks on unit buttons (delegated to recipeDetailsSection)
    function handleUnitChange(event) {
        const button = event.target.closest('.unit-btn');
        if (!button || !recipeDetailsSection.contains(button)) return;

        const newUnitType = button.dataset.unitType; // imperial, metric, cups, grams
        const oldUnits = currentUnits; // Store old state ('imperial' or 'metric')

        if (newUnitType === 'imperial' || newUnitType === 'cups') {
            currentUnits = 'imperial';
        } else {
            currentUnits = 'metric';
        }

        console.log(`Unit change requested: ${newUnitType}, State set to: ${currentUnits}`);

        if (oldUnits !== currentUnits && currentCookieType) {
            updateUnitToggleUI();
            regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
        } else {
             updateUnitToggleUI(); // Still update active state
        }
    }

    // --- Scaling Function ---
    function handleRecipeScale() {
        const newButterAmount = parseFloat(butterInput.value);
        let updateSuccessful = false;

        if (!isNaN(newButterAmount) && newButterAmount > 0) {
            currentScaleFactor = newButterAmount / BASE_BUTTER_GRAMS;
            butterInput.value = newButterAmount;
            updateSuccessful = true;
            console.log(`Scaling factor updated to: ${currentScaleFactor.toFixed(3)} (Butter: ${newButterAmount}g)`);

             // Force units to metric when scaling
             currentUnits = 'metric';

             if (currentCookieType) {
                 regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
                 updateYieldInfo();
                 updateUnitToggleUI();
             }
        } else {
            currentScaleFactor = 1;
            butterInput.value = BASE_BUTTER_GRAMS;
             alert(getText('alertInvalidButter', currentLang));
             if (currentCookieType) {
                 currentUnits = (currentLang === 'ar') ? 'metric' : 'imperial'; // Reset units based on lang
                 regenerateRecipeHTML(currentCookieType, currentLang, currentUnits, currentScaleFactor);
                 updateYieldInfo();
                 updateUnitToggleUI();
             }
        }

        if (updateSuccessful && recipeScalerSection) {
            recipeScalerSection.classList.add('updated');
            setTimeout(() => {
                recipeScalerSection.classList.remove('updated');
            }, 400);
        }
    }

    // --- Content Population Functions ---

    // Populates Key Differences section
    function populateKeyDifferences(cookieType, lang) {
        const diffs = keyDifferencesData[cookieType];
        if (!diffs || !keyDifferencesSection || !keyDiffPointsContainer || !keyDiffTitleElement || !keyDiffDynamicNameSpan) return;

        keyDiffPointsContainer.innerHTML = ''; // Clear previous points

        // Update title base text and dynamic name
        keyDiffTitleElement.querySelector('[data-lang-key]').textContent = getText('keyDifferencesTitleBase', lang);
        const cookieName = getText(recipeData[cookieType]?.nameKey || '', lang);
        keyDiffDynamicNameSpan.textContent = ` ${getText('keyDifferencesTitleFor', lang)} ${cookieName}`;


        diffs.forEach(diff => {
            const titleText = getText(diff.titleKey, lang);
            const descText = getText(diff.descKey, lang);

            const pointDiv = document.createElement('div');
            pointDiv.className = 'diff-point';
            // Use innerHTML for title and desc to allow spans/emojis
            pointDiv.innerHTML = `<h4><span class="emoji">${diff.emoji || '🔹'}</span> ${titleText}</h4><p>${descText}</p>`;
            keyDiffPointsContainer.appendChild(pointDiv);
        });
    }

    // Populates Tips section
    function populateTips(lang) {
        if (!tipsData || !tipsListContainer) return;

        tipsListContainer.innerHTML = ''; // Clear previous tips

         // Update tip box title
         const tipBoxTitleElement = document.querySelector('.tip-box h3[data-lang-key="tipsTitle"]');
         if(tipBoxTitleElement) {
             tipBoxTitleElement.innerHTML = getText('tipsTitle', lang); // Use innerHTML for emojis
         }

        tipsData.forEach(tip => {
            const tipText = getText(tip.tipKey, lang);
            const li = document.createElement('li');
            li.dataset.emoji = tip.emoji || '💡';
            // Use innerHTML because tip text might contain HTML spans
            li.innerHTML = `<div>${tipText}</div>`; // Wrap in div
            tipsListContainer.appendChild(li);
        });
    }

    // Populates the Easter Egg section
    function populateEasterEgg(lang) {
         const data = easterEggData;
         if (!data || !easterEggSection) return;

         easterEggSection.innerHTML = ''; // Clear previous

         let listItems = '';
         data.steps.forEach(stepKey => {
             listItems += `<li>${getText(stepKey, lang)}</li>`;
         });

         const html = `
              <h3 data-lang-key="${data.titleKey}">${getText(data.titleKey, lang)}</h3>
              <div class="easter-egg-content">
                  <p data-lang-key="${data.introKey}">${getText(data.introKey, lang)}</p>
                  <img id="stuffed-cookie-image" src="${data.imageSrc}" alt="${getText(data.imageAltKey, lang)}">
                  <strong data-lang-key="${data.coreConceptKey}">${getText(data.coreConceptKey, lang)}</strong>
                  <p data-lang-key="${data.coreDescKey}">${getText(data.coreDescKey, lang)}</p>
                  <ul>${listItems}</ul>
                  <p><strong>${getText(data.enjoyKey, lang)}</strong></p>
              </div>
          `;
         easterEggSection.innerHTML = html;
     }


    // Generates and updates the recipe details HTML
    function regenerateRecipeHTML(cookieType, lang, units, scale = 1) {
        console.log(`Generating recipe for: ${cookieType}, Lang: ${lang}, Units: ${units}, Scale: ${scale.toFixed(2)}`);
        const recipe = recipeData[cookieType];
        if (!recipe || !recipeDetailsSection) {
            // If placeholder exists, update its text, otherwise inject it
            const placeholderP = contentPlaceholder?.querySelector('p');
            if (placeholderP) {
                placeholderP.textContent = getText('placeholderSelect', lang);
                hideContentSection(recipeDetailsSection); // Ensure recipe section is hidden
                showContentSection(contentPlaceholder); // Show placeholder
            } else {
                recipeDetailsSection.innerHTML = `<div class="placeholder"><p>${getText('placeholderSelect', lang)}</p></div>`;
            }
            return;
        }

        let recipeContentHtml = ''; // Build the HTML for the content area

        // 1. Recipe Title
        const recipeTitle = `${getText('recipeTitlePrefix', lang)} ${getText(recipe.nameKey, lang)}`;
        recipeContentHtml += `<h3>${recipeTitle}</h3>`;

         // 2. Unit Toggles HTML
         recipeContentHtml += `<div class="recipe-unit-toggle">${createUnitTogglesHTML()}</div>`;

        // 3. Ingredients List
        recipeContentHtml += `<h4 class="list-header" data-lang-key="ingredientsTitle">${getText('ingredientsTitle', lang)}</h4>`;
        recipeContentHtml += '<ul class="ingredient-list">';

        recipe.ingredients.forEach(ing => {
            // Skip optional ingredients if they shouldn't be shown (e.g., flaky salt step missing)
            // This logic can be expanded if needed
            if (ing.optional && ing.nameKey === 'ingredientFlakySalt' && !recipe.steps.some(s => s.stepKey === 'stepFinishSprinkle')) {
                return; // Skip flaky salt if the sprinkle step isn't present
            }

            let displayAmount, displayUnitKey, amountValue;
            const isMetricView = (units === 'metric'); // Simplified check

            // Determine which unit system to display
            if (isMetricView && ing.metric) { // Check if metric data exists
                displayAmount = ing.metric.amount;
                displayUnitKey = ing.metric.unitKey;
                amountValue = ing.metric.amount;
                // Apply scaling ONLY to metric amounts marked as scalable
                if (ing.metric.isScalable && scale !== 1 && typeof amountValue === 'number') {
                    displayAmount = amountValue * scale;
                }
            } else if (ing.imperial) { // Fallback to imperial if metric not wanted or not available
                displayAmount = ing.imperial.amount;
                displayUnitKey = ing.imperial.unitKey;
                amountValue = null; // Imperial not scaled numerically here
            } else {
                // Handle case where neither unit is available (shouldn't happen with good data)
                displayAmount = 'N/A';
                displayUnitKey = '';
            }


            const formattedAmount = formatAmount(displayAmount);
            const unitText = displayUnitKey ? getText(displayUnitKey, lang) : '';
            const ingredientName = getText(ing.nameKey, lang);
            const optionalText = ing.optional ? `<em class="note">(${getText('noteOptional', lang)})</em>` : '';
            // Handle notes: use innerHTML for potential spans from old data structure compatibility or future use
            const noteHtml = ing.noteKey ? `<span class="note">${getText(ing.noteKey, lang)}</span>` : '';


            recipeContentHtml += `<li data-emoji="${ing.emoji || '🍪'}">
                         <div>
                             <strong>${formattedAmount} ${unitText}</strong> ${ingredientName} ${optionalText}
                             ${noteHtml}
                          </div>
                      </li>`;
        });
        recipeContentHtml += '</ul>';

        // 4. Optional Toasting Instructions - ADDED
         if (recipe.toastMilkPowder && recipe.ingredients.some(i => i.nameKey === 'ingredientMilkPowder')) {
             recipeContentHtml += `
                 <div class="how-to-toast">
                     <h4 data-lang-key="howToToastMilkPowderTitle">${getText('howToToastMilkPowderTitle', lang)}</h4>
                     <p data-lang-key="howToToastMilkPowderDesc">${getText('howToToastMilkPowderDesc', lang)}</p>
                 </div>`;
         }
         if (recipe.toastNuts && recipe.ingredients.some(i => i.nameKey === 'ingredientNuts')) {
             recipeContentHtml += `
                 <div class="how-to-toast">
                     <h4 data-lang-key="toastNutsTitle">${getText('toastNutsTitle', lang)}</h4>
                     <p data-lang-key="toastNutsDesc">${getText('toastNutsDesc', lang)}</p>
                 </div>`;
         }

        // 5. Steps List
        recipeContentHtml += `<h4 class="list-header" data-lang-key="stepsTitle">${getText('stepsTitle', lang)}</h4>`;
        recipeContentHtml += '<ol class="steps-list">';
        recipe.steps.forEach(step => {
             // Skip optional steps if their condition isn't met
             if (step.optional && step.stepKey === 'stepFinishSprinkle' && !recipe.ingredients.some(ing => ing.nameKey === 'ingredientFlakySalt')) {
                 return; // Skip sprinkle step if no flaky salt ingredient listed
             }

             const stepText = getText(step.stepKey, lang);
             recipeContentHtml += `<li><div>${stepText}</div></li>`; // Use innerHTML for spans
        });
        recipeContentHtml += '</ol>';

        // 6. Optional Science Note
        if (recipe.scienceNoteKey) {
            recipeContentHtml += `
                 <div class="science-note">
                      <h4><span class="emoji">🔬</span> ${getText('scienceNoteTitle', lang)}</h4>
                      <p>${getText(recipe.scienceNoteKey, lang)}</p>
                 </div>`;
        }

        // Inject the built HTML content into the recipe details section
        // IMPORTANT: Clear previous content first to avoid appending
        recipeDetailsSection.innerHTML = `<div class="recipe-content-area">${recipeContentHtml}</div>`; // Wrap in content area

        // Add theme class for styling
        recipeDetailsSection.className = 'recipe-container'; // Reset classes first
        recipeDetailsSection.classList.add(`${cookieType}-theme`); // Add theme

        // Update UI elements AFTER injecting HTML
        updateYieldInfo();
        updateUnitToggleUI(); // Ensure toggles reflect current state
    }

    // Debounced version of recipe generation
    const debouncedRegenerateRecipe = debounce(regenerateRecipeHTML, 150);

    // --- Event Handlers ---

    // Handles clicks on the main cookie type selector buttons
    function handleCookieTypeSelect(event) {
        const button = event.currentTarget;
        const type = button.dataset.type;

        if (!type || !recipeData[type]) {
            console.error("Invalid cookie type selected:", type);
            return;
        }

        // Easter Egg Trigger: Click Thick button again if already active
        if (type === 'thick' && button.classList.contains('active')) {
            console.log("Easter Egg triggered!");
             hideContentSection(keyDifferencesSection);
             hideContentSection(recipeScalerSection);
             hideContentSection(recipeDetailsSection);
             hideContentSection(contentPlaceholder); // Hide placeholder too
             populateEasterEgg(currentLang);
             showContentSection(easterEggSection);
             easterEggSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             return; // Stop normal processing
        }

        // --- Normal Type Selection ---
         const previousType = currentCookieType;
         currentCookieType = type;

        // Update button active states
        cookieTypeButtons.forEach(btn => {
             btn.classList.remove('active');
             btn.setAttribute('aria-pressed', 'false');
         });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');


        // Update header image
        const imagePath = recipeData[type].cardImage || IMAGE_PATHS.comparison;
        selectedCookieImage.src = imagePath;
        selectedCookieImage.alt = getText(recipeData[type].nameKey, currentLang); // Use nameKey for alt
        selectedCookieImage.classList.add(IMAGE_CLASS_SELECTED);

        // Show/Hide Omar's Fav Text
        omarsFavText.classList.toggle('visible', recipeData[type].isOmarFav);
        omarsFavText.classList.toggle('visually-hidden', !recipeData[type].isOmarFav);

        // Hide placeholder and potentially the Easter Egg
        hideContentSection(contentPlaceholder);
        hideContentSection(easterEggSection); // Always hide easter egg unless explicitly triggered

        // Populate and Show relevant sections
        populateKeyDifferences(type, currentLang);
        showContentSection(keyDifferencesSection);

        // Reset scale factor and input, show scaler
        currentScaleFactor = 1;
        butterInput.value = BASE_BUTTER_GRAMS;
        showContentSection(recipeScalerSection);

        // Set initial units based on language (EN->imperial, AR->metric)
        currentUnits = (currentLang === 'ar') ? 'metric' : 'imperial';

        // Generate and show recipe
        regenerateRecipeHTML(type, currentLang, currentUnits, currentScaleFactor); // Regenerate immediately
        showContentSection(recipeDetailsSection); // Show the container

        // Scroll down to the dynamic content area smoothly (optional)
         if (keyDifferencesSection) {
             keyDifferencesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
    }


    // --- Scroll Animation Setup ---
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            scrollFadeElements.forEach(el => el.classList.add('is-visible'));
            return;
        }
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        scrollFadeElements.forEach(el => observer.observe(el));
    }


    // --- INITIALIZATION ---
    function initialize() {
        console.log("Initializing script...");

        // Set initial language and units state
        currentLang = DEFAULT_LANG;
        currentUnits = DEFAULT_UNIT;
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });

        // Set initial image
        selectedCookieImage.src = IMAGE_PATHS.comparison;
        selectedCookieImage.alt = "Comparison of classic, thick, and thin cookies";
        selectedCookieImage.classList.remove(IMAGE_CLASS_SELECTED);

        // Initial Text & Content Update
        updateTextContent(currentLang); // Populates static text, tips
        hideContentSection(keyDifferencesSection); // Hide dynamic sections
        hideContentSection(recipeScalerSection);
        hideContentSection(recipeDetailsSection);
        hideContentSection(easterEggSection);
        showContentSection(contentPlaceholder); // Show placeholder
        omarsFavText.classList.add('visually-hidden'); // Hide fav text

        // Ensure butter input has default value
        butterInput.value = BASE_BUTTER_GRAMS;

        // Setup Event Listeners
        langButtons.forEach(button => {
            button.addEventListener('click', handleLanguageChange);
        });

        cookieTypeButtons.forEach(button => {
            button.addEventListener('click', handleCookieTypeSelect);
            button.addEventListener('keydown', (event) => {
                 if (event.key === 'Enter' || event.key === ' ') {
                     event.preventDefault(); // Prevent spacebar scrolling
                     handleCookieTypeSelect({ currentTarget: button }); // Pass event-like object
                 }
             });
        });

        updateScaleBtn.addEventListener('click', handleRecipeScale);
        butterInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleRecipeScale();
            }
        });
        butterInput.addEventListener('change', handleRecipeScale); // Also scale on change/blur

         // Add delegated listener for unit changes within the recipe details section
         recipeDetailsSection.addEventListener('click', handleUnitChange);

        // Setup scroll animations
        setupScrollAnimations();

        // Fade in the body
        body.classList.add('loaded');
        console.log("Initialization complete.");
    }

    // Add error handling for safety
    try {
        initialize();
    } catch (error) {
        console.error("Initialization failed:", error);
        // Optionally display a message to the user
        // document.body.innerHTML = "<p>Sorry, an error occurred while loading the page. Please try again later.</p>";
    }

}); // End DOMContentLoaded

// --- END OF FILE script.js ---
