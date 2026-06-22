import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import image_Half_Logo from "@/imports/Half_Logo.png";
import { Footer } from "./Footer";

// Shared style helpers
const h2 = "text-2xl font-bold text-gray-900 mt-14 mb-4 scroll-mt-24";
const h3 = "text-lg font-semibold text-gray-900 mt-8 mb-2";
const p = "text-gray-700 leading-relaxed mb-4";
const ul = "list-disc pl-6 space-y-1.5 text-gray-700 mb-4 marker:text-[#8A2BE2]";
const ulSub = "list-[circle] pl-6 space-y-1 text-gray-700 mt-1 marker:text-gray-400";

export function HostGuidelinesPage() {
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
          {/* ============ HOST ONBOARDING GUIDE ============ */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8A2BE2] mb-6">
            ToGatherSG Host Onboarding Guide
          </h1>
          <p className={p}>
            Welcome to ToGatherSG! We're excited to have you on board. Follow the steps below to
            get started as a host.
          </p>
          <p className={p}>
            As ToGatherSG is still in <strong>Beta</strong>, you may experience some bugs or minor
            issues while using the app as we continue to improve it. We truly appreciate your
            patience, understanding and support during this phase. If you run into any issues,
            please email us at{" "}
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
            To become a host on ToGatherSG, you must first create a <strong>user account</strong> on
            the main app. Sign up using your:
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
            <strong>main ToGatherSG app</strong>. Go to your <strong>Profile Page</strong> and fill
            in the <strong>host onboarding form</strong>. Prepare the following details:
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
            <strong>ToGatherSG Host Standards &amp; Safety Guidelines</strong> (below) carefully.
            This is to ensure that you understand our community standards, hosting requirements, and
            expectations before proceeding.
          </p>
          <div className="rounded-xl border-2 border-[#F4C300] bg-[#F4C300]/10 p-5 mb-4">
            <p className="font-semibold text-gray-900 mb-2">
              For Hosts Planning Culinary Activities or Dining Sessions
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you plan to host <strong>culinary workshops, food-related activities, or dining
              sessions</strong>, you must upload your <strong>food safety certification</strong>{" "}
              during onboarding.
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              Please note that <strong>without a valid food safety certificate, you will not be able
              to publish culinary workshops on the platform</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not yet have one, you may apply for it through the relevant certification
              link provided.
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
            Once everything is approved, you may download the <strong>ToGatherSG Host App</strong>,
            sign in using the same account details as your main app, and begin listing your
            experiences.
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
              Choose your preferred hosting dates and times carefully. Please ensure your
              availability is accurate to avoid scheduling conflicts.
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
              including your unit number, together with clear directions so guests can locate your
              venue easily.
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

          {/* ============ HOST STANDARDS & SAFETY GUIDELINES ============ */}
          <hr className="my-14 border-gray-200" />
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8A2BE2] mb-6">
            ToGatherSG Host Standards &amp; Safety Guidelines
          </h1>
          <p className={p}>
            At ToGatherSG, we prioritise the safety, comfort, and enjoyment of our community. All
            Hosts are expected to maintain a safe, respectful, and high-quality experience for all
            guests.
          </p>
          <p className={p}>
            These guidelines apply to all Experiences listed on the platform, whether hosted in a
            home, private residential space, or other approved residential venue.
          </p>

          <h2 className={h2}>1. General Hosting Standards</h2>
          <h3 className={h3}>1.1 Cleanliness &amp; Readiness</h3>
          <p className={p}>
            Hosts must ensure the venue is clean, sanitary, clutter-free, and properly prepared
            before each session.
          </p>
          <h3 className={h3}>1.2 Safety</h3>
          <p className={p}>Hosts must ensure the venue is reasonably safe for guests at all times, including:</p>
          <ul className={ul}>
            <li>dry and non-slippery floors</li>
            <li>adequate lighting at entryways, activity areas, and restrooms</li>
            <li>safe access in and out of the venue</li>
            <li>proper storage of sharp, hazardous, or fragile items</li>
          </ul>
          <h3 className={h3}>1.3 Accessibility &amp; Arrival Information</h3>
          <p className={p}>
            Hosts must provide clear directions, entry instructions, and any relevant arrival
            details for booked guests. To protect Host privacy and safety, only a{" "}
            <strong>general location</strong> will be displayed publicly. The{" "}
            <strong>exact address and full arrival details</strong> will be shared only with
            confirmed users <strong>48 hours prior to the workshop</strong>.
          </p>
          <h3 className={h3}>1.4 Ventilation</h3>
          <p className={p}>
            The premise must have adequate ventilation, especially for cooking, arts and crafts, or
            physical activities.
          </p>
          <h3 className={h3}>1.5 Listing Accuracy</h3>
          <p className={p}>
            Photos and descriptions must accurately reflect the actual venue, setup, and experience
            being provided.
          </p>
          <h3 className={h3}>1.6 Pets</h3>
          <p className={p}>
            If pets are present at the venue, this must be clearly disclosed in the listing. Pets
            must be properly supervised at all times. Hosts should take reasonable steps to ensure
            that pets do not disrupt the Experience or compromise guest comfort and safety.
          </p>

          <h2 className={h2}>2. Respect for Neighbours &amp; Property Rules</h2>
          <p className={p}>
            Hosts must conduct all Experiences in a way that is respectful of neighbours and the
            surrounding community.
          </p>
          <h3 className={h3}>2.1 No Disturbance to Neighbours</h3>
          <p className={p}>
            Activities must not create excessive noise, crowding, obstruction, nuisance, smells, or
            other disturbance to neighbours or shared spaces.
          </p>
          <h3 className={h3}>2.2 No Hosting After 10pm</h3>
          <p className={p}>
            As a <strong>ToGatherSG platform rule</strong>, Hosts must not conduct Experiences after{" "}
            <strong>10pm</strong>. Guests should leave in an orderly and quiet manner, and any
            cleanup should also not disturb neighbours.
          </p>
          <h3 className={h3}>2.3 Common Areas</h3>
          <p className={p}>
            Guests must not loiter, gather noisily, or obstruct corridors, lifts, staircases,
            carparks, or other common property.
          </p>
          <h3 className={h3}>2.4 MCST / Landlord / Venue Rules</h3>
          <p className={p}>
            Hosts must comply with all applicable property owner, landlord, business management
            (e.g. MCST), and venue rules. If any such rules prohibit or restrict the activity, the
            Host must not proceed.
          </p>
          <h3 className={h3}>2.5 Complaints</h3>
          <p className={p}>
            If complaints are received from neighbours, building management, MCST, landlord, or
            relevant authorities, ToGatherSG may require the Host to modify, suspend, or stop
            hosting.
          </p>
          <p className={p}>
            This aligns with Singapore's home-based business framework, which allows small-scale
            home-based activity without separate planning permission from HDB or URA, provided the
            relevant scheme requirements are met and the activity remains suitable for a residential
            setting.
          </p>

          <h2 className={h2}>3. Venue Eligibility &amp; Compliance</h2>
          <h3 className={h3}>3.1 Permitted Venues</h3>
          <p className={p}>Hosts may only host from venues they are authorised to use, including:</p>
          <ul className={ul}>
            <li>their own home</li>
            <li>a rented home, where permitted</li>
            <li>another private residential space with proper permission</li>
            <li>selected shared residential facilities, where allowed under the applicable condo, landlord, or venue rules</li>
            <li>certain public spaces, such as parks, where such use is permitted and all applicable rules, approvals, and regulations are complied with</li>
          </ul>
          <p className={p}>
            ToGatherSG does <strong>not currently support</strong> workshops hosted in external
            commercial studios, shops, or other standalone rental venues unless otherwise approved
            by ToGatherSG.
          </p>
          <h3 className={h3}>3.2 Responsibility for Compliance</h3>
          <p className={p}>
            Hosts are solely responsible for ensuring that their Experience is lawful and permitted
            at the venue, including compliance with all applicable laws, licences, certifications,
            landlord approvals, venue policies, and safety requirements.
          </p>
          <h3 className={h3}>3.3 Home-Based Business Rules</h3>
          <p className={p}>
            Where hosting takes place from a residence, Hosts must ensure the activity complies with{" "}
            <strong>Singapore's Home-Based Business Scheme requirements</strong>, including all
            relevant licensing and regulatory requirements.
          </p>
          <h3 className={h3}>3.4 Domestic Workers</h3>
          <p className={p}>
            Domestic workers must not be used to support or assist with any business or
            hosting-related activity. MOM states that migrant domestic workers may only perform
            domestic chores at the declared residential address and must not work for the employer's
            business, including a home-based business.
          </p>
          <h3 className={h3}>3.5 Business Registration</h3>
          <p className={p}>
            Some hobby-based or occasional activities may not require ACRA registration. Hosts remain
            responsible for determining whether business registration is required for their
            activities.
          </p>

          <h2 className={h2}>4. Category-Specific Safety Requirements</h2>
          <h3 className={h3}>4.1 Food, Dining &amp; Alcohol Requirements</h3>
          <p className={p}>
            <strong>Food Safety Training.</strong> For ToGatherSG's platform standards, all culinary
            Hosts must hold a valid <strong>WSQ Food Safety Course Level 1</strong> certificate.
          </p>
          <p className={p}>
            <strong>Home-Based Food Businesses.</strong> Home-based food businesses currently do{" "}
            <strong>not</strong> require an SFA food retail licence, but they must still comply with
            food laws and food safety requirements. SFA states that home-based food businesses:
          </p>
          <ul className={ul}>
            <li>must comply with food laws</li>
            <li>must not offer food catering</li>
            <li>must not sell food to food retailers</li>
            <li>must not sell food at or to temporary fairs</li>
            <li>must not sell ready-to-eat raw seafood</li>
            <li>must ensure ingredients are legally sourced</li>
            <li>must ensure food prepared and sold is safe for consumption</li>
          </ul>
          <p className={p}>
            <strong>Cooking &amp; Dining Experiences.</strong> If you are hosting a Cooking &amp;
            Dining experience, Hosts must ensure that:
          </p>
          <ul className={ul}>
            <li>kitchen surfaces, utensils, storage areas, and fridges are clean and hygienic</li>
            <li>a handwashing area with soap is available</li>
            <li>any known allergens, including common allergens such as nuts, shellfish, dairy, eggs, and gluten, are clearly disclosed</li>
            <li>the listing clearly states whether the food is <strong>halal</strong>, <strong>not halal</strong>, or <strong>not halal-certified</strong></li>
            <li>any other relevant dietary information is communicated clearly to guests in the workshop description</li>
            <li>knives, sharp tools, hot surfaces, and flammable items are handled and stored safely</li>
          </ul>
          <p className={p}>
            <strong>Sale or Supply of Alcohol.</strong> If a Host intends to sell or supply
            alcoholic drinks from residential premises, including online supply, the Host must obtain
            the appropriate <strong>liquor licence</strong>. Such applications are assessed by the
            Police, including considerations on the suitability of the residence and whether the
            applicant satisfies the relevant fit and proper criteria. Hosts should refer to{" "}
            <strong>GoBusiness Singapore</strong> for further information on the applicable
            requirements and licensing process.
          </p>
          <p className={p}>
            <strong>Alcohol &amp; Age Restrictions.</strong> Where alcohol is served, sold, or
            supplied as part of an Experience, Hosts must ensure the activity is restricted to users
            aged <strong>18 and above</strong> and must comply with all applicable laws, licence
            conditions, and venue rules.
          </p>
          <h3 className={h3}>4.2 Arts &amp; Crafts</h3>
          <p className={p}>If you are hosting an Arts &amp; Crafts experience:</p>
          <ul className={ul}>
            <li>materials should be non-toxic unless clearly disclosed</li>
            <li>the venue must be well-ventilated especially if paints, glues, or solvents are used</li>
            <li>protective gear such as gloves, masks, or aprons must be provided where needed</li>
            <li>cutting tools or sharp objects must be supervised</li>
          </ul>
          <h3 className={h3}>4.3 Fitness &amp; Wellness</h3>
          <p className={p}>
            If you are hosting a Fitness &amp; Wellness experience, Hosts must ensure that the
            activity area is clear of obstacles and fragile items, suitable flooring, mats, or
            non-slip surfaces are provided where needed, and the listing clearly states the activity
            intensity level and any relevant physical requirements. Where such activities are
            conducted in condominium gyms, function rooms, parks, or other shared or public spaces,
            Hosts must also comply with all applicable condo or building management rules, venue
            policies, public-space regulations, and permit requirements. NParks requires permits for
            certain organised group activities and some park uses, depending on the location, group
            size, and nature of the activity.
          </p>

          <h2 className={h2}>5. Session Protocol</h2>
          <p className={p}>Before each session, Hosts must ensure that:</p>
          <ul className={ul}>
            <li>the venue is cleaned and prepared</li>
            <li>all materials, ingredients, and equipment are in safe and usable condition</li>
            <li>power outlets are not overloaded</li>
            <li>guests are given a brief orientation, including any relevant house rules, safety reminders, and restroom location</li>
          </ul>

          <h2 className={h2}>6. Enforcement</h2>
          <p className={p}>
            Failure to comply with these standards may result in action by ToGatherSG, including:
          </p>
          <ul className={ul}>
            <li>listing edits or removal</li>
            <li>suspension of hosting privileges</li>
            <li>cancellation of sessions</li>
            <li>permanent removal from the platform where necessary</li>
          </ul>
          <p className={p}>
            ToGatherSG reserves the right to investigate complaints and request documents or
            clarifications where safety, legality, or community trust is at risk.
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
