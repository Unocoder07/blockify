import type { Metadata } from "next";
import { FeedbackList } from "@/components/sections/FeedbackList";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Read what the Blockify community is saying — every approved review, newest first.",
};

export default function FeedbackPage() {
  return <FeedbackList />;
}
