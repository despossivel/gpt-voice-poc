
const audio = document.querySelector('audio');
const audioReceive = document.querySelector('#audioReceive');
const socket = io();
let mediaRecorder = null;
let chunks = [];
let chunksReceive = [];

// Quando o botão de gravação é clicado
const startButton = document.getElementById('start');
startButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      startButton.style.display = 'none';
      stopButton.style.display = 'block';

      // Quando um novo fragmento de áudio é gravado
      mediaRecorder.addEventListener('dataavailable', event => {
        chunks.push(event.data);
        socket.emit('audio', event.data);
      });

      // Quando a gravação é interrompida
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(chunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audio.src = audioUrl;
 
        console.log(audioUrl)

        // Habilita o botão de upload
        // uploadButton.disabled = false;
      });
    })
    .catch(error => {
      console.error(error);
    });
});

// Quando o botão de parada é clicado
const stopButton = document.getElementById('stop');
stopButton.addEventListener('click', () => {
  mediaRecorder.stop();
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
  
  setTimeout(() => {
    upload()
  }, 2000)
});

// Quando o servidor envia o áudio
socket.on('audio', (data) => {
  chunksReceive.push(data);

  const audioBlobReceive = new Blob(chunksReceive);
  const audioUrlReceive = URL.createObjectURL(audioBlobReceive);
  audioReceive.src = audioUrlReceive;
  // byteLength: 887736
  audioReceive.play();
  chunksReceive = [];


  // audioReceive.style.display = 'none'
  // loader.style.display = 'block'

});


async function upload() {
  // Captura o elemento de audio
  const audioElement = document.querySelector('audio');

  // Faz uma requisição GET para o arquivo de áudio
  fetch(audioElement.src)
    .then(response => response.blob())
    .then(async audioBlob => {
      // Cria um objeto FormData
      const formData = new FormData();

      // Adiciona o arquivo ao objeto FormData
      formData.append('audio', audioBlob, 'audio.wav');

      try {
        // Faz uma requisição POST para o servidor com o objeto FormData
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData
        });

        // Verifica se a resposta foi bem sucedida
        if (response.ok) {
          console.log('Arquivo enviado com sucesso!');
          chunks = []
        } else {
          console.error('Erro ao enviar o arquivo.');
        }
      } catch (error) {
        console.error(error);
      }
    })
    .catch(error => console.error(error));
}


// Quando o botão de upload é clicado
// const uploadButton = document.getElementById('upload');
// uploadButton.addEventListener('click', async () => {
//   upload()
// });