import { site } from "@/lib/site";

/**
 * Scaffold landing page. Deliberately holds no invented copy about the venue —
 * it is replaced wholesale once FACTS.md is filled in.
 */
export default function Home() {
  return (
    <main className="shell" style={{ paddingBlock: "var(--section-y)" }}>
      <p
        style={{
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          fontSize: "0.75rem",
          margin: 0,
        }}
      >
        Scaffold
      </p>

      <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", marginTop: "1rem" }}>
        {site.name}
      </h1>

      <p style={{ color: "var(--fg-muted)", maxWidth: "var(--measure)" }}>
        Project initialised. No content has been written yet — brand, copy,
        photography and structure are all pending. See{" "}
        <code>FACTS.md</code> for the content checklist and{" "}
        <code>CONTRACT.md</code> for the design decisions still to be made.
      </p>

      <hr
        style={{
          border: 0,
          borderTop: "1px solid var(--rule)",
          margin: "var(--section-y) 0 2rem",
        }}
      />

      <p style={{ color: "var(--fg-muted)", fontSize: "0.875rem" }}>
        Next.js {`15`} · React 19 · TypeScript · GSAP + Lenis
      </p>
    </main>
  );
}
