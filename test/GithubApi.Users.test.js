const agent = require('superagent');
const { expect } = require('chai');

const token = process.env.ACCESS_TOKEN;

describe('getting users', () => {
  it('get default users', async () => {
    const response = await agent.get('https://api.github.com/users')
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.body.length).to.be.above(0);
  });
  it('get 10 users', async () => {
    const response = await agent.get('https://api.github.com/users')
      .query('per_page=10')
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.body.length).to.be.equal(10);
  });
  it('get 50 users', async () => {
    const response = await agent.get('https://api.github.com/users')
      .query('per_page=50')
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.body.length).to.be.equal(50);
  });
});
