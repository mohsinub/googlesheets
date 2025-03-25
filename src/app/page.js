"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";


export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <div>
      <Header
      />
      <Homepage selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} />
    </div>
  );
}


