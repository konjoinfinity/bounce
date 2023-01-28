import React, { Component } from "react";
import { View, AppRegistry, Dimensions, PanResponder } from "react-native";
import { Surface } from "gl-react-native";
import {GL} from "gl-react";
import Triangle from "./Triangle";
const window = Dimensions.get("window");

var shaders = GL.Shaders.create({
  myEffect: {
    frag: `
    precision highp float;
    varying vec2 uv;
    uniform float ratio;
    uniform float radius;
    uniform vec2 location;
    uniform float angle;
    uniform sampler2D image;
    void main () {
    float sin_factor = sin(angle);
    float cos_factor = cos(angle);
    mat2 rotation = mat2(cos_factor, sin_factor, -sin_factor, cos_factor);
    vec2 ballLocation = location * rotation;
       vec2 currentLocation = vec2(uv.x, uv.y / ratio) * rotation;
       vec2 result = (ballLocation - currentLocation + radius) / (radius * 2.0);
       gl_FragColor = texture2D(image, result);
    }
    `
  },
})

function start() {
  var gravity = new b2Vec2(0.0, -2000000.0);
  world = new b2World(gravity, true);
  ball = new BallBody(someInitialPosition, radius, world);
  // vertical walls
  new Wall(new b2Vec2(0, 0), new b2Vec2(0, 2.0), world);
  new Wall(new b2Vec2(0.5, 0), new b2Vec2(0.5, 2.0), world);
  // horizontal walls
  new Wall(new b2Vec2(0, 0.03), new b2Vec2(1, 0.03), world);
  new Wall(new b2Vec2(0, 0.5 / ratio), new b2Vec2(1, 0.5 / ratio), world);
}
function move() {
  world.Step(step, 1, 1);
}

export default class Bounce extends Component {
  render() {
    console.log("I`m redrawn!");
    return (
      <View>
        <Surface width={window.width} height={window.height}>
          <GL.Node shader={shaders.myEffect} />
        </Surface>
      </View>
    );
  }

  componentDidUpdate() {
    var now = Date.now();
    lastRendered = now;
    var diff = now - lastRendered;
    var timeout = diff >= 16 ? 0 : 16 - diff;
    setTimeout(() => {
      this.forceUpdate();
    }, timeout);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.handleTouch(evt);
      },
    });
  }
  handleTouch(event) {
    var touchX = event.nativeEvent.locationX / window.width;
    var touchY = 1.0 - event.nativeEvent.locationY / window.height;
    if (
      this.distance(
        touchX,
        touchY / ratio,
        ball.position()[0],
        ball.position()[1]
      ) < radius
    ) {
      this.kickBall(touchX > ball.position()[0] ? -50.0 : 50.0, 500.0);
    }
  }
  kickBall(x, y) {
    ball.applyImpulse(new b2Vec2(x, y));
  }
  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
}
AppRegistry.registerComponent("Bounce", () => Bounce);
