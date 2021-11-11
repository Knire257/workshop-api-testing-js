const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const fs = require('fs');

const { expect } = chai;
const md5 = require('md5');

let readmeTree;

describe('Consuming method GET github', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://api.github.com/users/aperdomob')
      .set('User-Agent', 'agent');
    expect(response.body.name).to.equal('Alejandro Perdomo');
    expect(response.body.company).to.equal('Perficient Latam');
    expect(response.body.location).to.equal('Colombia');
  });
  it('Looking for aperdomob jasmine-awesome-report repo', async () => {
    const response = await agent.get('https://api.github.com/users/aperdomob')
      .set('User-Agent', 'agent');
    const repos = await agent.get(response.body.repos_url)
      .set('User-Agent', 'agent');
    const reposDir = repos.body;
    const repoJasmine = reposDir.find((repo) => repo.name === 'jasmine-awesome-report');
    expect(repoJasmine.full_name).to.equal('aperdomob/jasmine-awesome-report');
    expect(repoJasmine.visibility).to.equal('public');
    expect(repoJasmine).to.have.property('description');
  });
  it('Downloading repo', async () => {
    const response = await agent.get('https://api.github.com/repos/aperdomob/jasmine-awesome-report/zipball')
      .set('User-Agent', 'agent')
      .set('accept', 'application/vnd.github.v3.raw');
    expect(response.status).to.equal(statusCode.OK);
    expect(response).to.have.property('redirects');
    const download = await agent.get(response.redirects[0])
      .set('User-Agent', 'agent')
      .set('accept', '*')
      .set('accept-encoding', 'gzip, deflate, br')
      .pipe(fs.createWriteStream('master.zip'));
    expect(download.writable).to.equal(true);
  });
  it('Getting repo readme metadata', async () => {
    const response = await agent.get('https://api.github.com/repos/aperdomob/jasmine-awesome-report/git/trees/master')
      .set('User-Agent', 'agent');
    expect(response.status).to.equal(statusCode.OK);
    readmeTree = response.body.tree.find((tree) => tree.path === 'README.md');
    expect(readmeTree).to.containSubset({
      path: 'README.md',
      sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
    });
  });
  it('Checking README MD5', async () => {
    const response = await agent.get(readmeTree.url)
      .set('User-Agent', 'agent');
    expect(md5(response.body)).to.equal('3449c9e5e332f1dbb81505cd739fbf3f');
  });
});
