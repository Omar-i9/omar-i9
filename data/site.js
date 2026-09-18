export const SITE = {
  name: 'Omar AbuZeineh',
  nameAr: 'عُمَر',
  githubUser: 'Omar-i9',
  baseUrl: 'https://omar-i9.github.io/omar-i9/',
  canonical: 'https://omar-i9.github.io/omar-i9/',
  githubUrl: 'https://github.com/Omar-i9',
  siteRepo: 'https://github.com/Omar-i9/omar-i9',
  profileImage: 'assets/img/profile.webp',
  profileImageFallback: 'assets/img/profile.jpeg',
  ogImage: 'assets/img/og-image.jpg',
  roles: ['ev', 'web', 'builder'],
  motto: 'Build. Test. Diagnose. Improve.',
  year: 2026
};

export const NAV = [
  { id: 'top', href: '#top', key: 'nav.home' },
  { id: 'work', href: '#work', key: 'nav.work' },
  { id: 'about', href: '#about', key: 'nav.about' },
  { id: 'engineering', href: '#engineering', key: 'nav.engineering' },
  { id: 'contact', href: '#contact', key: 'nav.contact' }
];

export const CONTACT = {
  primary: [
    {
      id: 'github',
      labelKey: 'contact.github',
      handle: 'Omar-i9',
      url: 'https://github.com/Omar-i9',
      external: true
    },
    {
      id: 'instagram',
      labelKey: 'contact.instagram',
      handle: 'omar.a.z3',
      url: 'https://www.instagram.com/omar.a.z3',
      external: true
    },
    {
      id: 'discord',
      labelKey: 'contact.discord',
      handle: 'gdmi_3',
      copy: 'gdmi_3',
      external: false
    }
  ],
  elsewhere: [
    {
      id: 'tiktok',
      label: 'TikTok',
      handle: '@gdmii_33',
      url: 'https://www.tiktok.com/@gdmii_33'
    },
    {
      id: 'snapchat',
      label: 'Snapchat',
      handle: 'omar-gdmi',
      url: 'https://www.snapchat.com/add/omar-gdmi'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      handle: '3mar.a.z3',
      url: 'https://www.facebook.com/3mar.a.z3'
    },
    {
      id: 'chess',
      label: 'Chess.com',
      handle: 'omar-g4',
      url: 'https://www.chess.com/member/omar-g4'
    },
    {
      id: 'steam',
      label: 'Steam',
      handle: 'omar_gg33',
      url: 'https://steamcommunity.com/id/omar_gg33/'
    },
    {
      id: 'spotify',
      label: 'Spotify',
      handle: 'Omar',
      url: 'https://open.spotify.com/user/31zq4egkwu5qt6armgjuvey2tgga'
    }
  ],
  ids: [
    { id: 'steam-code', labelKey: 'ids.steam', value: '1586913441' },
    { id: 'epic', labelKey: 'ids.epic', value: 'Omar-G4' },
    { id: 'ubisoft', labelKey: 'ids.ubisoft', value: 'Omar-G4' },
    { id: 'ea', labelKey: 'ids.ea', value: 'gdmi3' }
  ]
};

export const STACK = [
  {
    id: 'web',
    titleKey: 'stack.web',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Browser APIs']
  },
  {
    id: 'engineering',
    titleKey: 'stack.engineering',
    items: [
      'EV / Hybrid systems',
      'CAN Bus',
      'BMS concepts',
      'Diagnostics',
      'Telemetry',
      'Python',
      'Embedded C'
    ]
  },
  {
    id: 'tools',
    titleKey: 'stack.tools',
    items: ['Git', 'GitHub', 'VS Code', 'Chrome DevTools']
  }
];

export const FOCUS = [
  {
    id: 'taamen',
    horizon: 'now',
    titleKey: 'focus.taamen.title',
    bodyKey: 'focus.taamen.body'
  },
  {
    id: 'docs',
    horizon: 'now',
    titleKey: 'focus.docs.title',
    bodyKey: 'focus.docs.body'
  },
  {
    id: 'ev',
    horizon: 'next',
    titleKey: 'focus.ev.title',
    bodyKey: 'focus.ev.body'
  },
  {
    id: 'can',
    horizon: 'next',
    titleKey: 'focus.can.title',
    bodyKey: 'focus.can.body'
  },
  {
    id: 'bms',
    horizon: 'next',
    titleKey: 'focus.bms.title',
    bodyKey: 'focus.bms.body'
  },
  {
    id: 'embedded',
    horizon: 'next',
    titleKey: 'focus.embedded.title',
    bodyKey: 'focus.embedded.body'
  },
  {
    id: 'long',
    horizon: 'later',
    titleKey: 'focus.long.title',
    bodyKey: 'focus.long.body'
  }
];

export const MINDSET = [
  { n: '01', key: 'mindset.s1' },
  { n: '02', key: 'mindset.s2' },
  { n: '03', key: 'mindset.s3' },
  { n: '04', key: 'mindset.s4' },
  { n: '05', key: 'mindset.s5' },
  { n: '06', key: 'mindset.s6' }
];

export const ENGINEERING_TOPICS = [
  { id: 'battery', titleKey: 'engineering.battery.title', bodyKey: 'engineering.battery.body' },
  { id: 'bms', titleKey: 'engineering.bms.title', bodyKey: 'engineering.bms.body' },
  { id: 'can', titleKey: 'engineering.can.title', bodyKey: 'engineering.can.body' },
  { id: 'diag', titleKey: 'engineering.diag.title', bodyKey: 'engineering.diag.body' },
  { id: 'tele', titleKey: 'engineering.tele.title', bodyKey: 'engineering.tele.body' },
  { id: 'motor', titleKey: 'engineering.motor.title', bodyKey: 'engineering.motor.body' }
];
