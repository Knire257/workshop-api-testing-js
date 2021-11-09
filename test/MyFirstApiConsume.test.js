const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = { name: 'John', age: '31', city: 'New York' };
    const response = await agent.get('https://httpbin.org/get').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/headers');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.headers['content-type']).to.equal('application/json');
  });

  it('consume HEAD Service with query args', async () => {
    const query = { freeform: 'Hello' };
    const response = await agent.head('https://httpbin.org/response-headers').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.headers.freeform).to.equal('Hello');
  });

  it('consume PATCH Service', async () => {
    const response = await agent.patch('https://httpbin.org/anything');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.data).to.equal('');
  });

  it('consume PATCH Service with query args', async () => {
    const query = { delay: 1 };
    const response = await agent.patch(`https://httpbin.org/delay/${query.delay}`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.data).to.equal('');
  });

  it('consume PUT Service', async () => {
    const response = await agent.put('https://httpbin.org/anything');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.data).to.equal('');
  });

  it('consume PUT Service with query args', async () => {
    const query = { data: 'Fullmetal' };
    const response = await agent.put('https://httpbin.org/anything').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args.data).to.equal('Fullmetal');
  });

  it('Consume DELETE Service', async () => {
    const response = await agent.delete('https://httpbin.org/anything/{anything}');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.method).to.equal('DELETE');
  });

  it('Consume DELETE Service with query args', async () => {
    const query = { data: 'Fullmetal' };
    const response = await agent.delete('https://httpbin.org/anything').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args.data).to.equal(query.data);
  });
});
