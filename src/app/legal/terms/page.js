import { siteConfig } from "@/config/site";
import { POPCORN } from "@/lib/constants";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Terms of Service",
  openGraph: {
    title: "Terms of Service",
  },
};

export default function TermsOfServicePage() {
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
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {privacyPolicy}
        </ReactMarkdown>
      </div>
    </div>
  );
}

const privacyPolicy = `# Terms of Service

**Last updated:** _August 31, 2025_

Welcome to ${siteConfig.name} ("we", "our", "us"). By accessing or using our website, application, or services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.

## Use of the Service
- You may use the Service solely for personal and non-commercial purposes.  
- You agree not to misuse the Service, including attempting to gain unauthorized access, interfere with operation, or use the Service for illegal activities.  
- You are responsible for ensuring that your use of the Service complies with all applicable laws and regulations in your country.  

## Accounts and Authentication
- ${siteConfig.name} allows you to log in using your **The Movie Database (TMDb)** account.  
- Authentication is handled by TMDb. We do not collect or store your TMDb email, password, or personal profile information.  
- We only store the **access token** provided by TMDb in cookies for login purposes.  
- You are responsible for maintaining the confidentiality of your TMDb account and access to the Service.  

## Third-Party Services
The Service integrates third-party providers:
- **The Movie Database (TMDb)** for authentication and movie data (including movie details, images, metadata, and watch providers).  
- **ipinfo.io** for geolocation based on your IP address (to determine your country code and country name).  
- **Google Analytics** for usage analytics.  

We do not control these services and are not responsible for their content, policies, or practices. Your use of these services is subject to their respective terms and privacy policies.  

## Data and Privacy
Our handling of data is described in the [Privacy Policy](/legal/privacy).  
By using the Service, you agree to the collection and use of information as described there.  

## Intellectual Property
- ${siteConfig.name} does not own or claim ownership of any movie data, images, or metadata provided by TMDb.  
- All movie-related content displayed in the Service is the property of **TMDb** or its licensors.  
- The ${siteConfig.name} name, design, and original features are our intellectual property.  

## Disclaimer
${siteConfig.name} is provided **"as is"** and **"as available"** without warranties of any kind, express or implied.  

- ${siteConfig.name} is an **open-source project** created for educational and personal learning purposes.  
- It functions as a **film discovery platform** and does not claim ownership of any media content displayed.  
- All data including titles, posters, and metadata is retrieved from third-party public API (**The Movie Database**).  
- Streaming links or embeds shown on this site are sourced from external providers.  
- **${siteConfig.name} does not host, store, or upload any content.**  

Any media streamed via this platform originates from third-party sources whose availability and legality are beyond our control.  
If you believe that any content infringes your copyright, **please contact the original streaming provider**, as ${siteConfig.name} does not have ownership or control over the hosted files.  

Use of this site implies that you understand and accept these terms. ${siteConfig.name} is **non-commercial** and should only be used for **personal exploration and learning**. We do not encourage or promote any form of copyright violation.  

## Limitation of Liability
To the maximum extent permitted by law:
- ${siteConfig.name} shall not be liable for any damages, including indirect, incidental, or consequential damages, arising out of or related to the use of the Service.  
- You use the Service at your own risk.  

## Changes to the Terms
We may update these Terms of Service from time to time. Any updates will be posted on this page with a new effective date. Continued use of the Service after changes constitutes acceptance of the new Terms.  

## Privacy Policy
You agree that you have read and understand our Privacy Policy.

## Questions
If you have questions or concerns about these Terms, please don't hesitate to contact us.`;
