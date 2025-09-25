<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function chat(Request $request)
    {
        try {
            $userMessage = $request->input('message');
            Log::info("User message: " . $userMessage);

            $qaFile = storage_path('app/qa.json');
            $qaData = file_exists($qaFile) ? json_decode(file_get_contents($qaFile), true) : [];

            $synonyms = [
                'offline shop' => ['physical store', 'visit your shop', 'retail store'],
                'refund' => ['return money', 'money back'],
                'cancel order' => ['cancel purchase', 'stop my order'],
                'delivery' => ['shipping', 'ship', 'transport'],
                'warranty' => ['guarantee', 'assurance'],
                'discount' => ['promotion', 'sale', 'offer'],
                'support' => ['help', 'assistance', 'customer service']
            ];

            $normalizedUser = strtolower($userMessage);
            foreach ($synonyms as $main => $alts) {
                foreach ($alts as $alt) {
                    $normalizedUser = str_replace($alt, $main, $normalizedUser);
                }
            }

            $bestMatch = null;
            $highestScore = 0;

            foreach ($qaData as $qa) {
                $question = strtolower($qa['question']);
                foreach ($synonyms as $main => $alts) {
                    foreach ($alts as $alt) {
                        $question = str_replace($alt, $main, $question);
                    }
                }

                similar_text($normalizedUser, $question, $percent);

                $userWords = array_filter(explode(" ", preg_replace('/[^a-z0-9 ]/', '', $normalizedUser)));
                $qaWords = array_filter(explode(" ", preg_replace('/[^a-z0-9 ]/', '', $question)));

                $overlap = count(array_intersect($userWords, $qaWords));
                $keywordScore = (count($qaWords) > 0) ? ($overlap / count($qaWords)) * 100 : 0;

                $score = ($percent * 0.7) + ($keywordScore * 0.3);

                if ($score > $highestScore) {
                    $highestScore = $score;
                    $bestMatch = $qa['answer'];
                }
            }

            if ($highestScore >= 50) {
                return response()->json([
                    'reply' => $bestMatch
                ]);
            }

            $apiKey = env('GEMINI_API_KEY');

            $prompt = "You are an AI assistant for a SmartHome e-commerce website.
Your role is to answer customer questions about smart home devices, installation, and usage.
Only respond to SmartHome-related questions.
If the question is unrelated, politely say you can only assist with SmartHome topics.
Keep answers short and concise (maximum 3 sentences).\n\nUser: " . $userMessage;

            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
                'X-goog-api-key' => $apiKey,
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            Log::info("Gemini raw response: ", $response->json());

            $data = $response->json();

            return response()->json([
                'reply' => $data['candidates'][0]['content']['parts'][0]['text']
                    ?? "Sorry, I couldn’t process your request."
            ]);
        } catch (\Exception $e) {
            Log::error("Gemini API error: " . $e->getMessage());
            return response()->json([
                'reply' => "Error from server: " . $e->getMessage()
            ], 500);
        }
    }
}
