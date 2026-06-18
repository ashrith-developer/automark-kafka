import Content from '../models/Content.js';
import Groq from 'groq-sdk';
import { publishContentGenerated } from '../kafka/producer.js';
import { createEventEnvelope } from '../kafka/envelope.js';

const getPlatformPrompt = (platform, productDescription, targetAudience, tone) => {
  const basePrompt = `Product: ${productDescription}\nTarget Audience: ${targetAudience}\nTone: ${tone}\n\n`;

  switch (platform) {
    case 'linkedin':
      return basePrompt + `Write a professional LinkedIn post about this product. It should be around 300 words, formatted in paragraphs, and include 3-5 relevant hashtags. It should be engaging and showcase thought leadership. Output ONLY the post content, no conversational filler.`;
    case 'twitter':
      return basePrompt + `Write a Twitter/X thread (3-5 tweets) about this product. Each tweet must be under 280 characters. Start with a strong hook. Make it punchy and concise. Separate tweets with ---. Output ONLY the thread content.`;
    case 'instagram':
      return basePrompt + `Write an Instagram caption for this product. It should be around 150 words, use visual storytelling, include emojis, and end with 10-15 relevant hashtags. Output ONLY the caption content.`;
    case 'email':
      return basePrompt + `Write an email marketing campaign for this product. Provide a compelling "Subject:" line, followed by the email body (around 500 words). Make it personalized, benefit-driven, and end with a strong Call to Action. Output ONLY the email content.`;
    default:
      return basePrompt + `Write marketing content for ${platform}.`;
  }
};

export const generateContent = async (req, res) => {
  try {
    const { productDescription, targetAudience, tone, platforms, scheduledFor } = req.body;

    if (!platforms || platforms.length === 0) {
      return res.status(400).json({ message: 'At least one platform must be selected' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const generatedContent = {};

    for (const platform of platforms) {
      const prompt = getPlatformPrompt(platform, productDescription, targetAudience, tone);
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      let text = chatCompletion.choices[0]?.message?.content || '';

      if (platform === 'email') {
        generatedContent[platform] = {
          subject: text.split('\n')[0].replace('Subject: ', '').trim() || 'Email Campaign',
          body: text
        };
      } else {
        generatedContent[platform] = text;
      }
    }

    const contentRecord = await Content.create({
      userId: req.user._id,
      productDescription,
      targetAudience,
      tone,
      platforms,
      generatedContent,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : Date.now()
    });
    const eventEnvelope = createEventEnvelope('ContentGenerated', {
      contentId: contentRecord._id.toString(),
      userId: req.user._id.toString(),
      platforms,
      tone,
      createdAt: contentRecord.createdAt,
    });
    await publishContentGenerated(eventEnvelope);

    res.status(200).json({
      success: true,
      contentId: contentRecord._id,
      generatedContent,
      createdAt: contentRecord.createdAt
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ message: error.message || 'Error generating content' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Content.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching history' });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    if (content.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    if (content.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await content.deleteOne();
    res.json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
