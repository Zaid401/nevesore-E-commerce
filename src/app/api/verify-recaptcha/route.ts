import { NextRequest, NextResponse } from "next/server";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const PROJECT_ID = "neversore";
const RECAPTCHA_SITE_KEY = "6LfLfoAsAAAAABNKFMQWlpb3zRbGV5Wg89ideXqX";
// Minimum acceptable risk score (0.0 = likely bot, 1.0 = likely human)
const SCORE_THRESHOLD = 0.5;

export async function POST(req: NextRequest) {
  try {
    const { token, action } = await req.json();

    if (!token || !action) {
      return NextResponse.json({ success: false, message: "Missing token or action." }, { status: 400 });
    }

    // TODO: Ensure GOOGLE_APPLICATION_CREDENTIALS env var points to your
    // GCP service account JSON key, or configure ADC for the deployment environment.
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(PROJECT_ID);

    const [response] = await client.createAssessment({
      assessment: {
        event: {
          token,
          siteKey: RECAPTCHA_SITE_KEY,
        },
      },
      parent: projectPath,
    });

    if (!response.tokenProperties?.valid) {
      return NextResponse.json(
        { success: false, message: `Invalid token: ${response.tokenProperties?.invalidReason}` },
        { status: 400 }
      );
    }

    if (response.tokenProperties.action !== action) {
      return NextResponse.json(
        { success: false, message: "Action mismatch." },
        { status: 400 }
      );
    }

    const score = response.riskAnalysis?.score ?? 0;
    if (score < SCORE_THRESHOLD) {
      return NextResponse.json(
        { success: false, message: "Suspicious activity detected.", score },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, score });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("reCAPTCHA verification error:", err);
    return NextResponse.json({ success: false, message: "Verification failed." }, { status: 500 });
  }
}
