"use client";
import Homepage from '@/components/Homepage'
import React, { useState } from 'react'

export default function Page() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  
  return (
    <div>
      <Homepage selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} />
    </div>
  );
}
