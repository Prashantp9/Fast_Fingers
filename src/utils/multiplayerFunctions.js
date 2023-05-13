export const getMyProfile = (assignprofile, socketId) => {
  const links = Object.keys(assignprofile);
  for (const val of links) {
    if (assignprofile[val] == socketId) {
      return val;
    }
  }
};
