"use client";

import { NewChart } from "@/components/NewChart";
import { NewPieChart } from "@/components/PieChart";

export default function Home() {
const Chart=({ type }) => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">{type} Distribution</h2>
      <NewChart type={type} />
    </div>
  );
};

  return (
    <div className=" min-h-screen bg-background">
      <main className="container mx-16 px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">District Distribution</h2>
            <NewChart type="district" />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">HRD/Promoter Distribution</h2>
            <NewChart type="hrd" />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Group Distribution</h2>
            <NewChart type="group" />
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">HRD/Promoter Distribution</h2>
            <NewPieChart type="group" />
          </div>
        </div>
      </main>
    </div>
  );
}


