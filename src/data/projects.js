export const projects = [
  {
    id: 'taamen',
    name: 'TAAMEN',
    version: '2.1',
    status: { ar: 'النسخة الجديدة قادمة قريباً', en: 'New version coming soon' },
    summary: {
      ar: 'منصة لتنظيم مباريات كرة القدم، وتوثيق النتائج، ومتابعة أداء اللاعبين والخطط التكتيكية في مساحة واحدة.',
      en: 'A football platform for organizing matches, recording results, and following player performance and tactical plans in one place.'
    },
    features: [
      { ar: 'مركز المباريات والأرشيف لتنظيم المواجهات وحفظ نتائجها.', en: 'A match center and archive for organizing fixtures and keeping results.' },
      { ar: 'ملعب تكتيكي لتخطيط 5 ضد 5 و7 ضد 7 ورسم تحركات اللاعبين.', en: 'A tactical board for 5-a-side and 7-a-side plans and player movement drawing.' },
      { ar: 'ملفات للاعبين وتحليلات للأهداف والصناعات والمساهمات.', en: 'Player profiles and analytics for goals, assists, and contributions.' },
      { ar: 'مساعد ذكي، تحسينات للهاتف، وتحرير صور مع خيارات مزامنة سحابية بموافقة صريحة.', en: 'An AI assistant, mobile refinements, image editing, and optional cloud sync with explicit consent.' }
    ],
    stack: ['React', 'TypeScript', 'PWA', 'IndexedDB', 'Cloudflare'],
    liveUrl: 'https://taamenn.com/',
    detailsUrl: './projects/taamen.html'
  }
];
