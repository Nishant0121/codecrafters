import React, { useState, useRef, useEffect } from "react";

const LiveObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isStreaming]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas frame to base64
    return canvas.toDataURL("image/jpeg").split(",")[1]; // Remove metadata
  };

  const query = async () => {
    if (!isStreaming) return;

    const base64Image = captureFrame();
    if (!base64Image) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
        {
          headers: {
            Authorization: "Bearer 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", // Replace with your actual token
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: base64Image }),
        }
      );
      const result = await response.json();
      setResponse(result);
      drawBoundingBoxes(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const drawBoundingBoxes = (detections) => {
    if (!canvasRef.current || !detections) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new bounding boxes
    detections.forEach((item) => {
      const { xmin, ymin, xmax, ymax } = item.box;

      // Draw rectangle
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);

      // Draw label
      ctx.fillStyle = "red";
      ctx.font = "14px Arial";
      ctx.fillText(
        `${item.label} (${(item.score * 100).toFixed(2)}%)`,
        xmin,
        ymin - 5
      );
    });
  };

  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(query, 2000); // Send a frame every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Live Object Detection</h2>
      <button onClick={() => setIsStreaming(!isStreaming)}>
        {isStreaming ? "Stop Camera" : "Start Camera"}
      </button>
      <br />
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "500px", height: "auto" }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </div>
  );
};

export default LiveObjectDetection;
