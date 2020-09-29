import aws from 'aws-sdk'

aws.config.update({
    'accessKeyId': process.env.AWS_ACCESS_KEY_ID,
    'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY,
    'region': 'eu-central-1',
})

const Polly = new aws.Polly()
const trimText = string => string.replace("\n"," ").substr(0,3000)

export const speechSynthesisTask = async (req, res) => {
    const deutsch = req.body.lang === 'de'
    const params = {
        'Text': trimText(req.body.text),
        'OutputFormat': 'mp3',
        'OutputS3BucketName': 'article-audio2', 
        'LanguageCode': deutsch ? 'de-DE' : 'en-US',
        'VoiceId': deutsch ? 'Marlene' : 'Joanna'
    }

    Polly.startSpeechSynthesisTask(params, (error, data) => {
        if (error) {
            res.status(500).json({ error })
        } else if (data) {
            res.status(202).json({ audioTaskId: data.SynthesisTask.TaskId })
        }
    });
}