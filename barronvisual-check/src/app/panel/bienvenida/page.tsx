import { requireUser } from "@/lib/auth";
import { Eyebrow } from "@/components/ui";
import { ProfileForm } from "../profile-form";

export default async function BienvenidaPage() {
  const { profile } = await requireUser();
  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Eyebrow>Paso 1 de 2</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">Cuéntanos de tu tienda</h1>
        <p className="mt-2 text-fg-2">Con el tipo de tienda, las revisiones y las ideas se ajustan a tu producto. Te lleva 20 segundos.</p>
      </div>
      <ProfileForm profile={profile} mode="onboarding" />
    </div>
  );
}
