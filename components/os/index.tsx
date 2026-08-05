"use client";

import { useState } from "react";
import { Desktop } from "./desktop";
import { FileBrowser } from "./browser";
import { Boot } from "./boot";

const BOOTED_KEY = "sb-ws-booted";

function alreadyBooted() {
  try {
    return sessionStorage.getItem(BOOTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function WorkstationOS() {
  const [booted, setBooted] = useState(alreadyBooted);

  return (
    <>
      <Desktop
        renderBody={(path, navigate) => (
          <FileBrowser path={path} onNavigate={navigate} />
        )}
      />
      {booted ? null : (
        <Boot
          onDone={() => {
            try {
              sessionStorage.setItem(BOOTED_KEY, "1");
            } catch {}
            setBooted(true);
          }}
        />
      )}
    </>
  );
}
