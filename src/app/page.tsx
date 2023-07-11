import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <p>NextJS with APP dir</p>
      <UserButton afterSignOutUrl="/signin" />
    </div>
  );
}
