import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Quiz = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Career Assessment Quiz</h1>
          <p className="text-xl text-muted-foreground">Quiz implementation coming soon!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;