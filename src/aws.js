import AWS from "aws-sdk"

AWS.config.region = 'eu-central-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-central-1:df97c608-06bc-49f5-abe5-c9639bc52387',
});

export const Polly = new AWS.Polly({
    region: 'eu-central-1'
})