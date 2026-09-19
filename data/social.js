export const socialFilters = [
  { id: 'all', labelKey: 'filterAll' },
  { id: 'social', labelKey: 'filterSocial' },
  { id: 'gaming', labelKey: 'filterGaming' },
  { id: 'dev', labelKey: 'filterDeveloper' },
  { id: 'media', labelKey: 'filterMedia' }
];

export const socialOrder = ['instagram', 'snapchat', 'github', 'tiktok', 'discord'];

export const socialLinks = [
  {
    id: 'tiktok',
    group: 'social',
    className: 'tk-card',
    badges: ['private'],
    icon: 'assets/img/brands/tiktok.svg',
    titleKey: 'tiktokAr',
    handle: 'gdmii_33',
    url: 'https://www.tiktok.com/@gdmii_33'
  },
  {
    id: 'snapchat',
    group: 'social',
    className: 'sc-card',
    badges: ['private'],
    icon: 'assets/img/brands/snapchat.svg',
    titleKey: 'snapchatAr',
    handle: 'omar-gdmi',
    url: 'https://www.snapchat.com/add/omar-gdmi'
  },
  {
    id: 'instagram',
    group: 'social',
    className: 'ig-card',
    badges: ['public'],
    icon: 'assets/img/brands/instagram.svg',
    titleKey: 'instagramAr',
    handle: 'omar.a.z3',
    url: 'https://www.instagram.com/omar.a.z3'
  },
  {
    id: 'github',
    group: 'dev',
    className: 'github-card',
    badges: ['official'],
    icon: 'assets/img/brands/github.svg',
    titleKey: 'githubAr',
    handle: 'Omar-i9',
    url: 'https://github.com/Omar-i9'
  },
  {
    id: 'facebook',
    group: 'social',
    className: 'fb-card',
    badges: ['private'],
    icon: 'assets/img/brands/facebook.svg',
    titleKey: 'facebookAr',
    handle: '3mar.a.z3',
    url: 'https://www.facebook.com/3mar.a.z3'
  },
  {
    id: 'chess',
    group: 'gaming',
    className: 'chess-card',
    badges: ['private'],
    icon: 'assets/img/brands/chessdotcom.svg',
    titleKey: 'chessAr',
    handle: 'omar-g4',
    url: 'https://www.chess.com/member/omar-g4'
  },
  {
    id: 'steam',
    group: 'gaming',
    className: 'steam-card',
    badges: ['featured', 'private'],
    icon: 'assets/img/brands/steam.svg',
    titleKey: 'steamAr',
    handle: 'omar_gg33',
    url: 'https://steamcommunity.com/id/omar_gg33/'
  },
  {
    id: 'spotify',
    group: 'media',
    className: 'spotify-card',
    badges: ['public'],
    icon: 'assets/img/brands/spotify.svg',
    titleKey: 'spotifyAr',
    handle: 'Omar',
    url: 'https://open.spotify.com/user/31zq4egkwu5qt6armgjuvey2tgga'
  },
  {
    id: 'rockstar',
    group: 'gaming',
    className: 'rockstar-card',
    badges: ['official'],
    icon: 'assets/img/brands/rockstar-games.svg',
    titleKey: 'rockstarAr',
    handle: 'Omar-G4',
    url: 'https://socialclub.rockstargames.com/member/Omar-G4/games'
  },
  {
    id: 'discord',
    group: 'gaming',
    className: 'ds-card',
    badges: ['private', 'contact'],
    icon: 'assets/img/brands/discord.svg',
    titleKey: 'discordAr',
    handleKey: 'discordNote',
    handle: 'اضغط لفتح البطاقة داخل الموقع',
    copy: 'gdmi_3',
    action: 'discord'
  }
];

export const quickCopy = [
  {
    id: 'steam-friend',
    labelKey: 'steamFriendLabel',
    value: '1586913441',
    icon: 'assets/img/brands/steam.svg'
  },
  {
    id: 'epic',
    labelKey: 'epicGamesLabel',
    value: 'Omar-G4',
    icon: 'assets/img/brands/epicgames.svg'
  },
  {
    id: 'ubisoft',
    labelKey: 'ubisoftLabel',
    value: 'Omar-G4',
    icon: 'assets/img/brands/ubisoft.svg'
  },
  {
    id: 'ea',
    labelKey: 'eaLabel',
    value: 'gdmi3',
    icon: 'assets/img/brands/ea.svg'
  }
];
