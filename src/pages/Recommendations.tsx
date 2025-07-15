import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Recommendations = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Career Recommendations</h1>
          <p className="text-xl text-muted-foreground">Recommendations will appear here after completing the quiz!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;