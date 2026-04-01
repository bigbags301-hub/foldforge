import { useState, useEffect, useRef } from "react";
import { getPopupVariant, trackPopupEvent, type PopupVariant } from "@/lib/ab-testing";
import PremiumPopupVariantA from "./PremiumPopupVariantA";
import PremiumPopupVariantB from "./PremiumPopupVariantB";

interface PremiumFreeMonthPopupProps {
  onClose?: () => void;
}

/**
 * Premium Free Month Popup - A/B Testing Wrapper
 * 
 * This component:
 * 1. Determines which variant to show based on deterministic user assignment
 * 2. Tracks when popup is shown
 * 3. Handles scroll trigger logic (5-10 seconds of scrolling)
 * 4. Manages localStorage to prevent repeated displays
 * 5. Routes to appropriate variant component
 * 
 * Pro Plan Features (from Pricing.tsx):
 * - 5 EA License Keys
 * - Full Broker Data Sync (MT4/MT5)
 * - Unlimited Studio Runs
 * - Advanced Analytics & Reports
 * - Monte Carlo Simulations
 * - Walk-Forward Analysis
 * - Priority Support
 * - Funded Account Guardian
 */
export default function PremiumFreeMonthPopup({ onClose }: PremiumFreeMonthPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<PopupVariant | null>(null);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const scrollStartTimeRef = useRef<number>(0);

  // Initialize variant on mount
  useEffect(() => {
    const assignedVariant = getPopupVariant();
    setVariant(assignedVariant);
  }, []);

  // Handle scroll trigger logic
  useEffect(() => {
    scrollStartTimeRef.current = Date.now();

    const handleScroll = () => {
      // Don't trigger if already shown or already triggered
      if (scrollTriggered || isVisible) return;

      const elapsedSeconds = (Date.now() - scrollStartTimeRef.current) / 1000;
      const hasScrolled = window.scrollY > 100;
      const isInTimeWindow = elapsedSeconds >= 5 && elapsedSeconds <= 10;

      // Check localStorage to prevent showing multiple times
      const alreadyShown = localStorage.getItem("premium_free_month_shown");

      if (hasScrolled && isInTimeWindow && !alreadyShown) {
        setScrollTriggered(true);
        setIsVisible(true);
        localStorage.setItem("premium_free_month_shown", "true");

        // Track that popup was shown
        if (variant) {
          trackPopupEvent(variant, "shown");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollTriggered, isVisible, variant]);

  const handleClose = () => {
    setIsVisible(false);
    if (variant) {
      trackPopupEvent(variant, "closed");
    }
    if (onClose) onClose();
  };

  // Don't render if variant not yet determined
  if (!variant || !isVisible) return null;

  // Route to appropriate variant
  if (variant === "variant-a") {
    return <PremiumPopupVariantA onClose={handleClose} />;
  }

  return <PremiumPopupVariantB onClose={handleClose} />;
}
