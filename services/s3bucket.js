const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
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

module.exports = { getImageUrl, s3Client };
