import aws from 'aws-sdk'

const Polly = new aws.Polly({
    region: 'eu-central-1'
})

aws.config.update({
    'accessKeyId': process.env.AWS_ACCESS_KEY_ID,
    'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY,
    'region': 'eu-central-1',
})

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

    res.setHeader('Content-Type', 'application/json')

    Polly.startSpeechSynthesisTask(params, (error, data) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error })
        } else if (data) {
            console.log(data)
            res.status(200).json({ TaskId: data.SynthesisTask.TaskId })
        }
    });
    

    // Polly.synthesizeSpeech(params, (error, data) => {
    //     if (error) res.json({ error })
    //     } else if (data) {
    //         if (data.AudioStream instanceof Buffer) {
    //             fs.writeFile(`./public/${slug}.mp3`, data.AudioStream, function(err) {
    //                 if (err) res.json({ error })
    //                 else res.json({ path: `/${slug}.mp3` })
    //             })
    //         }
    //     }
    // })

}