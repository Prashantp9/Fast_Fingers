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
