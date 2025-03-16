import React, { useRef, useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const VideoFaceMesh = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  let camera = null;

  useEffect(() => {
    if (!isCameraOn) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      drawFaceMesh(results);
    });

    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [isCameraOn]);

  const drawFaceMesh = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;

        for (let i = 0; i < landmarks.length; i++) {
          const x = landmarks[i].x * canvas.width;
          const y = landmarks[i].y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    }
  };

  return (
    <div className="mt-20 text-center p-6">
      <h2 className="text-2xl font-bold">Live Face Mesh Detection</h2>
      <button
        onClick={() => setIsCameraOn(!isCameraOn)}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
      <br />
      <div className="relative inline-block mt-4">
        <video ref={videoRef} className="border w-96 h-auto" autoPlay />
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
    </div>
  );
};

export default VideoFaceMesh;
