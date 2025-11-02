import Link from "next/link";

type Props = {
  id: string;
  name: string;
  price: number;
  duration: number;
  desc?: string;
};

export default function ServiceCard({ id, name, price, duration, desc }: Props) {
  return (
    <div className="card p-6 group hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg text-pink-700">{name}</h3>
        <span className="badge">{duration} دقیقه</span>
      </div>
      <p className="text-sm text-gray-600 mt-2 leading-6">{desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-pink-600 font-bold text-lg">
          {price.toLocaleString()} تومان
        </div>
        <Link href={`/reserve?serviceId=${id}`} className="cta-secondary">
          رزرو
        </Link>
      </div>
    </div>
  );
}
