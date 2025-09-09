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

            $apiKey = env('GEMINI_API_KEY');

            $prompt = "Please give a short and concise answer (maximum 3 sentences).\nUser: " . $userMessage;

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
