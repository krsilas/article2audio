import AWS from "aws-sdk/global"
import Polly from "aws-sdk/clients/polly"

AWS.config.region = 'eu-central-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-central-1:df97c608-06bc-49f5-abe5-c9639bc52387',
});

export const PollyClient = new Polly({
    region: 'eu-central-1'
})