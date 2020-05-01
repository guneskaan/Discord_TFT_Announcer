import twisted from 'twisted'

const availableRegions = ["na", "euw", "eun", "tr", "br", "kr", "oc", "ru", "jp"];
const Constants = twisted.Constants;

function regionArgToTwistedRegion(regionArg){
    switch(regionArg){
      case 'na':
        return Constants.Regions.AMERICA_NORTH;
      case 'eun':
        return Constants.Regions.EU_EAST;
      case 'euw':
        return Constants.Regions.EU_WEST;
      case 'tr':
        return Constants.Regions.TURKEY;
      case 'br':
        return Constants.Regions.BRAZIL;
      case 'kr':
        return Constants.Regions.KOREA;
      case 'oc':
        return Constants.Regions.OCEANIA;
      case 'ru':
        return Constants.Regions.RUSSIA;
      case 'jp':
        return Constants.Regions.JAPAN;
      default:
        return;
    }
}

export {availableRegions, regionArgToTwistedRegion};
