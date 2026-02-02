import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { api } from "../api/client";
import { useState } from "react";

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
                        placeholderTextColor="#475569"
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
        backgroundColor: "#0f172a",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        marginBottom: 40,
    },
    greeting: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#f8fafc",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#94a3b8",
    },
    inputContainer: {
        backgroundColor: "#1e293b",
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#334155",
    },
    label: {
        color: "#22c55e",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    input: {
        backgroundColor: "#0f172a",
        borderRadius: 8,
        padding: 16,
        color: "#fff",
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#475569",
    },
    button: {
        backgroundColor: "#22c55e",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
