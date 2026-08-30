export async function generateMetadata({ params }) {
  const { subject: rawSubject } = await params;

  const subject = decodeURIComponent(rawSubject);

  return {
    title: `${subject} — মনোভূমি`,
    description: `${subject} বিষয়ের শিক্ষামূলক বিষয়বস্তু ও জ্ঞান — মনোভূমি।`,
  };
}

export default function SubjectLayout({ children }) {
  return children;
}
