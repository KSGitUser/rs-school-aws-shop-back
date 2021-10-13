require('dotenv').config();

module.exports = {
  basicAuthorizer: async function (event, ctx, cb) {

    if (event['type'] != 'TOKEN')
      cb('Unauthorized');

    try {
      const authToken = event.authorizationToken;

      const creds = authToken.split(' ')[1];
      const buff = Buffer.from(creds, 'base64');
      const plainCreds = buff.toString('utf-8').split(':');
      const username = plainCreds[0];
      const password = plainCreds[1];

      console.log(`username: ${username}, password: ${password}`);

      const affect = (process.env.AUTH_USER === username && process.env.AUTH_PASSWORD === password) ? "Allow" : "Deny"

      const policy = {
        principalId: creds,
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: affect,
              Resource: event.methodArn
            }
          ]
        }
      }
      cb(null, policy);

    } catch (e) {
      cb(`Unauthorized: ${e.message}`);
    }
  }
}