<?php

namespace App\Services;

use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;

class PayPalService
{
    private static $apiContext = null;

    /**
     * Get cached PayPal API context to avoid recreating on each call.
     * This improves performance by reusing the context.
     */
    public static function getApiContext()
    {
        if (self::$apiContext === null) {
            self::$apiContext = new ApiContext(
                new OAuthTokenCredential(
                    config('paypal.client_id'),
                    config('paypal.secret')
                )
            );

            self::$apiContext->setConfig([
                'mode' => config('paypal.mode', 'sandbox'),
            ]);
        }

        return self::$apiContext;
    }
}
