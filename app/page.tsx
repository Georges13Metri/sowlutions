import EmailFormCustom from "@/components/email/Email";
import BossPage from "@/components/game/GamePlay";
import LinkedListComponent from "@/components/linkedList/LinkedListComponent";

export default function Home() {
  return (
   <>
   <EmailFormCustom />
   <LinkedListComponent />
   <BossPage />
   </>
  );
}
