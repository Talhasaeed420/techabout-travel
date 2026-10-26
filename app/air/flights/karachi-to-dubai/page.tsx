import Image from "next/image";
import Button from "../../../../components/ui/Button";

// This page is saved (cached) and rebuilt in the background at most once an hour (3600 seconds).
// It only has facts that rarely change. There are no fares here, those only live on /air/search.
export const revalidate = 3600;

// the content of this page
const PAGE = {
  title: "Flights from Karachi to Dubai",
  imageAlt: "Dubai skyline with the Burj Khalifa",
  intro: "Emirates, flydubai, Air Arabia, Airblue and PIA fly this route non-stop. The shortest flight is about 2h 45m.",
  button: "See today's fares",
  faqTitle: "Common questions",
  faq: [
    { question: "Which airlines fly from Karachi to Dubai?", answer: "PIA, Emirates, flydubai, Air Arabia and Airblue fly non-stop. Qatar Airways and Saudia stop on the way." },
    { question: "Why are there no prices on this page?", answer: "Fares change all the time, so we only show them live in the search results." },
    { question: "How can I pay?", answer: "You can pay with JazzCash or Easypaisa when you book." },
  ],
  builtOn: "This page was last built on",
};

export const metadata = { title: PAGE.title };

export default function KarachiToDubaiPage() {
  // shows when this copy was made, so you can see the cache working
  const builtAt = new Date().toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "medium" });

  return (
    <div className="page">
      <Image src="/assets/dubai.jpeg" alt={PAGE.imageAlt} width={1200} height={400} priority className="hero" />
      <h1>{PAGE.title}</h1>
      <p>{PAGE.intro}</p>
      <Button href="/air/search?from=KHI&to=DXB">{PAGE.button}</Button>

      <h2 className="space-top">{PAGE.faqTitle}</h2>
      {PAGE.faq.map((item) => (
        <div key={item.question} className="faq">
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}

      <p className="muted space-top">
        {PAGE.builtOn} {builtAt} (Pakistan time).
      </p>
    </div>
  );
}
