import { baseMetadata, RootHtml } from "@/components/root-html";

export const metadata = baseMetadata;

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
