document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const DEFAULT_LANG = 'en';
    const DEFAULT_UNIT = 'metric'; // Or 'imperial'
    const STANDARD_BUTTER_GRAMS = 226;
    const BASE_YIELD_MIN = 18;
    const BASE_YIELD_MAX = 24;
    const TRANSITION_DURATION = 400; // Matches CSS transition-duration (in ms) for .details-section

    // --- IMAGE PATHS ---
    const IMAGE_PATHS = {
        heroDefault: '3-cookie-types.jpg',
        classic: 'classic.webp',
        thick: 'thick_and_gooey.webp',
        thin: 'thin-and-crispy.webp',
        stuffed: 'stuffed_cookie.webp',
        thumb: { // Assumes thumbnails exist
            classic: 'classic_thumb.webp',
            thick: 'thick_thumb.webp',
            thin: 'thin_thumb.webp'
        }
    };

    // --- DOM ELEMENTS ---
    const body = document.body;
    const langButtons = document.querySelectorAll('.lang-btn');
    const yieldInfoElement = document.querySelector('.yield-info');
    const heroCookieImage = document.getElementById('hero-cookie-image');
    const cookieCards = document.querySelectorAll('.cookie-card');
    const omarsFavBadge = document.querySelector('.omars-fav-badge');

    // Dynamic Content Containers
    const dynamicContentWrapper = document.querySelector('.dynamic-content-wrapper');
    const contentPlaceholder = dynamicContentWrapper.querySelector('.content-placeholder');
    const keyDifferencesContainer = document.getElementById('key-differences');
    const recipeScalerContainer = document.getElementById('recipe-scaler');
    const recipeDetailsContainer = document.getElementById('recipe-details');
    const easterEggContainer = document.getElementById('easter-egg-container');
    const tipsList = document.getElementById('tips-list');

    // Template (used for cloning unit toggles)
    const unitTogglesTemplate = document.getElementById('unit-toggles-template');

    // (Will get scaler elements dynamically when scaler is shown)
    let butterAmountInput = null;
    let updateScaleBtn = null;


    // --- STATE ---
    let currentLang = DEFAULT_LANG;
    let currentUnit = DEFAULT_UNIT;
    let selectedCookieType = null;
    let currentScaleFactor = 1; // 100% scale initially

    // --- DATA (Keep your existing comprehensive langData object here) ---
    const langData = {
        en: {
            mainTitle: "🍪 Omar's Insanely Good Cookie Guide! 🍪",
            heroSubtitle: "Select your ultimate cookie style below!",
            chooseStyle: "Pick Your Cookie Destiny:",
            typeClassicShort: "Classic", typeClassicDesc: "The balanced crowd-pleaser.",
            typeThickShort: "Thick & Gooey", typeThickDesc: "The big softie, ultra decadent.",
            typeThinShort: "Thin & Crispy", typeThinDesc: "Maximum snap, buttery delight.",
            omarsFavText: "Omar's Fave!",
            unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: "Whips up about {min}-{max} cookies 🍪",
            keyDifferencesTitleBase: "🔑 Key Differences: ", // Added colon for consistency
            butterTitle: "Brown Butter & Mixing", chillingTitle: "Chilling", otherNotesTitle: "Other Notes",
            placeholderSelect: "👆 Select a cookie style above to load the recipe! ✨",
            ingredientsTitle: "Ingredients", stepsTitle: "Steps", scienceNoteTitle: "The Science Bit!",
            easterEggTitle: "🏆 GOOEY Picked! Bonus! 🏆", easterEggIntro: "Got taste! Ready for Level 2?", easterEggIdea: "🔥 STUFFED COOKIES! 🔥",
            easterEggDesc: "Easy peasy: Dent a THICK dough ball, plop in ~1 tsp Nutella/Lotus/Pistachio cream, seal, bake!",
            easterEggPistachioTip: "TRUST the pistachio! It's a game-changer.", pistachioReco: "Best Spread IMHO:", pistachioLinkSource: "(Amazon EG link)",
            tipsTitle: "💡 Omar's Pro Tips! 🔬",
            finalTag: "Nailed it? Show off! Tag me! @omarisavibe 😄",
            scalerTitle: "🧈 Customize Your Batch Size!", scalerDesc: "Enter starting butter (grams) to scale metric values.",
            scalerLabel: "Butter (g):", scalerButton: "Update Scale", scalerNote: "Note: Only metric (gram) values are scaled. Imperial (cup) units are approximate.",
            diffs: { /* ... Keep full diffs objects ... */
                 classic: { name: "Classic", butterMethod: "Use <span class='highlight'>COOLED but LIQUID</span> Brown Butter. Whisk with sugars (no heavy creaming needed).", chillingMethod: "<span class='highlight'>RECOMMENDED Chill:</span> 30 mins - 24 hrs. Improves flavor and texture.", otherNotes: "Standard flour (~300g). Includes baking powder. Optional toasted nuts = great texture!" },
                 thick: { name: "Thick & Gooey", butterMethod: "Use <span class='critical'>CHILLED SOLID</span> Brown Butter. <span class='critical'>Cream</span> this with sugars until very light and fluffy (3-5 mins).", chillingMethod: "<span class='critical'>MANDATORY Long Chill:</span> 24 - 72 hrs. The SECRET to thickness & deep flavor!", otherNotes: "Use <span class='highlight'>MORE flour</span> (~310-330g). Baking powder + opt. cornstarch. Toasted nuts highly recommended!" },
                 thin: { name: "Thin & Crispy", butterMethod: "Use <span class='critical'>WARM LIQUID</span> Brown Butter. Whisk with sugars.", chillingMethod: "<span class='critical'>SKIP Chilling!</span> Bake immediately for maximum spread.", otherNotes: "Use <span class='highlight'>LESS flour</span> (~280-300g). <span class='critical'>OMIT baking powder.</span> More white sugar aids crispness." }
             },
            recipes: { /* ... Keep full recipes objects ... */
                classic: { title: "Classic Balanced Cookies", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">COOLED but LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups brown sugar, packed', metric: '250g brown sugar, packed' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup granulated sugar', metric: '100g granulated sugar' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 cups all-purpose flour', metric: '300g all-purpose flour' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt (or 3g table salt)' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 - 2 cups chocolate', metric: '255-340g chocolate <span class="note">(Omar recommends Dropsy MILK!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Opt: Pecans/Walnuts!)' } ], steps: [ 'Prep: Brown butter & cool (liquid). Toast milk powder (if using). Whisk dry (flour, milk powder, leavening, salt). Toast nuts (350°F/175°C, 5-8 min) if using.', 'Whisk <span class="highlight">liquid brown butter</span> & sugars.', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix dry until JUST combined. <span class="critical">No overmixing!</span>', 'Stir in chocolate <span class="highlight">and toasted nuts (if using).</span>', '<span class="highlight">Chill Dough (Recommended):</span> Cover & chill <span class="highlight">30 mins+</span> (up to 24 hrs).', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="highlight">~2 Tbsp</span> balls. Add flaky salt (optional).', 'Bake <span class="highlight">10-12 min</span> (golden edges).', 'Cool on pan 5-10 min, then rack. Enjoy! 🎉' ], scienceNote: "Cooled liquid butter = flavor w/o air. Chill=texture. Powder=lift. Milk powder/nuts=depth." },
                 thick: { title: "Thick & Gooey Cookies", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">CHILLED SOLID (scoopable)</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/2 cups brown sugar, packed', metric: '300g brown sugar (More brown!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/4 cup granulated sugar', metric: '50g granulated sugar (Less white!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/2 - 2 3/4 cups all-purpose flour', metric: '310-330g all-purpose flour (More!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'starch', emoji: '⭐', imperial: '1-2 Tbsp cornstarch', metric: '8-16g cornstarch (Opt, softness)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda' }, { key: 'leavening_powder', emoji: '✨', imperial: '1/2 tsp baking powder', metric: '2g baking powder' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g), room temp' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '2+ cups chocolate', metric: '340g+ chocolate <span class="note">(Go generous! Omar recommends Dropsy MILK!)</span>' }, { key: 'nuts', emoji: '🥜', imperial: '1/2 - 1 cup toasted nuts', metric: '50-100g toasted nuts (Highly Rec: Pecans/Walnuts!)' } ], steps: [ 'Prep: Brown butter & <span class="critical">chill solid</span>. Toast milk powder (if using). Whisk dry (flour, milk powder, cornstarch, leavening, salt). Toast nuts.', '<span class="critical">CREAM</span> chilled brown butter & sugars until light/fluffy (3-5 min). Essential!', 'Beat in eggs (one by one), then vanilla.', 'Gradually mix in <span class="highlight">higher amount</span> of dry until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in <span class="highlight">generous</span> chocolate <span class="highlight">and toasted nuts.</span>', '<span class="critical">CHILL DOUGH (MANDATORY):</span> Cover & chill <span class="critical">24 - 72 hours</span>. The secret!', 'Preheat oven <span class="highlight">375°F (190°C)</span>. Line sheets.', 'Scoop <span class="critical">LARGE (~3-4 Tbsp)</span> balls. Keep <span class="highlight">TALL!</span> Don\'t flatten. Add salt (optional).', 'Bake <span class="highlight">12-15 min</span>. Centers look <span class="critical">soft/underdone</span>.', 'Cool on pan <span class="critical">10-15 min MINIMUM</span>, then rack. GOOEY! 😍' ], scienceNote: "Creaming SOLID butter = air. LONG chill = hydration/flavor. More flour/starch = chew. Nuts=contrast." },
                 thin: { title: "Thin & Crispy Cookies", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', imperial: '1 cup (2 sticks) brown butter', metric: '226g brown butter, <span class="critical note">WARM LIQUID</span>' }, { key: 'sugar', emoji: '🍬', imperial: '1 1/4 cups granulated sugar', metric: '250g granulated sugar (More white!)' }, { key: 'sugar_gran', emoji: '🍚', imperial: '1/2 cup brown sugar, packed', metric: '100g brown sugar (Less brown!)' }, { key: 'flour', emoji: '🌾', imperial: '2 1/4 - 2 1/2 cups all-purpose flour', metric: '280-300g all-purpose flour (Less!)' }, { key: 'milkpowder', emoji: '🥛', imperial: '~1.5-2 Tbsp toasted milk powder', metric: '15-20g toasted milk powder (Optional)' }, { key: 'leavening_soda', emoji: '🥄', imperial: '1 tsp baking soda', metric: '5g baking soda <span class="critical note"> (NO baking powder!)</span>' }, { key: 'extra_liquid', emoji: '💧', imperial: '1-2 Tbsp milk', metric: '15-30ml milk (Opt, spread)' }, { key: 'salt', emoji: '🧂', imperial: '1 tsp Kosher salt', metric: '6g Kosher salt' }, { key: 'eggs', emoji: '🥚', imperial: '2 large eggs', metric: '2 large eggs (~100g) (+ Opt Yolk)' }, { key: 'vanilla', emoji: '🏺', imperial: '2 tsp vanilla extract', metric: '10ml vanilla extract' }, { key: 'choco', emoji: '🍫', imperial: '1.5 cups chocolate', metric: '255g chocolate <span class="note">(Minis ok! Omar recommends Dropsy MILK!)</span>' } ], steps: [ 'Prep: Brown butter & keep <span class="critical">warm liquid</span>. Toast milk powder. Whisk dry (flour, milk powder, <span class="highlight">soda ONLY</span>, salt).', 'Whisk <span class="highlight">warm butter</span> & sugars (adj. ratio).', 'Beat in eggs (and opt yolk/milk), then vanilla.', 'Gradually mix in <span class="highlight">lower amount</span> of dry until JUST combined. <span class="critical">NO OVERMIXING!</span>', 'Stir in chocolate.', '<span class="critical">DO NOT CHILL.</span> Bake immediately!', 'Preheat oven lower: <span class="highlight">350°F (175°C)</span>. Line sheets.', 'Scoop <span class="highlight">smaller (~1.5-2 Tbsp)</span> balls. Place <span class="critical">FAR APART!</span> Can flatten slightly.', 'Bake <span class="highlight">12-15 min</span> until golden brown & set.', 'Cool on pan 5 min, then rack. Crisps fully when cool! ✨' ], scienceNote: "Warm butter + white sugar + less flour + soda only + no chill = SPREAD! Lower/longer bake=SNAP." }
             },
            tips: [ /* ... Keep full tips objects ... */
                { emoji: '⚖️', text: "<span class='highlight'>Weigh Your Flour:</span> Spoon & level is okay, scale (grams) is KING for consistency." }, { emoji: '🥚', text: "<span class='highlight'>Room Temp Matters:</span> Eggs & butter mix best when not cold. Quick fix: warm water bath for eggs (5 min)." }, { emoji: '🧈', text: "<span class='highlight'>Brown Butter State is CRITICAL:</span> Cooled Liquid, Chilled Solid, or Warm Liquid dictates texture. Pay attention!" }, { emoji: '🥶', text: "<span class='critical'>Respect the Chill!:</span> Seriously, for Thick/Gooey it's non-negotiable. Builds flavor, prevents puddles." }, { emoji: '🔥', text: "<span class='highlight'>Know Thy Oven:</span> They lie! An oven thermometer is cheap. Rotate pans for even baking." }, { emoji: '🍪', text: "<span class='highlight'>Don't Overbake:</span> Pull when edges set & centers look *slightly* under. Carryover cooking is real!" }, { emoji: '📄', text: "<span class='highlight'>Use Parchment Paper:</span> No sticking, easy cleanup, even browning. Essential." }, { emoji: '🥄', text: "<span class='critical'>Enemy #1: Overmixing Flour:</span> Mix JUST until flour disappears. More mixing = tough cookies. Be gentle!" }, { emoji: '✨', text: "<span class='highlight'>Flaky Sea Salt Finish:</span> Sprinkle *before* baking adds sparkle & flavor pop. Do it!" }, { emoji: '🍫', text: "<span class='highlight'>Quality Chocolate FTW:</span> Use good stuff! Dropsy Milk is great! Mix chips & chopped bars/wafers for texture." }, { emoji: '🥜', text: "<span class='highlight'>Toast Those Nuts!:</span> For Classic/Thick, toast nuts (350°F/175°C, 5-8 mins) - HUGE flavor boost!" }, { emoji: '🧪', text: 'Brown Butter Magic: Maillard reaction = nutty complexity. Universal upgrade!' }, { emoji: '🥛', text: 'Toasted Milk Powder: Extra Maillard! Adds chew/depth. Small amount, big impact.' }
            ]
        },
        ar: { // <<< ADD ARABIC TRANSLATIONS FOR NEW KEYS LIKE heroSubtitle, type*Short, type*Desc
            mainTitle: "🍪 دليل عمر للكوكيز الخرافية! 🍪",
            heroSubtitle: "اختر ستايل الكوكيز المفضل لديك بالأسفل!", // Example
            chooseStyle: "اختر قدر الكوكيز الخاص بك:",          // Example
            typeClassicShort: "كلاسيك", typeClassicDesc: "المتوازنة محبوبة الجماهير.", // Example
            typeThickShort: "سميكة وغنية", typeThickDesc: "الدبدوبة الطرية، غنية جداً.", // Example
            typeThinShort: "رفيعة ومقرمشة", typeThinDesc: "أقصى قرمشة، متعة زبدية.", // Example
            omarsFavText: "مفضلة عمر!",
            unitLabelEn: "Units:", unitLabelAr: "الوحدات:",
            yieldInfo: "بتعمل حوالي {min}-{max} قطعة كوكيز 🍪",
            keyDifferencesTitleBase: "🔑 الفروقات الأساسية: ",
            butterTitle: "زبدة بنية وخلط", chillingTitle: "تبريد", otherNotesTitle: "ملاحظات أخرى",
            placeholderSelect: "👆 اختر ستايل الكوكيز فوق لتحميل الوصفة! ✨",
            ingredientsTitle: "المكونات", stepsTitle: "الخطوات", scienceNoteTitle: "الحتة العلمية!",
            easterEggTitle: "🏆 اخترت الغنية! بونص! 🏆", easterEggIntro: "ذوقك عالي! جاهز لمستوى 2؟", easterEggIdea: "🔥 كوكيز محشية! 🔥",
            easterEggDesc: "سهلة جداً: اعمل حفرة بعجينة السميكة، ضع ~1 م.ص نوتيلا/لوتس/بستاشيو، اقفل، اخبز!",
            easterEggPistachioTip: "جرب البستاشيو! هيغير قواعد اللعبة.", pistachioReco: "أحسن كريمة:", pistachioLinkSource: "(أمازون مصر)",
            tipsTitle: "💡 نصائح عمر للمحترفين! 🔬",
            finalTag: "ظبطتها؟ شاركها! تاج ليا! @omarisavibe 😄",
            scalerTitle: "🧈 عدّل حجم الدفعة!", scalerDesc: "أدخل وزن الزبدة (جرام) لضبط القيم المترية.",
            scalerLabel: "زبدة (جم):", scalerButton: "تحديث المقادير", scalerNote: "ملحوظة: يتم تعديل الجرامات فقط. الأكواب تقريبية.",
             diffs: { /* ... Keep full diffs objects - TRANSLATED ... */
                 classic: { name: "الكلاسيك", butterMethod: "زبدة بنية <span class='highlight'>مبردة لكن سائلة</span>. اخفقها بالسلك مع السكر (بدون خفق كريمي).", chillingMethod: "<span class='highlight'>تبريد يُفضل:</span> 30 دقيقة - 24 ساعة.", otherNotes: "دقيق عادي (~300ج). فيها بيكنج بودر. مكسرات محمصة = قوام روعة!" },
                 thick: { name: "السميكة والطرية", butterMethod: "زبدة بنية <span class='critical'>مبردة وصلبة</span>. <span class='critical'>اخفقها كريمي</span> مع السكر حتى هشة (3-5 د).", chillingMethod: "<span class='critical'>تبريد إلزامي طويل:</span> 24 - 72 ساعة. <span class='critical'>السر</span>!", otherNotes: "دقيق <span class='highlight'>أكثر</span> (~310-330ج). بودر + نشا (اختياري). مكسرات محمصة ضرورية!" },
                 thin: { name: "الرفيعة والمقرمشة", butterMethod: "زبدة بنية <span class='critical'>دافئة وسائل</span>. اخفقها بالسلك.", chillingMethod: "<span class='critical'>تخطَ التبريد!</span> اخبز فوراً.", otherNotes: "دقيق <span class='highlight'>أقل</span> (~280-300ج). <span class='critical'>بدون بيكنج بودر.</span> سكر أبيض أكثر = قرمشة." }
             },
            recipes: { /* ... Keep full recipes objects - TRANSLATED (important for metric keys!) ... */
                 classic: { title: "كوكيز الكلاسيك المتوازن", theme: "classic-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة لكن سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر بني', grams: '250 جرام سكر بني' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر أبيض', grams: '100 جرام سكر أبيض' }, { key: 'flour', emoji: '🌾', cups: '2 1/2 كوب دقيق', grams: '300 جرام دقيق' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك بودرة حليب', grams: '15-20 جرام بودرة حليب محمصة (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن (أو 3ج ناعم)' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5-2 كوب شوكولاتة', grams: '255-340 جرام شوكولاتة <span class="note">(عمر يوصي بدروبسي!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2-1 كوب مكسرات', grams: '50-100 جرام مكسرات (اختياري: بيكان/جوز!)' } ], steps: [ 'تجهيز: حمّص الزبدة وبرّدها (سائلة). حمّص الحليب البودرة. اخلط الجاف. حمّص المكسرات (175°م، 5-8 د).', 'اخفق <span class="highlight">الزبدة السائلة</span> والسكر.', 'ضيف البيض والفانيليا.', 'ضيف الجاف واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة <span class="highlight">والمكسرات (إن استخدمت).</span>', '<span class="highlight">برّد العجين (مفضل):</span> غطِ وبرّد <span class="highlight">30د+</span> (لـ 24 س).', 'سخن الفرن <span class="highlight">190°م</span>.', 'شكّل كرات <span class="highlight">~2 م.ك</span>. رش ملح (اختياري).', 'اخبز <span class="highlight">10-12 د</span>.', 'برّد ع الصينية 5-10د ثم الشبكة. 🎉' ], scienceNote: "زبدة سائلة=نكهة. تبريد=قوام. بودر=رفع. حليب بودرة/مكسرات=عمق." },
                 thick: { title: "كوكيز السميكة والغنية", theme: "thick-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">مبردة وصلبة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/2 كوب سكر بني', grams: '300 جرام سكر بني (أكثر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/4 كوب سكر أبيض', grams: '50 جرام سكر أبيض (أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.5-2.75 كوب دقيق', grams: '310-330 جرام دقيق (أكثر!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك بودرة حليب', grams: '15-20 جرام بودرة حليب محمصة (اختياري)' }, { key: 'starch', emoji: '⭐', cups: '1-2 م.ك نشا', grams: '8-16 جرام نشا (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا' }, { key: 'leavening_powder', emoji: '✨', cups: '1/2 م.ص بيكنج بودر', grams: '2 جرام بيكنج بودر' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '2+ كوب شوكولاتة', grams: '340+ جرام شوكولاتة <span class="note">(بزيادة! عمر يوصي بدروبسي!)</span>' }, { key: 'nuts', emoji: '🥜', cups: '1/2-1 كوب مكسرات', grams: '50-100 جرام مكسرات محمصة (موصى به!)' } ], steps: [ 'تجهيز: حمّص الزبدة <span class="critical">وبردها صلبة</span>. حمّص بودرة الحليب. اخلط الجاف. حمّص المكسرات.', '<span class="critical">اخفق كريمي</span> الزبدة الصلبة والسكر (3-5د). ضروري!', 'ضيف البيض والفانيليا.', 'ضيف <span class="highlight">الدقيق الأكثر</span> واخلط <span class="critical">بالكاد</span>.', 'قلّب <span class="highlight">الشوكولاتة الكثيرة والمكسرات</span>.', '<span class="critical">برّد العجين (إلزامي):</span> غطِ وبرّد <span class="critical">24-72 ساعة</span>. السر!', 'سخن الفرن <span class="highlight">190°م</span>.', 'شكّل كور <span class="critical">كبيرة (3-4 م.ك)</span> <span class="highlight">واتركها عالية!</span>. رش ملح.', 'اخبز <span class="highlight">12-15 د</span> (الوسط <span class="critical">طري</span>).', 'برّد ع الصينية <span class="critical">10-15 د على الأقل</span> ثم الشبكة. 😍' ], scienceNote: "خفق زبدة صلبة = هواء. تبريد طويل = نكهة. دقيق/نشا = مضغة. مكسرات=تباين." },
                 thin: { title: "كوكيز الرفيعة والمقرمشة", theme: "thin-theme", ingredients: [ { key: 'butter', emoji: '🧈', cups: '1 كوب (226ج) زبدة بنية', grams: '226 جرام زبدة بنية، <span class="critical note">دافئة سائلة</span>' }, { key: 'sugar', emoji: '🍬', cups: '1 1/4 كوب سكر أبيض', grams: '250 جرام سكر أبيض (أكثر!)' }, { key: 'sugar_gran', emoji: '🍚', cups: '1/2 كوب سكر بني', grams: '100 جرام سكر بني (أقل!)' }, { key: 'flour', emoji: '🌾', cups: '2.25-2.5 كوب دقيق', grams: '280-300 جرام دقيق (أقل!)' }, { key: 'milkpowder', emoji: '🥛', cups: '~1.5-2 م.ك بودرة حليب', grams: '15-20 جرام بودرة حليب محمصة (اختياري)' }, { key: 'leavening_soda', emoji: '🥄', cups: '1 م.ص بيكنج صودا', grams: '5 جرام بيكنج صودا<span class="critical note">(لا بيكنج بودر!)</span>' }, { key: 'extra_liquid', emoji: '💧', cups: '1-2 م.ك حليب', grams: '15-30 مل حليب (اختياري)' }, { key: 'salt', emoji: '🧂', cups: '1 م.ص ملح خشن', grams: '6 جرام ملح خشن' }, { key: 'eggs', emoji: '🥚', cups: '2 بيضة', grams: '2 بيضة كبيرة (~100 جرام) (+صفار اختياري)' }, { key: 'vanilla', emoji: '🏺', cups: '2 م.ص فانيليا', grams: '10 مل فانيليا' }, { key: 'choco', emoji: '🍫', cups: '1.5 كوب شوكولاتة', grams: '255 جرام شوكولاتة <span class="note">(ميني OK! عمر يوصي بدروبسي!)</span>' } ], steps: [ 'تجهيز: حمّص الزبدة <span class="critical">وخليها دافئة</span>. حمّص بودرة الحليب. اخلط الجاف (<span class="highlight">صودا فقط</span>).', 'اخفق <span class="highlight">الزبدة الدافئة</span> والسكر.', 'ضيف البيض (وصفار/حليب اختياري) والفانيليا.', 'ضيف <span class="highlight">الدقيق الأقل</span> واخلط <span class="critical">بالكاد</span>.', 'قلّب الشوكولاتة.', '<span class="critical">لا تبرّد!</span> اخبز فوراً.', 'سخن الفرن أقل <span class="highlight">175°م</span>.', 'شكّل كور <span class="highlight">صغيرة (1.5-2 م.ك)</span> <span class="critical">وبعيدة عن بعض</span>.', 'اخبز <span class="highlight">12-15 د</span>.', 'برّد ع الصينية 5د ثم الشبكة. هتقرمش! ✨' ], scienceNote: "زبدة دافئة + سكر أبيض + دقيق أقل + صودا + لا تبريد = فرشة! حرارة أقل=قرمشة." }
            },
            tips: [ /* ... Keep full tips objects - TRANSLATED ... */
                { emoji: '⚖️', text: "<span class='highlight'>زن الدقيق:</span> ملعقة ومسح أو ميزان (جرام) أفضل." }, { emoji: '🥚', text: "<span class='highlight'>حرارة الغرفة مهمة:</span> البيض والزبدة بيتخلطوا أفضل. حل سريع: حمام مياه دافيء للبيض." }, { emoji: '🧈', text: "<span class='highlight'>حالة الزبدة البنية حرجة:</span> سائلة، صلبة، أو دافئة - تحدد القوام!" }, { emoji: '🥶', text: "<span class='critical'>احترم التبريد!:</span> للسميكة، إجباري. بيبني نكهة ويمنع السيحان." }, { emoji: '🔥', text: "<span class='highlight'>اعرف فرنك:</span> الأفران تكذب! ترمومتر رخيص. لف الصواني." }, { emoji: '🍪', text: "<span class='highlight'>لا تفرط في الخبز:</span> أخرجها والحواف ثابتة والوسط طري *قليلاً*." }, { emoji: '📄', text: "<span class='highlight'>استخدم ورق زبدة:</span> لا التصاق، تنظيف سهل، لون موحد." }, { emoji: '🥄', text: "<span class='critical'>العدو: الخلط الزائد:</span> اخلط حتى يختفي الدقيق فقط." }, { emoji: '✨', text: "<span class='highlight'>لمسة نهائية: ملح خشن:</span> رشة *قبل* الخبز تعطي شكل ونكهة." }, { emoji: '🍫', text: "<span class='highlight'>جودة الشوكولاتة مهمة:</span> استخدم نوع جيد! اخلط أنواع." }, { emoji: '🥜', text: "<span class='highlight'>حمّص المكسرات!:</span> للكلاسيك/السميكة، التحميص (175°م، 5-8د) يفرق جدا!" }, { emoji: '🧪', text: 'سحر الزبدة البنية: تفاعل ميلارد = نكهة مكسراتية!' }, { emoji: '🥛', text: 'بودرة الحليب المحمصة: ميلارد زيادة! عمق ومضغة.' }
            ]
        }
    };


    // --- HELPER FUNCTIONS ---

    /** Updates text content based on data-lang-key attribute */
    function updateTextContent() {
        const texts = langData[currentLang];
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            // Skip elements handled specifically (yield, dynamic content titles)
            if (key === 'yieldInfo' || el.closest('.details-section')) return;
            if (texts && texts[key]) {
                el.innerHTML = texts[key];
            }
        });
        // Update page title
        document.title = texts?.mainTitle || "Omar's Cookie Guide";
    }

    /** Calculates and updates the yield info text */
    function updateYieldDisplay() {
        if (!yieldInfoElement) return;
        const scaledMin = Math.round(BASE_YIELD_MIN * currentScaleFactor);
        const scaledMax = Math.round(BASE_YIELD_MAX * currentScaleFactor);
        const yieldTemplate = langData[currentLang]?.yieldInfo || "Yield: {min}-{max}";
        yieldInfoElement.innerHTML = yieldTemplate.replace('{min}', scaledMin).replace('{max}', scaledMax);
        yieldInfoElement.dataset.langKey = 'yieldInfo'; // Keep key for potential future use
    }

    /** Generates HTML for unit toggle controls */
    function createUnitTogglesHTML() {
        if (!unitTogglesTemplate) return '';
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-toggle-wrapper';
        const enToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="en"]')?.cloneNode(true);
        const arToggle = unitTogglesTemplate.querySelector('.unit-selector[data-lang="ar"]')?.cloneNode(true);
        if (enToggle) wrapper.appendChild(enToggle);
        if (arToggle) wrapper.appendChild(arToggle);
        return wrapper.outerHTML;
    }

    /** Updates visibility and active state of unit toggles inside a container */
    function updateUnitTogglesState(container) {
        const wrapper = container.querySelector('.unit-toggle-wrapper');
        if (!wrapper) return;

        const enSelector = wrapper.querySelector('.unit-selector[data-lang="en"]');
        const arSelector = wrapper.querySelector('.unit-selector[data-lang="ar"]');

        // Visibility based on language
        if (enSelector) enSelector.style.display = (currentLang === 'en') ? 'inline-block' : 'none';
        if (arSelector) arSelector.style.display = (currentLang === 'ar') ? 'inline-block' : 'none';

        // Active button based on currentUnit
        wrapper.querySelectorAll('.unit-btn').forEach(btn => {
            const btnUnit = btn.dataset.unitType;
            const btnLang = btn.closest('.unit-selector')?.dataset.lang;
            let isActive = false;
            if (currentUnit === 'imperial') {
                isActive = (btnLang === 'en' && btnUnit === 'imperial') || (btnLang === 'ar' && btnUnit === 'cups');
            } else { // metric
                isActive = (btnLang === 'en' && btnUnit === 'metric') || (btnLang === 'ar' && btnUnit === 'grams');
            }
            btn.classList.toggle('active', isActive);
        });
    }

     /** Generates HTML for ingredient list based on type, unit, lang, scale */
     function generateIngredientsHTML(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes[type];
        if (!recipe?.ingredients) return '<p>Ingredients data missing!</p>';

        const unitSystemKeyForMetric = (currentLang === 'ar') ? 'grams' : 'metric';
        const unitKey = (currentUnit === 'imperial')
                          ? (currentLang === 'ar' ? 'cups' : 'imperial')
                          : unitSystemKeyForMetric;

        let ingredientsHtml = '';
        recipe.ingredients.forEach(ing => {
            let measurement = ing[unitKey] || ing.metric || ing.imperial || ing.grams || ing.cups || 'N/A';
            const originalMeasurement = measurement; // Store for parsing original numbers

            // Apply scaling *only* if current view is metric AND scale factor is not 1
            if (unitKey === unitSystemKeyForMetric && currentScaleFactor !== 1) {
                const gramMarker = (currentLang === 'ar') ? 'جرام' : 'g';
                const gramRegexBase = `(\\d+(\\.\\d+)?)\\s*${gramMarker}`; // Number + optional decimal + marker

                // 1. Try scaling the base STANDARD_BUTTER_GRAMS amount specifically
                if (ing.key === 'butter') {
                    const standardButterRegex = new RegExp(`(${STANDARD_BUTTER_GRAMS})\\s*${gramMarker}`);
                    if (standardButterRegex.test(originalMeasurement)) {
                         measurement = originalMeasurement.replace(standardButterRegex, `${Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor)}${gramMarker}`);
                    } else { // Fallback if specific number not found, scale first number found
                        const firstNumRegex = new RegExp(gramRegexBase);
                        const match = originalMeasurement.match(firstNumRegex);
                        if (match && match[1]) {
                             measurement = originalMeasurement.replace(match[0], `${Math.round(parseFloat(match[1]) * currentScaleFactor)}${gramMarker}`);
                        }
                    }
                } else {
                    // 2. Try scaling ranges "MIN-MAX g"
                     // Needs careful regex for both LTR/RTL potential number order issues if AR translations reverse numbers? Assume standard LTR numbers in string.
                     const rangeRegex = new RegExp(`(\\d+(\\.\\d+)?)\\s*-\\s*(\\d+(\\.\\d+)?)\\s*${gramMarker}`);
                     const rangeMatch = originalMeasurement.match(rangeRegex);
                     if (rangeMatch && rangeMatch[1] && rangeMatch[3]) {
                         const scaledMin = Math.round(parseFloat(rangeMatch[1]) * currentScaleFactor);
                         const scaledMax = Math.round(parseFloat(rangeMatch[3]) * currentScaleFactor);
                         measurement = originalMeasurement.replace(rangeMatch[0], `${scaledMin}-${scaledMax}${gramMarker}`);
                     } else {
                         // 3. Try scaling single numbers "NUM g" or "(~NUM g)" etc.
                         const singleNumRegex = new RegExp(gramRegexBase);
                         // Find *all* number-gram occurrences and scale them
                         measurement = originalMeasurement.replace(new RegExp(gramRegexBase, 'g'), (match, p1) => {
                            // p1 is the numeric part (e.g., "250" from "250g")
                             return `${Math.round(parseFloat(p1) * currentScaleFactor)}${gramMarker}`;
                         });
                     }
                 }
             } // End scaling logic

            ingredientsHtml += `<li data-emoji="${ing.emoji || '🍪'}">${measurement}</li>`;
        });
        return ingredientsHtml;
    }

    /** Generates complete HTML for Key Differences section */
    function generateKeyDifferencesHTML(type) {
        const texts = langData[currentLang];
        const diffs = texts.diffs?.[type];
        const titleBase = texts.keyDifferencesTitleBase || 'Key Differences: ';
        if (!diffs) return '';

        const cookieName = diffs.name || type.charAt(0).toUpperCase() + type.slice(1);

        return `
            <h3>${titleBase}<span class="dynamic-cookie-name">${cookieName}</span></h3>
            <div class="diff-points">
                <div class="diff-point butter-diff"><h4><span class="emoji">🧈</span> <span>${texts.butterTitle || 'Butter'}</span></h4><p>${diffs.butterMethod || ''}</p></div>
                <div class="diff-point chilling-diff"><h4><span class="emoji">🥶</span> <span>${texts.chillingTitle || 'Chilling'}</span></h4><p>${diffs.chillingMethod || ''}</p></div>
                <div class="diff-point other-diff"><h4><span class="emoji">📝</span> <span>${texts.otherNotesTitle || 'Notes'}</span></h4><p>${diffs.otherNotes || ''}</p></div>
            </div>`;
    }

    /** Generates complete HTML for Recipe Scaler section */
    function generateScalerHTML() {
        const texts = langData[currentLang];
        return `
            <h3 data-lang-key="scalerTitle">${texts.scalerTitle || 'Scale Recipe'}</h3>
            <p data-lang-key="scalerDesc">${texts.scalerDesc || 'Enter butter amount (g):'}</p>
            <div class="scaler-input-group">
                <label for="butter-amount-input" data-lang-key="scalerLabel">${texts.scalerLabel || 'Butter (g):'}</label>
                <input type="number" id="butter-amount-input" name="butter-amount" min="50" step="1" placeholder="${STANDARD_BUTTER_GRAMS}" value="${Math.round(STANDARD_BUTTER_GRAMS * currentScaleFactor)}">
                <button id="update-scale-btn" data-lang-key="scalerButton">${texts.scalerButton || 'Update Scale'}</button>
            </div>
            <span class="scaler-note" data-lang-key="scalerNote">${texts.scalerNote || 'Note: Scales metric only.'}</span>`;
    }

     /** Generates complete HTML for Recipe Details section */
     function generateRecipeHTML(type) {
        const texts = langData[currentLang];
        const recipe = texts.recipes?.[type];
        if (!recipe) return '<p>Recipe data not found!</p>';

        const unitTogglesHtml = createUnitTogglesHTML(); // Get unit toggles
        let stepsHtml = recipe.steps.map(step => `<li>${step}</li>`).join('');
        let ingredientsHtml = generateIngredientsHTML(type); // Get initial ingredients

        let scienceNoteHtml = '';
        if (recipe.scienceNote) {
            scienceNoteHtml = `
                <div class="science-note">
                    <h4><span class="emoji">🔬</span> <span data-lang-key="scienceNoteTitle">${texts.scienceNoteTitle || 'Science!'}</span></h4>
                    <p>${recipe.scienceNote}</p>
                </div>`;
        }

        return `
            <div class="recipe-content-area">
                <h3>${recipe.title || 'Cookie Recipe'}</h3>
                ${unitTogglesHtml}
                <h4 class="list-header" data-lang-key="ingredientsTitle">${texts.ingredientsTitle || 'Ingredients'}</h4>
                <ul class="ingredient-list">
                    ${ingredientsHtml}
                </ul>
                <h4 class="list-header" data-lang-key="stepsTitle">${texts.stepsTitle || 'Steps'}</h4>
                <ol class="steps-list">
                    ${stepsHtml}
                </ol>
                ${scienceNoteHtml}
            </div>`;
    }

    /** Generates complete HTML for Easter Egg section */
    function generateEasterEggHTML(type) {
        if (type !== 'thick') return ''; // Only for thick cookies
        const texts = langData[currentLang];

         return `
             <h3 data-lang-key="easterEggTitle">${texts.easterEggTitle}</h3>
             <div class="easter-egg-content">
                 <p data-lang-key="easterEggIntro">${texts.easterEggIntro}</p>
                 <strong data-lang-key="easterEggIdea">${texts.easterEggIdea}</strong>
                 <p data-lang-key="easterEggDesc">${texts.easterEggDesc}</p>
                 <img id="stuffed-cookie-image" src="${IMAGE_PATHS.stuffed}" alt="${texts.easterEggIdea}">
                 <p data-lang-key="easterEggPistachioTip">${texts.easterEggPistachioTip}</p>
                  <ul><li><span data-lang-key="pistachioReco">${texts.pistachioReco}</span> <a href="https://www.amazon.eg/-/en/Pistachio-spread-Irresistible-Luxurious-Goodness/dp/B0D9C3BDV2/" target="_blank">ASMACUP Pistachio Cream</a> <span data-lang-key="pistachioLinkSource">${texts.pistachioLinkSource}</span></li></ul>
             </div>`;
     }

    /** Generates and updates the Pro Tips list */
    function displayTips() {
        const texts = langData[currentLang];
        if (!texts?.tips || !tipsList) return;
        tipsList.innerHTML = texts.tips
            .map(tip => `<li data-emoji="${tip.emoji || '💡'}">${tip.text}</li>`)
            .join('');
    }

    /** Hides all dynamic sections and shows the placeholder */
    function showPlaceholderContent() {
        const sectionsToHide = [
            keyDifferencesContainer,
            recipeScalerContainer,
            recipeDetailsContainer,
            easterEggContainer
        ];

        // Immediately mark placeholder as potentially active
        contentPlaceholder.classList.remove('hidden');
        contentPlaceholder.classList.add('active'); // May be redundant but safe

        let hidePromises = sectionsToHide.map(section => {
            if (section && section.classList.contains('visible')) {
                section.classList.remove('visible');
                 // Optional: Wait for CSS transition before resolving
                // return new Promise(resolve => setTimeout(resolve, TRANSITION_DURATION));
            }
             //return Promise.resolve(); // Resolve immediately if not visible
             section?.classList.add('visually-hidden'); // Ensure hidden for sure
        });
        contentPlaceholder.innerHTML = langData[currentLang].placeholderSelect;


        // Example using simple timeout - adjust timing as needed
        // If using promises, Promise.all(hidePromises).then(() => { ... });
        // setTimeout(() => {
        //     contentPlaceholder.classList.remove('hidden');
        // }, TRANSITION_DURATION / 2); // Show placeholder halfway through hide?
    }


    /** Main function to display content for a selected cookie type */
    function displaySelectedCookieContent(type) {
         // 1. Hide current content and placeholder
         contentPlaceholder.classList.add('hidden');
         [keyDifferencesContainer, recipeScalerContainer, recipeDetailsContainer, easterEggContainer].forEach(section => {
             if (section) {
                section.classList.remove('visible');
                section.classList.add('visually-hidden'); // Ensure it's hidden fast
             }
         });

         // 2. Generate HTML for the new sections (while hidden)
         const keyDiffHTML = generateKeyDifferencesHTML(type);
         const scalerHTML = generateScalerHTML();
         const recipeHTML = generateRecipeHTML(type);
         const easterEggHTML = generateEasterEggHTML(type);

         // 3. Inject the HTML
         keyDifferencesContainer.innerHTML = keyDiffHTML;
         recipeScalerContainer.innerHTML = scalerHTML;
         recipeDetailsContainer.innerHTML = recipeHTML;
         easterEggContainer.innerHTML = easterEggHTML;

         // Apply theme class to recipe container
         const theme = langData[currentLang].recipes[type]?.theme || '';
         recipeDetailsContainer.className = `details-section recipe-container ${theme}`; // Keep details-section

         // 4. Get references to NEWLY added dynamic elements (scaler inputs/button)
         butterAmountInput = recipeScalerContainer.querySelector('#butter-amount-input');
         updateScaleBtn = recipeScalerContainer.querySelector('#update-scale-btn');

         // 5. Add Event Listeners to NEW elements
         if (updateScaleBtn) updateScaleBtn.addEventListener('click', handleScaleUpdate);
         if (butterAmountInput) {
             butterAmountInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleScaleUpdate(); });
             butterAmountInput.addEventListener('change', handleScaleUpdate);
         }
         // Add listener for unit toggles INSIDE the recipe container (Delegation)
         recipeDetailsContainer.removeEventListener('click', handleUnitChangeDelegation); // Clean up old if any
         recipeDetailsContainer.addEventListener('click', handleUnitChangeDelegation);


         // 6. Use setTimeout to allow DOM update before starting transition
         setTimeout(() => {
             // 7. Make the relevant sections visible
             [keyDifferencesContainer, recipeScalerContainer, recipeDetailsContainer].forEach(section => {
                  if (section && section.innerHTML.trim() !== '') { // Only show if has content
                       section.classList.remove('visually-hidden');
                       section.classList.add('visible');
                  }
             });
             // Show easter egg only if it has content (i.e., type is thick)
             if (easterEggContainer && easterEggHTML) {
                easterEggContainer.classList.remove('visually-hidden');
                easterEggContainer.classList.add('visible');
             }

             // 8. Update the state of unit toggles after recipe container is visible
             updateUnitTogglesState(recipeDetailsContainer);

         }, 50); // Short delay (50ms) - adjust if needed

         // 9. (Optional) Scroll to the content
         // dynamicContentWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }


    // --- EVENT HANDLERS ---

    function handleLanguageChange(event) {
        const newLang = event.target.dataset.lang;
        if (newLang === currentLang) return;
        currentLang = newLang;

        // Update basic static text first
        document.documentElement.lang = currentLang;
        body.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
        updateTextContent();
        updateYieldDisplay(); // Update yield format

        // Update language button active states
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));

        // Refresh dynamic content if a cookie is selected
        if (selectedCookieType) {
             // Re-generate and inject content with new language
             displaySelectedCookieContent(selectedCookieType);
        } else {
             // Update placeholder text if visible
             contentPlaceholder.innerHTML = langData[currentLang].placeholderSelect;
        }
        // Refresh tips
        displayTips();
    }

    function handleScaleUpdate() {
         // Ensure elements exist before proceeding
         if (!butterAmountInput) return;

        const newButterAmount = parseFloat(butterAmountInput.value);
        if (!isNaN(newButterAmount) && newButterAmount >= 50) { // Use min value from input
            currentScaleFactor = newButterAmount / STANDARD_BUTTER_GRAMS;
            butterAmountInput.value = Math.round(newButterAmount); // Clean up value
        } else {
            // Reset on invalid input
            currentScaleFactor = 1;
            butterAmountInput.value = STANDARD_BUTTER_GRAMS;
             alert(currentLang === 'ar' ? "كمية الزبدة غير صالحة (أقل حد 50 جرام). الرجوع للوضع الأساسي." : "Invalid butter amount (min 50g). Resetting to default.");
        }

        updateYieldDisplay(); // Update yield based on new scale

        // Update ingredients list specifically (more efficient than full redraw)
        if (selectedCookieType && recipeDetailsContainer) {
            const ingredientsList = recipeDetailsContainer.querySelector('.ingredient-list');
            if (ingredientsList) {
                ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType);
            }
        }
        console.log(`Scale Factor: ${currentScaleFactor.toFixed(3)}`);
    }

    function handleCookieCardSelect(event) {
         // Find the card element, even if user clicked on internal element like <img> or <h3>
         const card = event.target.closest('.cookie-card');
         if (!card) return; // Clicked outside a card somehow

        const type = card.dataset.type;

        // Optional: If clicking the already active card, do nothing (or maybe scroll?)
        if (card.classList.contains('active') && selectedCookieType === type) {
            // dynamicContentWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        selectedCookieType = type;

        // Update Card Active States
        cookieCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update Hero Image
        heroCookieImage.src = IMAGE_PATHS[type] || IMAGE_PATHS.heroDefault;
        heroCookieImage.alt = `${type} cookie closeup`; // Generate alt text

        // Update Omar's Fave Badge Visibility
        omarsFavBadge.classList.toggle('visible', type === 'thick');
        omarsFavBadge.classList.toggle('visually-hidden', type !== 'thick');

        // Trigger the main content display logic
        displaySelectedCookieContent(type);
    }

     // Handles clicks within the recipe container for unit toggles
    function handleUnitChangeDelegation(event) {
        const button = event.target.closest('.unit-btn');
        // Ensure click is on a button within the toggles INSIDE this recipe container
        if (!button || !event.currentTarget.contains(button)) return;

        const newUnitType = button.dataset.unitType;
        const buttonLang = button.closest('.unit-selector')?.dataset.lang;
        if (!buttonLang) return; // Should not happen

        const newUnit = ((buttonLang === 'en' && newUnitType === 'imperial') || (buttonLang === 'ar' && newUnitType === 'cups'))
                        ? 'imperial'
                        : 'metric';

        if (newUnit !== currentUnit) {
             currentUnit = newUnit;
             console.log(`Unit changed to: ${currentUnit}`);

             // Update ingredients list based on new unit
             const ingredientsList = recipeDetailsContainer.querySelector('.ingredient-list');
             if (ingredientsList && selectedCookieType) {
                 ingredientsList.innerHTML = generateIngredientsHTML(selectedCookieType);
             }
             // Update active state on buttons
             updateUnitTogglesState(recipeDetailsContainer);
         }
     }


    // --- INITIALIZATION ---
    function initialize() {
        console.log("Initializing Cookie Lab!");
        currentLang = document.documentElement.lang || DEFAULT_LANG;
        if (!langData[currentLang]) currentLang = DEFAULT_LANG; // Fallback lang

        // Initial setup based on currentLang
        document.documentElement.lang = currentLang;
        body.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));

        updateTextContent(); // Set static text
        updateYieldDisplay(); // Set initial yield
        displayTips(); // Display initial tips

        // Setup event listeners
        langButtons.forEach(btn => btn.addEventListener('click', handleLanguageChange));
        cookieCards.forEach(card => {
            card.addEventListener('click', handleCookieCardSelect);
            // Add keypress listener for accessibility (Enter/Space)
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent space scrolling
                    handleCookieCardSelect(e);
                }
            });
        });


        // Ensure placeholder is shown initially
        showPlaceholderContent(); // Redundant? Set directly maybe? No, keeps logic together.


        // Fade in the page
        body.classList.add('loaded');
    }

    initialize();

}); // End DOMContentLoaded