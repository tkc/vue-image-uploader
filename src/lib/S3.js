import AWS from 'aws-sdk';
import {Setting} from './Config'

const s3Client = () => {
    AWS.config.region = Setting.S3.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: Setting.S3.PoolId});
    AWS.config.credentials.get(err => {
        !err ? console.log("Cognito Identify Id: " + AWS.config.credentials.identityId) : null;
    });
    return new AWS.S3({params: {Bucket: Setting.S3.Bucket}});
};

const save = (filename, file, type) => new Promise((resolve, reject) => {
    s3Client().putObject({
        Key: filename,
        ContentType: type,
        Body: file,
        ACL: "public-read"
    }, (err, data) => {
        data === null ? reject() : null;
        resolve(getFileName(filename));
    });
});

const dataURItoBlob = (dataURI, type) => {
    const binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: type});
};

export const SaveDataUrl = (filename, dataUel, type) => save(filename, dataURItoBlob(dataUel, type), type);
export const SaveBlob = (filename, file) => save(filename, file);
export const getFileName = fileName => "https://s3-ap-northeast-1.amazonaws.com/" + Setting.S3.Bucket + "/" + fileName;
