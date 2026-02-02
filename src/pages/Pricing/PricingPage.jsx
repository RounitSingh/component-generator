import React from "react";
import PricingSection from "@/pages/Pricing/PricingSection";
import useAuthStore from "@/store/authStore";

const PricingPage = () => {
  const user = useAuthStore((s) => s.user);

  const isPro =
    user?.plan === "pro" || user?.isPro || user?.subscription?.status === "active";

  if (isPro) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center text-center text-white">
        <div className="max-w-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">You're already on Pro</h2>
          <p className="text-neutral-300">Thanks for being a supporter — enjoy the Pro features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <PricingSection />
    </div>
  );
};

export default PricingPage;
