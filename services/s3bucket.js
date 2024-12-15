const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const getImageUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "hemant-private",
    Key: key,
  });

  const imageUrl = await getSignedUrl(s3Client, command);
  return imageUrl;
};

const putImageUrl = async (filename, contentType) => {
  const command = new PutObjectCommand({
    Bucket: "hemant-private",
    Key: `uploads/images/users/${filename}`,
    ContentType: contentType,
  });
  const putImageUrl = await getSignedUrl(s3Client, command);
  return putImageUrl;
};

const deleteImageUrl = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: "hemant-private",
    Key: key,
  });
  const putImageUrl = await getSignedUrl(s3Client, command);
  return putImageUrl;
};

// const initPutImageUrl = async () => {
//   return await putImageUrl(`profile-${Date.now()}.jpeg`, "image/jpeg");
// };

// const initGetImageUrl = async (path) => {
//   return console.log(await getImageUrl(path));
// };

module.exports = { getImageUrl, putImageUrl, deleteImageUrl };
