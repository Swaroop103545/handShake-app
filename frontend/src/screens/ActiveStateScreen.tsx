import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../utils/theme";
import { Sizes } from "../utils/sizes";

export function ActiveStateScreen({ userId, challengeId, onExit }: { userId: string, challengeId: string, onExit: () => void }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Game Session Active 🎮</Text>
                <Text style={styles.subtitle}>You are now synchronously connected.</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Connected as: {userId}</Text>
                </View>
                <Text style={styles.info}>Challenge ID: {challengeId}</Text>
            </View>

            <TouchableOpacity style={styles.exitButton} onPress={onExit}>
                <Text style={styles.exitButtonText}>End Session</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: Sizes.spacing.md,
    },
    content: {
        alignItems: "center",
        marginBottom: Sizes.spacing.xxl,
    },
    title: {
        fontSize: Sizes.font.xl,
        fontWeight: "bold",
        color: "#f8fafc",
        marginBottom: Sizes.spacing.sm,
        textAlign: "center",
    },
    subtitle: {
        fontSize: Sizes.font.lg,
        color: Colors.textMuted,
        marginBottom: Sizes.spacing.xl,
        textAlign: "center",
    },
    statusBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Sizes.spacing.md,
        paddingVertical: Sizes.spacing.sm,
        borderRadius: Sizes.radius.xl,
        marginBottom: Sizes.spacing.md,
    },
    statusText: {
        color: Colors.text,
        fontWeight: "bold",
        fontSize: Sizes.font.base,
    },
    info: {
        fontSize: Sizes.font.sm,
        color: Colors.textSubtle,
    },
    exitButton: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: Sizes.spacing.xxl,
        paddingVertical: Sizes.spacing.base,
        borderRadius: Sizes.radius.xl,
        elevation: 5,
        shadowColor: Colors.backgroundDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    exitButtonText: {
        color: Colors.text,
        fontSize: Sizes.font.lg,
        fontWeight: "bold",
    },
});
