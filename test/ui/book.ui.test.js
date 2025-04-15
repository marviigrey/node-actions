import { expect } from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

const { JSDOM } = jsdom;

describe('Frontend UI Tests', () => {
  let dom;
  let window;
  let document;

  before(() => {
    const html = fs.readFileSync('./src/views/index.html', 'utf-8');
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;

    // Mock fetch API
    window.fetch = async (url) => {
      if (url === '/api/books') {
        return {
          ok: true,
          json: async () => [
            { _id: '1', title: 'Mock Book', author: 'Mock Author', year: 2023 }
          ]
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };
  });

  it('should display books when loaded', async () => {
    // Trigger DOMContentLoaded
    window.dispatchEvent(new window.Event('DOMContentLoaded'));
    
    // Wait for mock fetch to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    const bookCards = document.querySelectorAll('.book-card');
    expect(bookCards.length).to.equal(1);
    expect(bookCards[0].textContent).to.include('Mock Book');
  });

  it('should have working navigation links', () => {
    const addBookLink = document.querySelector('a[href="/add-book"]');
    expect(addBookLink).to.exist;
    expect(addBookLink.textContent).to.equal('Add New Book');
  });
});