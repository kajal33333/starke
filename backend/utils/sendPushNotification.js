const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
const { User, sequelize } = require("../models");
const { Op } = require("sequelize");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sendPushNotification = async (tokens = [], payload = {}) => {
  if (!tokens.length) return;

  const message = {
    tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data || {}, // values must be strings
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    for (let i = 0; i < response.responses.length; i++) {
      if (!response.responses[i].success) {
        const badToken = tokens[i];
        const safeToken = badToken.replace(/'/g, "\\'");

        console.log("❌ Removing invalid token:", badToken);

        await User.update(
          {
            fcm_tokens: sequelize.literal(`
              JSON_REMOVE(
                fcm_tokens,
                JSON_UNQUOTE(JSON_SEARCH(fcm_tokens, 'one', '${safeToken}'))
              )
            `),
          },
          {
            where: {
              fcm_tokens: {
                [Op.ne]: null,
              },
            },
          }
        );
      }
    }

    return response;
  } catch (error) {
    console.error("🔥 FCM Error:", error.message);
    throw error;
  }
};

module.exports = { sendPushNotification };
