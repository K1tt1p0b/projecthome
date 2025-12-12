"use client";

import { useEffect, useState } from "react";
import { pingApi } from "@/lib/api/system";

export default function TestApiPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    pingApi()
      .then((data) => setResult(data))
      .catch((err) => setResult({ error: String(err) }));
  }, []);

  return (
    <div className="container py-5">
      <h1>ทดสอบเชื่อม Laravel API</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
