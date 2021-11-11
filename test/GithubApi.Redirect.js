const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const token = process.env.ACCESS_TOKEN;
var redirect_to_page;

describe('Consuming method HEAD and redirecting', () => {
	it('getting redirect page', async () => {
		try{
		const response = await agent.head('https://github.com/aperdomob/redirect-test')
			.auth('token', token)
	 		.set('User-Agent', 'agent')
	 	console.log(response);
	 }catch(error){	
		expect(error.status).to.equal(301); 
		expect(error.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
		redirect_to_page = 	error.response.headers.location;
	 }
	});
	it('going to the redirect page', async () => {
		const response = await agent.head(redirect_to_page)
			.auth('token', token)
	 		.set('User-Agent', 'agent')
 		expect(response.status).to.equal(statusCode.OK);
	});
});