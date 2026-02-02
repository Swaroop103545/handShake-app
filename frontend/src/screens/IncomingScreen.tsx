import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { api } from "../api/client";
import { Colors } from "../utils/theme";
import { Sizes } from "../utils/sizes";

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
        backgroundColor: Colors.backgroundDark,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Sizes.spacing.huge,
    },
    header: {
        alignItems: "center",
        marginTop: Sizes.spacing.xxl,
    },
    label: {
        color: Colors.textMuted,
        fontSize: Sizes.font.sm,
        letterSpacing: 4,
        marginBottom: Sizes.spacing.sm,
    },
    id: {
        color: Colors.text,
        fontSize: Sizes.font.xl,
        fontWeight: "300",
    },
    centerCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: Colors.card,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    icon: {
        fontSize: Sizes.font.huge,
    },
    footer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        paddingHorizontal: Sizes.spacing.md,
        marginBottom: Sizes.spacing.xxl,
    },
    button: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        shadowColor: Colors.backgroundDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    acceptButton: {
        backgroundColor: Colors.primary,
    },
    declineButton: {
        backgroundColor: Colors.secondary,
    },
    buttonText: {
        color: Colors.text,
        fontWeight: "600",
        fontSize: Sizes.font.base,
    },
});
