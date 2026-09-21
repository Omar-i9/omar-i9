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
  release,
  versionLabel: siteVersionLabel
};
