import { landingBody } from "./landingBody.js";

/** Public landing — same content as the Netlify page / syllabus program. No admin link. */
export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: landingBody }} />;
}
