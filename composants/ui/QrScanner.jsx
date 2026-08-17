"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {Camera, CameraOff, QrCode} from "lucide-react";
import jsQR from "jsqr";

export default function QrScanner({onScan, active = true}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const frameRef = useRef(null);
    const scanningRef = useRef(false);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const stopCamera = useCallback(() => {
        scanningRef.current = false;
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setStatus("idle");
    }, []);

    const scanFrame = useCallback(() => {
        if (!scanningRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
            const maxWidth = 960;
            const scale = Math.min(1, maxWidth / video.videoWidth);
            canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
            canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
            const ctx = canvas.getContext("2d", {willReadFrequently: true});
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(image.data, image.width, image.height, {inversionAttempts: "attemptBoth"});
            const value = code?.data?.trim();
            if (value) {
                scanningRef.current = false;
                if (navigator.vibrate) navigator.vibrate(80);
                stopCamera();
                onScan?.(value);
                return;
            }
        }
        frameRef.current = requestAnimationFrame(scanFrame);
    }, [onScan, stopCamera]);

    const startCamera = useCallback(async () => {
        setError("");
        if (!navigator.mediaDevices?.getUserMedia) {
            setError("La caméra n'est pas disponible. Utilisez HTTPS/localhost ou saisissez le numéro de suivi.");
            return;
        }
        try {
            stopCamera();
            setStatus("starting");
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}, audio: false});
            } catch (firstError) {
                if (firstError?.name === "OverconstrainedError") {
                    stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
                } else throw firstError;
            }
            streamRef.current = stream;
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setStatus("scanning");
            scanningRef.current = true;
            frameRef.current = requestAnimationFrame(scanFrame);
        } catch (e) {
            stopCamera();
            if (e?.name === "NotAllowedError") setError("Accès caméra refusé. Cliquez sur le cadenas de Chrome, autorisez Caméra, puis réessayez.");
            else if (e?.name === "NotFoundError") setError("Aucune caméra n'a été détectée sur ce PC.");
            else if (e?.name === "NotReadableError") setError("La caméra est déjà utilisée par une autre application. Fermez-la puis réessayez.");
            else setError("Impossible de démarrer la caméra. Vérifiez les autorisations de Chrome.");
        }
    }, [scanFrame, stopCamera]);

    useEffect(() => {
        if (!active) stopCamera();
        return stopCamera;
    }, [active, stopCamera]);

    return <div className="overflow-hidden rounded-2xl border border-blue-200 bg-slate-950">
        <canvas ref={canvasRef} className="hidden"/>
        <div className="relative flex min-h-64 items-center justify-center bg-black">
            <video ref={videoRef} playsInline muted className={`h-72 w-full object-cover ${status === "scanning" ? "block" : "hidden"}`}/>
            {status !== "scanning" && <div className="p-8 text-center text-white">
                <QrCode size={50} className="mx-auto text-blue-300"/>
                <p className="mt-3 font-extrabold">Scanner le QR code du colis</p>
                <p className="mt-1 text-sm text-slate-300">Compatible Chrome PC et mobile, sans BarcodeDetector.</p>
            </div>}
            {status === "scanning" && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-44 w-44 rounded-2xl border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.2)]"/>
            </div>}
        </div>
        <div className="bg-white p-4">
            {error && <p className="mb-3 text-sm font-semibold text-rose-700">{error}</p>}
            <div className="flex flex-wrap gap-3">
                {status === "scanning" ?
                    <button type="button" onClick={stopCamera} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"><CameraOff size={16}/> Arrêter la caméra</button> :
                    <button type="button" onClick={startCamera} disabled={status === "starting"} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Camera size={16}/> {status === "starting" ? "Ouverture..." : "Ouvrir la caméra"}</button>
                }
            </div>
            <p className="mt-3 text-xs text-slate-500">Sur Vercel (HTTPS) ou localhost, autorisez la caméra dans Chrome. La saisie manuelle du numéro de suivi reste disponible.</p>
        </div>
    </div>;
}
