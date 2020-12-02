import React from "react";
import Album from "../layout/show-listings"

export default function HomePage() {
  return (
    <div>
      <Album showFilters={true} inputFilter={{
          sold: true}}/>
    </div>
  )
}
