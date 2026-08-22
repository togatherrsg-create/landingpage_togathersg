import { PolicyLayout, RelatedLink, h1, h2, p, ul } from "./PolicyLayout";

// Public account-deletion page, required by Google Play's Data safety /
// account-deletion policy. Linked from the Play store listings of both the
// ToGatherSG customer app and the ToGatherSG Host app.
export function DeleteAccountPage() {
  return (
    <PolicyLayout>
      <h1 className={h1}>Delete Your ToGatherSG Account</h1>

      <p className={p}>
        This page explains how to delete your ToGatherSG account and what happens to your data. It
        applies to accounts created in the <strong>ToGatherSG</strong> app (for guests) and the{" "}
        <strong>ToGatherSG Host</strong> app (for hosts), both published by ToGatherSG.
      </p>

      <h2 className={h2}>Delete your account in the app (recommended)</h2>
      <p className={p}>In the ToGatherSG app (guests):</p>
      <ul className={ul}>
        <li>Open the app and sign in.</li>
        <li>
          Go to the <strong>Profile</strong> tab.
        </li>
        <li>
          Scroll down and tap <strong>Delete my account</strong>.
        </li>
        <li>Confirm twice. Your account is deleted immediately.</li>
      </ul>
      <p className={p}>In the ToGatherSG Host app (hosts):</p>
      <ul className={ul}>
        <li>Open the app and sign in.</li>
        <li>
          Go to <strong>Profile</strong> (or the onboarding screen if your application is still in
          progress) and tap <strong>Delete my account</strong>, then confirm.
        </li>
        <li>
          If you have upcoming classes with active bookings, you&rsquo;ll be asked to cancel them
          first — your guests are refunded — before the account can be deleted.
        </li>
      </ul>

      <h2 className={h2}>Or request deletion by email</h2>
      <p className={p}>
        If you can no longer access the app, email{" "}
        <a href="mailto:support@togathersg.com" className="text-[#8A2BE2] font-medium">
          support@togathersg.com
        </a>{" "}
        from the email address linked to your account with the subject &ldquo;Delete my
        account&rdquo;. We&rsquo;ll verify it&rsquo;s you and complete the deletion within 7 days.
      </p>

      <h2 className={h2}>What is deleted, and what is kept</h2>
      <p className={p}>Deleted immediately:</p>
      <ul className={ul}>
        <li>Your login credentials and authentication account;</li>
        <li>Your profile (name, photo, bio, contact details, saved preferences);</li>
        <li>For hosts: your listings, host profile and uploaded documents;</li>
        <li>Your saved experiences, notification settings and device tokens.</li>
      </ul>
      <p className={p}>Kept after deletion:</p>
      <ul className={ul}>
        <li>
          Booking and payment records are retained in <strong>anonymised</strong> form (no longer
          linked to your identity), as required for financial reporting, fraud prevention and legal
          compliance under Singapore law;
        </li>
        <li>
          Reviews you posted may remain visible without your name or profile attached.
        </li>
      </ul>
      <p className={p}>
        Payment card details are held by our payment processor, Stripe, and are never stored by
        ToGatherSG. There is no additional retention period beyond the anonymised records described
        above. For full details, see our Privacy Policy.
      </p>

      <RelatedLink
        href="/privacy"
        label="Privacy Policy"
        description="How ToGatherSG collects, uses and protects your personal data."
        eyebrow="Related"
      />
    </PolicyLayout>
  );
}
