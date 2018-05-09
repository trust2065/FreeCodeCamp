export function SETNAME(name = 'name not assigned by caller') {
  return {
    type: 'SETNAME',
    payload: {
      name: name
    }
  };
}
