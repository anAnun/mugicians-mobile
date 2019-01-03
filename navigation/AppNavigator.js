import React from "react";
import { createSwitchNavigator } from "react-navigation";
import EditScreen from "../screens/EditScreen";
import MainTabNavigator from "./MainTabNavigator";

export default createSwitchNavigator({
  Main: MainTabNavigator,
  Edit: EditScreen
});
