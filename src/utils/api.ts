// src/utils/api.ts
export const saveAnswers = async (answers: object) => {
  const response = await fetch("/save-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });
  return response;
};

export const getAnswers = async () => {
  const response = await fetch("/answers.json");
  const data = await response.json();
  return data;
};
