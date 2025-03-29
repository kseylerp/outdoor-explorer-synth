
import Foundation
import Capacitor
import MapKit

@objc(NativeNavigationPlugin)
public class NativeNavigationPlugin: CAPPlugin {
    
    @objc func startNavigation(_ call: CAPPluginCall) {
        guard let startLat = call.getDouble("startLat"),
              let startLng = call.getDouble("startLng"),
              let endLat = call.getDouble("endLat"),
              let endLng = call.getDouble("endLng"),
              let mode = call.getString("mode"),
              let tripTitle = call.getString("tripTitle") else {
            call.reject("Missing required parameters")
            return
        }
        
        let startCoordinate = CLLocationCoordinate2D(latitude: startLat, longitude: startLng)
        let endCoordinate = CLLocationCoordinate2D(latitude: endLat, longitude: endLng)
        
        // Create placemark for destination
        let endPlacemark = MKPlacemark(coordinate: endCoordinate)
        let endMapItem = MKMapItem(placemark: endPlacemark)
        endMapItem.name = tripTitle
        
        // Set transportation type
        let transportType: MKDirectionsTransportType = (mode == "driving") ? .automobile : .walking
        
        // Options for the map directions
        let launchOptions = [
            MKLaunchOptionsDirectionsModeKey: transportType.rawValue,
            MKLaunchOptionsShowsTrafficKey: true
        ] as [String : Any]
        
        // Start navigation
        DispatchQueue.main.async {
            if MKMapItem.openMaps(with: [MKMapItem.forCurrentLocation(), endMapItem], launchOptions: launchOptions) {
                call.resolve([
                    "success": true,
                    "message": "Navigation started successfully"
                ])
            } else {
                call.reject("Failed to launch Maps app")
            }
        }
    }
    
    @objc func isNavigationAvailable(_ call: CAPPluginCall) {
        // Check if Maps app is available
        let mapURL = URL(string: "maps://")!
        let canOpenMaps = UIApplication.shared.canOpenURL(mapURL)
        
        call.resolve([
            "available": canOpenMaps
        ])
    }
}
