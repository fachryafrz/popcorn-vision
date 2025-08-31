import { siteConfig } from "@/config/site";
import { POPCORN } from "@/lib/constants";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Privacy Policy",
  openGraph: {
    title: "Privacy Policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12">
      <figure
        style={{
          background: `url(${POPCORN})`,
          backgroundSize: `contain`,
        }}
        className={`aspect-square w-[150px]`}
      ></figure>

      <div className="prose max-w-none [&_*]:!text-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer">
                {props.children}
              </a>
            ),
          }}
        >
          {privacyPolicy}
        </ReactMarkdown>
      </div>
    </div>
  );
}

const privacyPolicy = `# Privacy Policy

**Last updated:** _August 31, 2025_

${siteConfig.name} ("we", "our", "us") respects your privacy. This Privacy Policy explains how we handle information when you use our website, application, and services (collectively, the "Service").

## Information We Collect
We may collect the following information when you use the Service:

- **Geolocation Information**:  
  We request your IP address through [ipinfo.io](https://ipinfo.io) to determine your **country code** and **country name**.  
  - We **do not store your IP address**.  
  - The country information is used solely to filter available watch providers provided by The Movie Database (TMDb).  
  - We store the **country code** and **country name** in your browser’s **local storage** to improve your experience and avoid repeated lookups.

- **Analytics Data**:  
  We use **Google Analytics** to collect data about your interaction with the Service, such as page views, device information, and general usage patterns.  

- **Authentication Data**:  
  When you log in with your **TMDb account**, authentication is handled by TMDb.  
  - We **do not collect or store your TMDb email, password, or personal profile information**.  
  - We only store the **access token** provided by TMDb in **cookies** to keep you logged in.  

## How We Use Your Information
The information collected is used for the following purposes:
- To provide relevant watch providers based on your location.  
- To authenticate users through TMDb login using access tokens.  
- To analyze usage trends and improve the Service through Google Analytics.  

Please note: both geolocation (via ipinfo.io) and analytics (via Google Analytics) are **essential for the Service and cannot be disabled**.

## Cookies and Browser Data
${siteConfig.name} has features that require us to remember your preferences and identify who is logged in to our applications. We use a combination of browser cookies and your browser's local storage to track this information.

Account identifiers in cookies are encrypted, and we do not store any sensitive information in local storage. We only set these items when you specifically log in to the site or change your preferences.

### Clear website data
If you no longer want this information on your device, you can clear your history and cookies:

- [Mozilla Firefox](https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored)
- [Microsoft Edge](https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy)
- [Safari on iOS](https://support.apple.com/en-us/HT201265)
- [Safari on Mac](https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac)
- [Chrome on Android](https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DAndroid)
- [Chrome on iOS](https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DiOS)
- [Chrome on Desktop](https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DAndroid)

## Sharing of Information
We do not sell or rent your personal information. However, your data may be shared with:
- **Service Providers**:  
  - [ipinfo.io](https://ipinfo.io) for geolocation.  
  - Google Analytics for analytics.  
  - The Movie Database (TMDb) for **authentication** (login via TMDb account) and **film data** (film details, images, metadata, watch providers, etc).  
- **Legal Authorities**: when required to comply with laws or regulations.  

## Data Security
We implement reasonable measures to protect the information we handle. However, please be aware that no method of transmission or storage is completely secure.

## Children's Privacy
The Service is not directed to children under the age of 13 (or the minimum legal age in your country). We do not knowingly collect personal information from children.

## Changes to This Policy
We may update this Privacy Policy from time to time. Updates will be posted on this page with a new effective date.

## Questions
If you have questions or concerns about this privacy information, please don't hesitate to contact us.`;
