
// This file now re-exports functionality from smaller, more focused files
import { addSegmentInteractions } from './route-interactions';
import { addRouteSegment } from './route-layer-utils';
import { addPopupStyles, removePopupStyles } from './popup-utils';

// Re-export everything for backward compatibility
export { 
  addRouteSegment,
  addSegmentInteractions,
  addPopupStyles,
  removePopupStyles
};
