import React from "react";
import { ScrollView, StyleSheet, View, Button, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { TextInput } from "react-native-gesture-handler";

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    // this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isShowingText: true,
      songObject: {},
      songName: "",
      songsArr: [],
      songLyrics: ""
    };

    // Toggle the state every second
    setInterval(
      () =>
        this.setState(previousState => ({
          isShowingText: !previousState.isShowingText
        })),
      1000
    );
  }

  handleInputChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;

    this.setState({ [name]: value });
  }

  static navigationOptions = {
    title: "Links"
  };

  submit = () => {
    const songName = this.state.songName;
    const lyrics = this.state.songLyrics;

    this.state.songsArr.push("song: " + songName + "," + lyrics);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
         * content, we just wanted to provide you with some helpful links */}
        {/* <ExpoLinksView /> */}
        <Text>Song:</Text>
        <TextInput
          value={this.state.songName}
          onChange={e => {
            this.setState({ songName: e.target.value });
          }}
        />
        <Text>lyrics:</Text>
        <TextInput
          name="songLyrics"
          value={this.state.songLyrics}
          onChange={e => {
            this.setState({ songLyrics: e.target.value });
          }}
        />
        <Button title="submit" onPress={() => this.submit()}>
          submit
        </Button>

        <Text>
          {this.state.songsArr.map(song => {
            <Text key={song.songName}>
              <Button>{song.songName}</Button>
              <Text>{song.lyrics}</Text>
            </Text>;
          })}
        </Text>
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
