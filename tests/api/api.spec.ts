import { test, expect } from '@playwright/test';

test('GET request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');

    expect(response.status()).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
});

test('GET request with parameter', async ({ request }) => {
    const parameter = 1;
    const response = await request.get(`https://jsonplaceholder.typicode.com/comments?postId=${parameter}`);

    expect(response.status()).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    data.forEach((item: any) => {
        expect(item.postId).toBe(parameter)
    })
});

test('POST request', async ({ request }) => {
    const postData = {
        title: 'test title',
        body: 'test body',
        userId: 1,
    };

    const response = await request.fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        data: postData
    });

    expect(response.status()).toEqual(201);
    const data = await response.json();

    expect(data.id).toBeDefined();
    expect(typeof data.id).toBe('number');

    expect(data).toEqual({ id: 101, ...postData });
});

test('GraphQL request', async ({ request }) => {
    const query = `
        query {
            episodes(filter: { name: "Rick" }) {
                results {
                    name
                }
            }
        }
    `;

    const response = await request.post('https://rickandmortyapi.com/graphql', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            query
        }
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    const episodes = result.data.episodes.results;
  
    expect(Array.isArray(episodes)).toBe(true);
    expect(episodes.length).toBeGreaterThan(0);
  
    episodes.forEach((episode: any) => {
        expect(episode.name.toLowerCase()).toContain('rick');
    });
});