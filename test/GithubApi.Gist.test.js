const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const token = process.env.ACCESS_TOKEN;
let gistUrl;
let gistId;

describe('Consuming method DELETE and an inexistent resource', () => {
  it('creating a gist with POST', async () => {
    const response = await agent.post('https://api.github.com/gists')
      .send({
        description: 'This is an example',
        files: { 'hello.txt': { content: 'hello!' } }
      })
      .auth('token', token)
      .set('User-Agent', 'agent')
      .set('accept', 'application/vnd.github.v3+json');
    gistUrl = response.body.url;
    gistId = response.body.id;
    expect(response.body).to.containSubset({
      url: gistUrl,
      description: 'This is an example',
      public: false
    });
  });
  it('getting the created gist', async () => {
    const response = await agent.get(gistUrl)
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.status).to.equal(statusCode.OK);
  });
  it('deleting the created gist', async () => {
    const response = await agent.delete(`https://api.github.com/gists/${gistId}`)
      .auth('token', token)
      .set('User-Agent', 'agent');
    expect(response.status).to.equal(204);
  });
  it('looking for a inexistent file', async () => {
    try {
      const response = await agent.get(gistUrl)
        .auth('token', token)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.NOT_FOUND);
    } catch (err) {
      expect(err.status).to.equal(404);
    }
  });
});
