import Constants from 'expo-constants';
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
const hash = require('object-hash');

const Globals: Globals = {
  font: {
    family: {
      bold: 'montserrat-bold',
      light: 'montserrat-light',
      regular: 'montserrat-regular',
      semibold: 'montserrat-semibold',
      spec: 'Noteworthy-Bold',
    },
    size: {
      small: 12,
      medium: 15,
      large: 18,
      headline: 24,
      xlarge: 30,
    },
    lineHeight: {
      large: 34,
      medium: 28,
      small: 22,
    },
  },
  platform: {
    os: {
      ios: 'ios',
      android: 'android',
    },
    deviceIdentifier: hash([
      Device.brand,
      Device.manufacturer,
      Device.modelName,
      Device.deviceYearClass,
      Device.totalMemory,
      Device.osVersion,
      Device.osBuildId,
    ]),
  },
  color: {
    main: '#00957E',
    bordercolor: '#707070',

    background: {
      dark: '#000000',
      grey: '#9F9F9F',
      light: '#FFFFFF',
      lightgrey: '#F6F7FB',
    },
    text: {
      default: '#393939',
      grey: '#9A9A9A',
      lightgrey: '#BAB4B4',
      lightergrey: '#ECEBED',
      light: '#FFFFFF',
    },
    button: {
      disabled: '#E1E2E6',
    },
    border: {
      lightgrey: '#ECEBED',
      darkgrey: '#BFB4B4',
    },
  },
  dimension: {
    padding: {
      xlarge: 70,
      large: 40,
      medium: 30,
      small: 20,
      mini: 14,
      tiny: 6,
    },
    margin: {
      large: 40,
      medium: 30,
      small: 20,
      mini: 14,
      tiny: 8,
    },
    borderRadius: {
      large: 36,
      small: 24,
      mini: 16,
      tiny: 6,
    },
    hitSlop: {
      regular: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    statusBarHeight:
      Constants.statusBarHeight + (Platform.OS === 'ios' ? 14 : 10),
    mainButtonWidth: Dimensions.get('window').width / 4.5,
    bottomTabBar: {
      backgroundHeight: Dimensions.get('window').width * 0.224,
      containerHeight: 25,
    },
  },
  format: {
    dateAndTime: {
      relativeTime: {
        future: '%s',
        past: '%s',
        s: 'now',
        ss: 'now',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1m',
        MM: '%dm',
        y: '1y',
        yy: '%dy',
      },
      calendar: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        lastWeek: 'dddd',
        sameElse: 'LL',
      },
    },
  },
};

export default Globals;

interface Globals {
  font: Font;
  platform: Platform;
  color: Color;
  dimension: Dimension;
  format: Format;
}

interface Font {
  size: {
    small: number;
    medium: number;
    large: number;
    headline: number;
    xlarge: number;
  };
  family: {
    bold: string;
    light: string;
    regular: string;
    semibold: string;
    spec: string;
  };
  lineHeight: {
    large: number;
    medium: number;
    small: number;
  };
}

interface Color {
  main: string;
  bordercolor: string;

  text: {
    default: string;
    grey: string;
    lightgrey: string;
    lightergrey: string;
    light: string;
  };
  background: {
    dark: string;
    grey: string;
    light: string;
    lightgrey: string;
  };
  button: {
    disabled: string;
  };
  border: {
    lightgrey: string;
    darkgrey: string;
  };
}

interface Dimension {
  padding: {
    xlarge: number;
    large: number;
    medium: number;
    small: number;
    mini: number;
    tiny: number;
  };
  margin: {
    large: number;
    medium: number;
    small: number;
    mini: number;
    tiny: number;
  };
  borderRadius: {
    large: number;
    small: number;
    mini: number;
    tiny: number;
  };
  hitSlop: {
    regular: object;
  };
  statusBarHeight: number;
  mainButtonWidth: number;
  bottomTabBar: {
    backgroundHeight: number;
    containerHeight: number;
  };
}

interface Platform {
  os: {
    ios: string;
    android: string;
  };
  deviceIdentifier: string;
}

interface Format {
  dateAndTime: {
    relativeTime: {
      [index: string]: any;
    };
    calendar: {
      [index: string]: any;
    };
  };
}
