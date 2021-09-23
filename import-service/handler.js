const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'rsschool-s3-service';

module.exports = {
  importProductsFile: async function (event) {

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    let status = 200;

    const queryName = event.queryStringParameters.name;

    if (!queryName) {
      status = 500;
    }

    const catalogPath = `uploaded/${queryName}`;
    const params = {
      Bucket: BUCKET,
      Key: catalogPath,
      Expires: 120,
      ContentType: 'text/csv'
    }

    const getResponse = async (error, url, resolve) => {
      if (error) {
        status = 500;
        return error;
      }
      return url;
    }

    const responseBody = await new Promise(resolve => s3.getSignedUrl('putObject', params, (error, url) => resolve(getResponse(error, url))));

    const response = {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: responseBody
    }

    return response;
  },
  importFileParser: async function (event) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    console.log("event =>", event.Records)

    try {
      for (const record of event.Records) {
        const s3Stream = s3.getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key
        }).createReadStream();
        console.log('record=> ', record.s3.object)
        const converted = [];
        s3Stream.pipe(csv())
          .on('data', (data) => console.log(data))
          .on('end', async () => {

            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: BUCKET + '/' + record.s3.object.key,
              Key: record.s3.object.key.replace('uploaded', 'parsed')
            }).promise();

            await s3.deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key
            }).promise();

            console.log(`Uploaded file ${record.s3.object.key} is created`);
          });

      }
    } catch (error) {
      console.error(error);
    }

  }

}