import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isPro } from "@/lib/plan";
import { coherenciaView, getReport, ideaView, revisionView, signedImageUrls } from "@/lib/reports";
import { historyCutoff, effectivePlan } from "@/lib/plan";
import { SPACE_LABELS } from "@/lib/ai/criteria";
import type { CoherenciaResult, IdeaResult, RevisionResult } from "@/lib/ai/schemas";
import { formatDateTime } from "@/lib/utils";
import { Eyebrow, buttonClass } from "@/components/ui";
import { ScoreDial } from "@/components/score";
import { AiNotice, CoherenciaReport, ExpertUpsell, IdeaReport, LockedSection, RevisionReport } from "@/components/reports";
import { PrintButton } from "@/components/print-button";
import { deleteReport } from "../../actions";

export default async function InformePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile } = await requireUser(`/panel/informes/${id}`);
  const report = await getReport(profile.id, id);
  if (!report) notFound();

  const pro = isPro(profile);
  const cutoff = historyCutoff(effectivePlan(profile));
  const outOfHistory = cutoff !== null && new Date(report.created_at) < cutoff;
  const images = await signedImageUrls(report.image_paths);
  const kindLabel = report.kind === "idea" ? "Idea de escaparate" : report.kind === "coherencia" ? "Coherencia tienda y web" : "Revisión con foto";

  return (
    <article className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Eyebrow>
            {kindLabel}
            {report.kind === "revision" && report.space_type ? ` · ${SPACE_LABELS[report.space_type]}` : ""}
          </Eyebrow>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">{report.title}</h1>
          <p className="mt-2 text-sm text-muted">{formatDateTime(report.created_at)}</p>
        </div>
        {report.score !== null ? <ScoreDial score={report.score} /> : null}
      </div>

      {images.length ? (
        <div className={`grid gap-3 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {images.map((src, i) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2">
              <Image src={src} alt={i === 0 ? "Foto revisada" : "Captura de la web"} fill unoptimized className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      ) : report.images_deleted_at ? (
        <p className="text-sm text-muted">La foto se borró a los 30 días, como indicamos. El informe se conserva.</p>
      ) : null}

      {outOfHistory ? (
        <LockedSection title="Informe guardado" description="Este informe tiene más de 7 días. En el plan gratuito se guarda, pero solo se ve con Pro." />
      ) : report.kind === "revision" ? (
        <RevisionReport view={revisionView(report.result as RevisionResult, pro)} />
      ) : report.kind === "coherencia" ? (
        <CoherenciaReport view={coherenciaView(report.result as CoherenciaResult, pro)} />
      ) : (
        <IdeaReport view={ideaView(report.result as IdeaResult, pro)} />
      )}

      {report.kind !== "idea" ? <ExpertUpsell score={report.score} /> : null}

      <AiNotice />

      <div className="no-print flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {pro ? <PrintButton /> : null}
        {pro && report.kind === "revision" ? (
          <Link href={`/panel/comparar?b=${report.id}`} className={buttonClass("secondary", "md")}>Comparar con otra</Link>
        ) : null}
        <form action={deleteReport}>
          <input type="hidden" name="id" value={report.id} />
          <button type="submit" className={buttonClass("ghost", "md")}>Borrar informe</button>
        </form>
      </div>
    </article>
  );
}
