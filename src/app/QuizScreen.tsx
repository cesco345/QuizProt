import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import QuestionCard from "../components/QuestionCard";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useQuizContext } from "../providers/QuizProvider";
import { useEffect, useState, useRef } from "react";

import questions from "../questions";
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import { useTimer } from "../hooks/useTimer";

export default function QuizScreen() {
  const { question, questionIndex, onNext, score, totalQuestions, bestScore } =
    useQuizContext();

  const { time, startTimer, clearTimer } = useTimer(20);

  useEffect(() => {
    startTimer();
    return () => {
      clearTimer();
    };
  }, [question]);

  useEffect(() => {
    if (time <= 0) {
      onNext();
    }
  }, [time]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View>
          <Text style={styles.title}>
            Question {questionIndex + 1}/{totalQuestions}
          </Text>
        </View>
        {/* Body */}
        {question ? (
          <View>
            <QuestionCard question={question} />
            <Text style={styles.time}>{time} sec</Text>
          </View>
        ) : (
          <Card title="Well done!">
            <Text>
              You have completed the quiz! Correct answers: {score}/
              {totalQuestions}
            </Text>
            <Text>Best Score: {bestScore}</Text>
          </Card>
        )}

        {/* Footer */}
        <CustomButton
          title="Next"
          onPress={() => onNext()}
          onLongPress={() => console.warn("Long press")}
          rightIcon={
            <FontAwesome6 name="arrow-right" size={16} color="white" />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FDFEF4",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    textAlign: "center",
    color: "#005055",
  },
  time: {
    textAlign: "center",
    marginTop: 15,
    color: "#005055",
    fontWeight: "bold",
  },
});
