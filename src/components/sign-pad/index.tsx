import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import "./style.css";

export default function SignPad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const signaturePad = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvasEl = canvas.current;
    if (canvasEl) {
      signaturePad.current = new SignaturePad(canvasEl); // Store the signaturePad instance in useRef

      // Cleanup function to destroy the SignaturePad instance
      return () => {
        signaturePad.current?.clear(); // Clear the signature pad
        signaturePad.current?.off(); // Remove all event listeners
      };
    }
  }, []); // Run once on component mount

  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  const resizeCanvas: React.ReactEventHandler<HTMLCanvasElement> = (canvas) => {
    if (canvas.currentTarget) {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      const ratio = Math.max(window.devicePixelRatio || 1, 1);

      // This part causes the canvas to be cleared
      canvas.currentTarget.width = canvas.currentTarget.offsetWidth * ratio;
      canvas.currentTarget.height = canvas.currentTarget.offsetHeight * ratio;
      canvas.currentTarget.getContext("2d")?.scale(ratio, ratio);

      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      signaturePad.clear();
    }
  };

  function download(dataURL: string, filename: string) {
    const blob = dataURLToBlob(dataURL);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.classList.add("hidden");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // One could simply use Canvas#toBlob method instead, but it's just to show
  // that it can be done using result of SignaturePad#toDataURL.
  function dataURLToBlob(dataURL: string) {
    // Code taken from https://github.com/ebidel/filer.js
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  return (
    <div id="signature-pad" className="signature-pad">
      <div className="signature-pad--body">
        <canvas onResize={resizeCanvas} ref={canvas}></canvas>
      </div>
      <div className="signature-pad--footer">
        <div className="description">Sign above</div>

        <div className="signature-pad--actions">
          <div>
            <button
              type="button"
              className="button clear"
              data-action="clear"
              onClick={() => {
                signaturePad.clear();
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="button"
              data-action="change-color"
              onClick={() => {
                const r = Math.round(Math.random() * 255);
                const g = Math.round(Math.random() * 255);
                const b = Math.round(Math.random() * 255);
                const color = "rgb(" + r + "," + g + "," + b + ")";

                signaturePad.penColor = color;
              }}
            >
              Change color
            </button>
            <button
              type="button"
              className="button"
              data-action="undo"
              onClick={() => {
                const data = signaturePad.toData();

                if (data) {
                  data.pop(); // remove the last dot or line
                  signaturePad.fromData(data);
                }
              }}
            >
              Undo
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button save"
              data-action="save-png"
              onClick={() => {
                if (signaturePad.isEmpty()) {
                  alert("Please provide a signature first.");
                } else {
                  const dataURL = signaturePad.toDataURL();
                  download(dataURL, "signature.png");
                }
              }}
            >
              Save as PNG
            </button>
            <button
              type="button"
              className="button save"
              data-action="save-jpg"
              onClick={() => {
                if (signaturePad.isEmpty()) {
                  alert("Please provide a signature first.");
                } else {
                  const dataURL = signaturePad.toDataURL("image/jpeg");
                  download(dataURL, "signature.jpg");
                }
              }}
            >
              Save as JPG
            </button>
            <button
              type="button"
              className="button save"
              data-action="save-svg"
              onClick={() => {
                if (signaturePad.isEmpty()) {
                  alert("Please provide a signature first.");
                } else {
                  const dataURL = signaturePad.toDataURL("image/svg+xml");
                  download(dataURL, "signature.svg");
                }
              }}
            >
              Save as SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
