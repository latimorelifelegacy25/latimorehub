export type TrackingPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: TrackingPayload[];
  }
}

export const trackEvent = (eventName: string, payload: TrackingPayload = {}) => {
  if (!eventName || typeof window === 'undefined') return;

  const eventPayload = {
    event: eventName,
    ...payload,
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }
};
