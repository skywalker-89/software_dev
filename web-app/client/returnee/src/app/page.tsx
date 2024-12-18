import React from "react";
import NavBar from "../components/NavBar";
import CardSection from "../components/CardSection";
import MapSectionWrapper from "../components/wrapper/MapSectionWrapper";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto">
        <section>
          <MapSectionWrapper />
        </section>
        <section>
          <h2 className="my-6 text-2xl font-bold">8 Result Found</h2>
          <CardSection />
        </section>
      </main>
    </>
  );
}
