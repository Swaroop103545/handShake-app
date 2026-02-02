import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert, Platform } from "react-native";
import { api } from "./frontend/src/api/client";
import { socket } from "./frontend/src/socket/socket";
import { HomeScreen } from "./frontend/src/screens/HomeScreen";
import { IncomingScreen } from "./frontend/src/screens/IncomingScreen";
import { ActiveStateScreen } from "./frontend/src/screens/ActiveStateScreen";

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

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('handshake-calls', {
        name: 'Handshake Calls',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#22c55e',
        sound: 'default',
      });
    }

    // Register with Socket
    socket.emit("register", userId);

    // Register Push Token
    Notifications.getExpoPushTokenAsync().then((t) => {
      api.post("/register-push", { userId, token: t.data });
    });

    // 1. Listen for incoming notifications while app is in FOREGROUND
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

    // 2. Listen for notification interactions (BACKGROUND)
    const responseListener = Notifications.addNotificationResponseReceivedListener((res) => {
      handleNotificationData(res.notification.request.content.data);
    });

    // 3. Handle cold boot from notification (KILLED)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        handleNotificationData(response.notification.request.content.data);
      }
    });

    // Helper to process notification data
    const handleNotificationData = (data: any) => {
      if (data && data.challengeId) {
        if (data.type === "HANDSHAKE_RESPONSE" && data.accepted) {
          setActiveSession(data.challengeId as string);
        } else {
          setIncoming(data.challengeId as string);
        }
      }
    };

    // 4. Socket Listeners
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

    return () => {
      socket.off("challenge_received");
      socket.off("challenge_response");
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
            placeholderTextColor="#475569"
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
    backgroundColor: "#0f172a",
    justifyContent: "center",
  },
  loginInner: {
    padding: 30,
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 18,
    color: "#94a3b8",
    marginBottom: 40,
  },
  loginInput: {
    width: "100%",
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 20,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#334155",
  }
});
