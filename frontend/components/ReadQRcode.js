"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import jsQR from "jsqr";

// Dynamically import BarcodeScannerComponent (avoids SSR issue in Next.js)
const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

const ReadQRcode = () => {
  const [mode, setMode] = useState("upload"); // ✅ default mode is upload
  const [data, setData] = useState(null);
  const fileInputRef = useRef(null);

  // File upload QR decoding
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          try {
            setData(JSON.parse(code.data));
          } catch {
            setData({ raw: code.data });
          }
        } else {
          alert("No QR code found!");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // Reset scanned data
  const handleReset = () => {
    setData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">QR Code Scanner</h1>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "camera"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Camera
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            mode === "upload"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Upload Image
        </button>
      </div>

      {/* Camera Scanner */}
      {mode === "camera" && (
        <div className="w-72 h-72 border rounded-lg overflow-hidden shadow-lg mb-4">
          <BarcodeScannerComponent
            width={288}
            height={288}
            onUpdate={(err, result) => {
              if (result) {
                try {
                  setData(JSON.parse(result.text));
                } catch {
                  setData({ raw: result.text });
                }
              }
            }}
          />
        </div>
      )}

      {/* Upload Input */}
      {mode === "upload" && (
        <div className="flex flex-col items-center mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="px-4 py-2 border rounded-lg bg-white hover:border-blue-500 transition cursor-pointer"
          />
        </div>
      )}

      {/* Display Scanned Info */}
      {data && (
        <div className="mt-6 max-w-sm w-full border rounded-xl shadow-lg p-4 bg-white">
          <h2 className="text-xl font-bold mb-3 text-center">Product Info</h2>
          <div className="space-y-2 text-gray-700">
            {"id" in data && (
              <p>
                <span className="font-semibold">ID:</span> {data.id}
              </p>
            )}
            {"name" in data && (
              <p>
                <span className="font-semibold">Name:</span> {data.name}
              </p>
            )}
            {"price" in data && (
              <p>
                <span className="font-semibold">Price:</span> {data.price}৳
              </p>
            )}
            {"raw" in data && (
              <p>
                <span className="font-semibold">Raw Data:</span> {data.raw}
              </p>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mt-4 w-full px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadQRcode;
