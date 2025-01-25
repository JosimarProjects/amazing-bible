import React from "react";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";

export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Amazing Bible</Text>
      </View>   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "blue",
  },
  header: {
    height: 80,
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center",     // Centraliza horizontalmente
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
