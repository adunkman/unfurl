const { JSDOM } = require('jsdom');
const { pluck } = require('./pluck');

/**
 * Extract metadata from <meta> tags in a string of HTML.
 *
 * @param {string} html A string of HTML
 * @returns {object} The HTML’s metadata as a plain JavaScript object
 */
exports.extractMetadata = html => {
  const document = new JSDOM(html).window.document;
  const tags = [...document.querySelectorAll('meta')];

  return {
    ...Object.fromEntries(
      tags
        .map(tag => [
          tag.getAttribute('name') || tag.getAttribute('property') || '',
          tag.getAttribute('content'),
        ])
        .filter(([key]) => !!key),
    ),
    title: document.title,
  };
};

/**
 * Normalize metadata from different metadata formats into a single summary.
 *
 * @param {object} metadata an object of page metadata
 * @returns {object} the metadata summary
 */
exports.summarizeMetadata = metadata => {
  return {
    title: pluck(metadata, 'title', 'og:title', 'twitter:title'),
    description: pluck(
      metadata,
      'description',
      'og:description',
      'twitter:description',
    ),
  };
};
