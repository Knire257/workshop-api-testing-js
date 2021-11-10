const agent = require('superagent');
const statusCode = require('http-status-codes');
var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const fs = require('fs');
const { expect } = chai;

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
		const repos_dir = repos.body;
		const repo_jasmine = repos_dir.find(repo => repo.name === 'jasmine-awesome-report')
		expect(repo_jasmine.full_name).to.equal('aperdomob/jasmine-awesome-report');
		expect(repo_jasmine.visibility).to.equal('public' || 'private');
		expect(repo_jasmine).to.have.property('description');
	});
	it('Downloading repo', async () => {
		const response = await agent.get('https://api.github.com/repos/aperdomob/jasmine-awesome-report/zipball')
			.set('User-Agent', 'agent')
			.set('accept','application/vnd.github.v3.raw');
		expect(response.status).to.equal(200);
		expect(response).to.have.property('redirects');
		const download = await agent.get(response.redirects[0])
			.set('User-Agent', 'agent')
			.set('accept','*')
			.set('accept-encoding', 'gzip, deflate, br')
			.pipe(fs.createWriteStream('master.zip'));
	});
	it('Getting repo readme metadata', async() => {
		const response = await agent.get('https://api.github.com/repos/aperdomob/jasmine-awesome-report/git/trees/master')
			.set('User-Agent', 'agent');
		expect(response.status).to.equal(200);
		const readme_tree = response.body.tree.find(tree => tree.path === 'README.md');
		expect(readme_tree).to.containSubset({
			path:'README.md',
			sha:'1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
		});
		//	FALTA DESCARGAR README Y REVISAR MD5
	});
});