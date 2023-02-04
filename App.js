import React, { Component } from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions} from 'react-native';
import BouncingPreloader from './Bounce';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync()

export default class Bounce extends Component {

  render(){
    return (
      <View style={{display: "flex", alignItems: "center"}}> 
    
<BouncingPreloader
  icons={[
    require('./assets/apple.png'),
    require('./assets/bananas.png'),
    require('./assets/cherries.png'),
    require('./assets/apple.png'),
    require('./assets/mango.png'),
    require('./assets/orange-juice.png'),
    require('./assets/pineapple.png'),
    require('./assets/strawberry.png'),
    require('./assets/watermelon.png'),
    require('./assets/pear.png'),
  ]}
  leftRotation="-540deg"
  rightRotation="720deg"
  leftDistance={Dimensions.get('screen').height}
  rightDistance={Dimensions.get('screen').height}
  speed={2000}
  size={125} />
  </View>
    );
  }
}
