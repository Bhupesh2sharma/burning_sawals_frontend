"use client";

import React, {
    useRef,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";

interface CaptchaProps {
    siteKey: string;
    onVerify: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
    disabled?: boolean;
    action?: string;
}

export interface CaptchaRef {
    reset: () => void;
    execute: () => void;
}

declare global {
    interface Window {
        grecaptcha: any;
    }
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(
    (
        {
            siteKey,
            onVerify,
            onExpire,
            onError,
            disabled = false,
            action = "submit",
        },
        ref
    ) => {
        const isLoaded = useRef(false);

        useImperativeHandle(ref, () => ({
            reset: () => {
                // reCAPTCHA v3 doesn't have a reset method
                console.log("reCAPTCHA v3 reset called");
            },
            execute: async () => {
                if (window.grecaptcha && !disabled) {
                    try {
                        const token = await window.grecaptcha.execute(siteKey, {
                            action,
                        });
                        onVerify(token);
                    } catch (error) {
                        console.error("reCAPTCHA execution error:", error);
                        onError?.();
                    }
                }
            },
        }));

        useEffect(() => {
            const loadRecaptcha = () => {
                if (window.grecaptcha) {
                    isLoaded.current = true;
                    return;
                }

                // Check if script already exists
                const existingScript = document.querySelector(
                    `script[src*="recaptcha/api.js"]`
                );
                if (existingScript) {
                    // Script exists but grecaptcha not ready, wait for it
                    const checkGrecaptcha = setInterval(() => {
                        if (window.grecaptcha) {
                            isLoaded.current = true;
                            clearInterval(checkGrecaptcha);
                        }
                    }, 100);

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        clearInterval(checkGrecaptcha);
                        if (!window.grecaptcha) {
                            onError?.();
                        }
                    }, 10000);
                    return;
                }

                const script = document.createElement("script");
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    // Wait for grecaptcha to be available
                    const checkGrecaptcha = setInterval(() => {
                        if (window.grecaptcha) {
                            isLoaded.current = true;
                            clearInterval(checkGrecaptcha);
                        }
                    }, 100);

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        clearInterval(checkGrecaptcha);
                        if (!window.grecaptcha) {
                            onError?.();
                        }
                    }, 10000);
                };
                script.onerror = () => {
                    console.error("Failed to load reCAPTCHA script");
                    onError?.();
                };
                document.head.appendChild(script);
            };

            loadRecaptcha();
        }, [siteKey, onError]);

        // Auto-execute on mount for v3
        useEffect(() => {
            if (isLoaded.current && !disabled) {
                const timer = setTimeout(() => {
                    if (window.grecaptcha) {
                        window.grecaptcha
                            .execute(siteKey, { action })
                            .then((token: string) => {
                                onVerify(token);
                            })
                            .catch((error: any) => {
                                console.error(
                                    "reCAPTCHA auto-execution error:",
                                    error
                                );
                                onError?.();
                            });
                    }
                }, 1000); // Small delay to ensure grecaptcha is ready

                return () => clearTimeout(timer);
            }
        }, [siteKey, action, onVerify, onError, disabled]);

        return (
            <div className="flex justify-center">
                <div className="text-sm text-gray-500 text-center">
                    <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Verifying you're human...
                    </div>
                </div>
            </div>
        );
    }
);

Captcha.displayName = "Captcha";

export default Captcha;
