import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Làng nghề",
  description: "Làng nghề",
  openGraph: {
    title: "Làng nghề",
    description: "Làng nghề",
    images: ["/images/og-image.png"],
  },
};

function page() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Làng nghề</h1>
    </div>
  );
}
export default page;
