type Interaction = {
  name: string;
  company: string;
  duration: string;
  tokens: number;
  status: "Afspraak" | "Info" | "Mislukt";
};

const data: Interaction[] = [
  {
    name: "Sarah Bakker",
    company: "Dental Clinic Amsterdam",
    duration: "2:34",
    tokens: 1247,
    status: "Afspraak",
  },
  {
    name: "Tom Peters",
    company: "Tandarts De Vries",
    duration: "1:52",
    tokens: 892,
    status: "Afspraak",
  },
  {
    name: "Anna de Jong",
    company: "Rotterdam Dental Care",
    duration: "0:45",
    tokens: 421,
    status: "Info",
  },
  {
    name: "Unknown",
    company: "Dental Clinic Amsterdam",
    duration: "0:22",
    tokens: 156,
    status: "Mislukt",
  },
];

export default function RecentInteractions() {
  return (
    <div className="bg-[#070B14] border border-white/10 rounded-xl p-4">
      <h3 className="text-sm text-white/60 mb-4">
        Laatste AI Interacties
      </h3>

      <div className="space-y-2">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm bg-black/20 p-3 rounded-lg"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-white/50 text-xs">{item.company}</div>
            </div>

            <div className="text-right">
              <div>{item.duration}</div>
              <div className="text-white/50 text-xs">
                {item.tokens} tokens
              </div>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-lg h-fit
                ${
                  item.status === "Afspraak"
                    ? "bg-green-500/20 text-green-400"
                    : item.status === "Info"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-red-500/20 text-red-400"
                }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
