export const PROJECT_FILTERS = [
  { id: 'all', key: 'filter.all' },
  { id: 'web', key: 'filter.web' },
  { id: 'engineering', key: 'filter.engineering' },
  { id: 'automotive', key: 'filter.automotive' }
];

export const PROJECTS = [
  {
    id: 'taamen',
    slug: 'taamen',
    category: 'web',
    status: 'evolving',
    featured: true,
    year: 2026,
    image: 'assets/img/tameen-logo.webp',
    imageFallback: 'assets/img/tameen-logo.jpeg',
    liveUrl: 'https://taamenn.com',
    repositoryUrl: 'https://github.com/Omar-i9/taamenn',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'IndexedDB',
      'Cloudflare Worker',
      'PWA'
    ],
    keys: {
      title: 'project.taamen.title',
      subtitle: 'project.taamen.subtitle',
      short: 'project.taamen.short',
      long: 'project.taamen.long',
      architecture: 'project.taamen.architecture',
      notes: 'project.taamen.notes',
      highlights: [
        'project.taamen.h1',
        'project.taamen.h2',
        'project.taamen.h3',
        'project.taamen.h4',
        'project.taamen.h5'
      ]
    }
  },
  {
    id: 'ev-telemetry',
    slug: 'ev-telemetry',
    category: 'engineering',
    extraCategories: ['automotive'],
    status: 'experimental',
    featured: false,
    year: 2026,
    image: null,
    liveUrl: 'https://ev-telemetry-dashboard.onrender.com/',
    repositoryUrl: 'https://github.com/Omar-i9/EV-Telemetry-Dashboard',
    technologies: [
      'Python',
      'Flask',
      'WebSocket',
      'SQLite',
      'HTML',
      'CSS',
      'JavaScript'
    ],
    keys: {
      title: 'project.ev.title',
      subtitle: 'project.ev.subtitle',
      short: 'project.ev.short',
      long: 'project.ev.long',
      architecture: 'project.ev.architecture',
      notes: 'project.ev.notes',
      highlights: [
        'project.ev.h1',
        'project.ev.h2',
        'project.ev.h3',
        'project.ev.h4'
      ]
    }
  }
];
