
import requestRest from 'request'
import path from 'path'
import fs from 'fs'
import Gpt from "./Gpt.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import textToSpeech from "./TextToSpeech.js"
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);



export async function IOSpeechToText(audioFilePath) {
  const audioContent = fs.readFileSync(audioFilePath).toString('base64');

  // Defina as opções do reconhecimento de voz
  const data = JSON.stringify({
    audio: { content: audioContent },
    config: {
      encoding: 'LINEAR16',
      languageCode: 'pt-BR',
      enableAutomaticPunctuation: true,
      model: 'default',
      // sampleRateHertz: 16000
    },
  });

  // Defina as opções da requisição HTTP POST
  const options = {
    method: 'POST',
    url: 'https://speech.googleapis.com/v1/speech:recognize',
    params: { key: process.env.API_KEY_GCP },
    headers: { 'Content-Type': 'application/json' },
    data: data,
  };

  // Use o método "axios" para enviar a requisição POST
  try {
    const response = await axios(options);
    console.log('speech:recognize: ', response.data.results[0].alternatives[0].transcript);
    const responseGPT = await Gpt({
      text: response.data.results[0].alternatives[0].transcript
    })

    console.log("responseGPT: ", responseGPT)
    await textToSpeech(responseGPT);

  } catch (error) {
    throw new Error(error);
  }
}



export async function getSpeechToText() {
  const audioFilePath = __dirname + '/audios/mic.wav',
    audioContent = fs.readFileSync(audioFilePath).toString('base64');

  // Defina as opções do reconhecimento de voz
  const data = JSON.stringify({
    audio: { content: audioContent },
    config: {
      encoding: 'LINEAR16',
      languageCode: 'pt-BR',
      enableAutomaticPunctuation: true,
      model: 'default',
      // sampleRateHertz: 16000
    },
  });

  // Defina as opções da requisição HTTP POST
  const options = {
    method: 'POST',
    url: 'https://speech.googleapis.com/v1/speech:recognize',
    params: { key: process.env.API_KEY_GCP },
    headers: { 'Content-Type': 'application/json' },
    data: data,
  };

  // Use o método "axios" para enviar a requisição POST
  try {
    const response = await axios(options);
    console.log(response.data.results[0].alternatives);
  } catch (error) {
    throw new Error(error);
  }
}