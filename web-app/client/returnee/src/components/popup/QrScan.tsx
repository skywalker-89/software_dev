import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Html5Qrcode } from "html5-qrcode";

interface QRScanProps {
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

const QRScan: React.FC<QRScanProps> = ({ onClose, onScanSuccess }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onScanSuccessRef = useRef(onScanSuccess);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (scannerRef.current) return; // Prevent multiple scanner instances

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const qrConfig = {
      fps: 10,
      qrbox: { width: 300, height: 300 }, // Keeps a square scanning area
    };

    scanner
      .start(
        { facingMode: "environment" },
        qrConfig,
        (result) => {
          stopScanner();
          onScanSuccessRef.current(result);
          onCloseRef.current();
        },
        () => {
          setErrorMessage("Place the QR code inside the scanner area.");
        }
      )
      .catch((err) => {
        setErrorMessage("Failed to access camera. Check permissions.");
        console.error(err);
      });

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
        })
        .catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Scan QR Code
        </h2>

        {/* QR Scanner Container, filling space correctly */}
        <div className="flex justify-center">
          <div className="w-64 h-48 bg-gray-100 rounded-md overflow-hidden flex justify-center items-center border-2 border-gray-500">
            <div id="qr-reader" className="w-full h-full" />
          </div>
        </div>

        {errorMessage && (
          <p className="text-gray-500 text-sm mt-2 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default QRScan;
