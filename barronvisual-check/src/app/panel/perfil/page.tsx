import { requireUser } from "@/lib/auth";
import { Card, Eyebrow } from "@/components/ui";
import { ProfileForm } from "../profile-form";
import { DeleteAccount } from "./delete-account";

export default async function PerfilPage() {
  const { profile } = await requireUser("/panel/perfil");
  return (
    <div className="max-w-xl space-y-10">
      <div>
        <Eyebrow>Perfil</Eyebrow>
        <h1 className="mt-2 font-display text-3xl">Tus datos</h1>
        <p className="mt-2 text-sm text-muted">Email de acceso: {profile.email}</p>
      </div>
      <ProfileForm profile={profile} mode="edit" />
      <Card className="space-y-3 border-bad/50">
        <h2 className="font-display text-lg">Borrar mi cuenta</h2>
        <p className="text-sm text-fg-2">
          Cancela tu suscripción si la tienes, borra tus fotos e informes y elimina la cuenta. No se puede deshacer. Las facturas se conservan
          en Stripe el tiempo que exige la ley.
        </p>
        <DeleteAccount />
      </Card>
    </div>
  );
}
