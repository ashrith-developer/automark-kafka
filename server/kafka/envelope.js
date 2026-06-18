import crypto from 'crypto';

/**
 * Helper to wrap all Kafka events in a standard event envelope.
 * 
 * @param {string} eventType - The type of event (e.g., 'UserRegistered', 'ContentGenerated')
 * @param {object} payload - The actual data payload of the event
 * @param {number} [version=1] - The schema version of the event payload
 * @returns {object} Standardized event envelope
 */
export const createEventEnvelope = (eventType, payload, version = 1) => {
    return {
        eventId: crypto.randomUUID(),
        eventType,
        version,
        occurredAt: new Date().toISOString(),
        payload,
    };
};
