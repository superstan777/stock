import ProtectedLayout from "./(protected)/layout";

export default function HomePage() {
  return (
    <ProtectedLayout>
      <>Dashboard</>
    </ProtectedLayout>
  );
}
