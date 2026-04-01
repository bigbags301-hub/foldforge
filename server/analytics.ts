import { Router, Request, Response } from "express";

const analyticsRouter = Router();

/**
 * Track popup events for A/B testing analysis
 * Stores events in memory (can be persisted to database later)
 */
const popupEvents: Array<{
  timestamp: string;
  variant: "variant-a" | "variant-b";
  eventType: "shown" | "submitted" | "closed";
  url: string;
  userAgent: string;
}> = [];

analyticsRouter.post("/api/analytics/popup-event", (req: Request, res: Response) => {
  try {
    const { timestamp, variant, eventType, url } = req.body;

    if (!variant || !eventType) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const event = {
      timestamp: timestamp || new Date().toISOString(),
      variant,
      eventType,
      url: url || "",
      userAgent: req.headers["user-agent"] || "",
    };

    popupEvents.push(event);

    // Log for debugging
    console.log(`[Popup Analytics] ${variant} - ${eventType}`);

    return res.json({ success: true, eventId: popupEvents.length });
  } catch (e: any) {
    console.error("[Analytics Error]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * Get A/B test results (admin endpoint)
 */
analyticsRouter.get("/api/analytics/popup-results", (req: Request, res: Response) => {
  try {
    const variantA = popupEvents.filter((e) => e.variant === "variant-a");
    const variantB = popupEvents.filter((e) => e.variant === "variant-b");

    const variantAShown = variantA.filter((e) => e.eventType === "shown").length;
    const variantASubmitted = variantA.filter((e) => e.eventType === "submitted").length;
    const variantAClosed = variantA.filter((e) => e.eventType === "closed").length;

    const variantBShown = variantB.filter((e) => e.eventType === "shown").length;
    const variantBSubmitted = variantB.filter((e) => e.eventType === "submitted").length;
    const variantBClosed = variantB.filter((e) => e.eventType === "closed").length;

    return res.json({
      summary: {
        totalEvents: popupEvents.length,
        variantA: {
          shown: variantAShown,
          submitted: variantASubmitted,
          closed: variantAClosed,
          conversionRate: variantAShown > 0 ? ((variantASubmitted / variantAShown) * 100).toFixed(2) : "0",
        },
        variantB: {
          shown: variantBShown,
          submitted: variantBSubmitted,
          closed: variantBClosed,
          conversionRate: variantBShown > 0 ? ((variantBSubmitted / variantBShown) * 100).toFixed(2) : "0",
        },
      },
      events: popupEvents.slice(-100), // Return last 100 events
    });
  } catch (e: any) {
    console.error("[Analytics Results Error]", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { analyticsRouter };
