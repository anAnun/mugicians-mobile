import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import EditScreen from "../screens/EditScreen";
import CreateScreen from "../screens/CreateScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-home${focused ? "" : "-outline"}`
          : "md-home"
      }
    />
  )
};

// const EditStack = createStackNavigator({
//   Edit: EditScreen
// });

// EditStack.navigationOptions = {
//   tabBarLabel: "Edit",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === "ios" ? "ios-link" : "md-link"}
//     />
//   )
// };

const CreateStack = createStackNavigator({
  Create: CreateScreen
});

CreateStack.navigationOptions = {
  tabBarLabel: "Create",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-musical-notes" : "md-musical-notes"}
    />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  // EditStack,
  CreateStack
});
