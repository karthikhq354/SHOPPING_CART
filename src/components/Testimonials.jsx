export default function Testimonials() {
  const reviews = [
    {
      name: "Sadhish",
      text: "The personalized gift I ordered exceeded all expectations. The quality and attention to detail were phenomenal!",
      profile: "S",
    },
    {
      name: "Gopi",
      text: "Fast shipping and beautiful packaging. My sister absolutely loved her anniversary gift. Will definitely order again!",
      profile: "G",
    },
    {
      name: "Vijay",
      text: "The handmade items are truly unique and special. Perfect for anyone looking to give something meaningful.",
      profile: "V",
    },
  ];

  return (
    <section className="bg-white py-20">
      <h2 className="text-center text-3xl font-bold text-purple-700 mb-14 px-4">
        What Our Customers Say
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-purple-50 rounded-3xl p-8 shadow-sm text-center md:text-left"
          >
            <p className="text-purple-700 italic mb-6">
              “{r.text}”
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <img
                className="w-12 h-12"
                alt={r.name}
                src={`data:image/svg+xml;utf8,${encodeURIComponent(`
                  <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
                    <circle cx='24' cy='24' r='24' fill='orange'/>
                    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                      font-size='24' fill='white' font-family='Arial' font-weight='bold'>
                      ${r.profile}
                    </text>
                  </svg>
                `)}`}
              />

              <div>
                <h4 className="font-semibold text-purple-800">
                  {r.name}
                </h4>
                <p className="text-yellow-400 text-sm">★★★★★</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
