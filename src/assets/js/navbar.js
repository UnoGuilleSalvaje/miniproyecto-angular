feather.replace();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.listAllUsers = functions.https.onRequest(async (req, res) => {
  try {
    let users = [];
    let nextPageToken;
    // List all users, 1000 at a time.
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord.toJSON());
      });
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(`Error listing users: ${error}`);
  }
});
