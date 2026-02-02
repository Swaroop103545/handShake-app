import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert, Platform } from "react-native";
import { api } from "./frontend/src/api/client";
import { socket } from "./frontend/src/socket/socket";
import { HomeScreen } from "./frontend/src/screens/HomeScreen";
import { IncomingScreen } from "./frontend/src/screens/IncomingScreen";
import { ActiveStateScreen } from "./frontend/src/screens/ActiveStateScreen";
import { Colors } from "./frontend/src/utils/theme";
import { Sizes } from "./frontend/src/utils/sizes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [userId, setUserId] = useState("");
  const [incoming, setIncoming] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('handshake-calls', {
        name: 'Handshake Calls',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: Colors.primary,
        sound: 'default',
      });
    }

    socket.emit("register", userId);

    Notifications.getExpoPushTokenAsync().then((t) => {
      api.post("/register-push", { userId, token: t.data });
    });

    const foregroundListener = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      if (data && data.challengeId) {
        if (data.type === "HANDSHAKE_RESPONSE") {
          if (data.accepted) setActiveSession(data.challengeId as string);
          else {
            Alert.alert("Declined", "Your challenge was declined.");
            setIncoming(null);
          }
        } else {
          setIncoming(data.challengeId as string);
        }
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((res) => {
      handleNotificationData(res.notification.request.content.data);
    });
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        handleNotificationData(response.notification.request.content.data);
      }
    });

    const handleNotificationData = (data: any) => {
      if (data && data.challengeId) {
        if (data.type === "HANDSHAKE_RESPONSE" && data.accepted) {
          setActiveSession(data.challengeId as string);
        } else {
          setIncoming(data.challengeId as string);
        }
      }
    };

    socket.on("challenge_received", (d) => {
      setIncoming(d.challengeId);
    });

    socket.on("challenge_response", (d) => {
      if (d.accepted) {
        setActiveSession(d.challengeId);
      } else {
        Alert.alert("Declined", "Your challenge was declined.");
        setIncoming(null);
      }
    });

    socket.on("session_terminated", () => {
      setActiveSession(null);
      Alert.alert("Session Ended", "The other player has ended the session.");
    });

    return () => {
      socket.off("challenge_received");
      socket.off("challenge_response");
      socket.off("session_terminated");
      foregroundListener.remove();
      responseListener.remove();
    };
  }, [userId]);

  const handleResponse = (accepted: boolean) => {
    if (accepted && incoming) {
      setActiveSession(incoming);
    }
    setIncoming(null);
  };

  const handleExit = () => {
    if (activeSession) {
      socket.emit("session_end", { challengeId: activeSession });
    }
    setActiveSession(null);
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.loginInner}>
          <Text style={styles.loginTitle}>Handshake</Text>
          <Text style={styles.loginSubtitle}>Enter your unique ID to start</Text>
          <TextInput
            placeholder="User ID (e.g. Player1)"
            placeholderTextColor={Colors.textSubtle}
            style={styles.loginInput}
            onChangeText={setUserId}
            autoCapitalize="none"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (activeSession) {
    return <ActiveStateScreen userId={userId} challengeId={activeSession} onExit={handleExit} />;
  }

  if (incoming) {
    return <IncomingScreen challengeId={incoming} onResponse={handleResponse} />;
  }

  return <HomeScreen userId={userId} />;
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  loginInner: {
    padding: Sizes.spacing.xl,
    alignItems: "center",
  },
  loginTitle: {
    fontSize: Sizes.font.xxl,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: Sizes.spacing.sm,
  },
  loginSubtitle: {
    fontSize: Sizes.font.lg,
    color: Colors.textMuted,
    marginBottom: Sizes.spacing.xxl,
  },
  loginInput: {
    width: "100%",
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.radius.base,
    fontSize: Sizes.font.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  }
});
