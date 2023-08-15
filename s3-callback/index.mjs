import axios from 'axios';
import { MongoClient } from 'mongodb';
import AWS from 'aws-sdk';

const MONGODB_URI =
  'mongodb+srv://madhav:NxTIkLXMvFdltMRN@miaifm-cluster.f4csodp.mongodb.net/InitDatabase?retryWrites=true&w=majority';
let cachedClient = null;

const APP_ID = 'madhavshroff99_gmail_com_0f1932_1fbf08';
const APP_KEY =
  'ec4b4719c6c61706d02c9accc49be2f5335662b3600bc24803157f31c547f039';
const BUCKET_NAME = 'miaifm-bucket-1'; // Replace with your bucket name

const getUserAndFileName = (event) => ({
  userId: event.Records[0].s3.object.key.substr(0, 36),
  fileName: event.Records[0].s3.object.key.substr(37),
});

const notifyNestBackend = async (userId, fileName) => {
  const config = {
    method: 'GET',
    url: `https://api.makeitaifor.me/fileupload/s3-file-uploaded?userId=${encodeURIComponent(
      userId,
    )}&fileName=${encodeURIComponent(fileName)}`,
  };

  return axios(config)
    .then((response) => {
      console.log('Response from backend:', response.data);
    })
    .catch((error) => {
      console.error('Error notifying backend:', error);
    });
};

const getTemporaryDownloadUrl = async (objKey) => {
  const s3 = new AWS.S3({ region: 'us-east-1', signatureVersion: 'v4' });
  const params = {
    Bucket: BUCKET_NAME,
    Key: objKey,
    Expires: 60, // URL expiration time in seconds
    ResponseContentDisposition: 'inline',
  };

  const url = s3.getSignedUrl('getObject', params);
  console.log(`The URL is ${url}`);
  return url;
};

const callMathpixApi = async (url) => {
  return axios({
    method: 'POST',
    url: 'https://api.mathpix.com/v3/pdf',
    headers: {
      app_id: APP_ID,
      app_key: APP_KEY,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ url }),
  }).then((response) => response.data);
};

const checkProcessingStatus = async (pdfId) => {
  return axios({
    method: 'GET',
    url: `https://api.mathpix.com/v3/pdf/${pdfId}`,
    headers: {
      app_key: APP_KEY,
      app_id: APP_ID,
    },
  }).then((response) => response.data);
};

const getCompletedResult = async (pdfId) => {
  return axios({
    method: 'GET',
    url: `https://api.mathpix.com/v3/pdf/${pdfId}.mmd`,
    headers: {
      app_key: APP_KEY,
      app_id: APP_ID,
    },
  }).then((response) => response.data);
};

const storeInMongoDb = (db, finalResult) => {
  const collection = db.collection('results');
  return collection
    .insertOne(finalResult)
    .then((insertResult) => {
      return insertResult;
    })
    .catch((error) => {
      // Handle any errors that occurred during the operation
      console.error(
        'An error occurred while storing the result in MongoDB:',
        error,
      );
      console.log(error);
    })
    .finally(() => {
      // Close mongo connection
      cachedClient.close();
    });
};

const connectToDatabase = async () => {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  const db = await client.db('MathJaxParsedFiles');
  return db;
};

const processDocument = async (objKey, callback) => {
  const db = await connectToDatabase();
  const url = await getTemporaryDownloadUrl(objKey);
  // const url = await getTemporaryDownloadUrl(
  //   '915b7cd5-08c1-45c2-9709-7585af332ee4/informal-learners-of-machine-learning_VLHCC-2022.pdf',
  // );
  const response = await callMathpixApi(url);
  console.log(response);
  let statusResponse;
  do {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    statusResponse = await checkProcessingStatus(response.pdf_id);
  } while (
    statusResponse.status !== 'completed' &&
    statusResponse.status !== 'error'
  );

  const finalResult = await getCompletedResult(response.pdf_id);

  storeInMongoDb(db, {
    userId: objKey.substr(0, 36),
    fileName: objKey.substr(37),
    parsedContentString: finalResult,
  })
    .then((result) => {
      console.log('Operation completed:', result);
      callback({ status: 'OK' });
    })
    .catch((error) => {
      console.log('Operation failed:', error);
      callback({ status: 'ERROR' });
    });
};

export const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId, fileName } = getUserAndFileName(event);
  notifyNestBackend(userId, fileName).then(() => {
    processDocument(event.Records[0].s3.object.key, (par) => {
      callback(null, {
        statusCode: par.status === 'OK' ? 200 : 500,
        body: par.status,
      });
    });
  });
};
