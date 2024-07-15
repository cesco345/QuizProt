import { PropsWithChildren, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import questions from "../questions";
import { Question } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type QuizContext = {
  question?: Question;
  questionIndex: number;
  onNext: () => void;
  selectedOption?: string;
  setSelectedOption: (newOption: string) => void;
  score: number;
  totalQuestions: number;
  bestScore: number;
};

const QuizContext = createContext<QuizContext>({
  questionIndex: 0,
  onNext: () => {},
  setSelectedOption: () => {},
  score: 0,
  totalQuestions: 0,
  bestScore: 0,
});

export default function QuizProvider({ children }: PropsWithChildren) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [score, setScore] = useState(0);
  const isFinished = questionIndex >= questions.length;
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    loadBestScore();
  }, []);

  useEffect(() => {
    //check if the score is greater than the best score
    if (isFinished === true && score > bestScore) {
      setBestScore(score);
      saveBestScore(score);
    }
  }, [isFinished]);

  const restart = () => {
    setQuestionIndex(0);
    setSelectedOption("");
    setScore(0);
  };
  const onNext = () => {
    if (isFinished) {
      restart();
      return;
    }

    if (selectedOption === question?.correctAnswer) {
      setScore((curScore) => curScore + 1);
    }
    setQuestionIndex((currValue) => currValue + 1);
  };
  //
  const saveBestScore = async (value: number) => {
    try {
      await AsyncStorage.setItem("bestScore", value.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const loadBestScore = async () => {
    try {
      const value = await AsyncStorage.getItem("bestScore");
      if (value !== null) {
        setBestScore(Number.parseInt(value));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        question,
        questionIndex,
        onNext,
        selectedOption,
        setSelectedOption,
        score,
        totalQuestions: questions.length,
        bestScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export const useQuizContext = () => {
  return useContext(QuizContext);
};
