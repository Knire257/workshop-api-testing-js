const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const token = process.env.ACCESS_TOKEN;

describe('Consuming service PUT github', () => {
  it('following an user', async () => {
    const response = await agent.put('https://api.github.com/user/following/aperdomob')
      .auth('token', token)
      .set('User-Agent', 'agent')
      .set('accept', 'application/vnd.github.v3+json');
    expect(response.status).to.equal(statusCode.NO_CONTENT);
  });
  it('looking if user follows apendomob', async () => {
    const response = await agent.get('https://api.github.com/user/following')
      .auth('token', token)
      .set('User-Agent', 'agent')
      .set('accept', 'application/vnd.github.v3+json');
    const followedUser = response.body.find((user) => user.login === 'aperdomob');
    expect(followedUser.login).to.equal('aperdomob');
  });
  it('following an user', async () => {
    const response = await agent.get('https://api.github.com/user/following/aperdomob')
      .auth('token', token)
      .set('User-Agent', 'agent')
      .set('accept', 'application/vnd.github.v3+json');
    expect(response.status).to.equal(statusCode.NO_CONTENT);
  });
});
