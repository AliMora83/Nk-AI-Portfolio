import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StatusBar } from "@/components/StatusBar";
import { AuditSection } from "@/components/AuditSection";
import { DemoGallery } from "@/components/DemoGallery";
import { ClientWork } from "@/components/ClientWork";
import { AiStack } from "@/components/AiStack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Nav />
            {/* We apply a negative z-index to base sections to keep nav above without z-index wars */}
            <div className="w-full">
                <Hero />
                <StatusBar />
                <AuditSection />
                <DemoGallery />
                <ClientWork />
                <AiStack />
                <Contact />
            </div>
            <Footer />
        </main>
    );
}
