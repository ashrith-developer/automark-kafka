const DEFAULT_RETRIES = Number(process.env.KAFKA_CONNECT_RETRIES || 30);
const DEFAULT_RETRY_DELAY_MS = Number(process.env.KAFKA_CONNECT_RETRY_DELAY_MS || 3000);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const retryKafkaOperation = async (
  operation,
  label,
  retries = DEFAULT_RETRIES,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS
) => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      console.log(
        `${label} failed (${error.message}). Retrying in ${retryDelayMs / 1000}s... ` +
          `(${attempt}/${retries})`
      );
      await delay(retryDelayMs);
    }
  }
};
