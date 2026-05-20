import twilio from 'twilio';

let twilioClient: twilio.Twilio | null = null;

/**
 * Lazily initialise the Twilio client.
 */
const getTwilioClient = (): twilio.Twilio => {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables must be set'
    );
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
};

/**
 * Get the Twilio phone number configured in the environment.
 */
const getFromNumber = (): string => {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER environment variable must be set');
  }
  return from;
};

/**
 * Send a generic SMS message.
 *
 * @param to      - Recipient phone number in E.164 format (e.g. +213555123456)
 * @param message - The text message body
 */
export const sendSMS = async (to: string, message: string): Promise<void> => {
  const client = getTwilioClient();
  const from = getFromNumber();

  try {
    await client.messages.create({
      body: message,
      from,
      to,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to send SMS to ${to}:`, errMsg);
    throw new Error(`SMS sending failed: ${errMsg}`);
  }
};

/**
 * Send an emergency alert SMS with the user's GPS location as a Google Maps link.
 *
 * @param contactPhone - Emergency contact phone number in E.164 format
 * @param userName     - Name of the user triggering the alert
 * @param latitude     - GPS latitude
 * @param longitude    - GPS longitude
 */
export const sendEmergencyAlert = async (
  contactPhone: string,
  userName: string,
  latitude: number,
  longitude: number
): Promise<void> => {
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const message =
    `🚨 EMERGENCY ALERT — Campus Covoiturage\n\n` +
    `${userName} has triggered an emergency alert.\n\n` +
    `📍 Location: ${mapsLink}\n\n` +
    `Please check on them immediately or contact local authorities.`;

  await sendSMS(contactPhone, message);
};

/**
 * Send a one-time password (OTP) verification code via SMS.
 *
 * @param to   - Recipient phone number in E.164 format
 * @param code - The OTP code to send
 */
export const sendOTP = async (to: string, code: string): Promise<void> => {
  const message =
    `Campus Covoiturage — Your verification code is: ${code}\n\n` +
    `This code expires in 10 minutes. Do not share it with anyone.`;

  await sendSMS(to, message);
};
