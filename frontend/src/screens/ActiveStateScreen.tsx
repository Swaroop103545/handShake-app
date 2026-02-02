import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { socket } from "../socket/socket";
import { useState, useEffect } from "react";

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
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#f8fafc",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 18,
        color: "#94a3b8",
        marginBottom: 30,
        textAlign: "center",
    },
    statusBadge: {
        backgroundColor: "#22c55e",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 20,
    },
    statusText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    info: {
        fontSize: 14,
        color: "#475569",
    },
    exitButton: {
        backgroundColor: "#ef4444",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    exitButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
