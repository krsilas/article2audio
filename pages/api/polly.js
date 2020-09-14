import aws from "aws-sdk"
import fs from "fs"

const Polly = new aws.Polly({
    region: 'eu-central-1'
})

const formatFileName = string => string.replace(/[^a-z0-9]/gi, '_').toLowerCase()
const trimText = string => string.replace("\n"," ").substr(0,3000)

export default async (req, res) => {
    const slug = formatFileName(req.body.slug)
    const params = {
        'Text': trimText(req.body.text),
        'OutputFormat': 'mp3',
        'LanguageCode': 'de-DE',
        'VoiceId': 'Marlene'
    }

    res.setHeader('Content-Type', 'application/json')
    
    Polly.synthesizeSpeech(params, (error, data) => {
        if (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error }))
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                fs.writeFile(`./public/${slug}.mp3`, data.AudioStream, function(err) {
                    if (err) {
                        res.statusCode = 300
                        res.end(JSON.stringify({ error }))
                    }
                    res.statusCode = 200
                    res.end(JSON.stringify({ path: `/${slug}.mp3` }))
                })
            }
        }
    })

}