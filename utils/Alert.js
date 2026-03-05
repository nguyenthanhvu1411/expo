import { Platform, Alert as RNAlert } from 'react-native';

/**
 * Cross-platform Alert utility
 * Hoạt động trên cả React Native và Web
 */
const Alert = {
  alert: (title, message, buttons = [{ text: 'OK' }], options = {}) => {
    if (Platform.OS === 'web') {
      // Trên web, dùng window.alert và window.confirm
      const buttonText = buttons.map(b => b.text).join(' / ');
      const fullMessage = message ? `${message}\n\n(${buttonText})` : title;
      
      if (buttons.length === 1) {
        // Chỉ có 1 button -> dùng alert
        window.alert(`${title}\n\n${message || ''}`);
        if (buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else if (buttons.length === 2) {
        // Có 2 buttons -> dùng confirm
        const confirmed = window.confirm(`${title}\n\n${message || ''}`);
        if (confirmed && buttons[1].onPress) {
          buttons[1].onPress();
        } else if (!confirmed && buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else {
        // Nhiều hơn 2 buttons -> fallback về alert với text mô tả
        window.alert(fullMessage);
        if (buttons[0].onPress) {
          buttons[0].onPress();
        }
      }
    } else {
      // Trên mobile, dùng Alert native
      RNAlert.alert(title, message, buttons, options);
    }
  },
};

export default Alert;