import { StackActions } from '@react-navigation/native';

class NavigationService {
  navigator;

  setTopLevelNavigator = navigatorRef => {
    this.navigator = navigatorRef;
  };

  navigate = (name, params?) => {
    this.navigator.current?.navigate(name, params);
  }

  push = (routeName, params = {}, action = null) => {
    if (!this.navigator) {
      throw new Error('navigator has not been initialized yet');
    }
    this.navigator.current?.dispatch(
      StackActions.push(routeName, {
        name: routeName,
        ...params,
        action,
      }),
    );
  };

  goBack = () => {
    this.navigator.current?.goBack()
  }
}

export default new NavigationService();
