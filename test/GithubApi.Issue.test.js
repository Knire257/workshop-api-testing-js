const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const token = process.env.ACCESS_TOKEN;
var issue_number;

describe('Consuming methods POST and PATCH', ()=> {
	it('looking if user has at least one public repo', async () => {
		const response = await agent.get('https://api.github.com/user')
			.auth('token', token)
 			.set('User-Agent', 'agent');
 		expect(response.body.public_repos <= 1);
	});
	it('looking if a public repo exist', async () => {
		const response = await agent.get('https://api.github.com/user')
			.auth('token', token)
 			.set('User-Agent', 'agent');
 		const repos = await agent.get(response.body.repos_url)
 			.auth('token', token)
 			.set('User-Agent', 'agent');
 		const repo_found = repos.body.find(repo => repo.name === 'workshop-api-testing-js');
 		expect(repo_found.name).to.equal('workshop-api-testing-js');
	});
	it('using method POST', async () => {
		const response = await agent.post('https://api.github.com/repos/Knire257/workshop-api-testing-js/issues')
			.send({ title: 'Esto no es un problema' })
			.auth('token', token)
 			.set('User-Agent', 'agent');
 		issue_number = response.body.number;
 		expect(response.body.title).to.equal('Esto no es un problema');
 		expect(response.body.body).to.equal(null);
	});
	it('editing an existent issue', async () => {
		const issue_body = 'Esto es solo un ejercicio de otro proyecto que juega con github api';
		const response = await agent.patch('https://api.github.com/repos/Knire257/workshop-api-testing-js/issues/'+issue_number)
			.send({ body: issue_body })
			.auth('token', token)
 			.set('User-Agent', 'agent');
 		expect(response.body.title).to.equal('Esto no es un problema');
 		expect(response.body.body).to.equal(issue_body);
	});
});