// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

// Deno global — available at runtime in Supabase Edge Functions
declare const Deno: { env: { get(key: string): string | undefined } };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PROJECT_ID = 'neversore';
const RECAPTCHA_SITE_KEY = '6LfLfoAsAAAAABNKFMQWlpb3zRbGV5Wg89ideXqX';
// Minimum acceptable risk score (0.0 = likely bot, 1.0 = likely human)
const SCORE_THRESHOLD = 0.5;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token, action } = await req.json() as { token?: string; action?: string };

    if (!token || !action) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing token or action.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the GCP API key stored as a Supabase secret.
    // Set via: supabase secrets set RECAPTCHA_ENTERPRISE_API_KEY=<your-gcp-api-key>
    const apiKey = Deno.env.get('RECAPTCHA_ENTERPRISE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'reCAPTCHA API key not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const assessmentUrl =
      `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${apiKey}`;

    const assessmentRes = await fetch(assessmentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token,
          siteKey: RECAPTCHA_SITE_KEY,
          expectedAction: action,
        },
      }),
    });

    if (!assessmentRes.ok) {
      const errText = await assessmentRes.text();
      console.error('reCAPTCHA Enterprise API error:', errText);
      return new Response(
        JSON.stringify({ success: false, message: 'reCAPTCHA assessment request failed.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const assessment = await assessmentRes.json() as {
      tokenProperties?: { valid: boolean; invalidReason?: string; action?: string };
      riskAnalysis?: { score: number; reasons?: string[] };
    };

    if (!assessment.tokenProperties?.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Invalid token: ${assessment.tokenProperties?.invalidReason ?? 'unknown'}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (assessment.tokenProperties.action !== action) {
      return new Response(
        JSON.stringify({ success: false, message: 'Action mismatch.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const score = assessment.riskAnalysis?.score ?? 0;
    if (score < SCORE_THRESHOLD) {
      return new Response(
        JSON.stringify({ success: false, message: 'Suspicious activity detected.', score }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, score }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('verify-recaptcha error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Verification failed.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
