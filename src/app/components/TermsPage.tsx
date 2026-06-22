import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import image_Half_Logo from "@/imports/Half_Logo.png";
import { Footer } from "./Footer";

// Shared style helpers
const h2 = "text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-24";
const p = "text-gray-700 leading-relaxed mb-4";
const ll = "list-none space-y-1.5 text-gray-700 mb-4 pl-4"; // lettered sub-clauses

export function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-['Satoshi',sans-serif] bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src={image_Half_Logo}
                alt="ToGatherSG Logo"
                className="h-12 w-12 rounded-lg object-cover mx-[-18px]"
              />
              <span className="font-semibold text-gray-900 text-[18px]">ToGatherSG</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#8A2BE2] hover:text-[#8A2BE2]/80 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to home
            </a>
          </div>
        </div>
      </header>

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8A2BE2] mb-6">
            ToGatherSG's Host Terms &amp; Conditions
          </h1>
          <p className={p}>
            These ToGatherSG Host Terms (the <strong>"Terms"</strong>) govern your registration as a
            host and your listing or hosting of any Experience on the ToGatherSG platform (the{" "}
            <strong>"Platform"</strong>).
          </p>
          <p className={p}>
            By registering as a Host, creating or publishing a listing, accepting a booking, or
            continuing to host any Experience through the Platform, you acknowledge that you have
            read, understood, and agree to be bound by these Terms, together with all policies,
            standards, guidelines, and operational rules issued by ToGatherSG from time to time,
            including the <strong>ToGatherSG Host Standards &amp; Safety Guidelines</strong>.
          </p>

          <h2 className={h2}>1. Definitions</h2>
          <p className={p}>In these Terms, unless the context otherwise requires:</p>
          <p className={p}>
            <strong>"Applicable Law"</strong> means all laws, regulations, subsidiary legislation,
            codes, directions, licence conditions, by-laws, and regulatory requirements applicable to
            the Host, the Experience, the Premise, or the use of the Platform.
          </p>
          <p className={p}>
            <strong>"Booking"</strong> means a confirmed reservation made by a User for an Experience
            through the Platform.
          </p>
          <p className={p}>
            <strong>"Experience"</strong> means any workshop, session, activity, class, dining
            experience, or other offering listed by a Host on the Platform.
          </p>
          <p className={p}>
            <strong>"Host"</strong>, <strong>"you"</strong>, or <strong>"your"</strong> means the
            individual or entity registered to offer Experiences on the Platform.
          </p>
          <p className={p}>
            <strong>"Host Cancellation Penalty"</strong> means the penalty payable by the Host under
            Clause 11.
          </p>
          <p className={p}>
            <strong>"Platform Fee"</strong> means the fee charged by ToGatherSG under Clause 9.
          </p>
          <p className={p}>
            <strong>"ToGatherSG"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or{" "}
            <strong>"our"</strong> means ToGatherSG LLP.
          </p>
          <p className={p}>
            <strong>"User"</strong> means any customer, participant, or end-user who views, books, or
            attends an Experience through the Platform.
          </p>
          <p className={p}>
            <strong>"Premise"</strong> means the location at which the Experience is conducted.
          </p>

          <h2 className={h2}>2. Nature of the Platform</h2>
          <p className={p}>
            2.1 ToGatherSG operates an online platform through which Hosts may list and offer
            Experiences to Users.
          </p>
          <p className={p}>
            2.2 You acknowledge and agree that ToGatherSG is a platform provider only and does not
            organise, operate, manage, supervise, or control your Experience unless expressly stated
            otherwise in writing.
          </p>
          <p className={p}>
            2.3 You are solely responsible for the planning, preparation, conduct, safety, legality,
            and delivery of each Experience.
          </p>
          <p className={p}>
            2.4 Nothing in these Terms creates any employment, agency, fiduciary, partnership, joint
            venture, or franchise relationship between you and ToGatherSG.
          </p>

          <h2 className={h2}>3. Host Eligibility and Authority</h2>
          <p className={p}>3.1 You represent and warrant on an ongoing basis that:</p>
          <ul className={ll}>
            <li>(a) you are at least 18 years of age;</li>
            <li>(b) you have full legal capacity and authority to accept and comply with these Terms;</li>
            <li>(c) all information submitted to ToGatherSG is true, accurate, complete, and not misleading;</li>
            <li>(d) you are authorised to use the Premise for the Experience; and</li>
            <li>(e) you will comply with these Terms and all Applicable Law.</li>
          </ul>
          <p className={p}>
            3.2 If you register as a Host on behalf of a business or entity, you represent and warrant
            that you are authorised to bind that business or entity to these Terms.
          </p>

          <h2 className={h2}>4. Premise Eligibility and Compliance</h2>
          <p className={p}>
            4.1 You may only host from premises that you are authorised to use, including:
          </p>
          <ul className={ll}>
            <li>(a) your own home;</li>
            <li>(b) a rented home, where permitted;</li>
            <li>(c) another private residential space, where permitted; or</li>
            <li>(d) selected shared residential facilities, where permitted by the applicable condo, landlord, property owner, or premise rules.</li>
          </ul>
          <p className={p}>
            4.2 ToGatherSG does not currently support workshops hosted in external commercial
            studios, shops, or other standalone rental premises unless otherwise approved by
            ToGatherSG in writing.
          </p>
          <p className={p}>
            4.3 Where the Experience is hosted from a residence, you must ensure that the activity
            complies with Singapore's home-based business requirements and all related licensing and
            regulatory obligations.
          </p>
          <p className={p}>
            4.4 You must comply with all applicable rules imposed by the property owner, landlord,
            building management (including any Management Corporation Strata Title (MCST)) and any
            rules applicable to the premises. If any such rule prohibits or restricts the Experience,
            you must not proceed.
          </p>
          <p className={p}>
            4.5 You are solely responsible for obtaining all necessary permissions, approvals,
            licences, certificates, and consents required for the Experience and the Premise.
          </p>

          <h2 className={h2}>5. Listings and Accuracy of Information</h2>
          <p className={p}>
            5.1 You must ensure that all listing content, including photographs, descriptions, menus,
            pricing, schedules, activity levels, capacity, and Premise information, is accurate,
            complete, up to date, and not misleading.
          </p>
          <p className={p}>5.2 You must promptly update your listing if any material information changes.</p>
          <p className={p}>
            5.3 You must not publish or offer any Experience that is unlawful, unsafe, misleading,
            discriminatory, or otherwise prohibited by ToGatherSG.
          </p>
          <p className={p}>
            5.4 To protect Host privacy and safety, only a general location shall be shown publicly.
            The exact address and full arrival details shall only be released to confirmed
            participants 48 hours prior to the Experience.
          </p>

          <h2 className={h2}>6. Host Standards and Operational Obligations</h2>
          <p className={p}>6.1 You must comply and agree at all times with:</p>
          <ul className={ll}>
            <li>(a) these Terms;</li>
            <li>(b) the ToGatherSG Host Standards &amp; Safety Guidelines;</li>
            <li>(c) any other policies or operational rules issued by ToGatherSG from time to time; and</li>
            <li>(d) all Applicable Law.</li>
          </ul>

          <h2 className={h2}>7. Alcohol</h2>
          <p className={p}>
            7.1 If your Experience involves the sale, supply, service, or consumption of alcohol, you
            are solely responsible for ensuring full compliance with all applicable laws, licensing
            requirements, and rules relating to the premises.
          </p>
          <p className={p}>
            7.2 You must clearly state in your listing if alcohol will be served or made available
            during the Experience. Any such Experience must be labelled as strictly 18+ only.
          </p>
          <p className={p}>
            7.3 You are solely responsible for verifying participants' eligibility to consume alcohol
            and must not serve or permit the consumption of alcohol by any person under the age of 18.
            You must refuse service where required by law or where you are unable to reasonably verify
            that a participant is 18 or above.
          </p>
          <p className={p}>
            7.4 ToGatherSG is not responsible for any alcohol related non-compliance, unlawful
            service, underage consumption, or breach of any applicable law, licence condition, or
            premises rule by the Host.
          </p>

          <h2 className={h2}>8. Domestic Workers, Co-Hosts and Substitutes</h2>
          <p className={p}>
            8.1 Domestic workers, including migrant domestic workers, must not be used to support,
            assist with, or perform any part of an Experience where this is prohibited by applicable
            law.
          </p>

          <h2 className={h2}>9. Pricing, Platform Fees and Payouts</h2>
          <p className={p}>
            9.1 You may set the listed price of the Experience, subject to any pricing features,
            promotions, discounts, campaigns, or commercial arrangements made available or agreed with
            ToGatherSG.
          </p>
          <p className={p}>
            9.2 ToGatherSG shall charge a <strong>Platform Fee of 12.5% per successful transaction</strong>{" "}
            booked through the Platform.
          </p>
          <p className={p}>
            9.3 Unless otherwise determined by ToGatherSG, the Platform Fee shall be calculated on the
            gross booking amount paid by the User for the Experience.
          </p>
          <p className={p}>
            9.4 ToGatherSG may set off any amounts payable to you against any outstanding liabilities
            owed by you to us, including, without limitation:
          </p>
          <ul className={ll}>
            <li>(a) Platform Fees;</li>
            <li>(b) refunds;</li>
            <li>(c) chargebacks;</li>
            <li>(d) payment disputes;</li>
            <li>(e) Host Cancellation Penalties;</li>
            <li>(f) fraud-related losses;</li>
            <li>(g) promotional subsidies agreed by you; and</li>
            <li>(h) other sums due from you to ToGatherSG.</li>
          </ul>
          <p className={p}>
            9.5 ToGatherSG may withhold, delay, reverse, suspend, or adjust payouts where reasonably
            necessary for fraud review, chargeback risk, payment investigation, dispute resolution,
            policy enforcement, or operational compliance.
          </p>

          <h2 className={h2}>10. Taxes</h2>
          <p className={p}>
            10.1 You are solely responsible for determining, reporting, collecting, remitting, and
            paying all taxes, levies, duties, charges, or similar governmental assessments arising
            from or relating to your use of the Platform, the listing of any Experience, or the
            receipt of any revenue, payout, or income from the Experience.
          </p>
          <p className={p}>
            10.2 ToGatherSG does not provide tax advice and shall not be responsible for your tax
            obligations.
          </p>
          <p className={p}>
            10.3 Where required by Applicable Law, ToGatherSG may withhold or report sums in
            connection with tax obligations.
          </p>

          <h2 className={h2}>11. Host Cancellation and Penalties</h2>
          <p className={p}>
            11.1 You must not cancel a confirmed Experience except where strictly necessary.
          </p>
          <p className={p}>
            11.2 If you cancel a confirmed Experience less than 48 hours before the scheduled start
            time:
          </p>
          <ul className={ll}>
            <li>(a) affected Users shall be entitled to a full refund; and</li>
            <li>(b) you shall incur a Host Cancellation Penalty.</li>
          </ul>
          <p className={p}>11.3 The Host Cancellation Penalty shall comprise:</p>
          <ul className={ll}>
            <li>(a) a base penalty equal to <strong>50% of the class price</strong>; plus</li>
            <li>(b) an additional participant penalty equal to <strong>5% of the class price multiplied by the number of participants signed up for the Experience</strong>.</li>
          </ul>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4 text-gray-700 text-sm leading-relaxed">
            <strong>For illustration only:</strong> if the class price is <strong>S$100</strong> and{" "}
            <strong>4 participants</strong> have signed up for the Experience, the Host Cancellation
            Penalty will be <strong>S$70</strong>, comprising a <strong>S$50</strong> base penalty and
            a <strong>S$5</strong> per participant penalty <strong>(S$20)</strong>.
          </div>
          <p className={p}>
            11.4 The Host Cancellation Penalty may be accrued and deducted from your next payout or any
            future amounts due to you.
          </p>
          <p className={p}>
            11.5 ToGatherSG may, in its sole discretion, waive or reduce the Host Cancellation Penalty
            in the case of a verified emergency, safety risk, force majeure event, or other
            exceptional circumstance.
          </p>

          <h2 className={h2}>12. Refunds, Chargebacks and Fraud</h2>
          <p className={p}>
            12.1 ToGatherSG may issue refunds, credits, or booking adjustments to Users where required
            under platform policy or where ToGatherSG reasonably determines that such action is
            appropriate to resolve a complaint, dispute, safety issue, service failure, fraud concern,
            or payment issue.
          </p>
          <p className={p}>
            12.2 Where any refund, chargeback, reversal, payment dispute, fraud loss, or similar
            deduction arises from or relates to:
          </p>
          <ul className={ll}>
            <li>(a) your cancellation;</li>
            <li>(b) inaccurate or misleading listing information;</li>
            <li>(c) failure to deliver the Experience as described;</li>
            <li>(d) your misconduct or breach of these Terms; or</li>
            <li>(e) suspected or actual fraud, abuse, collusion, or unauthorised activity connected to you or the Experience,</li>
          </ul>
          <p className={p}>
            ToGatherSG may recover the relevant amount from you, including by deduction, set-off,
            withholding, debit, or clawback from payouts.
          </p>
          <p className={p}>
            12.3 You must provide all information and cooperation reasonably requested by ToGatherSG in
            connection with any payment dispute, chargeback, fraud review, or investigation.
          </p>
          <p className={p}>
            12.4 ToGatherSG may suspend payouts, listings, or your Host account where it reasonably
            suspects fraud, abuse, unauthorised transactions, or elevated chargeback risk.
          </p>

          <h2 className={h2}>13. Insurance</h2>
          <p className={p}>
            13.1 You acknowledge that you are responsible for assessing whether insurance is
            appropriate for the Experience, Premise, and associated risks.
          </p>
          <p className={p}>
            13.2 ToGatherSG may, at any time upon written notice, require Hosts or specified categories
            of Hosts to maintain appropriate insurance coverage, including public liability insurance,
            product liability insurance, or any other insurance reasonably required by ToGatherSG.
          </p>
          <p className={p}>13.3 Where insurance is required by ToGatherSG under Clause 13.2, you must:</p>
          <ul className={ll}>
            <li>(a) obtain and maintain such insurance at your own cost;</li>
            <li>(b) ensure that the policy remains valid for the duration of your hosting activity; and</li>
            <li>(c) provide evidence of such insurance to ToGatherSG upon request.</li>
          </ul>
          <p className={p}>
            13.4 Failure to obtain or maintain required insurance shall constitute a material breach of
            these Terms.
          </p>

          <h2 className={h2}>14. Personal Data and PDPA Compliance</h2>
          <p className={p}>
            14.1 Each party must comply with the Personal Data Protection Act 2012 of Singapore and all
            related regulations, advisory guidelines, and legally binding requirements applicable to
            that party.
          </p>
          <p className={p}>
            14.2 You may only collect, use, disclose, access, store, or otherwise process personal data
            to the extent reasonably necessary for the performance of the Experience and in accordance
            with Applicable Law.
          </p>
          <p className={p}>
            14.3 You must implement reasonable administrative, physical, and technical security
            arrangements to protect personal data in your possession or under your control against
            unauthorised access, collection, use, disclosure, copying, modification, disposal, or
            similar risks.
          </p>
          <p className={p}>
            14.4 You must not retain personal data for longer than is reasonably necessary for legal or
            business purposes connected to the Experience.
          </p>
          <p className={p}>
            14.5 You must immediately notify ToGatherSG upon becoming aware of any actual or suspected
            personal data breach, unauthorised disclosure, loss of personal data, or security incident
            affecting Users or the Platform.
          </p>
          <p className={p}>
            14.6 You must cooperate fully with ToGatherSG in investigating and responding to any
            personal data incident or PDPA-related complaint.
          </p>
          <p className={p}>
            14.7 You must not use User personal data for unrelated marketing, solicitation, or
            off-platform engagement unless expressly permitted by Applicable Law and ToGatherSG.
          </p>

          <h2 className={h2}>15. Safety, Incidents and Complaints</h2>
          <p className={p}>15.1 You must promptly notify ToGatherSG of any:</p>
          <ul className={ll}>
            <li>(a) accident, injury, illness, allergen issue, food safety issue, or security incident;</li>
            <li>(b) complaint from neighbours, building management, landlord, MCST, or any authority;</li>
            <li>(c) warning, investigation, or enforcement action relating to the Experience; or</li>
            <li>(d) material event affecting the safety, legality, or delivery of the Experience.</li>
          </ul>
          <p className={p}>
            15.2 You must cooperate fully with any investigation, review, or information request by
            ToGatherSG.
          </p>

          <h2 className={h2}>16. Suspension, Removal and Termination</h2>
          <p className={p}>
            16.1 ToGatherSG may, with immediate effect and without liability, suspend, restrict, remove
            listings, withhold payouts, or terminate your access to hosting on the Platform if:
          </p>
          <ul className={ll}>
            <li>(a) you breach these Terms or any platform policy;</li>
            <li>(b) you pose a safety, legal, reputational, financial, or operational risk;</li>
            <li>(c) you provide false, misleading, or incomplete information;</li>
            <li>(d) repeated complaints, payment disputes, cancellations, or compliance issues arise; or</li>
            <li>(e) ToGatherSG reasonably considers such action necessary to protect Users, the Platform, or the community.</li>
          </ul>
          <p className={p}>
            16.2 You may cease hosting at any time, subject to the completion or proper resolution of
            all pending Bookings, refunds, disputes, penalties, fees, and outstanding obligations.
          </p>
          <p className={p}>
            16.3 Suspension, removal, or termination shall be without prejudice to any accrued rights,
            remedies, liabilities, deductions, indemnities, or obligations arising before such action.
          </p>

          <h2 className={h2}>17. Intellectual Property and Content Licence</h2>
          <p className={p}>
            17.1 You grant ToGatherSG a non-exclusive, worldwide, royalty-free, transferable licence to
            use, reproduce, display, adapt, distribute, and promote your listing content, photographs,
            descriptions, branding, and related materials for the purpose of operating, improving, and
            marketing the Platform.
          </p>
          <p className={p}>
            17.2 You warrant that you have all rights necessary to grant the licence in Clause 17.1 and
            that your content does not infringe any third-party rights.
          </p>

          <h2 className={h2}>18. Indemnity</h2>
          <p className={p}>
            18.1 You shall indemnify, defend, and hold harmless ToGatherSG and its directors, officers,
            employees, agents, affiliates, and representatives from and against all losses, liabilities,
            claims, demands, actions, proceedings, damages, penalties, fines, costs, and expenses,
            including reasonable legal fees, arising out of or in connection with:
          </p>
          <ul className={ll}>
            <li>(a) your Experience;</li>
            <li>(b) any injury, death, loss, damage, illness, allergen issue, food safety issue, or incident connected with the Experience or Premise;</li>
            <li>(c) any breach of these Terms;</li>
            <li>(d) any breach of Applicable Law or any licence, permit, rule, or by-law by you;</li>
            <li>(e) any claim by a User or third party arising from your acts or omissions; or</li>
            <li>(f) any use, misuse, or disclosure of personal data by you.</li>
          </ul>

          <h2 className={h2}>19. Limitation of Liability</h2>
          <p className={p}>
            19.1 To the maximum extent permitted by law, ToGatherSG shall not be liable for any
            indirect, incidental, consequential, special, exemplary, or punitive loss or damage, or for
            any loss of profits, goodwill, revenue, business opportunity, or anticipated savings.
          </p>
          <p className={p}>
            19.2 To the maximum extent permitted by law, ToGatherSG's total aggregate liability to you
            arising out of or in connection with these Terms, whether in contract, tort, statute, or
            otherwise, shall not exceed the total Platform Fees actually received by ToGatherSG from you
            in the three months preceding the event giving rise to the claim.
          </p>
          <p className={p}>
            19.3 Nothing in these Terms shall exclude or restrict liability to the extent such exclusion
            or restriction is prohibited by law.
          </p>

          <h2 className={h2}>20. Amendments to Terms, Policies and Operational Rules</h2>
          <p className={p}>
            20.1 ToGatherSG may amend, update, supplement, replace, or withdraw these Terms, the Host
            Standards &amp; Safety Guidelines, and any other platform policy, operational rule,
            commercial term, or process from time to time.
          </p>
          <p className={p}>20.2 Any such amendment shall take effect on the date specified by ToGatherSG.</p>
          <p className={p}>
            20.3 By continuing to use the Platform, maintaining a listing, accepting a Booking, or
            hosting an Experience after the effective date of any amendment, you agree to the amended
            terms.
          </p>
          <p className={p}>
            20.4 ToGatherSG may maintain electronic records of your acceptance of these Terms, including
            the date, time, account details, device or session information, and version of the Terms
            accepted, and such records may be used as evidence of your agreement to these Terms.
          </p>

          <h2 className={h2}>21. Dispute Resolution and Mediation</h2>
          <p className={p}>
            21.1 The parties shall first attempt in good faith to resolve any dispute, controversy, or
            claim arising out of or in connection with these Terms through negotiation.
          </p>
          <p className={p}>
            21.2 If the dispute is not resolved within 30 days after written notice of the dispute,
            either party may refer the matter to mediation administered in Singapore by the Singapore
            Mediation Centre or such other recognised mediation body as the parties may agree.
          </p>
          <p className={p}>
            21.3 If the dispute is not resolved by mediation within 60 days from the date of referral to
            mediation, or such longer period as the parties may agree in writing, either party may
            commence court proceedings in Singapore.
          </p>

          <h2 className={h2}>22. Governing Law and Jurisdiction</h2>
          <p className={p}>
            22.1 These Terms shall be governed by and construed in accordance with the laws of
            Singapore.
          </p>
          <p className={p}>
            22.2 Subject to Clause 21, the parties submit to the exclusive jurisdiction of the courts of
            Singapore.
          </p>

          <h2 className={h2}>23. Miscellaneous</h2>
          <p className={p}>
            23.1 <strong>Entire Terms.</strong> These Terms constitute the entire understanding between
            you and ToGatherSG in relation to hosting on the Platform and supersede all prior
            discussions, understandings, and representations relating to that subject matter.
          </p>
          <p className={p}>
            23.2 <strong>Severability.</strong> If any provision of these Terms is held to be invalid,
            illegal, or unenforceable, the remaining provisions shall remain in full force and effect.
          </p>
          <p className={p}>
            23.3 <strong>No Waiver.</strong> No failure or delay by ToGatherSG in exercising any right
            or remedy shall operate as a waiver of that right or remedy.
          </p>
          <p className={p}>
            23.4 <strong>Assignment.</strong> You must not assign, transfer, subcontract, or otherwise
            deal with any of your rights or obligations under these Terms without ToGatherSG's prior
            written consent. ToGatherSG may assign or transfer these Terms without your consent.
          </p>
          <p className={p}>
            23.5 <strong>Rights of Third Parties.</strong> A person who is not a party to these Terms
            shall have no right to enforce any term of these Terms under the Contracts (Rights of Third
            Parties) Act 2001 of Singapore, except where expressly stated otherwise.
          </p>

          <div className="mt-14 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#8A2BE2] hover:text-[#8A2BE2]/80 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
