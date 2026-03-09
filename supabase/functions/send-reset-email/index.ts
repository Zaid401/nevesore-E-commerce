// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Generate a recovery link via Supabase admin (no SMTP needed)
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectTo ?? 'https://neversore.com/reset-password',
      },
    });

    if (linkError || !data?.properties?.action_link) {
      throw new Error(linkError?.message ?? 'Failed to generate reset link');
    }

    const resetLink = data.properties.action_link;

    // Send via Resend REST API directly (bypasses SMTP entirely)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const senderName = Deno.env.get('SENDER_NAME') ?? 'Neversore';
    const senderEmail = Deno.env.get('SENDER_EMAIL') ?? 'noreply@neversore.com';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: [email],
        subject: 'Reset your Neversore password',
        html: buildResetEmailHtml(resetLink),
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      throw new Error(`Resend error: ${JSON.stringify(resendError)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});

function buildResetEmailHtml(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#dc2626;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">NEVERSORE</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#171717;text-transform:uppercase;letter-spacing:0.04em;">Reset Your Password</h2>
              <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.6;">
                We received a request to reset the password for your Neversore account. Click the button below to choose a new password. This link expires in 1 hour.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px;background:#dc2626;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:0.06em;border-radius:12px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:12px;color:#737373;line-height:1.6;">
                If you didn&apos;t request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#a3a3a3;">
                Or copy and paste this link into your browser:<br/>
                <a href="${resetLink}" style="color:#dc2626;word-break:break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.06em;">
                &copy; ${new Date().getFullYear()} Neversore. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
