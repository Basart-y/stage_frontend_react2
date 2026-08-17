"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {Camera, CameraOff, QrCode} from "lucide-react";

export default function QrScanner({onScan, active = true}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const detectorRef = useRef(null);
    const timerRef = useRef(null);
    const scanningRef = useRef(false);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const stopCamera = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        scanningRef.current = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setStatus("idle");
    }, []);

    const startCamera = useCallback(async () => {
        setError("");
        if (!("mediaDevices" in navigator) || !navigator.mediaDevices?.getUserMedia) {
            setError("La caméra n'est pas disponible dans ce navigateur.");
            return;
        }
        if (!("BarcodeDetector" in window)) {
            setError("Le scan QR direct n'est pas pris en charge par ce navigateur. Utilisez Chrome récent ou saisissez le numéro de suivi.");
            return;
        }

        try {
            stopCamera();
            setStatus("starting");
            const supported = await window.BarcodeDetector.getSupportedFormats?.();
            if (Array.isArray(supported) && !supported.includes("qr_code")) {
                setError("Ce navigateur ne prend pas en charge la lecture des QR codes.");
                setStatus("idle");
                return;
            }
            detectorRef.current = new window.BarcodeDetector({formats: ["qr_code"]});
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: {ideal: "environment"}},
                audio: false,
            });
            streamRef.current = stream;
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setStatus("scanning");
            scanningRef.current = true;

            timerRef.current = setInterval(async () => {
                if (!scanningRef.current || !videoRef.current || videoRef.current.readyState < 2) return;
                try {
                    const codes = await detectorRef.current.detect(videoRef.current);
                    const value = codes?.[0]?.rawValue?.trim();
                    if (!value) return;
                    scanningRef.current = false;
                    if (navigator.vibrate) navigator.vibrate(80);
                    stopCamera();
                    onScan?.(value);
                } catch {
                    // Une frame illisible est normale : on continue le scan.
                }
            }, 350);
        } catch (e) {
            stopCamera();
            if (e?.name === "NotAllowedError") setError("Accès à la caméra refusé. Autorisez la caméra dans le navigateur puis réessayez.");
            else if (e?.name === "NotFoundError") setError("Aucune caméra n'a été détectée sur cet appareil.");
            else setError("Impossible de démarrer la caméra. Vérifiez les autorisations du navigateur.");
        }
    }, [onScan, stopCamera]);

    useEffect(() => {
        if (!active) stopCamera();
        return stopCamera;
    }, [active, stopCamera]);

    return <div className="overflow-hidden rounded-2xl border border-blue-200 bg-slate-950">
        <div className="relative flex min-h-64 items-center justify-center bg-black">
            <video ref={videoRef} playsInline muted className={`h-72 w-full object-cover ${status === "scanning" ? "block" : "hidden"}`}/>
            {status !== "scanning" && <div className="p-8 text-center text-white">
                <QrCode size={50} className="mx-auto text-blue-300"/>
                <p className="mt-3 font-extrabold">Scanner le QR code du colis</p>
                <p className="mt-1 text-sm text-slate-300">La référence sera reconnue automatiquement.</p>
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
            <p className="mt-3 text-xs text-slate-500">Le navigateur peut demander l'autorisation d'utiliser la caméra. Sur mobile, la caméra arrière est privilégiée.</p>
        </div>
    </div>;
}
