import './App.css';
import { drawHand } from './utilities';

import { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandPose = async () => {
    // load tensorflow handpose neural network
    const net = await handpose.load();
    console.log("Handpose loaded.");

    // create loop to detect hand neural network
    setInterval(() => {
      detect(net);
    }, 100)
  }

  const detect = async (net) => {
    // check data is available
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      // get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const hand = await net.estimateHands(video);
      console.log(hand);

      // draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  }
  

  runHandPose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} style={webcamStyle} />
        <canvas id="myCanvas" ref={canvasRef} style={canvasStyle} />
      </header>
    </div>
  );
}

const webcamStyle = {
  position: 'absolute',
  marginLeft: 'auto',
  marginRight: 'auto',
  left: 0,
  right: 0,
  textAlign: 'center',
  width: 640,
  height: 480,
  zindex: 9,
}

const canvasStyle = {
  position: 'absolute',
  marginLeft: 'auto',
  marginRight: 'auto',
  left: 0,
  right: 0,
  textAlign: 'center',
  width: 640,
  height: 480,
  zindex: 9,
}

export default App;
