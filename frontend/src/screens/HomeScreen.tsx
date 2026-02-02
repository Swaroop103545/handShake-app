import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { api } from "../api/client";
import { useState } from "react";
import { Colors } from "../utils/theme";
import { Sizes } from "../utils/sizes";

export function HomeScreen({ userId }: { userId: string }) {
    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!target) return;
        setLoading(true);
        try {
            await api.post("/challenge", { from: userId, to: target });
            alert("Challenge Sent!");
        } catch (error) {
            alert("Failed to send challenge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inner}
            >
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome, {userId}</Text>
                    <Text style={styles.subtitle}>Who do you want to challenge today?</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>TARGET USER ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Player2"
                        placeholderTextColor={Colors.textSubtle}
                        onChangeText={setTarget}
                        value={target}
                    />
                    <TouchableOpacity
                        style={[styles.button, !target && styles.buttonDisabled]}
                        onPress={send}
                        disabled={loading || !target}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Sending..." : "Send Challenge 🚀"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        padding: Sizes.spacing.lg,
    },
    header: {
        marginBottom: Sizes.spacing.xxl,
    },
    greeting: {
        fontSize: Sizes.font.xl,
        fontWeight: "bold",
        color: "#f8fafc",
        marginBottom: Sizes.spacing.sm,
    },
    subtitle: {
        fontSize: Sizes.font.base,
        color: Colors.textMuted,
    },
    inputContainer: {
        backgroundColor: Colors.card,
        padding: Sizes.spacing.lg,
        borderRadius: Sizes.radius.lg,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
    },
    label: {
        color: Colors.primary,
        fontSize: Sizes.font.xs,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: Sizes.spacing.base,
    },
    input: {
        backgroundColor: Colors.background,
        borderRadius: Sizes.radius.sm,
        padding: Sizes.spacing.base,
        color: Colors.text,
        fontSize: Sizes.font.base,
        marginBottom: Sizes.spacing.md,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: Sizes.radius.sm,
        padding: Sizes.spacing.base,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.text,
        fontSize: Sizes.font.lg,
        fontWeight: "bold",
    },
});
