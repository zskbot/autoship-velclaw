"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Cloud,
  ExternalLink,
  GitBranch,
  Github,
  Loader2,
  Rocket,
  Server,
  Terminal,
  TriangleAlert,
} from "lucide-react";

type Deployment = {
  id?: string;
  url?: string;
  dashboardUrl?: string;
  status?: string;
  projectName?: string;
};

const DEFAULT_REPO = "https://github.com/Velclaw/VELCLAW";

export default function Home() {
  const [repo, setRepo] = useState(DEFAULT_REPO);
  const [branch, setBranch] = useState("main");
  const [deploying, setDeploying] = useState(false);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [error, setError] = useState("");

  const repoLabel = useMemo(() => {
    if (!repo) return "No repository selected";
    try {
      return new URL(repo).pathname.replace(/^\//, "").replace(/\.git$/, "");
    } catch {
      return repo;
    }
  }, [repo]);

  async function deploy() {
    setDeploying(true);
    setError("");
    setDeployment(null);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ repo, branch }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Deployment request failed");
      setDeployment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment request failed");
    } finally {
      setDeploying(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/velclaw-mark.svg" alt="Velclaw" className="brandMark" />
          <div>
            <strong>VELCLAW</strong>
            <span>DEPLOY CONTROL</span>
          </div>
        </div>

        <div className="sidebarSection">WORKSPACE</div>
        <nav>
          <a className="navItem active"><CircleDot size={15} /> Overview</a>
          <a className="navItem"><Github size={15} /> Source</a>
          <a className="navItem"><Terminal size={15} /> Builds</a>
          <a className="navItem"><Rocket size={15} /> Deployments <span className="navCount">LIVE</span></a>
          <a className="navItem"><Server size={15} /> Infrastructure</a>
        </nav>

        <div className="sidebarSection projectSection">PROJECT</div>
        <div className="projectCard">
          <span className="projectGlyph">V</span>
          <div>
            <strong>VELCLAW</strong>
            <span>{repoLabel}</span>
            <small>branch / {branch || "—"}</small>
          </div>
        </div>

        <div className="sidebarBottom">
          <span className="pulse" />
          <span>BUILD · REVIEW · DEPLOY</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <div className="eyebrow">AI-NATIVE SOFTWARE WORKSPACE</div>
            <h1>Deploy</h1>
            <p>Move validated software from source to production.</p>
          </div>
          <div className="topActions">
            <a href="https://docs.velclaw.ai" target="_blank" rel="noreferrer" className="docsLink">
              Docs <ExternalLink size={13} />
            </a>
            <div className="statusPill"><span /> Vercel connected</div>
          </div>
        </header>

        <div className="pipeline" aria-label="Deployment pipeline">
          <PipelineStep index="01" title="SOURCE" detail="GitHub" active />
          <PipelineStep index="02" title="BUILD" detail="Vercel" />
          <PipelineStep index="03" title="PREVIEW" detail="Validation" />
          <PipelineStep index="04" title="PRODUCTION" detail="Release" />
        </div>

        <div className="grid">
          <section className="panel heroPanel">
            <div className="panelHeader">
              <div>
                <span className="kicker">DEPLOYMENT / 01</span>
                <h2>Ship a preview</h2>
                <p>Connect a source branch and start a Vercel deployment.</p>
              </div>
              <div className="heroIcon"><Rocket size={20} /></div>
            </div>

            <label htmlFor="repo">Repository</label>
            <div className="inputWrap">
              <Github size={16} />
              <input id="repo" value={repo} onChange={(e) => setRepo(e.target.value)} spellCheck={false} />
            </div>

            <div className="twoCol">
              <div>
                <label htmlFor="branch">Branch</label>
                <div className="inputWrap">
                  <GitBranch size={16} />
                  <input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} spellCheck={false} />
                </div>
              </div>
              <div>
                <label>Target</label>
                <div className="targetBox"><span className="targetDot" /> Preview / Vercel</div>
              </div>
            </div>

            <button className="deployButton" onClick={deploy} disabled={deploying || !repo || !branch}>
              {deploying ? <><Loader2 className="spin" size={16} /> Creating deployment…</> : <><Rocket size={16} /> Deploy preview <ArrowUpRight size={15} /></>}
            </button>

            {error && (
              <div className="errorBox">
                <TriangleAlert size={16} />
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className="panel activityPanel">
            <div className="panelHeader compact">
              <div>
                <span className="kicker">RUN STATE</span>
                <h2>Deployment flow</h2>
              </div>
              <span className="monoTag">VELCLAW</span>
            </div>

            <div className="timeline">
              <Step title="Source" detail={repoLabel} done={Boolean(repo)} />
              <Step title="Build" detail="Vercel build pipeline" done={Boolean(deployment)} />
              <Step title="Preview" detail={deployment?.url ? "Preview URL generated" : "Awaiting build"} done={Boolean(deployment?.url)} />
              <Step title="Production" detail="Promote after review" done={false} />
            </div>
          </section>
        </div>

        <section className="panel latest">
          <div className="panelHeader compact">
            <div>
              <span className="kicker">LATEST DEPLOYMENT</span>
              <h2>{deployment ? "Preview deployment" : "Deployment queue"}</h2>
            </div>
            {deployment?.status && <span className="readyPill"><CheckCircle2 size={14} /> {deployment.status}</span>}
          </div>

          {deployment ? (
            <div className="deploymentRow">
              <div className="deploymentMeta">
                <div className="deploymentGlyph"><Cloud size={17} /></div>
                <div>
                  <strong>{deployment.projectName ?? "Velclaw preview"}</strong>
                  <span>{deployment.id ?? "Vercel deployment"}</span>
                </div>
              </div>
              <div className="actions">
                {deployment.url && <a href={deployment.url} target="_blank" rel="noreferrer">Open preview <ExternalLink size={13} /></a>}
                {deployment.dashboardUrl && <a className="secondary" href={deployment.dashboardUrl} target="_blank" rel="noreferrer">Vercel <ExternalLink size={13} /></a>}
              </div>
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyIcon"><Cloud size={18} /></div>
              <div>
                <strong>Ready for source</strong>
                <span>Deployments created from this console will appear here.</span>
              </div>
              <span className="emptyCode">STATUS / IDLE</span>
            </div>
          )}
        </section>

        <footer>
          <span>VELCLAW</span> / Deploy Control Plane <span className="footerDot">·</span> GitHub → Vercel
        </footer>
      </section>
    </main>
  );
}

function PipelineStep({ index, title, detail, active }: { index: string; title: string; detail: string; active?: boolean }) {
  return (
    <div className={active ? "pipelineStep active" : "pipelineStep"}>
      <span className="pipelineIndex">{index}</span>
      <div><strong>{title}</strong><span>{detail}</span></div>
    </div>
  );
}

function Step({ title, detail, done }: { title: string; detail: string; done: boolean }) {
  return (
    <div className="step">
      <div className={done ? "stepIcon done" : "stepIcon"}>{done ? <CheckCircle2 size={16} /> : <CircleDot size={16} />}</div>
      <div><strong>{title}</strong><span>{detail}</span></div>
    </div>
  );
}
