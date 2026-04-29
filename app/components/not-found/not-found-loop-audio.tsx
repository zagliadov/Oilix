"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type NotFoundLoopAudioProps = {
  readonly src: string;
};

export const NotFoundLoopAudio = ({ src }: NotFoundLoopAudioProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const notFoundTranslations = useTranslations("NotFound");
  const audioReference = useRef<HTMLAudioElement | null>(null);
  const waitingForGestureAfterAutoplayFailReference = useRef(false);
  const [playbackHardBlocked, setPlaybackHardBlocked] = useState(false);
  const [soundIsPlaying, setSoundIsPlaying] = useState(false);
  const [isAudible, setIsAudible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      buttonRef.current?.click();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const updateAudioState = useCallback((): void => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    setSoundIsPlaying(!audio.paused);
    setIsAudible(!audio.paused && !audio.muted);
  }, []);

  const tryAutoplay = useCallback((): void => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    audio.muted = false;
    audio.volume = 1;
    waitingForGestureAfterAutoplayFailReference.current = false;
    void audio
      .play()
      .then(() => {
        setPlaybackHardBlocked(false);
        updateAudioState();
      })
      .catch(() => {
        waitingForGestureAfterAutoplayFailReference.current = true;
        setPlaybackHardBlocked(false);
      });
  }, [updateAudioState]);

  const tryPlayFromUserGesture = useCallback((): void => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    audio.muted = false;
    audio.volume = 1;
    void audio
      .play()
      .then(() => {
        waitingForGestureAfterAutoplayFailReference.current = false;
        setPlaybackHardBlocked(false);
        updateAudioState();
      })
      .catch(() => {
        setPlaybackHardBlocked(true);
      });
  }, [updateAudioState]);

  const handleMute = useCallback((): void => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    audio.muted = true;
    updateAudioState();
  }, [updateAudioState]);

  const handleUnmute = useCallback((): void => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    audio.muted = false;
    void audio.play().catch(() => {
      setPlaybackHardBlocked(true);
    });
    updateAudioState();
  }, [updateAudioState]);

  const handleRetryAfterHardBlock = (): void => {
    setPlaybackHardBlocked(false);
    tryPlayFromUserGesture();
  };

  useEffect(() => {
    const audio = audioReference.current;
    if (!audio) {
      return;
    }
    audio.loop = true;
    audio.volume = 1;
    audio.muted = false;
    tryAutoplay();

    const removeUnlockListeners = (): void => {
      document.removeEventListener("pointerdown", onInteractionUnlock, { capture: true });
      document.removeEventListener("touchstart", onInteractionUnlock, { capture: true });
      document.removeEventListener("click", onInteractionUnlock, { capture: true });
    };

    const onInteractionUnlock = (): void => {
      const element = audioReference.current;
      if (!element) {
        return;
      }
      if (!element.paused && !element.muted) {
        removeUnlockListeners();
        return;
      }
      if (waitingForGestureAfterAutoplayFailReference.current || element.paused) {
        tryPlayFromUserGesture();
      }
    };

    const handlePlaying = (): void => {
      updateAudioState();
    };

    const handlePause = (): void => {
      updateAudioState();
    };

    const handleCanPlay = (): void => {
      if (waitingForGestureAfterAutoplayFailReference.current) {
        return;
      }
      tryAutoplay();
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("volumechange", updateAudioState);

    document.addEventListener("pointerdown", onInteractionUnlock, { capture: true, passive: true });
    document.addEventListener("touchstart", onInteractionUnlock, { capture: true, passive: true });
    document.addEventListener("click", onInteractionUnlock, { capture: true, passive: true });

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("volumechange", updateAudioState);
      removeUnlockListeners();
    };
  }, [tryAutoplay, tryPlayFromUserGesture, updateAudioState]);

  const showOtrubit = soundIsPlaying && isAudible;
  const showPodrubitAfterMute = soundIsPlaying && !isAudible && !playbackHardBlocked;
  const showPodrubitRetry = playbackHardBlocked;
  const showChrome = showOtrubit || showPodrubitAfterMute || showPodrubitRetry;

  return (
    <>
      <audio
        ref={audioReference}
        className="hidden"
        src={src}
        loop
        preload="auto"
        autoPlay
        aria-label={notFoundTranslations("musicAriaLabel")}
      />
      {showChrome ? (
        <div className="pointer-events-auto fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:right-5 lg:bottom-6 lg:right-6 lg:top-auto">
          {showPodrubitRetry ? (
            <button
              type="button"
              onClick={handleRetryAfterHardBlock}
              className="rounded-2xl border border-[#a67c2d] bg-[#e2be73] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-[#d7b160]"
            >
              {notFoundTranslations("musicEnableSound")}
            </button>
          ) : null}
          {showPodrubitAfterMute ? (
            <button
              ref={buttonRef}
              type="button"
              onClick={handleUnmute}
              className="rounded-2xl border border-[#a67c2d] bg-[#e2be73] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-[#d7b160]"
            >
              {notFoundTranslations("musicEnableSound")}
            </button>
          ) : null}
          {showOtrubit ? (
            <button
              type="button"
              onClick={handleMute}
              className="rounded-2xl border border-[#a67c2d] bg-[#e2be73]/95 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-[#d7b160]"
            >
              {notFoundTranslations("musicDisableSound")}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
