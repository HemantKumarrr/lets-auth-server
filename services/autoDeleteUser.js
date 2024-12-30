const User = require("../models/user.model");

async function deleteOldUsers() {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const result = await User.deleteMany({
      createdAt: { $lte: twoMinutesAgo },
    });
    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} users deleted.`);
    }
  } catch (error) {
    console.error("Error deleting old users:", error);
  }
}

// Function to continuously check and delete users older than 2 minutes
async function startDeletionProcess(intervalInSeconds) {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Users found. Starting deletion process.");
      setInterval(deleteOldUsers, intervalInSeconds * 1000);
    } else {
      console.log("No users in database. Waiting for users to be created.");
      // Retry after a delay
      setTimeout(
        () => startDeletionProcess(intervalInSeconds),
        intervalInSeconds * 1000
      );
    }
  } catch (error) {
    console.error("Error checking user count:", error);
    setTimeout(
      () => startDeletionProcess(intervalInSeconds),
      intervalInSeconds * 1000
    );
  }
}

module.exports = startDeletionProcess;
