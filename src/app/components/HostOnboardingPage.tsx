import { PolicyLayout, h1, h2, p, ul, ulSub } from "./PolicyLayout";

export function HostOnboardingPage() {
  return (
    <PolicyLayout>
      <h1 className={h1}>ToGatherSG Host Onboarding Guide</h1>
      <p className={p}>
        Welcome to ToGatherSG! We're excited to have you on board. Follow the steps below to get
        started as a host.
      </p>
      <p className={p}>
        As ToGatherSG is still in <strong>Beta</strong>, you may experience some bugs or minor
        issues while using the app as we continue to improve it. We truly appreciate your patience,
        understanding and support during this phase. If you run into any issues, please email us at{" "}
        <a className="text-[#8A2BE2] underline" href="mailto:admin@togathersg.com">
          admin@togathersg.com
        </a>{" "}
        or contact us at{" "}
        <a className="text-[#8A2BE2] underline" href="tel:+6586596838">
          +65 8659 6838
        </a>
        .
      </p>

      <h2 className={h2}>Step 1: Download Our iOS App</h2>
      <p className={p}>
        ToGatherSG is currently available as a <strong>mobile app for iOS users only</strong>.
        Please begin by downloading the <strong>main ToGatherSG app</strong> from the App Store.
      </p>
      <p className={p}>
        Our website is available for learning more about us, but{" "}
        <strong>hosting and bookings are done through the mobile app, not through a web app</strong>.
      </p>

      <h2 className={h2}>Step 2: Create User Account</h2>
      <p className={p}>
        To become a host on ToGatherSG, you must first create a <strong>user account</strong> on the
        main app. Sign up using your:
      </p>
      <ul className={ul}>
        <li>email address,</li>
        <li>Google account, or</li>
        <li>Apple account.</li>
      </ul>
      <p className={p}>After signing up:</p>
      <ul className={ul}>
        <li>agree to the Terms &amp; Conditions and Privacy Policy,</li>
        <li>verify your account through the confirmation link sent to your email,</li>
        <li>complete your profile by adding your name, username, and profile picture.</li>
      </ul>

      <h2 className={h2}>Step 3: Apply to be a Host</h2>
      <p className={p}>
        Once your user account has been created, you can apply to become a host through the{" "}
        <strong>main ToGatherSG app</strong>. Go to your <strong>Profile Page</strong> and fill in
        the <strong>host onboarding form</strong>. Prepare the following details:
      </p>
      <ul className={ul}>
        <li><strong>Business name</strong></li>
        <li><strong>Host name</strong></li>
        <li><strong>Exact address</strong> (this will only be used internally)</li>
        <li><strong>Phone number</strong></li>
        <li><strong>Photos of the venue</strong> where the workshop will be conducted (maximum of 5 photos)</li>
        <li><strong>Social media details</strong> (optional)</li>
      </ul>
      <p className={p}>
        Before signing up as a host, you are required to read through our{" "}
        <a className="text-[#8A2BE2] underline" href="/host-guidelines">
          ToGatherSG Host Standards &amp; Safety Guidelines
        </a>{" "}
        carefully. This is to ensure that you understand our community standards, hosting
        requirements, and expectations before proceeding.
      </p>
      <div className="rounded-xl border-2 border-[#F4C300] bg-[#F4C300]/10 p-5 mb-4">
        <p className="font-semibold text-gray-900 mb-2">
          For Hosts Planning Culinary Activities or Dining Sessions
        </p>
        <p className="text-gray-700 leading-relaxed mb-2">
          If you plan to host <strong>culinary workshops, food-related activities, or dining
          sessions</strong>, you must upload your <strong>food safety certification</strong> during
          onboarding.
        </p>
        <p className="text-gray-700 leading-relaxed mb-2">
          Please note that <strong>without a valid food safety certificate, you will not be able to
          publish culinary workshops on the platform</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you do not yet have one, you may apply for it through the relevant certification link
          provided.
        </p>
      </div>
      <p className={p}>
        Once everything is filled in, click <strong>Submit</strong>. Our team will review your
        application and approve it on a case-by-case basis.
      </p>

      <h2 className={h2}>Step 4: Wait for Host Application Review</h2>
      <p className={p}>
        Once your host application is approved, you will be prompted to set up your{" "}
        <strong>payment account</strong>.
      </p>

      <h2 className={h2}>Step 5: Set Up Your Payment Account</h2>
      <p className={p}>
        Once your host application has been approved, open the ToGatherSG app and head to your
        profile. Tap <strong>Finish setting up your account</strong>, then complete your payment
        account setup before you can begin listing experiences.
      </p>
      <p className={p}>Please note:</p>
      <ul className={ul}>
        <li>payment account approval may take <strong>3–5 business days</strong></li>
        <li>once approved, you will receive a <strong>notification</strong></li>
        <li>your account status will then reflect your host access</li>
      </ul>
      <p className={p}>
        Once everything is approved, you may download the <strong>ToGatherSG Host App</strong>, sign
        in using the same account details as your main app, and begin listing your experiences.
      </p>

      <h2 className={h2}>Step 6: Create Your First Experience</h2>
      <p className={p}>Using the ToGatherSG Host App:</p>
      <ul className={ul}>
        <li>Go to the <strong>Calendar</strong> section.</li>
        <li>Tap <strong>Create New Experience</strong>.</li>
        <li>
          Fill in your experience details, including:
          <ul className={ulSub}>
            <li>Experience name</li>
            <li>Description</li>
            <li>Date</li>
            <li>Time</li>
            <li>Duration</li>
          </ul>
        </li>
        <li>Set your price.</li>
        <li>
          Choose your preferred hosting dates and times carefully. Please ensure your availability is
          accurate to avoid scheduling conflicts.
        </li>
        <li>Upload clear, high quality photos of your experience setup.</li>
        <li>
          Write a strong description to help guests understand:
          <ul className={ulSub}>
            <li>What the experience is about</li>
            <li>What they will learn or do</li>
            <li>What they can expect during the session</li>
            <li>Any host certifications, qualifications, or relevant years of experience</li>
            <li>Who the workshop is suitable for</li>
            <li>Anything guests should prepare or take note of before attending</li>
          </ul>
        </li>
        <li>
          Add your experience location using the map. This will be used as the{" "}
          <strong>general location</strong> shown publicly to users.
        </li>
        <li>
          In the <strong>Directions</strong> section, provide your <strong>full exact address</strong>,
          including your unit number, together with clear directions so guests can locate your venue
          easily.
        </li>
        <li>
          Once you have completed all required details, you may publish your listing and start
          receiving bookings.
        </li>
      </ul>
      <p className={p}>Please note:</p>
      <ul className={ul}>
        <li>The location pinned on the map will be used as the general location shown publicly.</li>
        <li>
          Your full exact address and directions will only be shared with users{" "}
          <strong>48 hours before the session</strong>.
        </li>
      </ul>
    </PolicyLayout>
  );
}
