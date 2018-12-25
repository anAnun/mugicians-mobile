import React from "react";
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
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

  componentDidMount() {
    /* Evidently, resizing triggers something that makes copy-paste work.
     * Timeout is mandatory for this hack, doesn't work otherwise.
     */
    setTimeout(() => {
      this.setState({ testWidth: "100%" });
    }, 100);
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
    const data = JSON.parse(this.props.navigation.state.params.data);
    AsyncStorage.removeItem(data.name + data.id + "_object", () => {
      const { navigate } = this.props.navigation;
      alert("Deleted!");
      console.log("WHATTTTT", data.id);
      navigate("Home", { home: true });
    });
  };

  goBack = () => {
    const { navigate } = this.props.navigation;
    navigate("Home");
  };

  deleteBeforePost = () => {
    if (!this.state.songName) {
      alert("Song Name Cannot Be Blank!");
    }
    if (this.state.songName.length > 0) {
      const data = JSON.parse(this.props.navigation.state.params.data);
      AsyncStorage.removeItem(
        data.name + data.id + "_object",
        this.setState({ goodToGo: true }, this.guid())
      );
    }
  };

  //first call  then call delete item, then guid, then set item
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
    this.setState({ newSongId: id }, this.submit);
  };

  submit = () => {
    let idO = this.state.songName + this.state.newSongId + "_object";

    let idObj = {
      name: this.state.songName,
      id: this.state.newSongId,
      lyrics: this.state.songLyrics,
      info: this.state.songInfo
    };

    AsyncStorage.setItem(idO, JSON.stringify(idObj), () => {
      AsyncStorage.getItem(idO, (err, result) => {
        const { navigate } = this.props.navigation;
        alert("Updated!");
        navigate("Home", { home: true });
      });
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            color: "#c0c0c0",
            width: 100,
            marginTop: 20,
            alignSelf: "flex-end"
          }}
        >
          <TouchableOpacity onPress={this.goBack} style={styles.submitButton}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
        {!this.state.deleteOption ? (
          <View>
            {this.state.songName ? (
              <Text style={styles.text}>Song:</Text>
            ) : (
              <Text style={styles.textValidation}>
                Song: Please enter a song name!
              </Text>
            )}
            <TextInput
              name="songName"
              style={styles.textInputSong}
              value={this.state.songName}
              onChangeText={e => {
                this.setState({ songName: e });
              }}
            />
            <Text style={styles.text}>Lyrics:</Text>
            <TextInput
              name="songLyrics"
              multiline={true}
              defaultValue={this.state.songLyrics}
              style={styles.textInputLyrics}
              onChangeText={e => {
                this.setState({ songLyrics: e });
              }}
            />

            <Text style={styles.text}>Additional info</Text>
            <TextInput
              name="additionalInfo"
              multiline={true}
              style={styles.textInputLyrics}
              defaultValue={this.state.songInfo}
              onChangeText={e => {
                this.setState({ songInfo: e });
              }}
            />
            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                alignSelf: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={this.deleteBeforePost}
                style={styles.submitButton}
              >
                <Text style={styles.textButton}>Update</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                alignSelf: "flex-end",
                marginBottom: 300
              }}
            >
              <TouchableOpacity
                onPress={this.confirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.confirmContainer}>
            <Text style={styles.textValidation}>Are you sure?</Text>
            <Text style={styles.textValidation}>
              Press DELETE to delete song
            </Text>
            <View
              style={{
                color: "#c0c0c0",
                width: 150,
                marginTop: 20,
                marginBottom: 30,
                alignSelf: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={this.deleteSong}
                style={styles.deleteButton}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            </View>
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
  backButton: {
    fontSize: 15,
    color: "#c0c0c0",
    textAlign: "center"
  },
  confirmContainer: {
    marginTop: 30
  },
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: "#000000"
  },
  deleteButton: {
    backgroundColor: "#ED553B",
    padding: 10,
    fontSize: 17
  },
  submitButton: {
    backgroundColor: "#068587",
    padding: 10,
    fontSize: 17
  },
  text: {
    fontSize: 20,
    color: "#F0F0F0"
  },
  textButton: {
    fontSize: 20,
    color: "#c0c0c0",
    textAlign: "center"
  },
  textInputLyrics: {
    borderColor: "#068587",
    borderWidth: 2,
    backgroundColor: "#C0C0C0",
    margin: 10
  },
  textInputSong: {
    borderColor: "#068587",
    borderWidth: 2,
    backgroundColor: "#C0C0C0",
    width: 150,
    margin: 10
  },
  textValidation: {
    color: "#ED553B",
    fontSize: 20
  }
});
