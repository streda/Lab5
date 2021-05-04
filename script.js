// script.js

const canvas = document.getElementById('user-image');
//const topText = document.getElementById('text-top');
//sconst bottomText = document.getElementById('text-bottom');


const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0,0, 400, 400);

const img = new Image(); // used to load image from <input> and draw to canvas
//img.src = 'images/mountains.jpg'

// Fires whenever the img object loads a new image (such as with img.src =)

img.addEventListener('load', () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, 400, 400);

  let dims = getDimmensions(400, 400, img.width, img.height )
  ctx.drawImage(img, dims.startX, dims.startY, dims.width, dims.height);

  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const imageInput = document.getElementById('image-input');
imageInput.addEventListener('change', function ()  { 
  //console.log(this.value);
  img.src = URL.createObjectURL(this.files[0]);
});


const form  = document.getElementById('generate-meme');
const textTop  = document.getElementById('text-top');
const textBottom  = document.getElementById('text-bottom');
form.addEventListener('submit', function(e){
  e.preventDefault();
  let textTopValue = textTop.value;
  let textBottomValue = textBottom.value;
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.fillText(textTopValue, 200, 50);
  ctx.fillText(textBottomValue, 200, 350);
  document.querySelectorAll('#button-group > button').forEach(function (button){
  button.disabled = false;

  });
  document.querySelector('#generate-meme > button').disabled = true;
});

form.addEventListener('reset', function(e){
  e.preventDefault();
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, 400, 400);

  textTop.value = '';
  textBottom.value = '';

  document.querySelectorAll('#button-group > button').forEach(function (button){
    button.disabled = true;

  });
  document.querySelector('#generate-meme > button').disabled = false;
});

const readTextButton = document.querySelector('#button-group > button:nth-child(2)');
let speech = new SpeechSynthesisUtterance();
readTextButton.addEventListener('click', function (){
  //let speechTop = new SpeechSynthesisUtterance(textTop.value + ' ' + textBottom.value);
  speech.text = textTop.value + ' ' + textBottom.value;
  speechSynthesis.speak(speech);

});

const volumeSlider = document.querySelector('#volume-group > input');
const volumeIcon = document.querySelector('#volume-group > img');
volumeSlider.addEventListener('change', function(){
  speech.volume = this.value / 100;
  if (this.value === 0){
    volumeIcon.src = 'icons/volume-level-0.svg';
  }
  else if(this.value >= 1 && this.value <= 33){
    volumeIcon.src = 'icons/volume-level-1.svg';

  }
  else if(this.value >= 34 && this.value <= 66){
    volumeIcon.src = 'icons/volume-level-2.svg';

  }

  else {
    volumeIcon.src = 'icons/volume-level-3.svg';
  }
}); 

const voices = document.getElementById('voice-selection');
  speechSynthesis.onvoiceschanged = function(){
  /* console.log(speechSynthesis.getVoices()); */
  speechSynthesis.getVoices().forEach(function(voice){
    /* console.log('high'); */
    let voiceOption = document.createElement('option');
    voiceOption.textContent = voice.name;
    voices.appendChild(voiceOption);
  });

  voices.disabled = false;
  }
voices.addEventListener('change', function(){
  let voiceList = speechSynthesis.getVoices();
  for(let i =0 ; i < voiceList.length; i++){
    if(voiceList[i].name === this.value){
      speech.voice = voiceList[i];
    }
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}


