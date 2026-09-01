import type { Service } from "@/lib/types";

export default function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service) => (
        <article
          key={service.id}
          className="group flex flex-col overflow-hidden rounded-card border border-gold/20 bg-white shadow-soft transition-transform duration-300 hover:-translate-y-1.5"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={service.image}
              alt={`${service.name} at Tejas Salon`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-serif text-xl text-navy">{service.name}</h3>
            <p className="mt-2 flex-1 text-sm text-ink/65">{service.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-gold-dark">From ₹{service.priceFrom}</span>
              <span className="text-ink/40">{service.durationMin} min</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
