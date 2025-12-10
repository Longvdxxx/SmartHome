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
            $userMessage = trim($request->input('message', ''));
            if ($userMessage === '') {
                return response()->json(['reply' => "Please enter a question so I can assist you."]);
            }

            $synonymFile  = storage_path('app/synonym.json');
            $stopwordFile = storage_path('app/stopwords.php');

            $synonyms  = file_exists($synonymFile)  ? json_decode(file_get_contents($synonymFile), true) : [];
            $stopwords = file_exists($stopwordFile) ? include $stopwordFile : [];

            if (!is_array($synonyms))  $synonyms = [];
            if (!is_array($stopwords)) $stopwords = [];

            $normalize = function (string $text) use ($synonyms) {
                $text = strtolower($text);
                foreach ($synonyms as $keyword => $alts) {
                    foreach ($alts as $alt) {
                        if (strlen($alt) > 2) {
                            $text = str_replace($alt, $keyword, $text);
                        }
                    }
                }
                return trim(preg_replace('/\s+/', ' ', $text));
            };

            $qaFile = storage_path('app/qa.json');
            $qaData = file_exists($qaFile) ? json_decode(file_get_contents($qaFile), true) : [];
            if (!is_array($qaData)) $qaData = [];

            $normalizedUser = $normalize($userMessage);

            $scored = [];
            foreach ($qaData as $qa) {
                $qNorm = $normalize($qa['question']);

                similar_text($qNorm, $normalizedUser, $textSim);

                $userWords = array_diff(
                    array_filter(explode(' ', preg_replace('/[^a-z0-9 ]/', ' ', $normalizedUser))),
                    $stopwords
                );
                $qaWords = array_diff(
                    array_filter(explode(' ', preg_replace('/[^a-z0-9 ]/', ' ', $qNorm))),
                    $stopwords
                );

                $overlap = empty($userWords) || empty($qaWords)
                    ? 0
                    : count(array_intersect($userWords, $qaWords));

                if ($overlap === 0) continue;

                $keywordScore = ($overlap / max(count($qaWords), 1)) * 100;

                $score = ($textSim * 0.60) + ($keywordScore * 0.40);

                $scored[] = [
                    'question' => $qa['question'],
                    'answer'   => $qa['answer'],
                    'score'    => $score
                ];
            }

            usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);
            if (!empty($scored) && $scored[0]['score'] >= 60) {
                return response()->json(['reply' => $scored[0]['answer']]);
            }

            $apiKey = env('GEMINI_API_KEY');

            $fallbackPrompt = <<<PROMPT
You are an AI assistant for a SmartHome e-commerce store.
If the question is SmartHome-related, DO NOT answer fully.
Respond exactly: "This question is not yet in our system. I will update the information and assist you as soon as possible."

If unrelated to SmartHome, reply:
"I can only assist with SmartHome-related questions."

User: "{$userMessage}"
PROMPT;

            $fallbackResponse = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type'   => 'application/json',
                    'X-goog-api-key' => $apiKey,
                ])
                ->post(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                    [
                        'contents' => [
                            ['parts' => [['text' => $fallbackPrompt]]]
                        ]
                    ]
                );

            $aiReply = trim($fallbackResponse->json()['candidates'][0]['content']['parts'][0]['text'] ?? '');
            if ($aiReply === '') {
                $aiReply = "This question is not yet in our system. I will update it soon.";
            }

            $exists = false;
            foreach ($qaData as $qa) {
                similar_text($normalize($qa['question']), $normalizedUser, $sim);
                if ($sim >= 75) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $qaData[] = [
                    'question'  => $userMessage,
                    'answer'    => $aiReply,
                    'timestamp' => now()->toDateTimeString(),
                ];
                file_put_contents($qaFile, json_encode($qaData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            $synPrompt = <<<PROMPT
Extract meaningful keywords and synonyms (max 5 per keyword).
Return ONLY JSON like:
{
  "keyword": ["syn1", "syn2"]
}
User: "{$userMessage}"
PROMPT;

            $synResponse = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type'   => 'application/json',
                    'X-goog-api-key' => $apiKey,
                ])
                ->post(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                    [
                        'contents' => [
                            ['parts' => [['text' => $synPrompt]]]
                        ]
                    ]
                );

            $synGenerated = json_decode(
                $synResponse->json()['candidates'][0]['content']['parts'][0]['text'] ?? '{}',
                true
            );

            if (is_array($synGenerated)) {
                foreach ($synGenerated as $key => $list) {
                    if (!isset($synonyms[$key])) $synonyms[$key] = [];
                    foreach ($list as $syn) {
                        $syn = strtolower(trim($syn));
                        if (!in_array($syn, $stopwords)
                            && strlen($syn) > 2
                            && $syn !== $key
                            && !in_array($syn, $synonyms[$key])
                        ) {
                            $synonyms[$key][] = $syn;
                        }
                    }
                }

                file_put_contents(
                    $synonymFile,
                    json_encode($synonyms, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                );
            }

            return response()->json(['reply' => $aiReply]);
        }

        catch (\Exception $e) {
            Log::error("Gemini error: " . $e->getMessage());
            return response()->json(['reply' => "Server error: " . $e->getMessage()], 500);
        }
    }
}
