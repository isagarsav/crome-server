const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = 2000;
const AI_MODEL_API = process.env.AI_MODEL_API_URL;
const genAI = new GoogleGenerativeAI(AI_MODEL_API);
app.use(bodyParser.json());
app.use(cors());

app.post('/api/ai-model', async (req, res) => {
  try {
    const { pageText } = req.body;
    const promptText = `Extract the product name and price from the given product details page. If either value is not found, return "not found" for that value.Page Content ${pageText} Expected Output Format Product Name:[name]: Product Price:[price]:`;
    const result = await generateContent(promptText);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function generateContent(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().split(':');
  console.log({ productName: text[1], productPrice: text[3] });
  return { response: { productName: text[1], productPrice: text[3] } };
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
