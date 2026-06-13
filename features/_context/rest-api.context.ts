import { When, Then, Given, After, BeforeAll } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import expect from 'expect';
import { execSync } from 'child_process';
import { deepCompare } from '../_helper/deep-compare';

const apiBaseUrl = 'http://localhost:3000';
let apiToken: string | null = null;
let apiResponse: AxiosResponse;

function buildHeaders(): Record<string, string> {
  if (apiToken === '' || apiToken === null) {
    return {};
  }
  return { Authorization: `Bearer ${apiToken}` };
}

BeforeAll({ timeout: 60 * 1000 }, async () => {
  const deadline = Date.now() + 45 * 1000;

  while (true) {
    try {
      await axios.get(apiBaseUrl, { validateStatus: () => true });
      return;
    } catch {
      if (Date.now() > deadline) {
        throw new Error(`API at ${apiBaseUrl} is not reachable`);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
});

Given('I use seed data', () => {
  execSync('npm run database:seed > /dev/null');
});

Given('I identify as player {string}', (playerId: string) => {
  apiToken = playerId;
});

When(
  'I send a {string} request to {string}',
  async (method: string, path: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      validateStatus: () => true,
      headers: buildHeaders(),
    });
  },
);

When(
  'I send a {string} request to {string} with body:',
  async (method: string, path: string, body: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      data: JSON.parse(body),
      validateStatus: () => true,
      headers: buildHeaders(),
    });
  },
);

Then('the response status should be {int}', (statusCode: number) => {
  expect(apiResponse.status).toBe(statusCode);
});

Then(
  'the response body should have the property {string}',
  (property: string) => {
    expect(apiResponse.data).toHaveProperty(property);
  },
);

Then('the response body should contain:', async function (docString: string) {
  const expected = JSON.parse(docString);
  const actual = apiResponse.data;

  deepCompare(actual, expected);
});

Then('I dump response', () => {
  console.log(JSON.stringify(apiResponse.data));
});

After(() => {
  apiToken = null;
});
