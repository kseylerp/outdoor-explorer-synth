
// Define colors for different transportation modes
export const modeColors = {
  walking: '#4CAF50',
  hiking: '#8BC34A',
  cycling: '#2196F3',
  driving: '#FF9800',
  transit: '#9C27B0',
  default: '#757575'
};

// Define line styles for different transportation modes
export const modeLineStyles = {
  walking: {
    width: 4,
    dashArray: [1, 1]
  },
  hiking: {
    width: 3,
    dashArray: [2, 1]
  },
  cycling: {
    width: 3,
    dashArray: []
  },
  driving: {
    width: 5,
    dashArray: []
  },
  transit: {
    width: 5,
    dashArray: [3, 2]
  },
  default: {
    width: 4,
    dashArray: []
  }
};
