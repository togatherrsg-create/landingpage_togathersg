import { PolicyLayout, RelatedLink, h1, h2, p, ul, ulSub } from "./PolicyLayout";

export function HostOnboardingPage() {
  return (
    <PolicyLayout>
      <h1 className={h1}>ToGatherSG Host Onboarding Guide</h1>
      <p className={p}>
        Welcome to ToGatherSG! We're excited to have you on board. This guide walks you through
        everything from applying to become a host to taking your first booking and getting paid.
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

      <h2 className={h2}>The host journey at a glance</h2>
      <ul className={ul}>
        <li><strong>Apply</strong> — fill in your host profile and upload your details.</li>
        <li><strong>Under review</strong> — our team checks your application.</li>
        <li><strong>Accepted</strong> — you're approved to host.</li>
        <li><strong>Set up payouts</strong> — connect your payment account so you can be paid.</li>
        <li><strong>Start hosting</strong> — create experiences, add class dates, and take bookings.</li>
        <li><strong>Get paid</strong> — payouts land in your bank after each class runs.</li>
      </ul>

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
        <strong>main ToGatherSG app</strong>. Go to your <strong>Profile</strong> and complete the{" "}
        <strong>host application form</strong>. Prepare the following:
      </p>
      <ul className={ul}>
        <li>A clear <strong>profile photo</strong> of yourself, so guests can recognise their host.</li>
        <li>A <strong>display name</strong> and a <strong>username</strong> (your @handle — this is lowercased and permanent once set).</li>
        <li>Your <strong>full name</strong> for verification.</li>
        <li>Your <strong>full address</strong> and a valid <strong>Singapore phone number</strong> (kept private — only a general area is shown publicly).</li>
        <li>The <strong>categories</strong> you'll host (at least one).</li>
        <li><strong>Photos</strong> of your space or past experiences.</li>
      </ul>
      <p className={p}>
        Before applying, you are required to read through our{" "}
        <a className="text-[#8A2BE2] underline" href="/host-guidelines">
          ToGatherSG Host Standards &amp; Safety Guidelines
        </a>{" "}
        carefully. This ensures you understand our community standards, hosting requirements, and
        expectations before proceeding.
      </p>
      <div className="rounded-xl border-2 border-[#F4C300] bg-[#F4C300]/10 p-5 mb-4">
        <p className="font-semibold text-gray-900 mb-2">
          For Hosts Planning Culinary Activities or Dining Sessions
        </p>
        <p className="text-gray-700 leading-relaxed mb-2">
          If you plan to host <strong>culinary workshops, food-related activities, or dining
          sessions</strong>, you must upload a valid <strong>WSQ Food Safety Course Level 1
          certificate</strong> during onboarding.
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
        Once everything is filled in, tap <strong>Submit</strong>. Our team will review your
        application on a case-by-case basis.
      </p>

      <h2 className={h2}>Step 4: Wait for Host Application Review</h2>
      <p className={p}>
        Our team reviews every application to keep the community safe and trusted. You'll be notified
        once a decision is made.
      </p>
      <ul className={ul}>
        <li><strong>If accepted</strong>, you'll move on to set up your payment account (Step 5).</li>
        <li><strong>If not accepted</strong>, you'll see the reason in the app — simply update your details and resubmit. There's no limit on trying again.</li>
      </ul>

      <h2 className={h2}>Step 5: Set Up Your Payment Account</h2>
      <p className={p}>
        ToGatherSG uses Stripe to pay hosts securely. Once your application has been approved, open
        the app, head to your profile, and tap <strong>Finish setting up your account</strong>.
        You'll be guided through Stripe to provide:
      </p>
      <ul className={ul}>
        <li>your business or personal details for verification, and</li>
        <li>the bank account where your payouts should land.</li>
      </ul>
      <p className={p}>Please note:</p>
      <ul className={ul}>
        <li>payment account approval may take <strong>3–5 business days</strong>,</li>
        <li>once approved, you will receive a <strong>notification</strong>,</li>
        <li>your account status will then reflect your host access.</li>
      </ul>
      <p className={p}>
        Once everything is approved, download the <strong>ToGatherSG Host App</strong>, sign in using
        the same account details as your main app, and begin listing your experiences.
      </p>

      <h2 className={h2}>Step 6: Create Your First Experience</h2>
      <p className={p}>
        In the ToGatherSG Host App, an <strong>experience</strong> is your listing. Go to the{" "}
        <strong>Experiences</strong> tab, create a new experience, and set:
      </p>
      <ul className={ul}>
        <li>Title, category, and a strong description of what guests will do, make, or learn.</li>
        <li>Price per guest and the duration of each session.</li>
        <li>Capacity (maximum guests).</li>
        <li>
          A <strong>booking window</strong> — how long before the class bookings close. This must be
          at least <strong>48 hours</strong> and is <strong>locked once the listing is created</strong>.
        </li>
        <li>Clear, high-quality photos of your setup.</li>
        <li>
          A <strong>general location</strong> on the map (shown publicly), plus your{" "}
          <strong>full exact address and directions</strong>, which are only shared with confirmed
          guests <strong>48 hours before the session</strong>.
        </li>
      </ul>
      <p className={p}>
        As a platform rule, experiences must <strong>end by 10pm</strong> and should stay small-scale
        and respectful of your neighbours.
      </p>

      <h2 className={h2}>Step 7: Add Your Class Dates</h2>
      <p className={p}>
        Under an experience, add the specific dates you'll run it. For each class you set:
      </p>
      <ul className={ul}>
        <li>the <strong>date</strong> — you can schedule up to <strong>4 months</strong> in advance,</li>
        <li>the <strong>start time</strong> (the end time is set automatically from the listing duration),</li>
        <li>the <strong>minimum and maximum pax</strong> for that class.</li>
      </ul>
      <p className={p}>
        <strong>About minimum pax:</strong> if a class doesn't reach its minimum number of guests by
        the time bookings close, it is automatically cancelled and everyone booked is fully refunded —
        so you never have to run an under-filled class. Once a class does meet its minimum, it is
        locked in to run.
      </p>

      <h2 className={h2}>How a Booking Works</h2>
      <p className={p}>Here's what happens automatically around each class:</p>
      <ul className={ul}>
        <li>Guests book and pay through the app; you can see your roster at any time.</li>
        <li>Bookings close at your set window (at least 48 hours before the class).</li>
        <li>At booking close, if the class has hit its minimum it is confirmed to run; if not, it auto-cancels with full refunds.</li>
        <li>The exact address and arrival details are revealed to confirmed guests 48 hours before the class.</li>
        <li>Guests receive a reminder the day before.</li>
      </ul>

      <h2 className={h2}>Getting Paid</h2>
      <p className={p}>
        After a class runs, your earnings are released to your Stripe account (and then your bank),
        minus the ToGatherSG platform fee. There is a short hold after the class ends before payout.
      </p>
      <ul className={ul}>
        <li>A guest who cancels <strong>outside</strong> the no-refund window gets a full refund.</li>
        <li>A guest who cancels <strong>inside</strong> the no-refund window forfeits their payment — and if the class still runs, you're paid your share for that seat.</li>
        <li>If you (the host) cancel a class within 48 hours of the start and it has guests, a penalty may apply and all guests are refunded.</li>
      </ul>

      <h2 className={h2}>Tips for a Great Listing</h2>
      <ul className={ul}>
        <li>Use bright, honest photos that match the real experience.</li>
        <li>Write a clear description: what guests will do, make, or learn.</li>
        <li>Set a realistic minimum pax so your class is likely to run.</li>
        <li>Disclose anything important up front — pets, allergens, stairs, or materials used.</li>
        <li>Reply to guest messages promptly; responsiveness builds trust and reviews.</li>
      </ul>

      <RelatedLink
        href="/host-guidelines"
        eyebrow="Next, read these"
        label="Host Standards & Safety Guidelines"
        description="The standards every host must meet before listing an Experience."
      />
    </PolicyLayout>
  );
}
