import React from "react";
import Album from "./Show-Listings"

export default function HomePage() {
  return (
    <div>
      <Album showFilters={true} inputFilter={{
          sold: true,
          category: [], size: [],
          color: [], condition: []
      }}/>
    </div>
  )
}
