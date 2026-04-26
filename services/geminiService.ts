import { GoogleGenAI, Chat, Type, Part } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const createTutorSession = (subjectName: string): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
        systemInstruction: `You are an expert Cambridge International Examinations (CAIE) tutor for ${subjectName || 'O and A Levels'}. 
        You help students solve past paper questions, explain difficult concepts, and provide marking scheme insights. 
        You are encouraging, precise, and use Markdown for mathematical formulas and structured answers. 
        If asked about specific past papers, assume the role of an examiner explaining the solution.`
    }
  });
};

export const sendMessageStream = async (
    chat: Chat, 
    message: string,
    imageData: string | null,
    onChunk: (text: string) => void
): Promise<string> => {
    try {
        let content: string | Array<string | Part> = message;
        
        if (imageData) {
            // Remove data:image/xxx;base64, prefix if present for the API call if it expects raw base64, 
            // but usually the SDK helpers might handle it or we construct the part manually.
            // The @google/genai SDK usually expects standard base64 in inlineData.
            const base64Data = imageData.split(',')[1] || imageData;
            const mimeType = imageData.substring(imageData.indexOf(':') + 1, imageData.indexOf(';'));

            content = [
                { text: message },
                { 
                    inlineData: { 
                        mimeType: mimeType || 'image/jpeg', 
                        data: base64Data 
                    } 
                }
            ];
        }

        const responseStream = await chat.sendMessageStream({
            message: content
        });

        let fullText = "";
        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
                fullText += text;
                onChunk(text);
            }
        }
        return fullText;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
}

export const generateExamFeedback = async (
    subjectName: string,
    subjectCode: string,
    paperNumber: number,
    userMarks: number,
    totalMarks: number,
    grade: string,
    threshold: number
): Promise<string> => {
    const prompt = `You are a senior Cambridge International examiner.
    A student just completed a past paper exam simulation.
    
    Context:
    - Subject: ${subjectName} (${subjectCode})
    - Paper: ${paperNumber}
    - Score: ${userMarks}/${totalMarks}
    - Grade Achieved: ${grade}
    - The 'A' grade threshold was: ${threshold}/${totalMarks}

    Task:
    Provide brief, specific, and actionable feedback (max 150 words).
    1. Analyze their performance based on the grade.
    2. Suggest 2-3 specific high-yield topics or skills usually tested in Paper ${paperNumber} for this subject that they should review to improve (or maintain) this grade. 
       (For example, if it is Math P3, mention complex numbers or integration; if Physics P4, mention fields or quantum physics).
    3. Be encouraging but realistic.
    
    Output Format:
    Use Markdown. Use bolding for key terms.`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "Unable to generate feedback at this time.";
    } catch (error) {
        console.error("Error generating feedback:", error);
        return "Sorry, I couldn't generate detailed feedback right now. Please try again later.";
    }
};

export const generateFlashcards = async (topic: string): Promise<{ id: string, front: string, back: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Create 10 high-yield revision flashcards for the CAIE (Cambridge) syllabus topic: "${topic}".
            The front should be a clear question, definition prompt, or formula name.
            The back should be the concise answer, definition, or formula.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            front: { type: Type.STRING },
                            back: { type: Type.STRING }
                        },
                        required: ["id", "front", "back"],
                    },
                },
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return [];
    }
};

export const gradeAnswer = async (
    question: string,
    studentAnswer: string,
    totalMarks: number
): Promise<{ score: number, feedback: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `You are a strict Cambridge examiner.
            Question: ${question}
            Total Marks Available: ${totalMarks}
            Student's Answer: ${studentAnswer}
            
            Task:
            1. Grade the student's answer out of the total marks.
            2. Provide brief feedback explaining where they got marks and where they lost them.
            
            Return JSON with 'score' (number) and 'feedback' (string).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"],
                },
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return { score: 0, feedback: "Error grading answer." };
    } catch (error) {
        console.error("Error grading answer:", error);
        return { score: 0, feedback: "Error grading answer." };
    }
};
export const generateFlashcards = async (topic: string): Promise<{ id: string, front: string, back: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Create 10 high-yield revision flashcards for the CAIE (Cambridge) syllabus topic: "${topic}".
            The front should be a clear question, definition prompt, or formula name.
            The back should be the concise answer, definition, or formula.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            front: { type: Type.STRING },
                            back: { type: Type.STRING }
                        },
                        required: ["id", "front", "back"],
                    },
                },
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return [];
    }
};

export const gradeAnswer = async (
    question: string,
    studentAnswer: string,
    totalMarks: number
): Promise<{ score: number, feedback: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `You are a strict Cambridge examiner.
            Question: ${question}
            Total Marks Available: ${totalMarks}
            Student's Answer: ${studentAnswer}
            
            Task:
            1. Grade the student's answer out of the total marks.
            2. Provide brief feedback explaining where they got marks and where they lost them.
            
            Return JSON with 'score' (number) and 'feedback' (string).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"],
                },
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return { score: 0, feedback: "Error grading answer." };
    } catch (error) {
        console.error("Error grading answer:", error);
        return { score: 0, feedback: "Error grading answer." };
    }
};
export const generateAIStudyPlan = async (
    subjectName: string,
    goal: string,
    days: number
): Promise<{ day: number; title: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Create a study plan for ${subjectName} to achieve the goal: "${goal}".
            The plan must span exactly ${days} days.
            Be specific about topics to cover or tasks to do (e.g., "Review Integration Formulas", "Solve Nov 2021 Paper 1").`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.INTEGER },
                            title: { type: Type.STRING, description: "A concise description of the study task for this day." }
                        },
                        required: ["day", "title"],
                    },
                },
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Error generating study plan:", error);
        return [];
    }
}