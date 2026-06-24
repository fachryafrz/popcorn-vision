import { siteConfig } from "@/config/site";

export interface EmailTemplateOptions {
  title: string;
  greeting?: string;
  bodyHtml: string;
  actionUrl?: string;
  actionText?: string;
  rawUrlText?: string;
}

/**
 * Generates the base HTML wrapper for emails.
 * Uses robust table-based layout and matching cinematic dark-theme styling.
 */
export function getEmailWrapperHtml(options: EmailTemplateOptions): string {
  // Use SITE_URL env variable or fallback to siteConfig URL
  const siteUrl = process.env.SITE_URL || siteConfig.url || "http://localhost:3000";
  const logoUrl = `${siteUrl}/logo/popcorn.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #0A0915;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #0A0915;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0915; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 10px 40px 10px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #131124; border: 1px solid #272545; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 32px 20px 24px 20px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <img src="${logoUrl}" alt="${siteConfig.name}" width="56" height="56" style="display: block; width: 56px; height: 56px; border-radius: 12px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${siteConfig.name}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subtle Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #272545;">
                <tr><td height="1">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; color: #E2E8F0; font-size: 16px; line-height: 26px;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: center; letter-spacing: -0.5px;">
                ${options.title}
              </h1>

              ${options.greeting ? `<p style="margin-top: 0; margin-bottom: 16px; font-weight: 600; color: #FFFFFF;">${options.greeting}</p>` : ""}
              
              ${options.bodyHtml}

              <!-- Action Button -->
              ${
                options.actionUrl && options.actionText
                  ? `
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; margin-bottom: 32px;">
                  <tr>
                    <td align="center">
                      <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="border-radius: 12px; background-color: #6366F1; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                            <a href="${options.actionUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                              ${options.actionText}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }

              <!-- Copy-paste URL fallback -->
              ${
                options.actionUrl && options.rawUrlText
                  ? `
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; background-color: #0A0915; border: 1px dashed #272545; border-radius: 8px;">
                  <tr>
                    <td style="padding: 16px; font-size: 13px; color: #94A3B8; word-break: break-all; text-align: center;">
                      <p style="margin-top: 0; margin-bottom: 8px; font-weight: 600; color: #E2E8F0;">
                        ${options.rawUrlText}
                      </p>
                      <a href="${options.actionUrl}" target="_blank" style="color: #6366F1; text-decoration: none;">
                        ${options.actionUrl}
                      </a>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- Security Footer Section -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0915; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px; font-size: 12px; line-height: 18px; color: #94A3B8; text-align: center;">
                    🔒 <strong>Security Notice:</strong> If you did not request this email, you can safely ignore it. Your password will remain unchanged.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Outer Footer -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="font-size: 12px; line-height: 20px; color: #4B5563; text-align: center; padding: 0 20px;">
              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.
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

/**
 * Returns the HTML for a password reset email.
 */
export function getResetPasswordEmailHtml(name: string | null | undefined, resetUrl: string): string {
  const bodyHtml = `
    <p style="margin-top: 0; margin-bottom: 16px;">
      We received a request to reset the password for your ${siteConfig.name} account. Click the button below to set a new password:
    </p>
    <p style="margin-top: 0; margin-bottom: 16px; font-size: 14px; color: #94A3B8;">
      For security reasons, this link is only valid for 1 hour.
    </p>
  `;

  return getEmailWrapperHtml({
    title: "Reset Your Password",
    greeting: `Hello ${name || "there"},`,
    bodyHtml,
    actionUrl: resetUrl,
    actionText: "Reset Password",
    rawUrlText: "Or copy and paste this link into your browser:",
  });
}
