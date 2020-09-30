import AWS from "aws-sdk/global"
import Polly from "aws-sdk/clients/polly"

AWS.config.region = 'eu-central-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
});

export const PollyClient = new Polly({
    region: 'eu-central-1'
})