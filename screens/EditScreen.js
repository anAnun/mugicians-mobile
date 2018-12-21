import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  View,
  Button,
  Text
} from "react-native";
import { ExpoLinksView } from "@expo/samples";
import { TextInput } from "react-native-gesture-handler";

export default class EditScreen extends React.Component {
  static navigationOptions = {
    title: "Edit"
  };
  constructor(props) {
    super(props);
    this._isMounted = false;
    const data = JSON.parse(this.props.navigation.state.params.data);

    this.state = {
      songId: data.id,
      songLyrics: data.lyrics,
      songName: data.name,
      songInfo: data.info,
      deleteOption: false
    };
  }

  static navigationOptions = {
    title: "Edit"
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const data = JSON.parse(nextProps.navigation.state.params.data);

    //if the id has changed then the song has changed, update it
    if (data.id && data.id !== prevState.songId) {
      return {
        songId: data.id,
        songLyrics: data.lyrics,
        songName: data.name,
        songInfo: data.info
      };
    }

    // Return null if the state hasn't changed
    return {
      songId: prevState.songId,
      songLyrics: prevState.songLyrics,
      songName: prevState.songName,
      songInfo: prevState.songInfo
    };
  }

  confirmDelete = () => {
    this.setState({
      deleteOption: true
    });
  };

  deleteSong = () => {
    this.setState({
      deleteOption: false
    });
    AsyncStorage.removeItem(this.state.songId + "_object", () => {
      const { navigate } = this.props.navigation;
      alert("Deleted!");
      navigate("Home", { home: true });
    });
  };

  submit = () => {
    let idO = this.state.songId + "_object";

    let idObj = {
      id: this.state.songId,
      name: this.state.songName,
      lyrics: this.state.songLyrics,
      info: this.state.songInfo
    };

    AsyncStorage.removeItem(this.props.navigation.state.params.data, () => {
      AsyncStorage.setItem(idO, JSON.stringify(idObj), () => {
        AsyncStorage.getItem(idO, (err, result) => {
          const { navigate } = this.props.navigation;
          alert("Created!");
          console.log("in async", idO, idObj);
          navigate("Home", { home: true });
        });
      });
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* <Text>songId: {this.state.songId}</Text> */}
        <Text>songName: {this.state.songName}</Text>
        <Text>songLyrics: {this.state.songLyrics}</Text>
        <Text>songInfo: {this.state.songInfo}</Text>

        {!this.state.deleteOption ? (
          <View>
            <Text>Song:</Text>
            <TextInput
              name="songName"
              value={this.state.songName}
              onChangeText={e => {
                this.setState({ songName: e });
              }}
            />
            <Text>lyrics:</Text>
            <TextInput
              name="songLyrics"
              defaultValue={this.state.songLyrics}
              onChangeText={e => {
                this.setState({ songLyrics: e });
              }}
            />

            <Text>Additional info</Text>
            <TextInput
              name="additionalInfo"
              defaultValue={this.state.songInfo}
              onChangeText={e => {
                this.setState({ songInfo: e });
              }}
            />
            <Button title="Submit" onPress={this.submit} />
            <Button title="delete" onPress={this.confirmDelete} />
          </View>
        ) : (
          <View>
            <Text>Are you sure?</Text>
            <Text>Press DELETE to delete song</Text>
            <Button title="Delete" onPress={this.deleteSong} />
            <Button
              title="Cancel"
              onPress={() => {
                this.setState({ deleteOption: false });
              }}
            />
          </View>
        )}
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
