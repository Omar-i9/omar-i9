import { release, siteVersionLabel } from './release.js';

export const siteConfig = {
  name: 'Omar Profiles',
  baseUrl: 'https://omar-i9.github.io/omar-i9/',
  discordPage: 'pages/discord.html',
  githubUrl: 'https://github.com/Omar-i9',
  instagramUrl: 'https://www.instagram.com/omar.a.z3',
  titles: [
    'اهلين تعال كل يوم 👋',
    'Omar Profiles',
    'دامك رجعت شوف الباقي'
  ],
  hiddenTabTitle: 'لا تهرب خليكككك',
  returnedTabTitle: 'رجعت هيك 😎',
  heroActions: [
    {
      id: 'github',
      labelKey: 'githubAr',
      icon: 'assets/img/brands/github.svg',
      url: 'https://github.com/Omar-i9'
    },
    {
      id: 'share',
      labelKey: 'shareShort',
      icon: 'share',
      action: 'share'
    },
    {
      id: 'instagram',
      labelKey: 'instagramAr',
      icon: 'assets/img/brands/instagram.svg',
      url: 'https://www.instagram.com/omar.a.z3'
    }
  ],
  smartStatuses: {
    sleeping: { labelKey: 'statusSleeping', bg: 'sleep', color: '#7dd3fc', glow: 'rgba(125,211,252,.45)' },
    busy: { labelKey: 'statusBusy', bg: 'stars', color: '#f7c948', glow: 'rgba(247,201,72,.42)' },
    online: { labelKey: 'statusOnline', bg: 'aurora', color: '#27e681', glow: 'rgba(39,230,129,.48)' },
    coding: { labelKey: 'statusCoding', bg: 'coding', color: '#00eaff', glow: 'rgba(0,234,255,.48)' },
    gaming: { labelKey: 'statusGaming', bg: 'gaming', color: '#a970ff', glow: 'rgba(169,112,255,.50)' }
  },
  release,
  versionLabel: siteVersionLabel
};
