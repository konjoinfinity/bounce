import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity
} from "react-native";
import * as Haptics from 'expo-haptics';

export default class BouncingPreloader extends Component {
  state = {
    spinValue: new Animated.Value(0),
    yValue: new Animated.Value(0),
    currentIndex: 0,
    icons: this.props.icons.map(
      icon => (typeof icon === "string" ? { uri: icon } : icon)
    ),
    iconLeft: null,
    iconRight: null,
    bounce: true
  };

  componentDidMount() {
    this.changeIndex();
  }

  changeIndex() {
    const { currentIndex, icons } = this.state;
    const nextIndex = currentIndex + 1;
    this.setState(
      {
        iconLeft: icons[currentIndex * 2],
        iconRight: icons[currentIndex * 2 + 1],
        currentIndex: nextIndex >= icons.length / 2 ? 0 : nextIndex
      },
      () => {
        if(this.state.bounce == true) {
        this.startAnimation(() => this.changeIndex()); }
      }
    );
  }
  startAnimation(callback) {
    // this.setState({bounce: false})
    this.state.spinValue.setValue(0);
    this.state.yValue.setValue(0);
    Animated.timing(this.state.spinValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: this.props.speed * 2,
      easing: Easing.linear
    }).start();
    Animated.timing(this.state.yValue, {
      toValue: 1,
      useNativeDriver: true,
      duration: this.props.speed / 2,
      easing: Easing.bezier(0, 1, 1, 1)
    }).start(() => {
      Animated.timing(this.state.yValue, {
        delay: 5,
        toValue: 0,
        useNativeDriver: true,
        duration: this.props.speed / 2,
        easing: Easing.bezier(1, 0, 1, 1)
      }).start(() => {
        setTimeout(() => {
          callback && callback();
        }, 0);
      });
    });
  }
  render() {
    // console.log(this.state.yValue)
    const spinRight = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", this.props.rightRotation]
    });
    const spinLeft = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", this.props.leftRotation]
    });
    const translateYLeft = this.state.yValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.leftDistance, 0]
    });
    const translateYRight = this.state.yValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.rightDistance, 0]
    });
    const { iconLeft, iconRight } = this.state;
    const { size } = this.props;
    return (
      <View>
         <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
        <Animated.View
          style={{
            marginLeft: 60,
            transform: [{ translateY: translateYRight }]
          }}
        >
          {iconRight ? (
            <Animated.Image
              source={iconRight}
              style={[
                styles.image,
                {
                  transform: [{ rotate: spinRight }, { translateY: 5 }],
                  width: size,
                  height: size
                }
              ]}
              resizeMode="contain"
            />
          ) : null}
        </Animated.View>
        <Animated.View
          style={{
            marginTop: -100,
            marginLeft: 0,
            transform: [{ translateY: translateYLeft }]
          }}
        >
          {iconLeft ? (
            <Animated.Image
              source={iconLeft}
              resizeMode="contain"
              style={[
                styles.image,
                {
                  transform: [{ rotate: spinLeft }, { translateY: 5 }],
                  width: size,
                  height: size
                }
              ]}
            />
          ) : null}
        </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

BouncingPreloader.propTypes = {
  icons: PropTypes.array,
  leftRotation: PropTypes.string,
  rightRotation: PropTypes.string,
  leftDistance: PropTypes.number,
  rightDistance: PropTypes.number,
  speed: PropTypes.number,
  size: PropTypes.number
};
BouncingPreloader.defaultProps = {
  icons: [
    "https://www.shareicon.net/data/256x256/2016/05/04/759946_bar_512x512.png",
    "https://www.shareicon.net/data/256x256/2016/05/04/759908_food_512x512.png"
  ],
  leftRotation: "-680deg",
  rightRotation: "360deg",
  leftDistance: -180,
  rightDistance: -250,
  speed: 1200,
  size: 150
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 90
  }
});
