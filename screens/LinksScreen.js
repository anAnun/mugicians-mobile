import React from "react";
import { ScrollView, StyleSheet, View, Button, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { TextInput } from "react-native-gesture-handler";

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingText: true,
      songObject: {},
      songsArr: [],
      songLyrics: "",
      songName: "",
      additionalInfo: ""
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

  guid = () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    const id =
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4();
    id.toString();
    this.setState({ songId: id }, this.submit);
  };

  submit = () => {
    if (!this.state.songId) {
      this.guid();
    } else {
      const songId = this.state.songId;
      const songName = this.state.songName;
      const lyrics = this.state.songLyrics;
      const additionalInfo = this.state.additionalInfo;
      this.state.songsArr.push(
        "{songId: " +
          songId +
          ", song: " +
          songName +
          ", lyrics: " +
          lyrics +
          ", info: " +
          additionalInfo +
          "}"
      );
      const asyncId =
        "ID" +
        songId +
        "_object = {name: " +
        songName +
        ", lyrics: " +
        lyrics +
        ", additionalInfo: " +
        additionalInfo +
        "};";

      AsyncStorage.setItem(songId.toString(), asyncId, () => {
        AsyncStorage.getItem(songId, (err, result) => {
          alert(result);
        });
      });

      //alert(this.state.songsArr);
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Song:</Text>
        <TextInput
          name="songName"
          value={this.state.tit}
          onChangeText={tit => {
            this.setState({ songName: tit });
          }}
        />
        <Text>lyrics:</Text>
        <TextInput
          name="songLyrics"
          value={this.state.lyr}
          onChangeText={lyr => {
            this.setState({ songLyrics: lyr });
          }}
        />
        <Text>Additional info</Text>
        <TextInput
          name="additionalInfo"
          value={this.state.add}
          onChangeText={add => {
            this.setState({ additionalInfo: add });
          }}
        />
        <Button title="submit" onPress={this.submit}>
          submitt
        </Button>

        <Text>{this.state.songName}</Text>
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
