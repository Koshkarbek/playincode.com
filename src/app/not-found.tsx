import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-lg text-muted mb-8">Страница не найдена</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
