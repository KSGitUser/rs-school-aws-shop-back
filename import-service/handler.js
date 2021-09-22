const AWS = require('aws-sdk');
const BUCKET = 'rsschool-s3-service';

module.exports = {
  getFiles: async function () {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    let status = 200;
    let products = [];
    const params = {
      Bucket: BUCKET,
      Prefix: 'files/'
    };

    try {
      const s3Response = await s3.listObjectsV2(params).promise();
      products = s3Response.Contents;
    } catch (error) {
      console.error(error);
      status = 500;
    }

    const response = {
      statusCode: status,
      Headers: {
        'Access-Control-Allow-Origins': '*',
      },
      body: JSON.stringify(
        products
          .filter(product => product.Size)
          .map(product => {
            return `https://${BUCKET}.s3.amazonaws.com/${product.Key}`

          })
      )
    }

    return response;
  }

}