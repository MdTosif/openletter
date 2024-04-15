import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { createClient } from "@supabase/supabase-js";

import "./style.css";
import { useClerk } from "@clerk/clerk-react";

export default function SignPad() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const clerk = useClerk();
  const signaturePad = useRef<SignaturePad | null>(null);

  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    "https://vauompkfayzeonicudle.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdW9tcGtmYXl6ZW9uaWN1ZGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MTc1MDUsImV4cCI6MjAxOTE5MzUwNX0.J9VgwWML2s7OXi1m1oMimnAW4gM2J082d0qfWGHpdY4",
  );

  useEffect(() => {
    const canvasEl = canvas.current;
    if (canvasEl) {
      signaturePad.current = new SignaturePad(canvasEl); // Store the signaturePad instance in useRef
      resizeCanvas();
      // Cleanup function to destroy the SignaturePad instance
      return () => {
        signaturePad.current?.clear(); // Clear the signature pad
        signaturePad.current?.off(); // Remove all event listeners
      };
    }
  }, []); // Run once on component mount

  useEffect(() => {
    const canvasEl = canvas.current;
    if (canvasEl && clerk.user?.id) {
      const imageUrl =
        "https://vauompkfayzeonicudle.supabase.co/storage/v1/object/public/signs/" +
        clerk.user?.id +
        ".png";

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);

          // Create an image element
          const image = new Image();

          // Set the source of the image to the blob URL
          image.src = blobUrl;
          canvasEl.getContext("2d")?.drawImage(image, 0, 0);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [clerk.user]);

  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  const resizeCanvas = () => {
    if (canvas.current) {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      const ratio = Math.max(window.devicePixelRatio || 1, 1);

      // This part causes the canvas to be cleared
      canvas.current.width = canvas.current.offsetWidth * ratio;
      canvas.current.height = canvas.current.offsetHeight * ratio;
      canvas.current.getContext("2d")?.scale(ratio, ratio);

      // This library does not listen for canvas changes, so after the canvas is automatically
      // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
      // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
      // that the state of this library is consistent with visual state of the canvas, you
      // have to clear it manually.
      signaturePad.current?.clear();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="container-body">
      <div id="signature-pad" className="signature-pad">
        <div className="signature-pad--body">
          <canvas onResize={resizeCanvas} ref={canvas} className=""></canvas>
        </div>
        <div className="signature-pad--footer">
          <div className="description">Sign above</div>

          <div className="signature-pad--actions">
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                className="btn clear"
                data-action="clear"
                onClick={() => {
                  signaturePad.current?.clear();
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn"
                data-action="change-color"
                onClick={() => {
                  const r = Math.round(Math.random() * 255);
                  const g = Math.round(Math.random() * 255);
                  const b = Math.round(Math.random() * 255);
                  const color = "rgb(" + r + "," + g + "," + b + ")";

                  signaturePad.current
                    ? (signaturePad.current.penColor = color)
                    : "";
                }}
              >
                Change color
              </button>
              <button
                type="button"
                className="btn"
                data-action="undo"
                onClick={() => {
                  const data = signaturePad.current?.toData();

                  if (data) {
                    data.pop(); // remove the last dot or line
                    signaturePad.current?.fromData(data);
                  }
                }}
              >
                Undo
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {/* <button
                type="button"
                className="btn save"
                data-action="save-png"
                onClick={() => {
                  if (signaturePad.current?.isEmpty()) {
                    alert("Please provide a signature first.");
                  } else {
                    const dataURL =
                      signaturePad.current?.toDataURL("image/png");
                    dataURL && download(dataURL, "signature.png");
                  }
                }}
              >
                Save as PNG
              </button>
              <button
                type="button"
                className="btn save"
                data-action="save-jpg"
                onClick={() => {
                  if (signaturePad.current?.isEmpty()) {
                    alert("Please provide a signature first.");
                  } else {
                    const dataURL =
                      signaturePad.current?.toDataURL("image/jpeg");
                    dataURL && download(dataURL, "signature.jpg");
                  }
                }}
              >
                Save as JPG
              </button>
              <button
                type="button"
                className="btn save"
                data-action="save-svg"
                onClick={() => {
                  if (signaturePad.current?.isEmpty()) {
                    alert("Please provide a signature first.");
                  } else {
                    const dataURL =
                      signaturePad.current?.toDataURL("image/svg+xml");
                    dataURL && download(dataURL, "signature.svg");
                  }
                }}
              >
                Save as SVG
              </button> */}
              <button
                className="btn"
                onClick={() => {
                  if (signaturePad.current?.isEmpty()) {
                    alert("Please provide a signature first.");
                  } else {
                    const dataURL =
                      signaturePad.current?.toDataURL("image/png");
                    // dataURL && download(dataURL, "signature.svg");
                    if (dataURL && clerk.user?.id) {
                      const blob = dataURLToBlob(dataURL);

                      // const file = new File(blob, "sign.png");

                      supabase.storage
                        .from("signs")
                        .upload(clerk.user?.id + ".png", blob, {
                          cacheControl: "3600",
                          upsert: true,
                          contentType: "image/png",
                        });
                    }
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
