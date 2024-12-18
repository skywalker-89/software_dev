// Fix Leaflet prototype typing
import "leaflet";

declare module "leaflet" {
  namespace Icon {
    interface Default {
      _getIconUrl?: () => string;
    }
  }
}
