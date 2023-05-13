export const assignProfile = function assignProfile(
  ProfileArray,
  PlayersArray
) {
  const object = {};
  for (const value of ProfileArray) {
    object[value] = "";
  }
  for (const value of PlayersArray) {
    const addedPlayers = Object.values(object);
    if (!addedPlayers.includes(value)) {
      for (const val in object) {
        if (!object[val]) {
          object[val] = value;
          break;
        }
      }
    }
  }
  return object;
};

export const playerProfileArray = [
  "profile1",
  "profile2",
  "profile3",
  "profile4",
  "profile5",
  "profile6",
];
// export const assignProfile = function assignProfile(prevObject, ProfileArray) {
//   const object = { ...prevObject };
//   for (const value of PlayersArray) {
//     const asingnedProfile = Object.values(object);
//     for (const image of ProfileArray) {
//       if (!asingnedProfile.includes(image)) {
//         object[value] = image;
//       }
//     }
//     return object;
//   }
// };
