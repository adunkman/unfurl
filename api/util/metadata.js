const { JSDOM } = require('jsdom');
const { pluck } = require('./pluck');

exports.parseMetadata = (url, html) => {
  const document = new JSDOM(html, { url }).window.document;
  const urlObject = new URL(url);
  const metadata = extractMetadata(document);

  const p = pluck.bind(null, metadata);
  const resolve = relative => new URL(relative, url).toString();

  const summary = {
    original_url: url,
    service_icon: resolve(p('icon', 'shortcut icon')),
    service_name: p('og:site_name') || urlObject.host.replace(/^www\./, ''),
    title: p('og:title', 'twitter:title') || document.title,
    description: p('description', 'og:description', 'twitter:description'),
    image_url: resolve(p('og:image')),
    image_height: p('og:image:height'),
    image_width: p('og:image:width'),
    image_alt: p('og:image:alt'),
    meta: metadata,
  };

  return Object.fromEntries(
    Object.entries({
      ...summary,
      ...applyDomainOverrides(urlObject.host, document),
    }).filter(([k, v]) => v),
  );
};

const extractMetadata = document => {
  const tags = [
    ...document.querySelectorAll('meta'),
    ...document.querySelectorAll('link[rel][href]'),
  ];

  return Object.fromEntries(
    tags
      .map(tag => [
        tag.getAttribute('name') ||
          tag.getAttribute('property') ||
          tag.getAttribute('rel') ||
          '',
        tag.getAttribute('content') || tag.getAttribute('href'),
      ])
      .filter(([key, value]) => key && value),
  );
};

const overrides = [];

const registerOverride = (host, fn) => overrides.push({ host, apply: fn });

const applyDomainOverrides = (host, document) => {
  return Object.assign(
    {},
    ...overrides.map(override => {
      return host.endsWith(override.host) ? override.apply(document) : {};
    }),
  );
};

registerOverride('wikipedia.org', document => {
  return {
    title: document.querySelector('#content #firstHeading').textContent,
    description: [
      ...document.querySelectorAll('#bodyContent #mw-content-text p'),
    ]
      .map(p => p.textContent.trim())
      .find(p => p),
  };
});

/**
 * {
  author_name
  author_link
  author_icon
  fields: [
    title:
    value:
    short:
  ],
  footer
  footer_icon
  image_url
  thumb_url
}
 */
