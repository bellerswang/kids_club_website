export type Locale = 'en' | 'zh';

export const site = {
  name: 'Sunbridge',
  email: 'info@sunbridgeacademy.uk',
  phoneDisplay: '07476 197319',
  phoneHref: '+447476197319',
  defaultLocale: 'en' as Locale
};

export const ui = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      programmes: 'Programmes',
      camp: 'Holiday Camp',
      contact: 'Contact',
      enquire: 'Enquire'
    },
    language: '中文',
    tagline: 'Explore, connect and grow.',
    footerLocation: 'Programme details and locations are confirmed when you enquire.',
    explore: 'Explore',
    contact: 'Contact'
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于我们',
      programmes: '项目方向',
      camp: '假期营',
      contact: '联系我们',
      enquire: '咨询'
    },
    language: 'EN',
    tagline: '探索、连接、自信成长。',
    footerLocation: '项目详情和活动地点将在咨询时确认。',
    explore: '探索',
    contact: '联系方式'
  }
} satisfies Record<Locale, unknown>;

export function localePath(locale: Locale, path = '') {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === 'zh' ? '/zh' : '';
  return `${prefix}/${clean}${clean ? '/' : ''}`;
}
