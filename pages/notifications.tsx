import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Header from "@/components/Header";
import NotificationsFeed from "@/components/NotificationsFeed";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  // লগইন না থাকলে হোমে পাঠিয়ে দাও
  if (!session) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { session } };
}

const Notifications = () => {
  return (
    <>
      <Header showBackArrow label="Notifications" />
      <NotificationsFeed />
    </>
  );
};

export default Notifications;