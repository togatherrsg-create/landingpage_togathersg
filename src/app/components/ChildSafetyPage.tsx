import { PolicyLayout, RelatedLink, h1, h2, p, ul } from "./PolicyLayout";

// Public child-safety (CSAE) standards page, required by Google Play's Child
// Safety Standards policy. Linked from Play Console → App content for both the
// ToGatherSG customer app and the ToGatherSG Host app.
export function ChildSafetyPage() {
  return (
    <PolicyLayout>
      <h1 className={h1}>Child Safety Standards</h1>

      <p className={p}>
        ToGatherSG operates a marketplace for home-based experiences in Singapore, published through
        the <strong>ToGatherSG</strong> app (for guests) and the <strong>ToGatherSG Host</strong>{" "}
        app (for hosts). We have zero tolerance for child sexual abuse and exploitation
        (&ldquo;CSAE&rdquo;) in any form. These standards describe how we prevent, detect and
        respond to it across our platform.
      </p>

      <h2 className={h2}>Prohibited conduct</h2>
      <p className={p}>The following are strictly prohibited on ToGatherSG:</p>
      <ul className={ul}>
        <li>
          Creating, uploading, sharing, requesting or linking to child sexual abuse material (CSAM)
          of any kind, in listings, photos, chat messages, reviews or any other content;
        </li>
        <li>Grooming, sexual extortion, or any sexualised contact with or about minors;</li>
        <li>
          Using ToGatherSG experiences, bookings or chat to arrange or facilitate any form of child
          exploitation or trafficking.
        </li>
      </ul>
      <p className={p}>
        Violations result in immediate removal of content, permanent account termination, and
        reporting to the relevant authorities.
      </p>

      <h2 className={h2}>How we keep the platform safe</h2>
      <ul className={ul}>
        <li>
          ToGatherSG accounts and bookings are intended for adults; some experiences are
          additionally restricted to guests aged 18 and above;
        </li>
        <li>
          Hosts apply with identity and business details and are manually reviewed and approved by
          our team before they can run experiences;
        </li>
        <li>Listings, photos and reviews are subject to moderation and can be removed;</li>
        <li>
          In-app chat exists only between a host and their confirmed guests, is subject to our
          community guidelines, and can be reported and reviewed.
        </li>
      </ul>

      <h2 className={h2}>Reporting child safety concerns</h2>
      <ul className={ul}>
        <li>
          <strong>In-app:</strong> use the Support / Contact section of either app to report any
          content, listing, message or user — reports are reviewed by our team;
        </li>
        <li>
          <strong>By email:</strong> contact{" "}
          <a href="mailto:support@togathersg.com" className="text-[#8A2BE2] font-medium">
            support@togathersg.com
          </a>{" "}
          — reports of child safety concerns are prioritised and acted on promptly.
        </li>
      </ul>
      <p className={p}>
        When we become aware of CSAM, we remove it, preserve evidence as required, terminate the
        accounts involved and report to the Singapore Police Force and/or other competent
        authorities, in line with applicable law.
      </p>

      <h2 className={h2}>Legal compliance and point of contact</h2>
      <p className={p}>
        ToGatherSG complies with applicable child safety laws, including Singapore&rsquo;s Penal
        Code and the Children and Young Persons Act, and cooperates with law enforcement requests.
        Our designated child safety point of contact can be reached at{" "}
        <a href="mailto:support@togathersg.com" className="text-[#8A2BE2] font-medium">
          support@togathersg.com
        </a>
        .
      </p>

      <RelatedLink
        href="/terms"
        label="Terms &amp; Conditions"
        description="The full rules for using ToGatherSG."
        eyebrow="Related"
      />
    </PolicyLayout>
  );
}
