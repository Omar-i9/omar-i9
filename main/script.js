document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. المتغيرات وإعدادات التخزين (Storage)
  // ==========================================
  const STORAGE = {
    lastIndex: "omarp_last_song_index",
    lastTime: "omarp_last_song_time",
    volume: "omarp_volume",
    wasPlaying: "omarp_was_playing",
    shuffle: "omarp_shuffle",
    repeat: "omarp_repeat",
    favorites: "omarp_favorites",
    search: "omarp_search",
    ayahVisible: "omarp_ayah_visible",
    ayahX: "omarp_ayah_x",
    ayahY: "omarp_ayah_y",
    device: "omarp_device_mode",
  };

  const AUDIO_BASE = "./audio/";
  const IMAGE_BASE = "./images/";
  const FALLBACK_COVER = "./photo/profile.jpeg";
  const SHARE_URL = "https://omar-i9.github.io/my-profiles/";
  const SHARE_TEXT = "هذا موقعي، تفضل الرابط:";

  // ==========================================
  // 2. ربط عناصر الـ DOM
  // ==========================================
  const toast = document.getElementById("toast");
  const musicFab = document.getElementById("musicFab");
  const musicSheet = document.getElementById("musicSheet");
  const overlay = document.getElementById("overlay");
  const closeMusicBtn = document.getElementById("closeMusicBtn");

  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const progressBar = document.getElementById("progressBar");
  const seekBar = document.getElementById("seekBar");
  const seekWrap = document.getElementById("seekWrap");
  const seekTooltip = document.getElementById("seekTooltip");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");

  const volumeBar = document.getElementById("volumeBar");
  const volumeIcon = document.getElementById("volumeIcon");
  const volumeIconBtn = document.getElementById("volumeIconBtn");
  const volumeValue = document.getElementById("volumeValue");

  const songTitle = document.getElementById("songTitle");
  const songArtist = document.getElementById("songArtist");
  const musicCover = document.getElementById("musicCover");

  const prevSongBtn = document.getElementById("prevSongBtn");
  const nextSongBtn = document.getElementById("nextSongBtn");

  const playlistEl = document.getElementById("playlist");
  const playlistCount = document.getElementById("playlistCount");
  const audioState = document.getElementById("audioState");
  const copyButtons = document.querySelectorAll("[data-copy]");

  const ayahFloat = document.getElementById("ayahFloat");
  const ayahNum = document.getElementById("ayahNum");
  const ayahText = document.getElementById("ayahText");
  const ayahRef = document.getElementById("ayahRef");
  const ayahNote = document.getElementById("ayahNote");
  const ayahDetail = document.getElementById("ayahDetail");

  const main = document.querySelector(".app");
  const playlistBox = document.querySelector(".playlist-box");
  const musicControls = document.querySelector(".music-controls");
  const sectionTitles = Array.from(document.querySelectorAll(".section-title"));

  // عناصر المشاركة والتواصل
  const moreSocialsBtn = document.getElementById("moreSocialsBtn");
  const moreSocialsDrawer = document.getElementById("moreSocialsDrawer");
  const moreSocialsBackdrop = document.getElementById("moreSocialsBackdrop");
  const moreSocialsClose = document.getElementById("moreSocialsClose");

  const sharePortalBtn = document.getElementById("sharePortalBtn");
  const shareOverlay = document.getElementById("shareOverlay");
  const closeShareBtn = document.getElementById("closeShare");
  const shareQrImg = document.getElementById("shareQrImg");
  const shareUrlInput = document.getElementById("shareUrlInput");
  const copyShareBtn = document.getElementById("copyShareBtn");
  const nativeShareBtn = document.getElementById("nativeShareBtn");
  const desktopSheetBtn = document.getElementById("desktopSheetBtn");
  const openLinkBtn = document.getElementById("openLinkBtn");
  const fakeShareSheet = document.getElementById("fakeShareSheet");
  const sheetBackdrop = fakeShareSheet?.querySelector(".sheet-backdrop");
  const closeSheetBtn = document.getElementById("closeSheetBtn");
  const waShare = document.getElementById("waShare");
  const fbShare = document.getElementById("fbShare");
  const tgShare = document.getElementById("tgShare");

  // ==========================================
  // 3. قواعد البيانات (الأغاني والآيات)
  // ==========================================
  const songs = [
    { base: "wildflower", title: "wildflower", coverCandidates: ["png", "jpeg", "jpg"] },
    { base: "arctic-505", title: "Arctic Monkeys 505", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "athr-dhelak", title: "Mohamed Alflahi – Athr Dhelak", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "babydoll", title: "Dominic Fike - Babydoll", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "death-bed", title: "Powfu - death bed (coffee for your head)", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "hotel-uglyy", title: "Hotel Ugly - Shut Up My Moms Calling", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "manu-chao", title: "Manu Chao - Me Gustas Tu", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "no-one-noticed", title: "The Marías - No One Noticed - Minimal Sounds", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "tv-girl", title: "TV Girl - Cigarettes out the Window", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "درب المهالك", title: "درب المهالك", coverCandidates: ["jpg", "jpeg", "png"] },
    { base: "كلاش - نصيحة مشفق", title: "كلاش - نصيحة مشفق", coverCandidates: ["jpg", "jpeg", "png"] },
  ].map((song, index) => ({
    ...song,
    index,
    src: `${AUDIO_BASE}${encodeURIComponent(song.base)}.mp3`,
    fileLabel: `${song.base}.mp3`,
  }));

  const ayahs = [
    { num: 1, text: "﴿لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾", ref: "[الزمر: 53]", note: "عن عدم اليأس.", detail: "هذه الآية تفتح باب الرجاء مهما كان الذنب أو الثقل أو الضعف. معناها أن رحمة الله أوسع من الحالة التي يمر بها الإنسان، وأن الانكسار ليس نهاية الطريق." },
    { num: 2, text: "﴿قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ﴾", ref: "[آل عمران: 31]", note: "المحبة لها أثر وسلوك.", detail: "المعنى هنا أن الحب الصادق لا يبقى مجرد كلام، بل يظهر في الاتباع والعمل. الآية تربط بين الشعور الداخلي والسلوك الظاهر، وتبين أن المحبة الحقيقية لها علامة واضحة." },
    { num: 3, text: "﴿إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ﴾", ref: "[يوسف: 86]", note: "للشكوى الصامتة.", detail: "هذه من أقرب الآيات لمن يحمل همًا داخليًا لا يشرحه للناس. فيها صدق وهدوء، وتصور أن القلب حين يضيق يجد مخرجًا في البوح إلى الله وحده." },
    { num: 4, text: "﴿وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ﴾", ref: "[الشورى: 25]", note: "الأمل بعد الخطأ.", detail: "الآية تؤكد أن الرجوع ليس خسارة، بل بداية. الباب مفتوح، والرحمة سابقة، والإنسان لا يُغلق عليه الماضي إذا صدق في الرجوع." },
    { num: 5, text: "﴿وَيَعْلَمُ مَا فِي الصُّدُورِ﴾", ref: "[آل عمران: 119]", note: "ما في القلب معلوم.", detail: "هذا المعنى يخفف ثقل الكتمان؛ لأن ما لا يُقال لا يضيع، وما في الصدر معلوم عند الله قبل أن يُنطق به." },
    { num: 6, text: "﴿يَعْلَمُ خَائِنَةَ الْأَعْيُنِ وَمَا تُخْفِي الصُّدُورُ﴾", ref: "[غافر: 19]", note: "حتى الخاطر الصغير.", detail: "الآية دقيقة جدًا في تصوير علم الله. حتى النظرة العابرة، وحتى ما يُخفى في الداخل، ليس خارجًا عن العلم والإحاطة." },
    { num: 7, text: "﴿وَابْيَضَّتْ عَيْنَاهُ مِنَ الْحُزْنِ﴾", ref: "[يوسف: 84]", note: "شوق وافتقاد.", detail: "فيها وصف مؤلم لكن عميق للحزن الطويل. ليست مجرد دمعة عابرة، بل صورة لوجع ممتد يترك أثره في الجسد والروح." },
    { num: 8, text: "﴿إِنِّي لَأَجِدُ رِيحَ يُوسُفَ﴾", ref: "[يوسف: 94]", note: "إحساس قريب من الحنين.", detail: "الآية تلمّح إلى شوقٍ شديد يسبق الرؤية. كأن القلب يلتقط الأثر قبل العين، وهذا من أجمل صور الحنين في القرآن." },
    { num: 9, text: "﴿وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ﴾", ref: "[ق: 16]", note: "قرب وأمان.", detail: "المعنى هنا عظيم: القرب الإلهي ليس معنويًا فقط، بل إحاطة وعلم ورحمة، وهذا يبعث الطمأنينة في أضعف اللحظات." },
    { num: 10, text: "﴿إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ﴾", ref: "[هود: 61]", note: "قرب يطمئن.", detail: "هذه الجملة القصيرة تحمل معنى واسعًا جدًا: لا بعد مع الدعاء، ولا ضياع مع النداء، ولا خيبة مع صدق الطلب." },
    { num: 11, text: "﴿رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي﴾", ref: "[القصص: 16]", note: "ندم وتوبة.", detail: "فيها اعتراف صادق، ومن الاعتراف يبدأ التطهر. الآية قصيرة لكن فيها معنى التواضع والرجوع الكامل." },
    { num: 12, text: "﴿ثُمَّ تَابَ عَلَيْهِمْ لِيَتُوبُوا﴾", ref: "[التوبة: 118]", note: "التوفيق قبل القرار.", detail: "من أعمق المعاني: أن التوبة نفسها توفيق من الله. أي أن الرجوع ليس مجرد قوة شخصية، بل رحمة وإعانة قبل كل شيء." },
    { num: 13, text: "﴿سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا﴾", ref: "[مريم: 96]", note: "مودة من الله.", detail: "المعنى أن المحبة قد تُوضع في القلوب بلا سبب ظاهر، وأن القبول الحقيقي من الله، لا من المظاهر." },
    { num: 14, text: "﴿وَأَلْقَيْتُ عَلَيْكَ مَحَبَّةً مِّنِّي﴾", ref: "[طه: 39]", note: "حب يزرعه الله.", detail: "هذه الآية لطيفة جدًا في معناها؛ لأن المحبة هنا ليست مكتسبة بالظاهر، بل موهوبة ومُلقاة من عند الله." },
    { num: 15, text: "﴿فَصَبْرٌ جَمِيلٌ﴾", ref: "[يوسف: 18]", note: "صبر هادئ.", detail: "الصبر الجميل هو الصبر الذي لا ينهار صاحبه فيه ولا يجزع، بل يحتمل الألم دون شكوى للناس." },
    { num: 16, text: "﴿وَلَا تَهِنُوا وَلَا تَحْزَنُوا﴾", ref: "[آل عمران: 139]", note: "رفع للهمّة.", detail: "هذه الآية تأتي كرفع مباشر للروح، وتمنح القلب دفعة من الثبات بعد الضعف." },
    { num: 17, text: "﴿وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ﴾", ref: "[النحل: 127]", note: "الصبر ليس وحدك.", detail: "هذه الآية تربط الصبر بالله مباشرة، وكأنها تقول إن الثبات الحقيقي لا يأتي من قوة الإنسان وحدها، بل من معونة الله. فيها معنى هادئ وعميق جدًا لمن يمر بضيق ويحتاج سندًا داخليًا." },
    { num: 18, text: "﴿إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾", ref: "[البقرة: 153]", note: "معية ترفع القلب.", detail: "هذه من أقوى الآيات في معنى التحمل؛ لأنها لا تعد بالصبر فقط، بل تبشر بمعية الله للصابر. والمعنى أن الألم لا يكون فارغًا إذا صاحبه إيمان واحتساب." },
    { num: 19, text: "﴿وَبَشِّرِ الصَّابِرِينَ﴾", ref: "[البقرة: 155]", note: "بشارة وسط الامتحان.", detail: "الآية قصيرة لكن أثرها كبير، لأنها تجعل الصبر نفسه طريقًا للبشارة. وفيها إشارة أن الابتلاء ليس مجرد وجع، بل قد يكون بابًا لخير كبير لا يُرى في لحظته." },
    { num: 20, text: "﴿رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا﴾", ref: "[البقرة: 250]", note: "طلب الصبر من الله.", detail: "فيها دعاء نادر وقوي جدًا؛ لأنهم لم يطلبوا مجرد صبر عادي، بل صبًا يغمر القلب بالكامل. وهذا يجعلها مناسبة جدًا وقت الضعف أو الخوف أو الضغط." },
    { num: 21, text: "﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا﴾", ref: "[الشرح: 5]", note: "بعد الضيق انفراج.", detail: "هذه من أشهر آيات الرجاء، ومعناها أن الشدة لا تبقى مغلقة إلى الأبد. فيها وعد واضح بأن مع ثقل اللحظة يوجد باب آخر للفرج، حتى لو تأخر ظهوره." },
    { num: 22, text: "﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾", ref: "[الرعد: 28]", note: "طمأنينة القلب.", detail: "هذه الآية تمسك بجذر الراحة الداخلية: ليس كل ما يهدئ الإنسان يأتي من الخارج. أحيانًا القلب لا يهدأ إلا حين يعود لذكر الله." },
    { num: 23, text: "﴿رَبَّنَا لَا تُزِغْ قُلُوبَنَا﴾", ref: "[آل عمران: 8]", note: "ثبات القلب.", detail: "فيها خوف جميل من الانحراف، وفيها أدب الدعاء أيضًا؛ كأن الإنسان يعترف أنه ضعيف ويطلب الثبات. وهي مناسبة جدًا لمن يخاف تقلب قلبه." },
    { num: 24, text: "﴿رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ﴾", ref: "[الفرقان: 74]", note: "دعاء الجمال الأسري.", detail: "هذه الآية تحمل معنى لطيفًا جدًا؛ لأن قرة العين ليست مجرد وجود الناس حولك، بل أن يكونوا سببًا للراحة والسكينة والخير في القلب." },
    { num: 25, text: "﴿رَبِّ اشْرَحْ لِي صَدْرِي﴾", ref: "[طه: 25]", note: "سعة صدر.", detail: "دعاء عظيم لمن يضيق صدره أو يثقل عليه الأمر. فيه طلب واضح أن يفتح الله القلب للفهم والتحمل والهدوء، ولذلك يلامس كثيرًا من الناس." },
    { num: 26, text: "﴿وَيَشْفِ صُدُورَ قَوْمٍ مُّؤْمِنِينَ﴾", ref: "[التوبة: 14]", note: "شفاء الداخل.", detail: "الآية لا تتكلم عن الألم الظاهر فقط، بل عن الصدر نفسه. وهذا يجعلها مناسبة جدًا لمن يشعر بثقل داخلي لا يراه الناس." },
    { num: 27, text: "﴿إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ﴾", ref: "[الشعراء: 62]", note: "ثقة وسط الخوف.", detail: "هذه جملة من القوة والثبات، وفيها يقين بأن الحيرة لا تعني الضياع. معناها أن وجود الله مع العبد يجعل الطريق موجودًا ولو لم يره بعد." },
    { num: 28, text: "﴿لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا﴾", ref: "[التوبة: 40]", note: "سند وقت الخوف.", detail: "من أقوى الآيات في التطمين؛ لأنها تجمع بين نهي الحزن وذكر المعية. فيها رسالة مباشرة أن الموقف مهما اشتد، فالله ليس غائبًا." },
    { num: 29, text: "﴿إِنِّي لَذَاهِبٌ إِلَىٰ رَبِّي سَيَهْدِينِ﴾", ref: "[الصافات: 99]", note: "اتجاه القلب.", detail: "فيها معنى جميل جدًا عن التوجه إلى الله، وكأن الرجوع إليه هو بداية الهداية لا نهايتها. مناسبة جدًا لمعنى العودة والبحث عن الطريق." },
    { num: 30, text: "﴿وَقُلْ رَبِّ زِدْنِي عِلْمًا﴾", ref: "[طه: 114]", note: "دعاء الزيادة.", detail: "هذه آية رقيقة لكنها عظيمة؛ لأنها تعلم الإنسان ألا يكتفي. وهي مناسبة جدًا لمن يحب التعلم أو يشعر أنه ما زال يحتاج فهمًا أوسع." },
    { num: 31, text: "﴿وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ﴾", ref: "[الحديد: 2]", note: "قدرة لا يعجزها شيء.", detail: "تعطي القلب اتساعًا كبيرًا؛ لأن كل ما يبدو مستحيلًا عند الإنسان ليس مستحيلًا عند الله. هذه الآية تفتح باب الرجاء في أصعب الحالات." },
    { num: 32, text: "﴿إِنَّ رَبِّي سَمِيعُ الدُّعَاءِ﴾", ref: "[إبراهيم: 39]", note: "الدعاء لا يضيع.", detail: "فيها طمأنينة مباشرة بأن الصوت الذي يخرج من القلب يُسمع، حتى لو لم يسمعه أحد من الناس. مناسبة جدًا لمن يدعو كثيرًا ويحتاج يقينًا." },
    { num: 33, text: "﴿فَإِنِّي قَرِيبٌ﴾", ref: "[البقرة: 186]", note: "قرب يختصر المسافة.", detail: "آية قصيرة جدًا لكنها من أعمق آيات الطمأنينة. فيها قرب مباشر من الله للعبد حين يدعو، وهذا يجعلها من أجمل الآيات للنوافذ الهادئة." },
    { num: 34, text: "﴿إِنَّ رَبِّي لَطِيفٌ لِّمَا يَشَاءُ﴾", ref: "[يوسف: 100]", note: "اللطف في التدبير.", detail: "هذه الآية تشرح أن ما يبدو معقدًا قد يكون فيه لطف خفي من الله. معناها جميل جدًا لمن ينظر إلى ما وراء الأحداث ولا يحكم بسرعة." },
    { num: 35, text: "﴿رَبِّ لَا تَذَرْنِي فَرْدًا﴾", ref: "[الأنبياء: 89]", note: "دعاء الوحدة.", detail: "فيها احتياج إنساني واضح وصادق. ليست مجرد طلب ولد، بل طلب ألا يبقى الإنسان وحيدًا بلا سند أو امتداد أو أنس." },
    { num: 36, text: "﴿وَفَوَّضْتُ أَمْرِي إِلَى اللَّهِ﴾", ref: "[غافر: 44]", note: "تفويض وراحة.", detail: "هذه من أهدأ آيات التسليم؛ لأنها تعني أن الإنسان توقف عن حمل ما لا يقدر عليه وحده، وأسلم أمره لمن يدبر أفضل منه." },
  ];

  // ==========================================
  // 4. حالة التطبيق (State)
  // ==========================================
  let currentSongIndex = clamp(getNumber(STORAGE.lastIndex, 0), 0, songs.length - 1);
  let currentTimeRestore = Math.max(0, getNumber(STORAGE.lastTime, 0));
  let shuffleEnabled = getBoolean(STORAGE.shuffle, false);
  let repeatMode = getString(STORAGE.repeat, "off");
  let searchTerm = getString(STORAGE.search, "").trim().toLowerCase();
  let favorites = new Set(getArray(STORAGE.favorites, []));
  let visibleIndexes = [];
  let loadedResumeApplied = false;
  let isSeeking = false;
  let hideTooltipTimer = null;
  let toastTimer = null;

  let ayahTimer = null;
  let ayahDelay = 7000;
  let ayahExpanded = false;
  let ayahOrder = [];
  let ayahCursor = 0;
  let ayahVisible = getBoolean(STORAGE.ayahVisible, true);
  const ayahDragState = {
    active: false,
    started: false,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  };

  let trackMenu = null;
  let menuIndex = -1;
  const playbackHistory = [];
  let pendingResume = false;

  // Audio Context للنبض (Pulse)
  let audioCtx, analyzer, dataArray;
  let audioContextInitialized = false;

  // ==========================================
  // 5. دوال مساعدة (Helpers)
  // ==========================================
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getNumber(key, fallback) {
    const v = Number(localStorage.getItem(key));
    return Number.isFinite(v) ? v : fallback;
  }

  function getBoolean(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "true";
  }

  function getString(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw;
  }

  function getArray(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function setStored(key, value) {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      return true;
    } catch {
      return false;
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  function copyText(text) {
    if (!text) return;
    copyToClipboard(text).then((ok) => showToast(ok ? "تم النسخ" : "تعذر النسخ"));
  }

  // ==========================================
  // 6. المشغل والأغاني (Music Player Core)
  // ==========================================
  function baseTrackSearch(song) {
    return `${song.title} ${song.fileLabel} ${song.base}`.toLowerCase();
  }

  function songFavorite(index) {
    return favorites.has(index);
  }

  function saveFavorites() {
    setStored(STORAGE.favorites, Array.from(favorites));
  }

  function savePlaybackSnapshot() {
    setStored(STORAGE.lastIndex, String(currentSongIndex));
    setStored(STORAGE.lastTime, String(Math.max(0, audio?.currentTime || 0)));
    setStored(STORAGE.volume, String(Math.round((audio?.volume || 0) * 100)));
    setStored(STORAGE.wasPlaying, String(!audio?.paused));
    setStored(STORAGE.shuffle, String(shuffleEnabled));
    setStored(STORAGE.repeat, repeatMode);
    setStored(STORAGE.search, searchTerm);
    setStored(STORAGE.ayahVisible, String(ayahVisible));
    setStored(STORAGE.device, document.body?.dataset?.device || detectDeviceMode());

    if (ayahFloat) {
      const rect = ayahFloat.getBoundingClientRect();
      setStored(STORAGE.ayahX, String(Math.round(rect.left)));
      setStored(STORAGE.ayahY, String(Math.round(rect.top)));
    }
  }

  function updateRepeatButton() {
    const repeatBtn = document.getElementById("repeatBtn");
    if (!repeatBtn) return;
    const label = repeatMode === "one" ? "Repeat 1" : repeatMode === "all" ? "Repeat All" : "Repeat Off";
    repeatBtn.textContent = label;
    repeatBtn.classList.toggle("active", repeatMode !== "off");
    repeatBtn.setAttribute("aria-pressed", repeatMode !== "off" ? "true" : "false");
  }

  function updateShuffleButton() {
    const shuffleBtn = document.getElementById("shuffleBtn");
    if (!shuffleBtn) return;
    shuffleBtn.classList.toggle("active", shuffleEnabled);
    shuffleBtn.setAttribute("aria-pressed", shuffleEnabled ? "true" : "false");
  }

  function updateNowPlayingCard() {
    const nowPlayingTitle = document.getElementById("nowPlayingTitle");
    const nowPlayingSub = document.getElementById("nowPlayingSub");
    const nowPlayingIndex = document.getElementById("nowPlayingIndex");
    if (!nowPlayingTitle || !nowPlayingSub || !nowPlayingIndex) return;

    const song = songs[currentSongIndex];
    nowPlayingTitle.textContent = song ? song.title : "اسم الأغنية";
    nowPlayingSub.textContent = audio?.paused ? "متوقف" : "يعمل الآن";
    nowPlayingIndex.textContent = `${currentSongIndex + 1} / ${songs.length}`;
  }

  function setVolumeTheme(value) {
    const pct = clamp(value, 0, 100);
    const hue = Math.round((pct / 100) * 140);
    const color = `hsl(${hue} 92% 56%)`;
    document.documentElement.style.setProperty("--volume-color", color);
    if (volumeBar) {
      volumeBar.style.background = `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,.08) ${pct}%, rgba(255,255,255,.08) 100%)`;
    }
    if (volumeValue) volumeValue.textContent = `${pct}%`;

    if (volumeIcon) {
      if (pct === 0) volumeIcon.className = "fa-solid fa-volume-xmark";
      else if (pct < 35) volumeIcon.className = "fa-solid fa-volume-low";
      else volumeIcon.className = "fa-solid fa-volume-high";
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function updateProgress() {
    if (!audio?.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (!isSeeking && seekBar) seekBar.value = String(pct);
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
  }

  function updateSeekTooltipFromValue(value) {
    if (!audio?.duration || !seekTooltip || !seekWrap) return;
    const ratio = clamp(Number(value), 0, 100) / 100;
    const time = ratio * audio.duration;
    seekTooltip.textContent = formatTime(time);

    const rect = seekWrap.getBoundingClientRect();
    const x = rect.width * ratio;
    seekTooltip.style.left = `${x}px`;
  }

  function showSeekTooltip() {
    if (!seekTooltip) return;
    seekTooltip.classList.add("show");
    clearTimeout(hideTooltipTimer);
  }

  function hideSeekTooltipSoon() {
    if (!seekTooltip) return;
    clearTimeout(hideTooltipTimer);
    hideTooltipTimer = setTimeout(() => {
      if (!isSeeking) seekTooltip.classList.remove("show");
    }, 220);
  }

  function setPlayIcon(isPlaying) {
    if (!playIcon) return;
    playIcon.className = `fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`;
  }

  function updatePulse(isPlaying) {
    if (!musicFab) return;
    musicFab.style.animation = isPlaying ? "pulse 1s infinite" : "none";
  }

  function getCoverCandidates(song) {
    const exts = Array.isArray(song.coverCandidates) && song.coverCandidates.length ? song.coverCandidates : ["jpg", "jpeg", "png"];
    const candidates = exts.map((ext) => `${IMAGE_BASE}${encodeURIComponent(song.base)}.${ext}`);
    candidates.push(FALLBACK_COVER);
    return candidates;
  }

  function applyImageFallback(img, candidates) {
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        img.src = FALLBACK_COVER;
        return;
      }
      const nextUrl = candidates[idx++];
      img.onerror = tryNext;
      img.src = nextUrl;
    };
    tryNext();
  }

  function currentSong() {
    return songs[currentSongIndex] || songs[0];
  }

  function setActiveTrack() {
    document.querySelectorAll(".track").forEach((track) => {
      track.classList.toggle("active", Number(track.dataset.index) === currentSongIndex);
    });
    updateNowPlayingCard();
  }

  function refreshToolbarState() {
    updateShuffleButton();
    updateRepeatButton();

    const searchInput = document.getElementById("songSearch");
    if (searchInput && searchInput.value !== searchTerm) {
      searchInput.value = searchTerm;
    }
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .trim();
  }

  function getVisibleSongIndexes() {
    const normalized = normalizeText(searchTerm);
    let indexes = songs.map((_, i) => i);

    if (normalized) {
      indexes = indexes.filter((i) => {
        const song = songs[i];
        return normalizeText(baseTrackSearch(song)).includes(normalized);
      });
    }

    indexes.sort((a, b) => {
      const af = songFavorite(a) ? 1 : 0;
      const bf = songFavorite(b) ? 1 : 0;
      if (af !== bf) return bf - af;
      return a - b;
    });

    return indexes;
  }

  function attachLongPress(trackEl, index) {
    let lpTimer = null;
    let startX = 0;
    let startY = 0;
    let fired = false;

    const clear = () => {
      if (lpTimer) clearTimeout(lpTimer);
      lpTimer = null;
    };

    trackEl.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      fired = false;
      clear();
      lpTimer = setTimeout(() => {
        fired = true;
        trackEl.dataset.ignoreClick = "1";
        openTrackMenu(index, e.clientX + 12, e.clientY + 12);
      }, 550);
    });

    trackEl.addEventListener("pointermove", (e) => {
      if (!lpTimer) return;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > 8 || dy > 8) clear();
    });

    trackEl.addEventListener("pointerup", () => {
      clear();
      if (fired) {
        setTimeout(() => {
          trackEl.dataset.ignoreClick = "0";
        }, 120);
      }
    });

    trackEl.addEventListener("pointercancel", () => {
      clear();
      trackEl.dataset.ignoreClick = "0";
    });
  }

  function buildPlaylist() {
    if (!playlistEl) return;
    visibleIndexes = getVisibleSongIndexes();
    if (playlistCount) playlistCount.textContent = `${visibleIndexes.length} / ${songs.length} أغنية`;

    if (!visibleIndexes.length) {
      playlistEl.innerHTML = `<div class="track-empty">لا توجد نتائج</div>`;
      return;
    }

    playlistEl.innerHTML = visibleIndexes.map((index) => {
      const song = songs[index];
      const fav = songFavorite(index);
      const coverCandidates = getCoverCandidates(song);
      return `
        <div class="track${index === currentSongIndex ? " active" : ""}${fav ? " fav" : ""}" data-index="${index}" tabindex="0" role="button" aria-label="تشغيل ${song.title}">
          <img class="track-cover" src="${coverCandidates[0]}" alt="غلاف ${song.title}" data-cover-index="${index}">
          <div class="track-meta">
            <strong>${song.title}</strong>
            <span>${song.fileLabel}</span>
          </div>
          <button class="track-star ${fav ? "active" : ""}" type="button" data-fav-index="${index}" aria-label="مفضلة">
            <i class="fa-solid fa-star"></i>
          </button>
        </div>
      `;
    }).join("");

    playlistEl.querySelectorAll(".track-cover").forEach((img) => {
      const index = Number(img.dataset.coverIndex);
      const song = songs[index];
      applyImageFallback(img, getCoverCandidates(song));
    });

    playlistEl.querySelectorAll(".track").forEach((track) => {
      const index = Number(track.dataset.index);
      attachLongPress(track, index);

      track.addEventListener("click", (e) => {
        const ignore = track.dataset.ignoreClick === "1";
        if (ignore) {
          track.dataset.ignoreClick = "0";
          return;
        }
        if (e.target.closest(".track-star")) return;
        playSong(index);
      });

      track.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          playSong(index);
        }
      });
    });

    playlistEl.querySelectorAll(".track-star").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = Number(btn.dataset.favIndex);
        toggleFavorite(index);
      });
    });

    setActiveTrack();
  }

  function toggleFavorite(index) {
    if (favorites.has(index)) favorites.delete(index);
    else favorites.add(index);
    saveFavorites();
    buildPlaylist();
    showToast(favorites.has(index) ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
  }

  function cycleRepeatMode() {
    if (repeatMode === "off") repeatMode = "all";
    else if (repeatMode === "all") repeatMode = "one";
    else repeatMode = "off";
    setStored(STORAGE.repeat, repeatMode);
    updateRepeatButton();
    showToast(repeatMode === "off" ? "Repeat Off" : repeatMode === "one" ? "Repeat 1" : "Repeat All");
  }

  function toggleShuffle() {
    shuffleEnabled = !shuffleEnabled;
    setStored(STORAGE.shuffle, String(shuffleEnabled));
    updateShuffleButton();
    showToast(shuffleEnabled ? "Shuffle On" : "Shuffle Off");
  }

  function loadSong(index, autoplay = false, options = {}) {
    if (!songs.length || !audio) return;
    const { pushHistory = true, restoreTime = null } = options;

    if (pushHistory && index !== currentSongIndex) {
      playbackHistory.push(currentSongIndex);
      if (playbackHistory.length > 50) playbackHistory.shift();
    }

    currentSongIndex = (index + songs.length) % songs.length;
    const song = currentSong();
    if (!song) return;

    if (audioState) audioState.textContent = "جاري التحميل...";
    if (songTitle) songTitle.textContent = song.title;
    if (songArtist) songArtist.textContent = song.fileLabel;

    if (musicCover) {
      musicCover.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_COVER;
      };
      applyImageFallback(musicCover, getCoverCandidates(song));
    }

    audio.src = song.src;
    audio.load();

    setActiveTrack();
    updateNowPlayingCard();
    savePlaybackSnapshot();

    if (autoplay) {
      // شغلنا النبض هون كمان احتياط لما يشتغل الصوت
      initAudioPulse();
      audio.play().catch(() => showToast("المتصفح منع التشغيل التلقائي"));
    }

    if (restoreTime !== null) {
      currentTimeRestore = restoreTime;
      loadedResumeApplied = false;
    }
  }

  function playSong(index) {
    if (index === currentSongIndex && audio?.src) {
      initAudioPulse();
      audio.play().catch(() => showToast("المتصفح منع التشغيل"));
      return;
    }
    loadSong(index, true, { pushHistory: true });
  }

  function nextSong() {
    if (repeatMode === "one") {
      loadSong(currentSongIndex, true, { pushHistory: false });
      return;
    }

    if (shuffleEnabled) {
      if (songs.length <= 1) {
        loadSong(currentSongIndex, true, { pushHistory: false });
        return;
      }
      let nextIndex = currentSongIndex;
      while (nextIndex === currentSongIndex) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }
      loadSong(nextIndex, true, { pushHistory: true });
      return;
    }

    const nextIndex = (currentSongIndex + 1) % songs.length;
    loadSong(nextIndex, true, { pushHistory: true });
  }

  function prevSong() {
    if (repeatMode === "one") {
      loadSong(currentSongIndex, true, { pushHistory: false });
      return;
    }

    if (shuffleEnabled && playbackHistory.length) {
      const prevIndex = playbackHistory.pop();
      if (Number.isInteger(prevIndex)) {
        loadSong(prevIndex, true, { pushHistory: false });
        return;
      }
    }

    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(prevIndex, true, { pushHistory: true });
  }

  function togglePlay() {
    if (!audio) return;
    initAudioPulse(); // تشغيل الـ AudioContext بأول تفاعل من المستخدم عشان سياسات المتصفح
    if (audio.paused) {
      audio.play().catch(() => showToast("المتصفح منع التشغيل"));
    } else {
      audio.pause();
    }
  }

  // ==========================================
  // 7. تأثير النبض (Visualizer Pulse)
  // ==========================================
  function initAudioPulse() {
    if (audioContextInitialized || !audio) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      analyzer = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(analyzer);
      analyzer.connect(audioCtx.destination);
      analyzer.fftSize = 256;
      const bufferLength = analyzer.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      audioContextInitialized = true;
      runPulseAnimation();
    } catch (e) {
      console.warn("تفعيل النبض الصوتي فشل (عادي بتصير ببعض المتصفحات):", e);
    }
  }

  function runPulseAnimation() {
    if (!analyzer || !dataArray) return;
    requestAnimationFrame(runPulseAnimation);
    
    if (audio.paused) return; // ما تعمل نبض لو الصوت واقف
    
    analyzer.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    
    // النبض بصير للأفاتار نفسه (حسب الكود القديم تبعك)
    const scale = 1 + (avg / 600); 
    const avatar = document.querySelector('.avatar');
    if(avatar) avatar.style.transform = `translateX(-50%) scale(${scale})`;
  }

  // ==========================================
  // 8. الستايلات وبناء الواجهة الإضافية (UI Builders)
  // ==========================================
  function ensureExtraStyles() {
    if (document.getElementById("addonStyles")) return;
    const style = document.createElement("style");
    style.id = "addonStyles";
    style.textContent = `
      .section-title.enhanced {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .section-title .section-icon {
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-size: 11px;
        background: rgba(255,255,255,.06);
        color: #d8f9ff;
      }
      .page-divider {
        height: 1px;
        width: min(100%, 560px);
        margin: 16px auto 10px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
      }
      .music-toolbar {
        display: grid;
        gap: 10px;
        margin: 10px 0 12px;
      }
      .music-search {
        width: 100%;
        min-height: 44px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px;
        background: rgba(255,255,255,.04);
        color: #fff;
        padding: 0 14px;
        outline: none;
        font-family: inherit;
        transition: border-color .18s ease, background .18s ease, transform .18s ease;
      }
      .music-search:focus {
        border-color: rgba(0,242,255,.3);
        background: rgba(255,255,255,.06);
      }
      .toolbar-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .tool-btn {
        min-height: 38px;
        padding: 0 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.05);
        color: #fff;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        transition: transform .18s ease, background .18s ease, border-color .18s ease;
      }
      .tool-btn.active {
        background: rgba(0,242,255,.12);
        border-color: rgba(0,242,255,.24);
        color: #d8ffff;
      }
      .tool-btn:active { transform: scale(.98); }
      .now-playing-card {
        display: grid;
        gap: 2px;
        margin: 10px 0 8px;
        padding: 10px 12px;
        border-radius: 16px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
        border: 1px solid rgba(255,255,255,.07);
      }
      .now-playing-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 11px;
        color: #a7b5c4;
        font-weight: 800;
      }
      .now-playing-title {
        font-size: 14px;
        font-weight: 900;
        line-height: 1.4;
      }
      .now-playing-sub {
        font-size: 11px;
        color: #98a8b8;
      }
      .track {
        transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
      }
      .track:hover,
      .track:focus-visible {
        transform: translateY(-1px);
        box-shadow: 0 12px 22px rgba(0,0,0,.16);
        border-color: rgba(255,255,255,.12);
      }
      .track.fav { border-color: rgba(255,215,0,.22); }
      .track-star {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        border: none;
        background: rgba(255,255,255,.06);
        color: rgba(255,255,255,.65);
        cursor: pointer;
        transition: transform .18s ease, color .18s ease, background .18s ease;
      }
      .track-star.active {
        color: #ffd54a;
        background: rgba(255, 213, 74, .10);
      }
      .track-star:active { transform: scale(.96); }
      .track-empty {
        padding: 16px;
        text-align: center;
        color: #8f9dad;
        border: 1px dashed rgba(255,255,255,.09);
        border-radius: 14px;
        background: rgba(255,255,255,.03);
      }
      .track-menu {
        position: fixed;
        z-index: 99999;
        min-width: 190px;
        padding: 8px;
        border-radius: 16px;
        background: rgba(10,14,22,.97);
        border: 1px solid rgba(255,255,255,.08);
        box-shadow: 0 18px 40px rgba(0,0,0,.35);
        display: none;
        gap: 6px;
      }
      .track-menu.open { display: grid; }
      .track-menu button {
        text-align: right;
        padding: 10px 12px;
        border: none;
        border-radius: 12px;
        background: rgba(255,255,255,.05);
        color: #fff;
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .track-menu button:active { transform: scale(.99); }
      .ayah-toggle-btn {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 996;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(10,14,22,.86);
        color: #dffcff;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(0,0,0,.2);
      }
      .ayah-float {
        background: linear-gradient(180deg, rgba(14,19,28,.92), rgba(9,13,20,.88)) !important;
        border: 1px solid rgba(255,255,255,.08) !important;
        box-shadow: 0 12px 28px rgba(0,0,0,.22) !important;
      }
      .music-sheet .music-top,
      .music-sheet .now-playing-card {
        backdrop-filter: blur(10px);
      }
      /* ستايلات لظهور الكروت متل كودك الأول */
      .social-card {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .social-card.appear {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function decorateSectionTitles() {
    const map = {
      "روابط التواصل": "fa-link",
      "نسخ سريع": "fa-copy",
      "مشروعي": "fa-sparkles",
      "مشروع؟": "fa-sparkles",
    };

    sectionTitles.forEach((el) => {
      if (el.dataset.enhanced === "1") return;
      const label = el.textContent.trim();
      const icon = map[label] || "fa-circle";
      el.innerHTML = `<i class="fa-solid ${icon} section-icon"></i><span>${label}</span>`;
      el.classList.add("enhanced");
      el.dataset.enhanced = "1";
    });
  }

  function ensureDivider() {
    if (document.getElementById("pageDivider")) return;
    const divider = document.createElement("div");
    divider.id = "pageDivider";
    divider.className = "page-divider";
    if (main) main.insertAdjacentElement("afterend", divider);
  }

  function ensureToolbar() {
    if (!musicSheet || document.getElementById("musicToolbar")) return;

    const toolbar = document.createElement("div");
    toolbar.id = "musicToolbar";
    toolbar.className = "music-toolbar";
    toolbar.innerHTML = `
      <input id="songSearch" class="music-search" type="search" placeholder="ابحث داخل الأغاني..." value="${escapeHtml(searchTerm)}">
      <div class="toolbar-actions">
        <button id="shuffleBtn" class="tool-btn" type="button">Shuffle</button>
        <button id="repeatBtn" class="tool-btn" type="button">Repeat Off</button>
        <button id="ayahHideBtn" class="tool-btn" type="button">إخفاء الآية</button>
      </div>
    `;

    musicSheet.insertBefore(toolbar, playlistBox || musicControls);

    const searchInput = document.getElementById("songSearch");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const ayahHideBtn = document.getElementById("ayahHideBtn");

    searchInput?.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      setStored(STORAGE.search, searchTerm);
      buildPlaylist();
    });

    shuffleBtn?.addEventListener("click", () => {
      toggleShuffle();
      refreshToolbarState();
    });

    repeatBtn?.addEventListener("click", () => {
      cycleRepeatMode();
      refreshToolbarState();
    });

    ayahHideBtn?.addEventListener("click", () => {
      toggleAyahVisibility();
    });
  }

  function ensureNowPlayingCard() {
    if (!musicSheet || document.getElementById("nowPlayingCard")) return;

    const card = document.createElement("div");
    card.id = "nowPlayingCard";
    card.className = "now-playing-card";
    card.innerHTML = `
      <div class="now-playing-head">
        <span><i class="fa-solid fa-circle-play"></i> Now Playing</span>
        <span id="nowPlayingIndex">0 / ${songs.length}</span>
      </div>
      <div class="now-playing-title" id="nowPlayingTitle">اسم الأغنية</div>
      <div class="now-playing-sub" id="nowPlayingSub">متوقف</div>
    `;
    if (musicControls) musicSheet.insertBefore(card, musicControls);
    else musicSheet.appendChild(card);
  }

  function ensureAyahToggleButton() {
    if (!ayahFloat || document.getElementById("ayahToggleBtn")) return;
    const btn = document.createElement("button");
    btn.id = "ayahToggleBtn";
    btn.className = "ayah-toggle-btn";
    btn.type = "button";
    btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    btn.title = "إظهار / إخفاء الآية";
    document.body.appendChild(btn);
    btn.addEventListener("click", toggleAyahVisibility);
  }

  function toggleAyahVisibility() {
    ayahVisible = !ayahVisible;
    setStored(STORAGE.ayahVisible, String(ayahVisible));
    if (ayahFloat) ayahFloat.style.display = ayahVisible ? "block" : "none";
    const btn = document.getElementById("ayahToggleBtn");
    if (btn) btn.innerHTML = ayahVisible ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    showToast(ayahVisible ? "تم إظهار الآية" : "تم إخفاء الآية");
  }

  function restoreAyahVisibility() {
    if (!ayahFloat) return;
    ayahFloat.style.display = ayahVisible ? "block" : "none";
    const btn = document.getElementById("ayahToggleBtn");
    if (btn) btn.innerHTML = ayahVisible ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';

    const savedX = getNumber(STORAGE.ayahX, 12);
    const savedY = getNumber(STORAGE.ayahY, 54);
    ayahFloat.style.left = `${savedX}px`;
    ayahFloat.style.top = `${savedY}px`;
  }

  function ensureTrackMenu() {
    if (trackMenu) return;
    trackMenu = document.createElement("div");
    trackMenu.id = "trackMenu";
    trackMenu.className = "track-menu";
    trackMenu.innerHTML = `
      <button type="button" data-action="play">تشغيل</button>
      <button type="button" data-action="favorite">مفضلة</button>
      <button type="button" data-action="copy-title">نسخ الاسم</button>
      <button type="button" data-action="copy-file">نسخ الملف</button>
    `;
    document.body.appendChild(trackMenu);

    trackMenu.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const song = songs[menuIndex];
      if (!song) return;

      if (action === "play") playSong(menuIndex);
      else if (action === "favorite") toggleFavorite(menuIndex);
      else if (action === "copy-title") copyText(song.title);
      else if (action === "copy-file") copyText(song.fileLabel);

      closeTrackMenu();
    });

    document.addEventListener("click", (e) => {
      if (!trackMenu.classList.contains("open")) return;
      if (e.target.closest("#trackMenu")) return;
      closeTrackMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeTrackMenu();
    });
  }

  function openTrackMenu(index, x, y) {
    if (!trackMenu) return;
    menuIndex = index;
    const song = songs[index];
    if (!song) return;

    const favBtn = trackMenu.querySelector('button[data-action="favorite"]');
    if (favBtn) favBtn.textContent = favorites.has(index) ? "إزالة من المفضلة" : "مفضلة";

    trackMenu.classList.add("open");
    const rect = trackMenu.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    const left = clamp(x, 8, maxX);
    const top = clamp(y, 8, maxY);
    trackMenu.style.left = `${left}px`;
    trackMenu.style.top = `${top}px`;
  }

  function closeTrackMenu() {
    if (!trackMenu) return;
    trackMenu.classList.remove("open");
    menuIndex = -1;
  }

  // ==========================================
  // 9. آيات القرآن (Ayah Float)
  // ==========================================
  function toggleAyahExpanded(nextState) {
    ayahExpanded = nextState;
    if (ayahFloat) ayahFloat.classList.toggle("expanded", ayahExpanded);
    ayahDelay = ayahExpanded ? 13000 : 4500;
    restartAyahRotation();
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function renderAyahFromOrder(orderIndex) {
    if (!ayahFloat) return;
    const ayah = ayahs[ayahOrder[orderIndex]];
    if (!ayah) return;

    ayahFloat.classList.add("swap");
    setTimeout(() => {
      if (ayahNum) ayahNum.textContent = String(ayah.num);
      if (ayahText) ayahText.textContent = ayah.text;
      if (ayahRef) ayahRef.textContent = ayah.ref;
      if (ayahNote) ayahNote.textContent = ayah.note;
      if (ayahDetail) ayahDetail.textContent = ayah.detail;
      ayahFloat.classList.remove("swap");
    }, 160);
  }

  function startNewAyahCycle() {
    ayahOrder = shuffleArray([...Array(ayahs.length).keys()]);
    ayahCursor = 0;
    renderAyahFromOrder(ayahCursor);
  }

  function restartAyahRotation() {
    clearInterval(ayahTimer);
    ayahTimer = setInterval(() => {
      ayahCursor += 1;
      if (ayahCursor >= ayahOrder.length) {
        startNewAyahCycle();
        return;
      }
      renderAyahFromOrder(ayahCursor);
    }, ayahDelay);
  }

  function moveAyahTo(x, y) {
    if (!ayahFloat) return;
    const rect = ayahFloat.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    ayahFloat.style.left = `${clamp(x, 8, maxX)}px`;
    ayahFloat.style.top = `${clamp(y, 8, maxY)}px`;
  }

  function bindAyahDragging() {
    if (!ayahFloat) return;

    ayahFloat.addEventListener("pointerdown", (e) => {
      ayahFloat.setPointerCapture(e.pointerId);
      const rect = ayahFloat.getBoundingClientRect();

      ayahDragState.active = true;
      ayahDragState.started = false;
      ayahDragState.offsetX = e.clientX - rect.left;
      ayahDragState.offsetY = e.clientY - rect.top;
      ayahDragState.startX = e.clientX;
      ayahDragState.startY = e.clientY;
    });

    ayahFloat.addEventListener("pointermove", (e) => {
      if (!ayahDragState.active) return;
      const dx = Math.abs(e.clientX - ayahDragState.startX);
      const dy = Math.abs(e.clientY - ayahDragState.startY);

      if (dx > 5 || dy > 5) {
        ayahDragState.started = true;
        toggleAyahExpanded(false);
        moveAyahTo(e.clientX - ayahDragState.offsetX, e.clientY - ayahDragState.offsetY);
      }
    });

    ayahFloat.addEventListener("pointerup", () => {
      if (ayahDragState.active && !ayahDragState.started) {
        toggleAyahExpanded(!ayahExpanded);
      }
      ayahDragState.active = false;
      ayahDragState.started = false;
    });

    ayahFloat.addEventListener("pointercancel", () => {
      ayahDragState.active = false;
      ayahDragState.started = false;
    });
  }

  // ==========================================
  // 10. إعداد المشغل الافتراضي والوقت
  // ==========================================
  function restorePlaybackTime() {
    if (loadedResumeApplied) return;
    loadedResumeApplied = true;
    if (!Number.isFinite(currentTimeRestore) || currentTimeRestore <= 0) return;
    if (!audio?.duration) return;
    audio.currentTime = Math.min(currentTimeRestore, Math.max(0, audio.duration - 0.25));
    updateProgress();
  }

  function initVolume() {
    if (!volumeBar || !audio) return;
    const storedVolume = clamp(getNumber(STORAGE.volume, 80), 0, 100);
    volumeBar.value = String(storedVolume);
    audio.volume = storedVolume / 100;
    setVolumeTheme(storedVolume);
  }

  function initPlayback() {
    buildPlaylist();
    refreshToolbarState();
    loadSong(currentSongIndex, false, { pushHistory: false, restoreTime: currentTimeRestore });
    setPlayIcon(false);
    updatePulse(false);
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (totalTimeEl) totalTimeEl.textContent = "0:00";
    updateNowPlayingCard();
  }

  function maybeResumePlaybackOnGesture() {
    if (!pendingResume) return;
    pendingResume = false;
    if (!audio?.src) return;
    initAudioPulse();
    audio.play().catch(() => {});
  }

  // ==========================================
  // 11. أدوات المشاركة والتأثيرات (Share & Effects)
  // ==========================================
  function detectDeviceMode() {
    const ua = navigator.userAgent || "";
    const mobileUA = /Android|iPhone|iPad|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    const touch = (navigator.maxTouchPoints || 0) > 1;
    const narrow = window.innerWidth <= 980;
    return (mobileUA || (coarse && touch && narrow)) ? "mobile" : "desktop";
  }

  function applyDeviceMode() {
    document.body.dataset.device = detectDeviceMode();
  }

  function openModal() {
    if (!shareOverlay) return;
    shareOverlay.classList.add("active");
    shareOverlay.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!shareOverlay) return;
    shareOverlay.classList.remove("active");
    shareOverlay.setAttribute("aria-hidden", "true");
  }

  function openSheet() {
    if (!fakeShareSheet) return;
    fakeShareSheet.classList.add("active");
    fakeShareSheet.setAttribute("aria-hidden", "false");
  }

  function closeSheet() {
    if (!fakeShareSheet) return;
    fakeShareSheet.classList.remove("active");
    fakeShareSheet.setAttribute("aria-hidden", "true");
  }

  function openMoreSocials() {
    document.body.classList.add("drawer-open");
    moreSocialsDrawer?.classList.add("open");
    moreSocialsBackdrop?.classList.add("open");
  }

  function closeMoreSocials() {
    document.body.classList.remove("drawer-open");
    moreSocialsDrawer?.classList.remove("open");
    moreSocialsBackdrop?.classList.remove("open");
  }

  function initShareLinks() {
    if (shareQrImg) {
      shareQrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(SHARE_URL) + "&margin=10";
    }

    if (shareUrlInput) shareUrlInput.value = SHARE_URL;
    if (waShare) waShare.href = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n${SHARE_URL}`)}`;
    if (fbShare) fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`;
    if (tgShare) tgShare.href = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;

    const mail = fakeShareSheet?.querySelector('[data-act="mail"]');
    if (mail) {
      mail.href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(`${SHARE_TEXT}\n${SHARE_URL}`)}`;
    }
  }

  async function doNativeShare() {
    const shareData = {
      title: document.title,
      text: SHARE_TEXT,
      url: SHARE_URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }
    openSheet();
  }

  function initShareUI() {
    if (sharePortalBtn && shareOverlay) {
      sharePortalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }

    closeShareBtn?.addEventListener("click", closeModal);
    shareOverlay?.addEventListener("click", (e) => {
      if (e.target === shareOverlay) closeModal();
    });

    copyShareBtn?.addEventListener("click", async () => {
      const ok = await copyToClipboard(shareUrlInput?.value || SHARE_URL);
      showToast(ok ? "تم نسخ الرابط" : "تعذر نسخ الرابط");
    });

    nativeShareBtn?.addEventListener("click", doNativeShare);
    desktopSheetBtn?.addEventListener("click", openSheet);
    openLinkBtn?.addEventListener("click", () => {
      window.open(shareUrlInput?.value || SHARE_URL, "_blank", "noopener,noreferrer");
    });

    sheetBackdrop?.addEventListener("click", closeSheet);
    closeSheetBtn?.addEventListener("click", closeSheet);

    fakeShareSheet?.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const act = btn.getAttribute("data-act");

      if (act === "copy") {
        const ok = await copyToClipboard(SHARE_URL);
        showToast(ok ? "تم نسخ الرابط" : "تعذر النسخ");
        closeSheet();
        return;
      }

      if (act === "open") {
        window.open(SHARE_URL, "_blank", "noopener,noreferrer");
        closeSheet();
        return;
      }

      if (act === "wa" || act === "fb" || act === "tg") {
        closeSheet();
      }
    });

    moreSocialsBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      pulseWave(moreSocialsBtn);
      makeRipple(e, moreSocialsBtn);
      openMoreSocials();
    });

    moreSocialsBackdrop?.addEventListener("click", closeMoreSocials);
    moreSocialsClose?.addEventListener("click", closeMoreSocials);
  }

  // ==========================================
  // 12. تأثيرات بصرية (Ripple & Animations)
  // ==========================================
  function pulseWave(el) {
    if (!el) return;
    el.classList.remove("pulse-hit");
    void el.offsetWidth; // Trigger reflow
    el.classList.add("pulse-hit");
    setTimeout(() => el.classList.remove("pulse-hit"), 650);
  }

  function makeRipple(e, el) {
    const rect = el.getBoundingClientRect();
    const circle = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 1.4;

    circle.style.position = "absolute";
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    circle.style.borderRadius = "50%";
    circle.style.pointerEvents = "none";
    circle.style.background = "radial-gradient(circle, rgba(255,255,255,.38), rgba(255,255,255,.08) 42%, transparent 70%)";
    circle.style.transform = "scale(0)";
    circle.style.opacity = "1";
    circle.style.animation = "rippleAnim 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  }

  function initRippleStyle() {
    if (document.getElementById("rippleAnimStyle")) return;
    const style = document.createElement("style");
    style.id = "rippleAnimStyle";
    style.textContent = `
      @keyframes rippleAnim {
        0%   { transform: scale(0); opacity: .55; }
        100% { transform: scale(1.9); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function initMiscUI() {
    moreSocialsBtn?.classList.add("soft-float", "wave-auto");
    initRippleStyle();

    // تأثير حركة الخلفية مع الماوس
    document.addEventListener("mousemove", (e) => {
      const moveX = (e.clientX * 0.05) / 8;
      const moveY = (e.clientY * 0.05) / 8;
      document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    });

    // إحصائيات المتصفح عند الضغط على الصورة الرمزية
    const profileImg = document.querySelector(".avatar-img") || document.querySelector(".avatar img") || document.querySelector('img[src$="profile.jpeg"]');
    if (profileImg) {
      profileImg.addEventListener("click", () => {
        const stats = `Browser: ${navigator.userAgent.split(" ")[0]} | Screen: ${window.screen.width}x${window.screen.height} | Lang: ${navigator.language}`;
        showToast(stats);
      });
    }

    // حركة ظهور الكروت بالتتابع
    document.querySelectorAll('.social-card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('appear');
      }, index * 100); 
    });

    // نسخ بالزر اليمين (Context Menu)
    document.querySelectorAll(".social-card").forEach((card) => {
      card.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const span = card.querySelector(".social-text span");
        if (!span) return;
        const textToCopy = span.innerText;
        copyToClipboard(textToCopy).then((ok) => {
          if (ok) {
            showToast(`تم نسخ: ${textToCopy}`);
            // هزة خفيفة للكرت للتأكيد
            card.style.animation = "none";
            card.offsetHeight;
            card.style.animation = "softFloat 0.3s ease";
          } else {
            showToast("تعذر النسخ");
          }
        });
      });
    });
  }

  // ==========================================
  // 13. الضغط المطول للنسخ السريع (Long Press)
  // ==========================================
  function initShareLongCopy() {
    const attachLongPressCopy = (selector = "[data-longcopy]", holdMs = 700) => {
      document.querySelectorAll(selector).forEach((el) => {
        let timer = null;
        let startX = 0;
        let startY = 0;
        let copied = false;

        const clearHold = () => {
          if (timer) clearTimeout(timer);
          timer = null;
        };

        const getCopyText = () => {
          return (
            el.dataset.copyText ||
            el.getAttribute("data-copy-text") ||
            el.getAttribute("href") ||
            el.textContent.trim()
          );
        };

        el.addEventListener("pointerdown", (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          copied = false;
          startX = e.clientX;
          startY = e.clientY;
          clearHold();

          timer = setTimeout(async () => {
            const textToCopy = getCopyText();
            if (!textToCopy) return;

            const ok = await copyToClipboard(textToCopy);
            if (ok) {
              copied = true;
              showToast(`تم نسخ: ${textToCopy}`);
              el.classList.add("copied");
              setTimeout(() => el.classList.remove("copied"), 500);
              el.dataset.ignoreClick = "1";
              setTimeout(() => {
                el.dataset.ignoreClick = "0";
              }, 120);
            } else {
              showToast("تعذر النسخ");
            }
          }, holdMs);
        });

        el.addEventListener("pointermove", (e) => {
          if (!timer) return;
          const dx = Math.abs(e.clientX - startX);
          const dy = Math.abs(e.clientY - startY);
          if (dx > 10 || dy > 10) clearHold();
        });

        el.addEventListener("pointerup", clearHold);
        el.addEventListener("pointercancel", clearHold);
        el.addEventListener("contextmenu", (e) => e.preventDefault());

        el.addEventListener("click", (e) => {
          if (el.dataset.ignoreClick === "1") {
            e.preventDefault();
            e.stopPropagation();
            el.dataset.ignoreClick = "0";
          }
          if (copied) {
            copied = false;
          }
        });
      });
    };

    attachLongPressCopy("[data-longcopy]");
    window.attachLongPressCopy = attachLongPressCopy; // عشان لو احتجتها بره
  }

  // ==========================================
  // 14. ربط الأحداث الرئيسية (Event Listeners)
  // ==========================================
  function bindEvents() {
    musicFab?.addEventListener("click", () => {
      musicSheet.classList.add("open");
      overlay.classList.add("open");
    });

    closeMusicBtn?.addEventListener("click", () => {
      musicSheet.classList.remove("open");
      overlay.classList.remove("open");
    });

    overlay?.addEventListener("click", () => {
      musicSheet.classList.remove("open");
      overlay.classList.remove("open");
      closeTrackMenu();
    });

    playBtn?.addEventListener("click", togglePlay);
    prevSongBtn?.addEventListener("click", prevSong);
    nextSongBtn?.addEventListener("click", nextSong);

    volumeBar?.addEventListener("input", () => {
      const value = Number(volumeBar.value);
      audio.volume = value / 100;
      setVolumeTheme(value);
      savePlaybackSnapshot();
    });

    volumeIconBtn?.addEventListener("click", () => {
      if (audio.volume > 0) {
        audio.dataset.lastVolume = String(Math.round(audio.volume * 100));
        audio.volume = 0;
        volumeBar.value = "0";
        setVolumeTheme(0);
      } else {
        const restore = clamp(getNumber(STORAGE.volume, 80), 0, 100);
        audio.volume = restore / 100;
        volumeBar.value = String(restore);
        setVolumeTheme(restore);
      }
      savePlaybackSnapshot();
    });

    if(audio) {
      audio.addEventListener("play", () => {
        setPlayIcon(true);
        updatePulse(true);
        if (audioState) audioState.textContent = `يعمل الآن: ${currentSong().title}`;
        const sub = document.getElementById("nowPlayingSub");
        if (sub) sub.textContent = "يعمل الآن";
        savePlaybackSnapshot();
      });

      audio.addEventListener("pause", () => {
        setPlayIcon(false);
        updatePulse(false);
        if (audioState) audioState.textContent = `متوقف: ${currentSong().title}`;
        const sub = document.getElementById("nowPlayingSub");
        if (sub) sub.textContent = "متوقف";
        savePlaybackSnapshot();
      });

      audio.addEventListener("ended", () => {
        if (repeatMode === "one") loadSong(currentSongIndex, true, { pushHistory: false });
        else nextSong();
      });

      audio.addEventListener("loadedmetadata", () => {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (audioState) audioState.textContent = `جاهزة: ${currentSong().title}`;
        const sub = document.getElementById("nowPlayingSub");
        if (sub) sub.textContent = "جاهزة";
        restorePlaybackTime();
        updateProgress();
      });

      audio.addEventListener("canplay", () => {
        if (audioState) audioState.textContent = `جاهزة: ${currentSong().title}`;
      });
    }

    seekBar?.addEventListener("pointerdown", () => {
      isSeeking = true;
      showSeekTooltip();
    });

    seekBar?.addEventListener("pointerup", () => {
      isSeeking = false;
      hideSeekTooltipSoon();
    });

    seekBar?.addEventListener("pointercancel", () => {
      isSeeking = false;
      hideSeekTooltipSoon();
    });

    seekBar?.addEventListener("input", () => {
      if (!audio?.duration) return;
      const value = Number(seekBar.value);
      const time = (value / 100) * audio.duration;
      audio.currentTime = time;
      if (progressBar) progressBar.style.width = `${value}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(time);
      updateSeekTooltipFromValue(value);
      showSeekTooltip();
      savePlaybackSnapshot();
    });

    seekBar?.addEventListener("mousemove", (e) => {
      if (!audio?.duration) return;
      const rect = seekBar.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      updateSeekTooltipFromValue(pct);
      showSeekTooltip();
    });

    seekBar?.addEventListener("mouseleave", hideSeekTooltipSoon);
    seekBar?.addEventListener("touchend", hideSeekTooltipSoon);

    seekWrap?.addEventListener("touchstart", () => {
      if (!audio?.duration) return;
      showSeekTooltip();
    }, { passive: true });

    seekWrap?.addEventListener("touchend", hideSeekTooltipSoon);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeTrackMenu();
        musicSheet.classList.remove("open");
        overlay.classList.remove("open");
        closeModal();
        closeSheet();
        closeMoreSocials();
      }
      if (e.key === "ArrowRight") nextSong();
      if (e.key === "ArrowLeft") prevSong();
      if (e.key === " ") {
        const active = document.activeElement;
        if (active !== seekBar && active?.tagName !== "INPUT") {
          e.preventDefault();
          togglePlay();
        }
      }
      maybeResumePlaybackOnGesture();
    });

    document.addEventListener("pointerdown", maybeResumePlaybackOnGesture, { passive: true });
    document.addEventListener("touchstart", maybeResumePlaybackOnGesture, { passive: true });
    document.addEventListener("beforeunload", savePlaybackSnapshot);

    copyButtons.forEach((btn) => {
      btn.addEventListener("click", () => copyText(btn.dataset.copy));
    });
  }

  function initGlobalShareHelpers() {
    window.copySiteLink = async () => {
      const ok = await copyToClipboard(SHARE_URL);
      showToast(ok ? "تم نسخ الرابط" : "تعذر نسخ الرابط");
    };
  }

  // ==========================================
  // 15. دالة التشغيل الأساسية (Initialization)
  // ==========================================
  function initEverything() {
    ensureExtraStyles();
    decorateSectionTitles();
    ensureDivider();
    ensureToolbar();
    ensureNowPlayingCard();
    ensureAyahToggleButton();
    ensureTrackMenu();
    restoreAyahVisibility();

    initVolume();
    buildPlaylist();
    initPlayback();
    bindEvents();

    if (ayahFloat) {
      if (!ayahVisible) ayahFloat.style.display = "none";
      bindAyahDragging();
      const savedX = getNumber(STORAGE.ayahX, 12);
      const savedY = getNumber(STORAGE.ayahY, 54);
      ayahFloat.style.left = `${savedX}px`;
      ayahFloat.style.top = `${savedY}px`;
    }

    if (ayahVisible) {
      startNewAyahCycle();
      restartAyahRotation();
    }

    initShareLinks();
    initShareUI();
    initMiscUI();
    initShareLongCopy();
    initGlobalShareHelpers();
    applyDeviceMode();
    window.addEventListener("resize", applyDeviceMode);

    if (shuffleEnabled) updateShuffleButton();
    updateRepeatButton();
    updateNowPlayingCard();
    savePlaybackSnapshot();
  }

  // يلا بينا نشغل كل شي!
  initEverything();
});