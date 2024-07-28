
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyDU-cu_OwZ4ELN4aTPAAxAZBf1S3vRB188");

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `hello gemini`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await run();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
