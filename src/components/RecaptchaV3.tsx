"use client";

import { useEffect, useState } from "react";

interface RecaptchaV3Props {
    siteKey: string;
    onVerify: (token: string) => void;
    onError: (error: string) => void;
    onReady?: () => void;
}

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function RecaptchaV3({
    siteKey,
    onVerify,
    onError,
    onReady,
}: RecaptchaV3Props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecaptcha = async () => {
            try {
                // Check if already loaded
                if (window.grecaptcha) {
                    setIsLoaded(true);
                    setIsLoading(false);
                    onReady?.();
                    return;
                }

                // Check if script already exists
                const existingScript = document.querySelector(
                    'script[src*="recaptcha/api.js"]'
                );
                if (existingScript) {
                    // Wait for grecaptcha to be available
                    const checkInterval = setInterval(() => {
                        if (window.grecaptcha) {
                            setIsLoaded(true);
                            setIsLoading(false);
                            onReady?.();
                            clearInterval(checkInterval);
                        }
                    }, 100);

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        if (!window.grecaptcha) {
                            onError(
                                "Failed to load reCAPTCHA. Please refresh the page."
                            );
                            setIsLoading(false);
                        }
                    }, 10000);
                    return;
                }

                // Load the script
                const script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    // Wait for grecaptcha to be available
                    const checkInterval = setInterval(() => {
                        if (window.grecaptcha) {
                            setIsLoaded(true);
                            setIsLoading(false);
                            onReady?.();
                            clearInterval(checkInterval);
                        }
                    }, 100);

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        if (!window.grecaptcha) {
                            onError(
                                "reCAPTCHA loaded but not ready. Please try again."
                            );
                            setIsLoading(false);
                        }
                    }, 10000);
                };

                script.onerror = () => {
                    onError(
                        "Failed to load reCAPTCHA script. Please check your internet connection."
                    );
                    setIsLoading(false);
                };

                document.head.appendChild(script);
            } catch (error) {
                console.error("reCAPTCHA loading error:", error);
                onError(
                    "Failed to initialize reCAPTCHA. Please refresh the page."
                );
                setIsLoading(false);
            }
        };

        loadRecaptcha();
    }, [siteKey, onError]);

    const executeRecaptcha = async (
        action: string = "submit"
    ): Promise<string> => {
        if (!window.grecaptcha) {
            throw new Error("reCAPTCHA not loaded");
        }

        try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            return token;
        } catch (error) {
            console.error("reCAPTCHA execution error:", error);
            throw new Error("Failed to execute reCAPTCHA");
        }
    };

    // Don't auto-execute - let the form handle execution

    // Expose execute function globally for use in forms
    useEffect(() => {
        if (isLoaded) {
            (window as any).executeRecaptcha = executeRecaptcha;
        }
    }, [isLoaded, siteKey]);

    if (isLoading) {
        return (
            <div className="text-sm text-gray-500 text-center">
                <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    Loading security verification...
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="text-sm text-red-500 text-center">
                Security verification failed to load
            </div>
        );
    }

    return null;
}

// Helper function to execute reCAPTCHA from anywhere
export const executeRecaptchaV3 = async (
    siteKey: string,
    action: string = "submit"
): Promise<string> => {
    console.log("executeRecaptchaV3 called with:", { siteKey, action });
    
    if (!window.grecaptcha) {
        console.error("reCAPTCHA not loaded - window.grecaptcha is undefined");
        throw new Error("reCAPTCHA not loaded");
    }

    try {
        console.log("Executing reCAPTCHA with siteKey:", siteKey);
        const token = await window.grecaptcha.execute(siteKey, { action });
        console.log("reCAPTCHA token generated successfully, length:", token?.length);
        return token;
    } catch (error) {
        console.error("reCAPTCHA execution error:", error);
        throw new Error("Failed to execute reCAPTCHA");
    }
};
