import aws from 'aws-sdk'

const Polly = new aws.Polly({
    region: 'eu-central-1'
})
const trimText = string => string.replace("\n"," ").substr(0,3000)

export const speechSynthesisTask = async (req, res) => {
    const params = {
        //LexiconNames: ['STRING'],
        //Engine (neural)
        'Text': trimText(req.body.text),
        'OutputFormat': 'mp3',
        'OutputS3BucketName': 'article-audio2', 
        'LanguageCode': 'de-DE',
        'VoiceId': 'Marlene'
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
    //     if (error) {
    //         res.statusCode = 500
    //         res.end(JSON.stringify({ error }))
    //     } else if (data) {
    //         if (data.AudioStream instanceof Buffer) {
    //             fs.writeFile(`./public/${slug}.mp3`, data.AudioStream, function(err) {
    //                 if (err) {
    //                     res.statusCode = 300
    //                     res.end(JSON.stringify({ error }))
    //                 }
    //                 res.statusCode = 200
    //                 res.end(JSON.stringify({ path: `/${slug}.mp3` }))
    //             })
    //         }
    //     }
    // })

}