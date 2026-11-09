
const MODEL =
  'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/';

const video = document.getElementById('v');
const message = document.getElementById('message');
const status = document.getElementById('cameraStatus');

let stream = null;

async function openCamera() {
  try {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
      throw new Error('เบราว์เซอร์ไม่รองรับกล้อง');
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    message.textContent = 'เปิดกล้องสำเร็จ';
    status.textContent = 'พร้อมใช้งาน';

  } catch (error) {
    message.textContent = error.message;
    status.textContent = 'ไม่สามารถเปิดกล้องได้';
    console.error(error);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  video.srcObject = null;
  message.textContent = 'ปิดกล้องแล้ว';
  status.textContent = 'รอเปิดกล้อง';
}

document.getElementById('openCam')
  .addEventListener('click', openCamera);

document.getElementById('stopCam')
  .addEventListener('click', stopCamera);

// เตรียมระบบตรวจจับใบหน้า
async function loadFaceModels() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL)
    ]);

    console.log('Face API พร้อมใช้งาน');

  } catch (error) {
    console.error('โหลด Face API ไม่สำเร็จ', error);
  }
}

loadFaceModels();

