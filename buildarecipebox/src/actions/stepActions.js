function addStep(steps) {
  let newStep;

  if (steps.length === 0) {
    newStep = 1;
  } else {
    newStep = steps[steps.length - 1].step + 1;
  }
  return {
    type: 'ADD_STEP',
    payload: newStep
  };
}
