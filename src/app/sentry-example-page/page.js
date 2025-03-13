"use client";

export default function SentryExamplePage() {
    return (
      <div style={{ padding: 20 }}>
        <h1>Sentry Test Page</h1>
        <button onClick={() => {
          throw new Error("Sentry Frontend Test Error!");
        }}>
          Throw error
        </button>
      </div>
    );
  }