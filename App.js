import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";

const STORAGE_KEY = "STORAGE_KEY";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  }, []);
  const custom = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (toDo) => setText(toDo);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    } else {
      const newToDos = { ...toDos, [Date.now()]: { text, working } };
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    }
  };

  const deleteToDo = async (key) => {
    Alert.alert("경고", "삭제하시겠습니까?", [
      {
        text: "취소",
      },
      {
        text: "삭제",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? theme.point : theme.grey }}>할 일</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={custom}>
          <Text style={{ ...styles.btnText, color: !working ? theme.point : theme.grey }}>반복 할 일</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType={"none"}
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "오늘 할 일을 입력하세요" : "반복 할 일을 입력해주세요"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Entypo name="circle-with-cross" size={24} color={theme.point} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 100,
    paddingVertical: 12,
  },
  btnText: {
    color: "white",
    fontSize: 32,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 15,
    borderBottomColor: theme.point,
    borderBottomWidth: 3,
  },
  toDo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    paddingVertical: 10,
  },
  toDoText: {
    paddingVertical: 3,
    color: "#333",
    fontSize: 17,
    fontWeight: "600",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 20,
  },
});
