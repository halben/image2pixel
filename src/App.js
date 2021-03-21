import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [pixelContext, setPixelContext] = useState(null);
  const [orginalImg, setImage] = useState(null);
  const origCanvasRef = useRef(null);
  const pixelCanvasRef = useRef(null);

  async function onFileChange(evt) {
    const file = evt.target.files[0];

    // original
    const origCanvas = origCanvasRef.current;
    const origContext = origCanvas.getContext('2d');
    origContext.clearRect(0, 0, origCanvas.width, origCanvas.height);

    // edited
    const pixelCanvas = pixelCanvasRef.current;
    const pixelContext = pixelCanvas.getContext('2d');
    pixelContext.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);

    setPixelContext(pixelContext);

    // img
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setImage({
        url: img.src,
        h: img.height,
        w: img.width
      });

      const sizer = preserveAspectRatio(img.width, img.height, origCanvas.width, origCanvas.height);

      // pixelContext.imageSmoothingEnabled = false;
      // pixelContext.mozImageSmoothingEnabled = false;
      // pixelContext.webkitImageSmoothingEnabled = false;
      // pixelContext.msImageSmoothingEnabled = false;

      origContext.drawImage(img, 0, 0, img.width*sizer, img.height*sizer);
      pixelContext.drawImage(img, 0, 0, img.width*sizer, img.height*sizer);
    };
  }

  function preserveAspectRatio(imgW, imgH, maxW, maxH) {
    return(Math.min((maxW/imgW),(maxH/imgH)));
  }

  function onSliderChange(evt) {
    const size = parseInt(evt.target.value);
    const canvas = pixelCanvasRef.current;

    let pixelArr = pixelContext.getImageData(0, 0, canvas.width, canvas.height).data;
    let h = orginalImg.h;
    let w = orginalImg.w;

    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        let p = (x + (y*w)) * 4;

        pixelContext.fillStyle = 'rgba(' + pixelArr[p] + ',' + pixelArr[p + 1] + ',' + pixelArr[p + 2] + ',' + pixelArr[p + 3] + ')';
        pixelContext.fillRect(x, y, size, size);
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image 2 Pixel</h1>
      </header>
      <section>
        <input type="file" id="input" onChange={onFileChange}></input>
      </section>
      <section id="preview">
        <div className="preview-col">
          <h3>Original</h3>
          <canvas ref={origCanvasRef} width="500" height="300"></canvas>
        </div>
        <div className="preview-col">
          <h3>Pixelated</h3>
          <canvas ref={pixelCanvasRef} width="500" height="300"></canvas>
          <input type="range" id="volume" name="volume" min="0" max="20" onChange={onSliderChange}></input>
        </div>
      </section>
    </div>
  );
}

export default App;
