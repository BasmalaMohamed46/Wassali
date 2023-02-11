const allStates = {
    Processing,
    Confirmed,
    Accepted,
    PickedUp,
    OnMyWay,
    Delivered
  };
  
  const states = Object.keys(allStates);
  
  module.exports = {
    states
  };
  