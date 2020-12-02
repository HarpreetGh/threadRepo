import React from "react";
import Album from "../layout/Show-Listings"

export default function HomePage() {
  return (
    <div>
      <Album showFilters={true} inputFilter={{
          sold: true}}/>
    </div>
  )
}
