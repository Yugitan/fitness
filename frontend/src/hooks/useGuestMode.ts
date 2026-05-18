'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

const STORAGE_PREFIX = 'fitness_guest_';
const FIRST_VISIT_KEY = `${STORAGE_PREFIX}first_visit`;
const POPUP_SHOWN_KEY = `${STORAGE_PREFIX}popup_shown`;
const MAX_DAYS = 7;

export function useGuestMode() {
  const { isLoggedIn, isLoading } = useAuthStore();
  const [daysUsed, setDaysUsed] = useState(0);
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [showLockPopup, setShowLockPopup] = useState(false);

  const isGuest = !isLoading && !isLoggedIn;
  const daysRemaining = Math.max(0, MAX_DAYS - daysUsed);
  const isLocked = daysUsed >= MAX_DAYS;

  useEffect(() => {
    if (!isGuest) return;

    const now = Date.now();
    let firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

    if (!firstVisit) {
      firstVisit = String(now);
      localStorage.setItem(FIRST_VISIT_KEY, firstVisit);
    }

    const days = Math.floor((now - Number(firstVisit)) / (1000 * 60 * 60 * 24));
    setDaysUsed(Math.min(days, MAX_DAYS));

    // Check if daily popup should show
    const popupShownDate = localStorage.getItem(POPUP_SHOWN_KEY);
    const today = new Date().toDateString();
    if (popupShownDate !== today && days < MAX_DAYS) {
      setShowDailyPopup(true);
    }

    // Check if locked
    if (days >= MAX_DAYS) {
      setShowLockPopup(true);
    }
  }, [isGuest]);

  const dismissDailyPopup = useCallback(() => {
    setShowDailyPopup(false);
    localStorage.setItem(POPUP_SHOWN_KEY, new Date().toDateString());
  }, []);

  const dismissLockPopup = useCallback(() => {
    // Lock popup is non-dismissible — but we allow closing if user logs in
    setShowLockPopup(false);
  }, []);

  const canWrite = !isLocked; // Guest can write within 7 days, but backend still blocks

  return {
    isGuest,
    daysUsed,
    daysRemaining,
    isLocked,
    showDailyPopup,
    showLockPopup,
    dismissDailyPopup,
    dismissLockPopup,
    canWrite,
  };
}
