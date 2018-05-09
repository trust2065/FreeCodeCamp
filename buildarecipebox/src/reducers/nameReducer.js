export default function reducer(
  state = {
    name: { name: 'default name' }
  },
  action
) {
  switch (action.type) {
    case 'SETNAME':
      return { ...state, name: action.payload };
    default:
      return state;
  }
}
