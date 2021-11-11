const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const token = process.env.ACCESS_TOKEN;
let redirectToPage;

describe('Consuming method HEAD and redirecting', () => {
  it('getting redirect page', async () => {
    try {
      const response = await agent.head('https://github.com/aperdomob/redirect-test')
        .auth('token', token)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(200);
    } catch (error) {
      expect(error.status).to.equal(301);
      expect(error.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
      redirectToPage = error.response.headers.location;
    }
  });
  it('going to the redirect page', async () => {
    const response = await agent.head(redirectToPage)
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.status).to.equal(statusCode.OK);
  });
});
