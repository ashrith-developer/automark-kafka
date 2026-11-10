import { useEffect, useRef, useState } from 'react';

const GoogleSignInButton = ({ onSuccess, onError, text = 'signin_with' }) => {
  const buttonRef = useRef(null);
  const [scriptFailed, setScriptFailed] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const renderButton = () => {
      if (!window.google || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await onSuccess(response.credential);
          } catch (error) {
            onError?.(error);
          }
        },
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: buttonRef.current.offsetWidth || 360,
        text,
        shape: 'rectangular',
      });
    };

    if (window.google) {
      renderButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => setScriptFailed(true);
    document.head.appendChild(script);
  }, [clientId, onError, onSuccess, text]);

  if (!clientId || scriptFailed) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-xl border border-dark-border bg-[#0B0F19] px-4 py-3 text-sm font-semibold text-slate-500"
      >
        Google sign-in unavailable
      </button>
    );
  }

  return <div ref={buttonRef} className="flex min-h-[44px] w-full justify-center" />;
};

export default GoogleSignInButton;
