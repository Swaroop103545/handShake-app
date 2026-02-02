import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { api } from "../api/client";

export function IncomingScreen({ challengeId, onResponse }: { challengeId: string, onResponse: (accepted: boolean) => void }) {
    const respond = async (accepted: boolean) => {
        try {
            await api.post("/challenge/respond", { challengeId, accepted });
            onResponse(accepted);
        } catch (error) {
            console.error("Failed to respond to challenge:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>INCOMING CHALLENGE</Text>
                <Text style={styles.id}>ID: {challengeId.slice(-6)}</Text>
            </View>

            <View style={styles.centerCircle}>
                <Text style={styles.icon}>🎮</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={() => respond(false)}
                >
                    <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => respond(true)}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 50,
    },
    header: {
        alignItems: "center",
        marginTop: 40,
    },
    label: {
        color: "#94a3b8",
        fontSize: 14,
        letterSpacing: 4,
        marginBottom: 8,
    },
    id: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "300",
    },
    centerCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#1e293b",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    icon: {
        fontSize: 60,
    },
    footer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    button: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    acceptButton: {
        backgroundColor: "#22c55e",
    },
    declineButton: {
        backgroundColor: "#ef4444",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
