import React from "react";
import { ScrollView, StyleSheet, View, Button, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { TextInput } from "react-native-gesture-handler";

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingText: true,
      showLyr: false,
      songObject: {},
      songsArr: [],
      songLyrics: ""
    };
    setInterval(
      () =>
        this.setState(previousState => ({
          isShowingText: !previousState.isShowingText
        })),
      1000
    );
  }
  static navigationOptions = {
    title: "Links"
  };

  next = () => {
    this.setState({ showLyr: true });
  };

  submit = () => {
    const songName = this.state.tit;
    // const lyrics = this.state.lyr;
    // this.state.songsArr.push('song: ' + songName + ' ,lyrics:' + lyrics);
    // alert(this.state.songsArr);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>
          {!this.state.showLyr ? "Enter your new songs name below:" : ""}
        </Text>
        <TextInput
          value={this.state.tit ? this.state.tit : ""}
          onChangeText={tit => {
            this.setState({ tit });
          }}
        />
        <Button
          title={!this.state.showLyr ? "next" : "update"}
          onPress={this.next}
        />
        <Text>{this.state.tit}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
