const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { extractMetadata, summarizeMetadata } = require('./metadata');

describe('extractMetadata', () => {
  it('handles blank, undefined, and null strings by returning blank objects', () => {
    expect(extractMetadata('')).toEqual({});
    expect(extractMetadata()).toEqual({});
    expect(extractMetadata(null)).toEqual({});
  });

  describe('well-formed metadata', () => {
    let html, metaData;

    beforeAll(async () => {
      html = await readFile('./fixtures/page/well-formed.html', 'utf8');
      metaData = extractMetadata(html);
    });

    it('marshalls data from meta tags with a name key', () => {
      expect(html).toContain('meta name="description"');
      expect(metaData).toHaveProperty('description', 'The Page Description');
    });

    it('marshalls data from meta tags with a property key', () => {
      expect(html).toContain('meta property="og:type"');
      expect(metaData).toHaveProperty('og:type', 'website');
    });
  });
});

describe('summarizeMetadata', () => {
  it('handles blank objects with blank summaries', () => {
    expect(summarizeMetadata({})).toEqual({
      title: '',
      description: '',
    });
  });

  it('summarizes the title by preferring title, open graph, and then twitter', () => {
    const subject = {
      'title': 'preference 1',
      'og:title': 'preference 2',
      'twitter:title': 'preference 3',
    };

    expect(summarizeMetadata(subject)).toHaveProperty('title', 'preference 1');
    delete subject['title'];
    expect(summarizeMetadata(subject)).toHaveProperty('title', 'preference 2');
    delete subject['og:title'];
    expect(summarizeMetadata(subject)).toHaveProperty('title', 'preference 3');
    delete subject['twitter:title'];
    expect(summarizeMetadata(subject)).toHaveProperty('title', '');
  });

  it('summarizes the description by preferring description, open graph, and then twitter', () => {
    const subject = {
      'description': 'preference 1',
      'og:description': 'preference 2',
      'twitter:description': 'preference 3',
    };

    expect(summarizeMetadata(subject)).toHaveProperty('description', 'preference 1');
    delete subject['description'];
    expect(summarizeMetadata(subject)).toHaveProperty('description', 'preference 2');
    delete subject['og:description'];
    expect(summarizeMetadata(subject)).toHaveProperty('description', 'preference 3');
    delete subject['twitter:description'];
    expect(summarizeMetadata(subject)).toHaveProperty('description', '');
  });
});
